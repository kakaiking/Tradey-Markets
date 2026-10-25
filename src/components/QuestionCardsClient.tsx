"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
    ChevronLeft, ChevronRight, 
    Check, X, BookOpen 
} from "lucide-react";
import { getQuestionCardsForLesson, QuestionCard } from "@/lib/questionCardsData";
import { recordCardPass } from "@/lib/practiceProgress";

interface Section {
    id: string;
    title: string;
    text: string[];
    visualType: string;
    order: number;
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

    // Find initially active grade and lesson
    const defaultGrade = grades.find(g => g.id === paramGrade) || grades[0];
    const defaultLesson = defaultGrade?.lessons.find(l => l.slug === paramSlug) || defaultGrade?.lessons[0];

    const [selectedGradeId, setSelectedGradeId] = useState(defaultGrade?.id || "");
    const [selectedLessonSlug, setSelectedLessonSlug] = useState(defaultLesson?.slug || "");
    
    // Loaded cards for the selected lesson
    const [cards, setCards] = useState<QuestionCard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [history, setHistory] = useState<number[]>([]);
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState<number | null>(null);

    // Get current active grade and lesson object
    const activeGrade = grades.find(g => g.id === selectedGradeId);
    const activeLesson = activeGrade?.lessons.find(l => l.slug === selectedLessonSlug);

    // Update selected lesson when URL params change
    useEffect(() => {
        if (paramGrade && grades.some(g => g.id === paramGrade)) {
            setSelectedGradeId(paramGrade);
            const targetGrade = grades.find(g => g.id === paramGrade);
            if (paramSlug && targetGrade?.lessons.some(l => l.slug === paramSlug)) {
                setSelectedLessonSlug(paramSlug);
            } else if (targetGrade && targetGrade.lessons.length > 0) {
                setSelectedLessonSlug(targetGrade.lessons[0].slug);
            }
        }
    }, [paramGrade, paramSlug, grades]);

    // Load question cards when active lesson changes
    useEffect(() => {
        if (activeLesson) {
            const lessonCards = getQuestionCardsForLesson(activeLesson.slug, {
                title: activeLesson.title,
                sections: activeLesson.sections
            });
            const start = lessonCards.length > 0
                ? Math.floor(Math.random() * lessonCards.length)
                : 0;
            setCards(lessonCards);
            setCurrentCardIndex(start);
            setHistory([]);
            setIsFlipped(false);
            setCurrentAnswer(null);
        } else {
            setCards([]);
        }
    }, [selectedLessonSlug, selectedGradeId]);

    // Answer selecting handler
    const handleAnswerSelect = (optionIndex: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card from flipping back
        if (currentAnswer !== null) return;

        setCurrentAnswer(optionIndex);
        const card = cards[currentCardIndex];
        if (card && optionIndex === card.correctIndex) {
            recordCardPass(card.id);
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
        setHistory(prev => [...prev, currentCardIndex]);
        showCard(pickRandomIndex(currentCardIndex));
    };

    const handlePrev = () => {
        if (history.length === 0) {
            showCard(pickRandomIndex(currentCardIndex));
            return;
        }
        const previous = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));
        showCard(previous);
    };

    const currentCard = cards[currentCardIndex];
    const isWrong = currentCard && currentAnswer !== null && currentAnswer !== currentCard.correctIndex;

    return (
        <div className="w-full h-full min-h-0 flex flex-col items-center">
            
            {/* Main Interactive Deck Container */}
            <div className="w-full max-w-[760px] h-full min-h-0 flex flex-col items-center">
                
                {cards.length === 0 ? (
                    <div className="w-full max-w-[620px] text-center py-16 card">
                        <BookOpen className="mx-auto text-[var(--muted)] mb-4" size={48} />
                        <p className="status text-sm font-semibold">No questions configured for this lesson yet.</p>
                    </div>
                ) : (
                    
                    /* FLASHCARD PLAYING SCREEN */
                    <div className="w-full h-full min-h-0 flex flex-col items-center">
                        
                        <div className="relative w-full h-full min-h-0 flex flex-col items-center">

                            {/* Flip Card Deck Wrapper — height follows the text */}
                            <div className="w-full max-w-[620px] max-[599px]:max-w-none h-auto shrink-0 perspective-1000 relative">
                                
                                <motion.div
                                    layout
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                                    className="w-full h-auto relative transform-style-3d cursor-pointer"
                                    onClick={() => setIsFlipped(!isFlipped)}
                                >
                                    {/* FRONT FACE: LESSON NOTE DESCRIPTION */}
                                    <div 
                                        className={`${isFlipped ? "absolute inset-0 w-full h-full overflow-y-auto" : "relative w-full h-auto"} backface-hidden card flex flex-col justify-between`}
                                        style={{
                                            backfaceVisibility: "hidden"
                                        }}
                                    >
                                        <div>
                                            <p className="kicker !text-sm mb-3">Read face</p>
                                            <h3 className="font-display text-2xl font-bold text-[var(--ink)] mb-4 leading-tight">
                                                {currentCard.sectionTitle || activeLesson?.title || "Lesson Details"}
                                            </h3>
                                            
                                            <div className="lesson-prose !text-[1.2rem] !leading-relaxed pr-1 whitespace-pre-wrap">
                                                {currentCard.sectionContent || currentCard.description}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-[var(--line)] select-none">
                                            <div className="kicker !text-sm">
                                                Tap to flip
                                            </div>
                                            <div className="text-base font-bold text-[var(--chalk)] flex items-center gap-1">
                                                Flip to Question <ChevronRight size={18} className="mt-0.5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* BACK FACE: QUESTION & MULTIPLE CHOICE OPTIONS */}
                                    <div 
                                        className={`${isFlipped ? "relative w-full h-auto overflow-visible" : "absolute inset-0 w-full h-full overflow-y-auto"} card flex flex-col rotate-y-180 backface-hidden`}
                                        style={{
                                            backfaceVisibility: "hidden",
                                            transform: "rotateY(180deg)"
                                        }}
                                    >
                                        <div>
                                            <p className="kicker !text-sm mb-3">Question</p>
                                            {/* Question Text */}
                                            <h4 className="font-display text-xl font-bold text-[var(--ink)] mb-4 leading-snug">
                                                {currentCard.question}
                                            </h4>

                                            {/* Choices A, B, C, D */}
                                            <div className="choice-list">
                                                {currentCard.options.map((option, idx) => {
                                                    const letter = ["A", "B", "C", "D"][idx];
                                                    const isAnswered = currentAnswer !== null;
                                                    const isUserSelection = currentAnswer === idx;
                                                    const isCorrectOption = currentCard.correctIndex === idx;

                                                    let stateClass = "";
                                                    let circleClass = "bg-[var(--sunken)] text-[var(--muted)] border border-[var(--line)]";

                                                    if (isAnswered) {
                                                        if (isCorrectOption) {
                                                            stateClass = "!bg-[color-mix(in_srgb,var(--chalk)_18%,var(--raised))] !border-[var(--chalk)] text-[var(--chalk)]";
                                                            circleClass = "bg-[var(--chalk)] text-[var(--on-chalk)] border border-[var(--ink)] font-black";
                                                        } else if (isUserSelection) {
                                                            stateClass = "!bg-[color-mix(in_srgb,var(--pencil)_15%,var(--raised))] !border-[var(--pencil)] text-[var(--pencil)]";
                                                            circleClass = "bg-[var(--pencil)] text-[var(--on-chalk)] border border-[var(--ink)] font-black";
                                                        } else {
                                                            stateClass = "opacity-55";
                                                            circleClass = "bg-[var(--sunken)] text-[var(--muted)] border border-[var(--line)]";
                                                        }
                                                    }

                                                    return (
                                                        <button
                                                            key={idx}
                                                            disabled={isAnswered}
                                                            onClick={(e) => handleAnswerSelect(idx, e)}
                                                            className={`choice-card !grid-cols-[auto_1fr] ${stateClass} ${isAnswered ? "locked" : ""}`}
                                                        >
                                                            <span className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-black shrink-0 ${circleClass}`}>
                                                                {isAnswered && isCorrectOption ? (
                                                                    <Check size={12} strokeWidth={3} />
                                                                ) : isAnswered && isUserSelection && !isCorrectOption ? (
                                                                    <X size={12} strokeWidth={3} />
                                                                ) : (
                                                                    letter
                                                                )}
                                                            </span>
                                                            <span className="leading-snug font-semibold text-lg">{option}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Correct Answer Explanation if Incorrectly Answered */}
                                            {isWrong && (
                                                <div 
                                                    onClick={(e) => e.stopPropagation()} 
                                                    className="mt-4 text-left"
                                                >
                                                    <hr className="my-4 border-[var(--line)]" />
                                                    <p className="text-base font-bold text-[var(--chalk)] mb-2">
                                                        The correct answer was: {["A", "B", "C", "D"][currentCard.correctIndex]}. {currentCard.options[currentCard.correctIndex]}
                                                    </p>
                                                    <p className="lesson-prose !text-[1.15rem] !leading-relaxed">
                                                        {currentCard.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </motion.div>
                            </div>

                            <div className="flex-1 w-full min-h-[5.5rem] flex items-center justify-center gap-6">
                                <button
                                    onClick={handlePrev}
                                    disabled={cards.length === 0}
                                    aria-label="Previous card"
                                    className="flex items-center justify-center w-12 h-12 rounded-full border border-[var(--line)] bg-[var(--raised)] text-[var(--ink)] hover:bg-[var(--highlighter)] transition-all active:scale-90 disabled:opacity-30 disabled:pointer-events-none shrink-0 shadow-[var(--shadow)]"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={currentAnswer === null}
                                    aria-label="Next card"
                                    className="flex items-center justify-center w-12 h-12 rounded-full border border-[var(--line)] bg-[var(--highlighter)] text-[var(--ink)] hover:brightness-95 disabled:bg-[var(--sunken)] disabled:text-[var(--muted)] transition-all active:scale-90 disabled:pointer-events-none shrink-0 shadow-[var(--shadow)]"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                        </div>


                    </div>
                )}
            </div>
            
            {/* Embedded styles for 3D card layout */}
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
