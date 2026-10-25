import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCachedLessons } from "@/lib/catalogCache";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const gradeId = searchParams.get("gradeId") ?? "";

        if (!prisma) {
            return NextResponse.json({ message: "Database not connected" }, { status: 500 });
        }

        const lessons = await getCachedLessons(gradeId);

        return NextResponse.json(
            { lessons },
            { headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=120" } }
        );
    } catch (error: any) {
        console.error("Error fetching lessons:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}
