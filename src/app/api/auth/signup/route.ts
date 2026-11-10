import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields (username, email, password)" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        if (!prisma) {
            return NextResponse.json(
                { message: "Database is not connected" },
                { status: 500 }
            );
        }

        // Check if username or email already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email.toLowerCase() },
                    { username: username.toLowerCase() }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email.toLowerCase() === email.toLowerCase()) {
                return NextResponse.json(
                    { message: "Email address is already registered" },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { message: "Username is already taken" },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create User
        const user = await prisma.user.create({
            data: {
                username: username.trim(),
                email: email.toLowerCase().trim(),
                passwordHash,
                avatar: username.trim().substring(0, 2).toUpperCase(),
                tier: "FREE",
                totalXP: 0,
                currentStreak: 0,
            },
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                tier: true,
                totalXP: true,
                currentStreak: true,
                createdAt: true,
            }
        });

        await setSessionCookie(user.id);

        return NextResponse.json({
            message: "User registered successfully",
            user,
        }, { status: 201 });

    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { message: "Something went wrong during registration", error: error.message },
            { status: 500 }
        );
    }
}
