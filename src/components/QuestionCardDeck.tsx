"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { QuestionCard } from "@/lib/questionCardsData";
import { recordCardPass } from "@/lib/practiceProgress";

type QuestionCardDeckProps = {
    cards: QuestionCard[];
    lessonTitle?: string;
    compact?: boolean;
};

export function QuestionCardDeck({
    cards,
    lessonTitle,
    compact = false,
}: QuestionCardDeckProps) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [history, setHistory] = useState<number[]>([]);
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState<number | null>(null);

    useEffect(() => {
        if (cards.length === 0) {
            setCurrentCardIndex(0);
            setHistory([]);
            setIsFlipped(false);
            setCurrentAnswer(null);
            return;
        }
        const start = Math.floor(Math.random() * cards.length);
        setCurrentCardIndex(start);
        setHistory([]);
        setIsFlipped(false);
        setCurrentAnswer(null);
    }, [cards]);

    if (cards.length === 0) return null;

    const currentCard = cards[currentCardIndex];
    if (!currentCard) return null;

    const isWrong =
        currentAnswer !== null && currentAnswer !== currentCard.correctIndex;

    const handleAnswerSelect = (optionIndex: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentAnswer !== null) return;

        setCurrentAnswer(optionIndex);
        if (optionIndex === currentCard.correctIndex) {
            recordCardPass(currentCard.id);
        }
    };

    const pickRandomIndex = (exclude: number) => {
        if (cards.length <= 1) return 0;
        let next = exclude;
        while (next === exclude) {
            next = Math.floor(Math.random() * cards.length);
        }
        return next;
    };

    const showCard = (index: number) => {
        setIsFlipped(false);
        setCurrentAnswer(null);
        setTimeout(() => {
            setCurrentCardIndex(index);
        }, 250);
    };

    const handleNext = () => {
        setHistory((prev) => [...prev, currentCardIndex]);
        showCard(pickRandomIndex(currentCardIndex));
    };

    const handlePrev = () => {
        if (history.length === 0) {
            showCard(pickRandomIndex(currentCardIndex));
            return;
        }
        const previous = history[history.length - 1];
        setHistory((prev) => prev.slice(0, -1));
        showCard(previous);
    };

    const titleClass = compact
        ? "font-display text-lg font-bold text-[var(--ink)] mb-3 leading-tight"
        : "font-display text-2xl font-bold text-[var(--ink)] mb-4 leading-tight";
    const questionClass = compact
        ? "font-display text-base font-bold text-[var(--ink)] mb-3 leading-snug"
        : "font-display text-xl font-bold text-[var(--ink)] mb-4 leading-snug";
    const proseClass = compact
        ? "lesson-prose !text-[0.95rem] !leading-relaxed pr-1 whitespace-pre-wrap"
        : "lesson-prose !text-[1.2rem] !leading-relaxed pr-1 whitespace-pre-wrap";
    const optionTextClass = compact
        ? "leading-snug font-semibold text-sm"
        : "leading-snug font-semibold text-lg";

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full perspective-1000 relative">
                <motion.div
                    layout
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    className="w-full h-auto relative transform-style-3d cursor-pointer"
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div
                        className={`${
                            isFlipped
                                ? "absolute inset-0 w-full h-full overflow-y-auto"
                                : "relative w-full h-auto"
                        } backface-hidden card flex flex-col justify-between`}
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <div>
                            <p className="kicker !text-sm mb-2">Question cards</p>
                            <h3 className={titleClass}>
                                {currentCard.sectionTitle ||
                                    lessonTitle ||
                                    "Lesson Details"}
                            </h3>
                            <div className={proseClass}>
                                {currentCard.sectionContent ||
                                    currentCard.description}
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-3 pt-3 border-t-2 border-[var(--line)] select-none">
                            <div className="kicker !text-xs">Tap to flip</div>
                            <div className="text-sm font-bold text-[var(--chalk)] flex items-center gap-1">
                                Flip to Question{" "}
                                <ChevronRight size={16} className="mt-0.5" />
                            </div>
                        </div>
                    </div>

                    <div
                        className={`${
                            isFlipped
                                ? "relative w-full h-auto overflow-visible"
                                : "absolute inset-0 w-full h-full overflow-y-auto"
                        } card flex flex-col rotate-y-180 backface-hidden`}
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        <div>
                            <p className="kicker !text-sm mb-2">Question</p>
                            <h4 className={questionClass}>
                                {currentCard.question}
                            </h4>

                            <div className="choice-list">
                                {currentCard.options.map((option, idx) => {
                                    const letter = ["A", "B", "C", "D"][idx];
                                    const isAnswered = currentAnswer !== null;
                                    const isUserSelection = currentAnswer === idx;
                                    const isCorrectOption =
                                        currentCard.correctIndex === idx;

                                    let stateClass = "";
                                    let circleClass =
                                        "bg-[var(--sunken)] text-[var(--muted)] border border-[var(--line)]";

                                    if (isAnswered) {
                                        if (isCorrectOption) {
                                            stateClass =
                                                "!bg-[color-mix(in_srgb,var(--chalk)_18%,var(--raised))] !border-[var(--chalk)] text-[var(--chalk)]";
                                            circleClass =
                                                "bg-[var(--chalk)] text-[var(--on-chalk)] border border-[var(--ink)] font-black";
                                        } else if (isUserSelection) {
                                            stateClass =
                                                "!bg-[color-mix(in_srgb,var(--pencil)_15%,var(--raised))] !border-[var(--pencil)] text-[var(--pencil)]";
                                            circleClass =
                                                "bg-[var(--pencil)] text-[var(--on-chalk)] border border-[var(--ink)] font-black";
                                        } else {
                                            stateClass = "opacity-55";
                                            circleClass =
                                                "bg-[var(--sunken)] text-[var(--muted)] border border-[var(--line)]";
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            disabled={isAnswered}
                                            onClick={(e) =>
                                                handleAnswerSelect(idx, e)
                                            }
                                            className={`choice-card !grid-cols-[auto_1fr] ${stateClass} ${
                                                isAnswered ? "locked" : ""
                                            }`}
                                        >
                                            <span
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${circleClass}`}
                                            >
                                                {isAnswered &&
                                                isCorrectOption ? (
                                                    <Check
                                                        size={12}
                                                        strokeWidth={3}
                                                    />
                                                ) : isAnswered &&
                                                  isUserSelection &&
                                                  !isCorrectOption ? (
                                                    <X
                                                        size={12}
                                                        strokeWidth={3}
                                                    />
                                                ) : (
                                                    letter
                                                )}
                                            </span>
                                            <span className={optionTextClass}>
                                                {option}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {isWrong && (
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-3 text-left"
                                >
                                    <hr className="my-3 border-[var(--line)]" />
                                    <p className="text-sm font-bold text-[var(--chalk)] mb-2">
                                        The correct answer was:{" "}
                                        {
                                            ["A", "B", "C", "D"][
                                                currentCard.correctIndex
                                            ]
                                        }
                                        .{" "}
                                        {
                                            currentCard.options[
                                                currentCard.correctIndex
                                            ]
                                        }
                                    </p>
                                    <p className="lesson-prose !text-[0.95rem] !leading-relaxed">
                                        {currentCard.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="w-full flex items-center justify-center gap-4 mt-3 mb-1">
                <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous card"
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--line)] bg-[var(--raised)] text-[var(--ink)] hover:bg-[var(--highlighter)] transition-all active:scale-90 shrink-0 shadow-[var(--shadow)]"
                >
                    <ChevronLeft size={20} />
                </button>
                <span className="text-xs font-bold text-[var(--muted)] tabular-nums">
                    {currentCardIndex + 1} / {cards.length}
                </span>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentAnswer === null}
                    aria-label="Next card"
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--line)] bg-[var(--highlighter)] text-[var(--ink)] hover:brightness-95 disabled:bg-[var(--sunken)] disabled:text-[var(--muted)] transition-all active:scale-90 disabled:pointer-events-none shrink-0 shadow-[var(--shadow)]"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
}
