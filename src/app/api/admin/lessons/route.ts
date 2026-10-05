import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET() {
    try {
        if (!prisma) {
            return NextResponse.json({ message: "Database not connected" }, { status: 500 });
        }

        const lessons = await prisma.lesson.findMany({
            include: {
                sections: {
                    orderBy: { order: "asc" }
                }
            },
            orderBy: { createdAt: "asc" }
        });

        return NextResponse.json({ lessons });
    } catch (error: any) {
        console.error("Error fetching lessons:", error);
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
        const { title, gradeId, slug, content } = body;

        if (!title || !gradeId || !slug) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Check if slug is unique
        const existing = await prisma.lesson.findUnique({
            where: { slug }
        });
        if (existing) {
            return NextResponse.json({ message: "A lesson with this slug already exists" }, { status: 400 });
        }

        // Create lesson and sections transactionally
        const newLesson = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const lesson = await tx.lesson.create({
                data: {
                    title,
                    gradeId,
                    slug,
                }
            });

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

        return NextResponse.json({ message: "Lesson created successfully!", lesson: newLesson });
    } catch (error: any) {
        console.error("Error creating lesson:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}
