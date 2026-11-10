"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, HelpCircle, PanelLeftClose, PanelLeftOpen, PlayCircle } from "lucide-react";

export function LearnSidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
    const pathname = usePathname();
    const clean = pathname.replace(/\/$/, "");
    const isLessons =
        clean === "/learn" ||
        clean.startsWith("/learn/chapters") ||
        (/^\/learn\/[^/]+\/[^/]+/.test(clean) &&
            !clean.startsWith("/learn/question-cards") &&
            !clean.startsWith("/learn/videos"));
    const isVideos = clean === "/learn/videos";
    const isCards = clean === "/learn/question-cards";

    const linkClass = (active: boolean) =>
        `flex items-center ${isCollapsed ? "justify-center p-1" : "gap-4 p-3"} rounded-xl transition-all group ${
            active
                ? "bg-green-500/10 text-green-400"
                : "text-white/60 hover:bg-white/5 hover:text-white"
        }`;

    const iconClass = (active: boolean) =>
        `w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all ${
            active
                ? "border-green-400 bg-green-500/20 text-green-400"
                : "border-white/10 bg-white/5 text-white/40 group-hover:border-white/20"
        }`;

    return (
        <aside
            className={`fixed left-0 top-0 bottom-0 z-30 flex transition-all duration-300 ease-in-out border-r border-white/10 ${
                isCollapsed ? "w-16" : "w-72"
            } bg-[#0a0f0d]/95 backdrop-blur-xl shadow-2x-l`}
        >
            <div className={`flex flex-col w-full h-full ${isCollapsed ? "p-2 pt-6" : "p-4 pt-6"}`}>
                <div
                    className={`flex items-center ${
                        isCollapsed ? "justify-center px-0" : "justify-between px-2"
                    } mb-10`}
                >
                    {!isCollapsed && (
                        <span className="text-sm font-bold text-white/40 uppercase tracking-widest">
                            Learn
                        </span>
                    )}
                    <button
                        onClick={onToggle}
                        className={`p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors ${
                            !isCollapsed ? "ml-auto" : ""
                        }`}
                    >
                        {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                    </button>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
                    <Link href="/learn" className={linkClass(isLessons)}>
                        <div className={iconClass(isLessons)}>
                            <BookOpen size={18} />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <span className="font-semibold truncate">Lessons</span>
                            </div>
                        )}
                    </Link>

                    <Link href="/learn/question-cards" className={linkClass(isCards)}>
                        <div className={iconClass(isCards)}>
                            <HelpCircle size={18} />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <span className="font-semibold truncate">Question cards</span>
                            </div>
                        )}
                    </Link>

                    <Link href="/learn/videos" className={linkClass(isVideos)}>
                        <div className={iconClass(isVideos)}>
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
        </aside>
    );
}
