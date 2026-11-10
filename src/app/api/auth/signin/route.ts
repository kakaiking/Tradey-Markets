import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, checkAndUpdateStreak, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { identifier, password } = await req.json(); // identifier can be email or username

        if (!identifier || !password) {
            return NextResponse.json(
                { message: "Missing identifier (email or username) or password" },
                { status: 400 }
            );
        }

        if (!prisma) {
            return NextResponse.json(
                { message: "Database is not connected" },
                { status: 500 }
            );
        }

        // Find user by email or username
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier.toLowerCase().trim() },
                    { username: identifier.trim() }
                ]
            }
        });

        if (!user || !user.passwordHash) {
            return NextResponse.json(
                { message: "Invalid email, username, or password" },
                { status: 401 }
            );
        }

        // Compare password hash
        const isPasswordValid = await comparePassword(password, user.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid email, username, or password" },
                { status: 401 }
            );
        }

        await setSessionCookie(user.id);

        // Automatically verify and update streak upon sign in
        const streakResult = await checkAndUpdateStreak({
            id: user.id,
            currentStreak: user.currentStreak,
            lastActiveAt: user.lastActiveAt,
        });

        return NextResponse.json({
            message: "Signed in successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                tier: user.tier,
                totalXP: user.totalXP,
                currentStreak: streakResult.currentStreak,
                createdAt: user.createdAt,
            },
        });

    } catch (error: any) {
        console.error("Signin error:", error);
        return NextResponse.json(
            { message: "Something went wrong during sign-in", error: error.message },
            { status: 500 }
        );
    }
}
