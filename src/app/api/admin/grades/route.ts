import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { invalidateCatalog } from "@/lib/catalogCache";

export async function GET() {
    try {
        if (!prisma) {
            return NextResponse.json({ message: "Database not connected" }, { status: 500 });
        }

        const grades = await prisma.grade.findMany({
            include: {
                lessons: true
            },
            orderBy: { createdAt: "asc" }
        });

        return NextResponse.json({ grades });
    } catch (error: any) {
        console.error("Error fetching grades:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!prisma) {
            return NextResponse.json({ message: "Database not connected" }, { status: 500 });
        }

        const body = await req.json();
        const { title, subtitle, color } = body;

        if (!title) {
            return NextResponse.json({ message: "Missing required fields: title is required" }, { status: 400 });
        }

        // Check if grade already exists
        const existing = await prisma.grade.findUnique({
            where: { title }
        });
        if (existing) {
            return NextResponse.json({ message: "A group with this title already exists" }, { status: 400 });
        }

        const newGrade = await prisma.grade.create({
            data: {
                title,
                subtitle: subtitle || null,
                color: color || "#22c55e"
            }
        });

        invalidateCatalog();
        return NextResponse.json({ message: "Group created successfully!", grade: newGrade });
    } catch (error: any) {
        console.error("Error creating grade:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}
