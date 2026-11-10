import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "tradey-markets-super-secret-jwt-key-change-me"
);

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function signJWT(payload: { userId: string }): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<{ userId: string } | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as { userId: string };
    } catch (e) {
        return null;
    }
}

/** Shared session cookie flags for email + OAuth sign-in. */
export async function setSessionCookie(userId: string): Promise<void> {
    const token = await signJWT({ userId });
    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

export async function checkAndUpdateStreak(user: { id: string; currentStreak: number; lastActiveAt: Date | null }): Promise<{ currentStreak: number; lastActiveAt: Date | null }> {
    if (!prisma) return { currentStreak: user.currentStreak, lastActiveAt: user.lastActiveAt };

    const now = new Date();
    const lastActive = user.lastActiveAt;

    let shouldUpdate = false;
    let newStreak = user.currentStreak;

    if (!lastActive) {
        // First time active
        shouldUpdate = true;
        newStreak = 1;
    } else {
        const lastActiveDate = new Date(lastActive);

        const isSameDay =
            lastActiveDate.getFullYear() === now.getFullYear() &&
            lastActiveDate.getMonth() === now.getMonth() &&
            lastActiveDate.getDate() === now.getDate();

        if (!isSameDay) {
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);

            const isYesterday =
                lastActiveDate.getFullYear() === yesterday.getFullYear() &&
                lastActiveDate.getMonth() === yesterday.getMonth() &&
                lastActiveDate.getDate() === yesterday.getDate();

            shouldUpdate = true;
            if (isYesterday) {
                newStreak = user.currentStreak + 1;
            } else {
                newStreak = 1;
            }
        }
    }

    if (shouldUpdate) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                currentStreak: newStreak,
                lastActiveAt: now,
            },
        });
        return { currentStreak: newStreak, lastActiveAt: now };
    }

    return { currentStreak: user.currentStreak, lastActiveAt: lastActive };
}

export async function getUserFromSession(): Promise<any | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;
        if (!token) {
            // Opt-in only: set DEV_AUTH_USER=1 to auto-pick the first DB user in local/dev.
            // Default off so home/progress do not pay a Neon round-trip on every request.
            if (
                process.env.NODE_ENV === "development" &&
                process.env.DEV_AUTH_USER === "1" &&
                prisma
            ) {
                const devUser = await prisma.user.findFirst({
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar: true,
                        tier: true,
                        totalXP: true,
                        currentStreak: true,
                        lastActiveAt: true,
                        createdAt: true,
                    },
                });
                if (devUser) {
                    return devUser;
                }
            }
            return null;
        }

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) return null;

        if (!prisma) return null;
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                tier: true,
                totalXP: true,
                currentStreak: true,
                lastActiveAt: true,
                createdAt: true,
            },
        });

        if (!user) return null;

        // Automatically verify and update streak upon daily activity
        const streakResult = await checkAndUpdateStreak({
            id: user.id,
            currentStreak: user.currentStreak,
            lastActiveAt: user.lastActiveAt,
        });

        user.currentStreak = streakResult.currentStreak;
        user.lastActiveAt = streakResult.lastActiveAt;

        return user;
    } catch (error) {
        console.error("Error in getUserFromSession:", error);
        return null;
    }
}
