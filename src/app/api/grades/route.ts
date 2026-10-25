import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCachedGrades } from "@/lib/catalogCache";

export async function GET() {
    try {
        if (!prisma) {
            return NextResponse.json({ message: "Database not connected" }, { status: 500 });
        }

        const grades = await getCachedGrades();

        return NextResponse.json(
            { grades },
            { headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=120" } }
        );
    } catch (error: any) {
        console.error("Error fetching public grades:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}
