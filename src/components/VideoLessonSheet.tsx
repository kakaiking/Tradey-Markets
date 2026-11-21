"use client";

import React, { useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { Send, Share2, X } from "lucide-react";
import { QuestionCardDeck } from "@/components/QuestionCardDeck";
import type { QuestionCard } from "@/lib/questionCardsData";

/** 0 = closed, 1 = 70% split, 2 = full lesson */
export type DescriptionLevel = 0 | 1 | 2;

export type VideoLessonSectionView = {
    title: string;
    paragraphs: string[];
};

export type LessonComment = {
    id: string;
    user: string;
    text: string;
    time: string;
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
    comments?: LessonComment[];
    onShare?: () => void;
    onAddComment?: (text: string) => void;
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
    comments = [],
    onShare,
    onAddComment,
}: VideoLessonSheetProps) {
    const didDragRef = useRef(false);
    const [commentText, setCommentText] = useState("");

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
                    className="flex flex-col items-center justify-center pt-3 pb-3 cursor-grab active:cursor-grabbing touch-none select-none"
                >
                    <div
                        className="w-10 h-1.5 rounded-full bg-[var(--muted)]/70"
                        aria-hidden
                    />
                </motion.div>
                <div className="absolute top-2 right-3 z-10 flex items-center gap-1.5">
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
                    {onShare ? (
                        <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                onShare();
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] transition-colors hover:bg-[var(--sunken)]"
                            aria-label="Share lesson"
                        >
                            <Share2 size={14} strokeWidth={2.5} />
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 scrollbar-thin">
                <section className="text-left mb-6">
                    <h3 className="font-display text-lg font-bold text-[var(--ink)] mb-3 leading-snug text-center">
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
                    <section className="mb-6">
                        <QuestionCardDeck
                            cards={cards}
                            lessonTitle={lessonTitle || title}
                            compact
                        />
                    </section>
                )}

                <section className="mb-2 border-t-2 border-[var(--line)] pt-4">
                    <h4 className="font-display text-sm font-bold text-[var(--ink)] mb-3">
                        Comments ({comments.length})
                    </h4>

                    <div className="space-y-3 mb-4">
                        {comments.length === 0 ? (
                            <p className="text-xs text-[var(--muted)] font-reading">
                                No comments yet. Be the first to share a take.
                            </p>
                        ) : (
                            comments.map((c) => (
                                <div
                                    key={c.id}
                                    className="flex gap-3 text-left"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[var(--sunken)] border border-[var(--ink)] flex items-center justify-center font-bold text-xs text-[var(--ink)] shrink-0">
                                        {c.user.charAt(0)}
                                    </div>
                                    <div className="flex-1 bg-[var(--paper)] border border-[var(--line)] rounded-[var(--radius-sm)] p-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-xs text-[var(--ink)]">
                                                {c.user}
                                            </span>
                                            <span className="text-[10px] text-[var(--muted)]">
                                                {c.time}
                                            </span>
                                        </div>
                                        <p className="text-[var(--muted)] text-xs md:text-sm leading-relaxed font-reading">
                                            {c.text}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {onAddComment ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const text = commentText.trim();
                                if (!text) return;
                                onAddComment(text);
                                setCommentText("");
                            }}
                            className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--paper)] p-2"
                        >
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add an expert comment..."
                                className="flex-1 bg-[var(--raised)] hover:bg-[var(--highlighter)] focus:bg-[var(--raised)] text-[var(--ink)] rounded-lg px-3 py-2 text-xs md:text-sm border border-[var(--line)] outline-none focus:border-[var(--chalk)] transition-all font-medium"
                            />
                            <button
                                type="submit"
                                className="p-2 bg-[var(--highlighter)] hover:brightness-95 text-[var(--ink)] rounded-lg transition-all border border-[var(--line)]"
                                aria-label="Post comment"
                            >
                                <Send size={14} />
                            </button>
                        </form>
                    ) : null}
                </section>
            </div>
        </motion.div>
    );
}
