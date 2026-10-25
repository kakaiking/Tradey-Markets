import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { invalidateCatalog } from "@/lib/catalogCache";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

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
            return NextResponse.json({ message: "Title is required" }, { status: 400 });
        }

        // Find the existing grade
        const existing = await prisma.grade.findUnique({
            where: { id }
        });
        if (!existing) {
            return NextResponse.json({ message: "Group not found" }, { status: 404 });
        }

        // If title changed, check uniqueness
        if (title !== existing.title) {
            const checkTitle = await prisma.grade.findUnique({
                where: { title }
            });
            if (checkTitle) {
                return NextResponse.json({ message: "A group with this title already exists" }, { status: 400 });
            }
        }

        const updated = await prisma.grade.update({
            where: { id },
            data: {
                title,
                subtitle: subtitle !== undefined ? subtitle : existing.subtitle,
                color: color || existing.color
            }
        });

        invalidateCatalog();
        return NextResponse.json({ message: "Group updated successfully!", grade: updated });
    } catch (error: any) {
        console.error("Error updating grade:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!prisma) {
            return NextResponse.json({ message: "Database not connected" }, { status: 500 });
        }

        // Find the existing grade
        const existing = await prisma.grade.findUnique({
            where: { id }
        });
        if (!existing) {
            return NextResponse.json({ message: "Group not found" }, { status: 404 });
        }

        // Delete (Cascade deletes all related lessons and sections due to schema definition!)
        await prisma.grade.delete({
            where: { id }
        });

        invalidateCatalog();
        return NextResponse.json({ message: "Group deleted successfully!" });
    } catch (error: any) {
        console.error("Error deleting grade:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}
