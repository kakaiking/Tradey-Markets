import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export async function GET() {
    try {
        if (!prisma) {
            return NextResponse.json({ message: "Database not connected" }, { status: 500 });
        }

        const events = await prisma.event.findMany({
            orderBy: {
                date: "asc"
            }
        });

        return NextResponse.json({ events });
    } catch (error: any) {
        console.error("Error fetching events:", error);
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
        const { title, date, time, type, description, impact } = body;

        if (!title || !date || !time || !type || !description) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const newEvent = await prisma.event.create({
            data: {
                title,
                date,
                time,
                type,
                description,
                impact: impact || "medium"
            }
        });

        return NextResponse.json({ message: "Event created successfully!", event: newEvent });
    } catch (error: any) {
        console.error("Error creating event:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!prisma) {
            return NextResponse.json({ message: "Database not connected" }, { status: 500 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "Missing event ID" }, { status: 400 });
        }

        await prisma.event.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Event deleted successfully!" });
    } catch (error: any) {
        console.error("Error deleting event:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}
