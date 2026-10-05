import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { QuestionCardsClient } from "@/components/QuestionCardsClient";

export const dynamic = "force-dynamic";

export default async function QuestionCardsPage() {
    let grades: any[] = [];
    
    if (prisma) {
        try {
            grades = await prisma.grade.findMany({
                include: {
                    lessons: {
                        include: {
                            sections: {
                                include: {
                                    questionCards: true
                                },
                                orderBy: { order: "asc" }
                            }
                        },
                        orderBy: { createdAt: "asc" }
                    }
                },
                orderBy: { createdAt: "asc" }
            }) as any[];
        } catch (err) {
            console.error("Failed to query grades/lessons in QuestionCardsPage:", err);
        }
    }

    // Adapt database type to the component expectations
    const formattedGrades = grades.map(g => ({
        id: g.id,
        title: g.title,
        lessons: (g.lessons || []).map((l: any) => ({
            id: l.id,
            slug: l.slug,
            title: l.title,
            gradeId: l.gradeId,
            sections: (l.sections || []).map((s: any) => ({
                id: s.id,
                title: s.title,
                text: s.text,
                visualType: s.visualType || "default",
                order: s.order,
                questionCards: s.questionCards || []
            }))
        }))
    }));

    return (
        <div className="w-full py-6 pb-24 text-[var(--ink)]">
            <Suspense fallback={
                <div className="w-full max-w-[620px] mx-auto text-center py-20">
                    <div className="w-12 h-12 rounded-full border-2 border-[var(--ink)] border-t-[var(--highlighter)] animate-spin mx-auto mb-4" />
                    <p className="status text-sm">Loading deck modules...</p>
                </div>
            }>
                <QuestionCardsClient grades={formattedGrades} />
            </Suspense>
        </div>
    );
}
