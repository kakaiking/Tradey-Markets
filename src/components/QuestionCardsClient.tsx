"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
    ChevronLeft, ChevronRight, RotateCcw, 
    Check, X, BookOpen, Sparkles, ChevronDown 
} from "lucide-react";
import { getQuestionCardsForLesson, QuestionCard } from "@/lib/questionCardsData";
import Link from "next/link";

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
    const [isFlipped, setIsFlipped] = useState(false);
    
    // Quiz state: stores the index of the selected answer for each card (null if unanswered)
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [quizCompleted, setQuizCompleted] = useState(false);

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
            setCards(lessonCards);
            setCurrentCardIndex(0);
            setIsFlipped(false);
            setAnswers({});
            setQuizCompleted(false);
        } else {
            setCards([]);
        }
    }, [selectedLessonSlug, selectedGradeId]);

    // Answer selecting handler
    const handleAnswerSelect = (optionIndex: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card from flipping back
        if (answers[currentCardIndex] !== undefined) return; // Answer already submitted for this card

        setAnswers(prev => ({
            ...prev,
            [currentCardIndex]: optionIndex
        }));
    };

    const handleNext = () => {
        if (currentCardIndex < cards.length - 1) {
            setIsFlipped(false);
            // Slight delay to allow card to flip back before changing index
            setTimeout(() => {
                setCurrentCardIndex(prev => prev + 1);
            }, 250);
        } else {
            // Check if all cards have been answered
            setQuizCompleted(true);
        }
    };

    const handlePrev = () => {
        if (currentCardIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentCardIndex(prev => prev - 1);
            }, 250);
        }
    };

    const handleResetQuiz = () => {
        setAnswers({});
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setQuizCompleted(false);
    };

    const currentCard = cards[currentCardIndex];
    const isWrong = currentCard && answers[currentCardIndex] !== undefined && answers[currentCardIndex] !== currentCard.correctIndex;
    const totalCorrect = Object.entries(answers).reduce((acc, [cardIdx, answerIdx]) => {
        const card = cards[Number(cardIdx)];
        if (card && card.correctIndex === answerIdx) {
            return acc + 1;
        }
        return acc;
    }, 0);

    return (
        <div className="w-full flex flex-col items-center">
            
            {/* Centered Card Selector Dropdown */}
            {cards.length > 0 && (
                <div className="w-full max-w-[620px] flex flex-col items-center mb-8 px-4 relative z-20">
                    <label className="kicker mb-2 select-none">
                        Select Study Card
                    </label>
                    <div className="relative w-full max-w-sm">
                        <select
                            value={currentCardIndex}
                            onChange={(e) => {
                                const index = Number(e.target.value);
                                setIsFlipped(false);
                                setCurrentCardIndex(index);
                            }}
                            className="w-full bg-[var(--raised)] hover:bg-[var(--highlighter)] border-2 border-[var(--ink)] rounded-[var(--radius-sm)] px-5 py-3.5 pr-10 text-xs md:text-sm font-bold text-[var(--ink)] transition-all focus:outline-none cursor-pointer appearance-none shadow-[var(--card-shadow)] text-center"
                            style={{
                                textAlignLast: "center"
                            }}
                        >
                            {cards.map((card, idx) => {
                                const displayTitle = card.sectionTitle 
                                    ? `${card.sectionTitle} - Card ${idx + 1}`
                                    : `Card ${idx + 1}: ${card.question.length > 50 ? card.question.substring(0, 47) + "..." : card.question}`;
                                return (
                                    <option key={card.id || idx} value={idx} className="bg-[var(--raised)] text-[var(--ink)] text-xs md:text-sm normal-case font-semibold">
                                        {displayTitle}
                                    </option>
                                );
                            })}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[var(--muted)]">
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Interactive Deck Container */}
            <div className="w-full max-w-[760px] flex flex-col items-center">
                
                {cards.length === 0 ? (
                    <div className="w-full max-w-[620px] text-center py-16 card">
                        <BookOpen className="mx-auto text-[var(--muted)] mb-4" size={48} />
                        <p className="status text-sm font-semibold">No questions configured for this lesson yet.</p>
                    </div>
                ) : quizCompleted ? (
                    
                    /* SCORE SCREEN */
                    <div className="w-full max-w-[620px]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full card text-center relative overflow-hidden"
                        >
                            <div className="w-20 h-20 bg-[color-mix(in_srgb,var(--chalk)_18%,var(--raised))] text-[var(--chalk)] border-2 border-[var(--ink)] rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles size={36} />
                            </div>
                            
                            <h2 className="font-display text-2xl font-bold text-[var(--ink)] mb-2">Lesson Quiz Completed!</h2>
                            <p className="kicker mb-6">
                                {activeLesson?.title}
                            </p>
                            
                            <div className="bg-[var(--sunken)] border-2 border-[var(--ink)] rounded-[var(--radius-sm)] p-6 max-w-sm mx-auto mb-8">
                                <div className="kicker mb-1">Your Score</div>
                                <div className="text-5xl font-black text-[var(--chalk)] font-display">
                                    {totalCorrect} <span className="text-[var(--muted)] text-3xl">/</span> {cards.length}
                                </div>
                                <div className="text-sm text-[var(--muted)] mt-3 font-semibold font-reading">
                                    {totalCorrect === cards.length 
                                        ? "Perfect! You've mastered this lesson's details!" 
                                        : totalCorrect >= cards.length / 2 
                                            ? "Good job! Review the cards to get a perfect score." 
                                            : "Try reading the lesson text again to improve."
                                    }
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 justify-center">
                                <button
                                    onClick={handleResetQuiz}
                                    className="btn secondary !w-auto"
                                >
                                    <RotateCcw size={14} /> Retry Quiz
                                </button>
                                {activeLesson && (
                                    <Link
                                        href={`/learn/${selectedGradeId}/${selectedLessonSlug}/`}
                                        className="btn chalk !w-auto"
                                    >
                                        <BookOpen size={14} /> Read Lesson Notes
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </div>

                ) : (
                    
                    /* FLASHCARD PLAYING SCREEN */
                    <div className="w-full flex flex-col items-center">
                        
                        {/* Flex Row containing Buttons on Left/Right of Card */}
                        <div className="w-full flex items-center justify-between gap-4 md:gap-6">
                            
                            {/* Prev Button */}
                            <button
                                onClick={handlePrev}
                                disabled={currentCardIndex === 0}
                                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[var(--ink)] bg-[var(--raised)] text-[var(--ink)] hover:bg-[var(--highlighter)] transition-all active:scale-90 disabled:opacity-0 disabled:pointer-events-none shrink-0 shadow-[2px_2px_0_var(--ink)]"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            {/* Flip Card Deck Wrapper */}
                            <div className="w-full max-w-[620px] perspective-1000 relative">
                                
                                <motion.div
                                    layout
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                                    className="w-full relative transform-style-3d cursor-pointer"
                                    onClick={() => setIsFlipped(!isFlipped)}
                                >
                                    {/* FRONT FACE: LESSON NOTE DESCRIPTION */}
                                    <div 
                                        className={`${isFlipped ? "absolute inset-0 w-full h-full" : "relative w-full h-auto"} backface-hidden card flex flex-col justify-between min-h-[360px] md:min-h-[380px]`}
                                        style={{
                                            backfaceVisibility: "hidden"
                                        }}
                                    >
                                        <div>
                                            <p className="kicker mb-2">Read face</p>
                                            <h3 className="font-display text-lg md:text-xl font-bold text-[var(--ink)] mb-3">
                                                {currentCard.sectionTitle || activeLesson?.title || "Lesson Details"}
                                            </h3>
                                            
                                            <div className="lesson-prose !text-sm max-h-[160px] md:max-h-[180px] overflow-y-auto pr-1 scrollbar-none whitespace-pre-wrap">
                                                {currentCard.sectionContent || currentCard.description}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-[var(--line)] select-none">
                                            <div className="kicker">
                                                Tap to flip
                                            </div>
                                            <div className="text-xs font-bold text-[var(--chalk)] flex items-center gap-1">
                                                Flip to Question <ChevronRight size={14} className="mt-0.5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* BACK FACE: QUESTION & MULTIPLE CHOICE OPTIONS */}
                                    <div 
                                        className={`${isFlipped ? "relative w-full h-auto" : "absolute inset-0 w-full h-full"} card flex flex-col rotate-y-180 backface-hidden min-h-[360px] md:min-h-[380px]`}
                                        style={{
                                            backfaceVisibility: "hidden",
                                            transform: "rotateY(180deg)"
                                        }}
                                    >
                                        <div>
                                            <p className="kicker mb-2">Question</p>
                                            {/* Question Text */}
                                            <h4 className="font-display text-sm md:text-base font-bold text-[var(--ink)] mb-4 leading-snug">
                                                {currentCard.question}
                                            </h4>

                                            {/* Choices A, B, C, D */}
                                            <div className="choice-list">
                                                {currentCard.options.map((option, idx) => {
                                                    const letter = ["A", "B", "C", "D"][idx];
                                                    const isAnswered = answers[currentCardIndex] !== undefined;
                                                    const isUserSelection = answers[currentCardIndex] === idx;
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
                                                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${circleClass}`}>
                                                                {isAnswered && isCorrectOption ? (
                                                                    <Check size={12} strokeWidth={3} />
                                                                ) : isAnswered && isUserSelection && !isCorrectOption ? (
                                                                    <X size={12} strokeWidth={3} />
                                                                ) : (
                                                                    letter
                                                                )}
                                                            </span>
                                                            <span className="leading-tight font-semibold text-sm">{option}</span>
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
                                                    <p className="text-xs md:text-sm font-bold text-[var(--chalk)] mb-2">
                                                        The correct answer was: {["A", "B", "C", "D"][currentCard.correctIndex]}. {currentCard.options[currentCard.correctIndex]}
                                                    </p>
                                                    <p className="lesson-prose !text-sm">
                                                        {currentCard.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </motion.div>
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={handleNext}
                                disabled={answers[currentCardIndex] === undefined}
                                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[var(--ink)] bg-[var(--highlighter)] text-[var(--ink)] hover:brightness-95 disabled:bg-[var(--sunken)] disabled:text-[var(--muted)] transition-all active:scale-90 disabled:pointer-events-none shrink-0 shadow-[2px_2px_0_var(--ink)]"
                            >
                                <ChevronRight size={24} />
                            </button>

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
