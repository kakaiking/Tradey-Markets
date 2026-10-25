import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCachedRecentLessons } from "@/lib/catalogCache";

export async function GET() {
    try {
        if (!prisma) {
            return NextResponse.json({ lessons: [] });
        }

        const recentLessons = await getCachedRecentLessons();

        return NextResponse.json(
            { lessons: recentLessons },
            { headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" } }
        );
    } catch (error: any) {
        console.error("Error fetching notification lessons:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}
