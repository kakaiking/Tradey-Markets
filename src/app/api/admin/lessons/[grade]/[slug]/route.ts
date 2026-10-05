import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ grade: string; slug: string }> }
) {
    try {
        const { grade, slug } = await params;

        if (!prisma) {
            return NextResponse.json({ message: "Database not connected" }, { status: 500 });
        }

        const lesson = await prisma.lesson.findFirst({
            where: {
                gradeId: grade,
                slug: slug
            },
            include: {
                sections: {
                    include: {
                        questionCards: true
                    },
                    orderBy: { order: "asc" }
                }
            }
        });

        if (!lesson) {
            return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
        }

        return NextResponse.json({ lesson });
    } catch (error: any) {
        console.error("Error fetching lesson:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ grade: string; slug: string }> }
) {
    try {
        const { grade: oldGrade, slug: oldSlug } = await params;

        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!prisma) {
            return NextResponse.json({ message: "Database not connected" }, { status: 500 });
        }

        const body = await req.json();
        const { title, gradeId, slug: newSlug, content } = body;

        if (!title || !gradeId || !newSlug) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Find the existing lesson
        const existingLesson = await prisma.lesson.findFirst({
            where: {
                gradeId: oldGrade,
                slug: oldSlug
            }
        });

        if (!existingLesson) {
            return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
        }

        // If the slug changed, check that newSlug is unique
        if (newSlug !== oldSlug) {
            const checkSlug = await prisma.lesson.findUnique({
                where: { slug: newSlug }
            });
            if (checkSlug) {
                return NextResponse.json({ message: "A lesson with this slug already exists" }, { status: 400 });
            }
        }

        // Update lesson and sections transactionally
        const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Delete all current sections
            await tx.lessonSection.deleteMany({
                where: { lessonId: existingLesson.id }
            });

            // Update lesson core details
            const lesson = await tx.lesson.update({
                where: { id: existingLesson.id },
                data: {
                    title,
                    gradeId,
                    slug: newSlug
                }
            });

            // Re-create the sections
            if (content && Array.isArray(content)) {
                for (let i = 0; i < content.length; i++) {
                    const sec = content[i];
                    const questionCardsData = sec.questionCards && Array.isArray(sec.questionCards)
                        ? sec.questionCards.map((card: any) => ({
                            description: card.description || "",
                            question: card.question || "",
                            options: Array.isArray(card.options) ? card.options : ["", "", "", ""],
                            correctIndex: typeof card.correctIndex === "number" ? card.correctIndex : 0
                        }))
                        : [];

                    await tx.lessonSection.create({
                        data: {
                            lessonId: lesson.id,
                            title: sec.title || `Section ${i + 1}`,
                            text: Array.isArray(sec.text) ? sec.text : [sec.text || ""],
                            visualType: sec.visualType || "default",
                            videoUrl: sec.videoUrl || null,
                            order: i,
                            questionCards: {
                                create: questionCardsData
                            }
                        }
                    });
                }
            }

            return tx.lesson.findUnique({
                where: { id: lesson.id },
                include: {
                    sections: {
                        include: {
                            questionCards: true
                        },
                        orderBy: { order: "asc" }
                    }
                }
            });
        });

        return NextResponse.json({ message: "Lesson updated successfully!", lesson: updated });
    } catch (error: any) {
        console.error("Error updating lesson:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ grade: string; slug: string }> }
) {
    try {
        const { grade, slug } = await params;

        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!prisma) {
            return NextResponse.json({ message: "Database not connected" }, { status: 500 });
        }

        // Find the existing lesson
        const existingLesson = await prisma.lesson.findFirst({
            where: {
                gradeId: grade,
                slug: slug
            }
        });

        if (!existingLesson) {
            return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
        }

        // Delete (Cascade deletes all related sections!)
        await prisma.lesson.delete({
            where: { id: existingLesson.id }
        });

        return NextResponse.json({ message: "Lesson deleted successfully!" });
    } catch (error: any) {
        console.error("Error deleting lesson:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}
