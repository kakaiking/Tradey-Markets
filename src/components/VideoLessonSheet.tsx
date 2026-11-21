"use client";

import React, { useRef } from "react";
import { motion, type PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { QuestionCardDeck } from "@/components/QuestionCardDeck";
import type { QuestionCard } from "@/lib/questionCardsData";

/** 0 = closed, 1 = 70% split, 2 = full lesson */
export type DescriptionLevel = 0 | 1 | 2;

export type VideoLessonSectionView = {
    title: string;
    paragraphs: string[];
};

export type VideoLessonSheetProps = {
    level: DescriptionLevel;
    onLevelChange: (level: DescriptionLevel) => void;
    title: string;
    description: string;
    paragraphs: string[];
    sections?: VideoLessonSectionView[];
    cards: QuestionCard[];
    lessonTitle?: string;
};

export function VideoLessonSheet({
    level,
    onLevelChange,
    title,
    description,
    paragraphs,
    sections = [],
    cards,
    lessonTitle,
}: VideoLessonSheetProps) {
    const didDragRef = useRef(false);

    if (level === 0) return null;

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        const { offset, velocity } = info;
        if (Math.abs(offset.y) > 8 || Math.abs(velocity.y) > 50) {
            didDragRef.current = true;
        }

        if (velocity.y < -500 || offset.y < -80) {
            onLevelChange(2);
            return;
        }
        if (velocity.y > 500 || offset.y > 80) {
            if (level === 2) {
                onLevelChange(1);
            } else {
                onLevelChange(0);
            }
        }
    };

    const handleHeaderActivate = () => {
        if (didDragRef.current) {
            didDragRef.current = false;
            return;
        }
        onLevelChange(level === 2 ? 1 : 2);
    };

    const bodyParagraphs =
        paragraphs.length > 0 ? paragraphs : description ? [description] : [];
    const hasStructuredSections = sections.some(
        (s) => s.title || s.paragraphs.length > 0
    );

    const sheetHeight = level === 2 ? "100%" : "70%";

    return (
        <motion.div
            initial={{ height: "40%" }}
            animate={{ height: sheetHeight }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="absolute inset-x-0 bottom-0 z-40 flex flex-col overflow-hidden rounded-t-[var(--radius)] border-t-2 border-[var(--ink)] bg-[var(--raised)] shadow-[var(--card-shadow)] pointer-events-auto"
        >
            <div className="relative shrink-0 flex flex-col border-b-2 border-[var(--line)]">
                <motion.div
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.2}
                    onDragStart={() => {
                        didDragRef.current = false;
                    }}
                    onDragEnd={handleDragEnd}
                    onClick={handleHeaderActivate}
                    role="button"
                    tabIndex={0}
                    aria-label={
                        level === 2
                            ? "Collapse lesson sheet"
                            : "Expand lesson sheet"
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleHeaderActivate();
                        }
                    }}
                    className="flex flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none select-none"
                >
                    <div
                        className="w-10 h-1.5 rounded-full bg-[var(--muted)]/70"
                        aria-hidden
                    />
                    <div className="w-full px-4 pt-2 pb-1 flex items-center gap-3">
                        <span className="font-bold text-[var(--ink)] text-sm font-display min-w-0 flex-1 truncate pointer-events-none">
                            {title}
                        </span>
                    </div>
                </motion.div>
                <div className="absolute top-2 right-3 z-10">
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onLevelChange(0);
                        }}
                        className="close-x"
                        aria-label="Close lesson"
                    >
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 scrollbar-thin">
                <section className="text-left mb-6">
                    <p className="kicker !text-sm mb-2">Lesson</p>
                    <h3 className="font-display text-lg font-bold text-[var(--ink)] mb-3 leading-snug">
                        {lessonTitle || title}
                    </h3>
                    {hasStructuredSections ? (
                        <div className="space-y-5">
                            {sections.map((section, si) => (
                                <div key={`lesson-sec-${si}`} className="space-y-2">
                                    {section.title ? (
                                        <h4 className="font-display text-sm font-bold text-[var(--ink)] leading-snug">
                                            {section.title}
                                        </h4>
                                    ) : null}
                                    {section.paragraphs.map((paragraph, pi) => (
                                        <p
                                            key={`lesson-sec-${si}-p-${pi}`}
                                            className="text-[var(--ink)] text-sm leading-relaxed font-reading"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {bodyParagraphs.map((paragraph, i) => (
                                <p
                                    key={`lesson-p-${i}`}
                                    className="text-[var(--ink)] text-sm leading-relaxed font-reading"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    )}
                </section>

                {cards.length > 0 && (
                    <section className="mb-2">
                        <QuestionCardDeck
                            cards={cards}
                            lessonTitle={lessonTitle || title}
                            compact
                        />
                    </section>
                )}
            </div>
        </motion.div>
    );
}
