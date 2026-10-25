"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen, PlayCircle } from "lucide-react";
import { loadGradesWithProgress } from "@/lib/clientCache";

export function LearnSidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
    const pathname = usePathname();
    const [grades, setGrades] = useState<any[]>([]);

    // Determine active grade from pathname
    const activeGradeId = pathname.split("/").filter(Boolean)[1] || "";

    useEffect(() => {
        async function fetchGradesAndProgress() {
            try {
                const { grades: fetchedGrades } = await loadGradesWithProgress();

                setGrades(fetchedGrades);
            } catch (err) {
                console.error("Failed to fetch dynamic grades and progress in LearnSidebar:", err);
            }
        }
        fetchGradesAndProgress();
    }, [pathname]);

    return (
        <aside
            className={`fixed left-0 top-0 bottom-0 z-30 flex transition-all duration-300 ease-in-out border-r border-white/10 ${isCollapsed ? "w-16" : "w-72"
                } bg-[#0a0f0d]/95 backdrop-blur-xl shadow-2x-l`}
        >
            <div className={`flex flex-col w-full h-full ${isCollapsed ? "p-2 pt-6" : "p-4 pt-6"}`}>
                <div className={`flex items-center ${isCollapsed ? "justify-center px-0" : "justify-between px-2"} mb-10`}>
                    {!isCollapsed && <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Curriculum</span>}
                    <button
                        onClick={onToggle}
                        className={`p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors ${!isCollapsed ? "ml-auto" : ""}`}
                    >
                        {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                    </button>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
                    {grades.map((grade) => {
                        const isActive = activeGradeId === grade.id;
                        return (
                            <Link
                                key={grade.id}
                                href="/quizzes"
                                className={`flex items-center ${isCollapsed ? "justify-center p-1" : "gap-4 p-3"} rounded-xl transition-all group ${isActive
                                    ? "bg-green-500/10 text-green-400"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold border-2 transition-all ${isActive
                                    ? "border-green-400 bg-green-500/20 text-green-400"
                                    : grade.progress === 100
                                        ? "border-green-500/50 bg-green-500/10 text-green-400"
                                        : "border-white/10 bg-white/5 text-white/40 group-hover:border-white/20"
                                    }`}>
                                    {grade.title.slice(0, 2).toUpperCase()}
                                </div>
                                {!isCollapsed && (
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold truncate">{grade.title}</span>
                                            <span className="text-[10px] opacity-60">{grade.progress}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full mt-1.5 overflow-hidden">
                                            <div
                                                className="h-full bg-current transition-all duration-500"
                                                style={{ width: `${grade.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </Link>
                        );
                    })}

                    <div className="mt-2 mb-6">
                        <Link
                            href="/learn/videos"
                            className={`flex items-center ${isCollapsed ? "justify-center p-1" : "gap-4 p-3"} rounded-xl transition-all group ${pathname === '/learn/videos'
                                ? "bg-green-500/10 text-green-400"
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all ${pathname === '/learn/videos'
                                ? "border-green-400 bg-green-500/20 text-green-400"
                                : "border-white/10 bg-white/5 text-white/40 group-hover:border-white/20"
                                }`}>
                                <PlayCircle size={18} />
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <span className="font-semibold truncate">Videos</span>
                                </div>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}
