"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, PlayCircle, HelpCircle } from "lucide-react";

export function DynamicIsland() {
    const pathname = usePathname();

    const cleanPathname = pathname.replace(/\/$/, "");
    const pathParts = cleanPathname.split("/").filter(Boolean);

    const rawGradeId = pathParts[1] || "";
    const isVideosActive = rawGradeId === "videos";
    const isQuestionCardsActive = rawGradeId === "question-cards";
    const isLessonsActive =
        cleanPathname === "/learn" ||
        rawGradeId === "chapters" ||
        (!!rawGradeId &&
            !isVideosActive &&
            !isQuestionCardsActive &&
            pathParts[0] === "learn");

    const activeGradeId =
        !isVideosActive && !isQuestionCardsActive && rawGradeId !== "chapters"
            ? rawGradeId
            : "";
    const currentLessonSlug = activeGradeId && pathParts[2] ? pathParts[2] : "";

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none flex justify-center w-full max-w-[95%] sm:max-w-fit">
            <motion.div
                layout
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                }}
                className="pointer-events-auto relative overflow-visible select-none rounded-full px-4 py-2 flex items-center justify-center gap-3 bg-[#0a0f0d]/75 backdrop-blur-2xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)]"
                style={{
                    backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)",
                }}
            >
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none rounded-full" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none rounded-full" />

                <div className="relative group py-1 flex flex-col items-center justify-center">
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-black/90 border border-white/10 rounded-xl text-[10px] font-bold text-white shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-[-4px] transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                        <span className="block text-white text-center font-extrabold">Lessons</span>
                        <span className="block text-[8px] text-white/40 text-center mt-0.5 font-semibold">
                            School courses
                        </span>
                    </div>
                    <Link
                        href="/learn"
                        className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ease-out hover:scale-115 active:scale-95 ${
                            isLessonsActive
                                ? "border-green-400 bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)] scale-110"
                                : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white"
                        }`}
                    >
                        <BookOpen size={16} />
                    </Link>
                    {isLessonsActive && (
                        <div className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    )}
                </div>

                <div className="w-[1px] h-6 bg-white/10 shrink-0 mx-0.5" />

                <div className="relative group py-1 flex flex-col items-center justify-center">
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-black/90 border border-white/10 rounded-xl text-[10px] font-bold text-white shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-[-4px] transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                        <span className="block text-white text-center font-extrabold">Videos Library</span>
                        <span className="block text-[8px] text-white/40 text-center mt-0.5 font-semibold">
                            Video Tutorials Feed
                        </span>
                    </div>
                    <Link
                        href="/learn/videos/"
                        className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ease-out hover:scale-115 active:scale-95 ${
                            isVideosActive
                                ? "border-green-400 bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)] scale-110"
                                : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white"
                        }`}
                    >
                        <PlayCircle size={16} className={isVideosActive ? "animate-pulse" : ""} />
                    </Link>
                    {isVideosActive && (
                        <div className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    )}
                </div>

                <div className="relative group py-1 flex flex-col items-center justify-center">
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-black/90 border border-white/10 rounded-xl text-[10px] font-bold text-white shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-[-4px] transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                        <span className="block text-white text-center font-extrabold">Question Cards</span>
                        <span className="block text-[8px] text-white/40 text-center mt-0.5 font-semibold">
                            Interactive Flashcards
                        </span>
                    </div>
                    <Link
                        href={
                            currentLessonSlug
                                ? `/learn/question-cards/?grade=${activeGradeId}&slug=${currentLessonSlug}`
                                : activeGradeId
                                  ? `/learn/question-cards/?grade=${activeGradeId}`
                                  : `/learn/question-cards/`
                        }
                        className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ease-out hover:scale-115 active:scale-95 ${
                            isQuestionCardsActive
                                ? "border-green-400 bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)] scale-110"
                                : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white"
                        }`}
                    >
                        <HelpCircle size={16} className={isQuestionCardsActive ? "animate-pulse" : ""} />
                    </Link>
                    {isQuestionCardsActive && (
                        <div className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    )}
                </div>
            </motion.div>
        </div>
    );
}
