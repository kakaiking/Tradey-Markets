import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import {
    EMPTY_PROGRESS,
    getProgressForUser,
    upsertLessonResume,
} from "@/lib/progress";

export async function GET() {
    try {
        const user = await getUserFromSession();
        if (!user) {
            // Guests: no DB. Empty progress is enough for next-lesson math.
            return NextResponse.json(EMPTY_PROGRESS, {
                headers: {
                    "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
                },
            });
        }

        if (!prisma) {
            return NextResponse.json(
                { message: "Database not connected" },
                { status: 500 }
            );
        }

        const payload = await getProgressForUser(user.id);

        return NextResponse.json(payload, {
            headers: {
                "Cache-Control": "private, max-age=15, stale-while-revalidate=30",
            },
        });
    } catch (error: any) {
        console.error("Error fetching user progress:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized. Please sign in to save your progress." },
                { status: 401 }
            );
        }

        if (!prisma) {
            return NextResponse.json(
                { message: "Database not connected" },
                { status: 500 }
            );
        }

        const { gradeId, lessonSlug, sectionId } = await req.json();
        if (!gradeId || !lessonSlug || !sectionId) {
            return NextResponse.json(
                { message: "Missing gradeId, lessonSlug, or sectionId" },
                { status: 400 }
            );
        }

        await upsertLessonResume(user.id, { gradeId, lessonSlug, sectionId });

        return NextResponse.json({
            message: "Resume saved",
            resume: { lessonSlug, sectionId, gradeId },
        });
    } catch (error: any) {
        console.error("Error saving lesson resume:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized. Please sign in to save your progress." },
                { status: 401 }
            );
        }

        if (!prisma) {
            return NextResponse.json(
                { message: "Database not connected" },
                { status: 500 }
            );
        }

        const { gradeId, lessonSlug } = await req.json();
        if (!gradeId || !lessonSlug) {
            return NextResponse.json(
                { message: "Missing gradeId or lessonSlug" },
                { status: 400 }
            );
        }

        const existing = await prisma.completedLesson.findUnique({
            where: {
                userId_lessonSlug: {
                    userId: user.id,
                    lessonSlug,
                },
            },
            select: { id: true },
        });

        if (!existing) {
            await prisma.completedLesson.create({
                data: {
                    userId: user.id,
                    gradeId,
                    lessonSlug,
                },
            });
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    totalXP: { increment: 50 },
                },
            });
        }

        // Finished lessons shouldn't keep a resume bookmark
        await prisma.lessonResume.deleteMany({
            where: { userId: user.id, lessonSlug },
        });

        const payload = await getProgressForUser(user.id);

        return NextResponse.json({
            message: "Lesson marked completed!",
            completedLessons: payload.completedLessons,
            progress: payload.progress,
            resumes: payload.resumes,
        });
    } catch (error: any) {
        console.error("Error saving lesson completion:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
