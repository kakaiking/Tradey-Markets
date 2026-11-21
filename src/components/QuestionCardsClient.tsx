"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen } from "lucide-react";
import { getQuestionCardsForLesson, QuestionCard } from "@/lib/questionCardsData";
import { QuestionCardDeck } from "@/components/QuestionCardDeck";

interface Section {
    id: string;
    title: string;
    text: string[];
    visualType: string;
    order: number;
    questionCards?: QuestionCard[];
}

interface Lesson {
    id: string;
    slug: string;
    title: string;
    gradeId: string;
    sections: Section[];
}

interface Grade {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface QuestionCardsClientProps {
    grades: Grade[];
}

export function QuestionCardsClient({ grades }: QuestionCardsClientProps) {
    const searchParams = useSearchParams();

    const paramGrade = searchParams.get("grade") || "";
    const paramSlug = searchParams.get("slug") || "";

    const defaultGrade = grades.find((g) => g.id === paramGrade) || grades[0];
    const defaultLesson =
        defaultGrade?.lessons.find((l) => l.slug === paramSlug) ||
        defaultGrade?.lessons[0];

    const [selectedGradeId, setSelectedGradeId] = useState(
        defaultGrade?.id || ""
    );
    const [selectedLessonSlug, setSelectedLessonSlug] = useState(
        defaultLesson?.slug || ""
    );

    const [cards, setCards] = useState<QuestionCard[]>([]);

    const activeGrade = grades.find((g) => g.id === selectedGradeId);
    const activeLesson = activeGrade?.lessons.find(
        (l) => l.slug === selectedLessonSlug
    );

    useEffect(() => {
        if (paramGrade && grades.some((g) => g.id === paramGrade)) {
            setSelectedGradeId(paramGrade);
            const targetGrade = grades.find((g) => g.id === paramGrade);
            if (
                paramSlug &&
                targetGrade?.lessons.some((l) => l.slug === paramSlug)
            ) {
                setSelectedLessonSlug(paramSlug);
            } else if (targetGrade && targetGrade.lessons.length > 0) {
                setSelectedLessonSlug(targetGrade.lessons[0].slug);
            }
        }
    }, [paramGrade, paramSlug, grades]);

    useEffect(() => {
        if (activeLesson) {
            const lessonCards = getQuestionCardsForLesson(activeLesson.slug, {
                title: activeLesson.title,
                sections: activeLesson.sections,
            });
            setCards(lessonCards);
        } else {
            setCards([]);
        }
    }, [selectedLessonSlug, selectedGradeId, activeLesson]);

    return (
        <div className="w-full h-full min-h-0 flex flex-col items-center">
            <div className="w-full max-w-[760px] h-full min-h-0 flex flex-col items-center px-4 py-4 overflow-y-auto">
                {cards.length === 0 ? (
                    <div className="w-full max-w-[620px] text-center py-16 card">
                        <BookOpen
                            className="mx-auto text-[var(--muted)] mb-4"
                            size={48}
                        />
                        <p className="status text-sm font-semibold">
                            No questions configured for this lesson yet.
                        </p>
                    </div>
                ) : (
                    <div className="w-full max-w-[620px] max-[599px]:max-w-none">
                        <QuestionCardDeck
                            cards={cards}
                            lessonTitle={activeLesson?.title}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
