import { NextResponse } from "next/server";
import { getNextLessonForRequest } from "@/lib/nextLesson";

export async function GET() {
    try {
        const { lesson } = await getNextLessonForRequest();
        return NextResponse.json(
            {
                index: lesson.index,
                total: lesson.total,
                title: lesson.title,
                href: lesson.href,
                slug: lesson.slug,
                gradeId: lesson.gradeId,
            },
            {
                headers: {
                    "Cache-Control": "private, max-age=15, stale-while-revalidate=30",
                },
            }
        );
    } catch (error: any) {
        console.error("Error fetching next lesson:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
