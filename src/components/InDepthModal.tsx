"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, ChevronRight } from "lucide-react";

interface InDepthModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string[];
    videoUrl?: string;
}

const extractVideoId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const InDepthModal: React.FC<InDepthModalProps> = ({ isOpen, onClose, title, content, videoUrl }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center py-8 px-[40px]">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[color-mix(in_srgb,var(--ink)_45%,transparent)] backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full card !p-0 z-[101] overflow-hidden flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b-2 border-[var(--line)] flex items-center justify-between bg-[var(--raised)]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[color-mix(in_srgb,var(--chalk)_18%,var(--raised))] border-2 border-[var(--ink)] rounded-[var(--radius-sm)]">
                                    <BookOpen className="text-[var(--chalk)]" size={20} />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold font-display text-[var(--ink)]">
                                    Deep Dive: {title}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[var(--sunken)] rounded-full transition-colors text-[var(--muted)] hover:text-[var(--ink)] border-2 border-transparent hover:border-[var(--ink)]"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content Body (Fixed Height Scrollable) */}
                        <div className="h-[500px] overflow-y-auto px-6 py-8 bg-[var(--paper)]">
                            <div className="w-full space-y-6 pb-4">
                                {videoUrl && extractVideoId(videoUrl) && (
                                    <div className="space-y-3 mb-6">
                                        <div className="kicker flex items-center gap-2 text-[var(--chalk)] !normal-case tracking-wider">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--chalk)]" />
                                            Watch Video Lesson
                                        </div>
                                        <div className="rounded-[var(--radius-sm)] overflow-hidden aspect-video border-2 border-[var(--ink)] bg-[var(--sunken)] shadow-[var(--card-shadow)]">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${extractVideoId(videoUrl)}?rel=0&modestbranding=1`}
                                                title={`${title} Video`}
                                                frameBorder="0"
                                                allowFullScreen
                                                className="w-full h-full"
                                            ></iframe>
                                        </div>
                                    </div>
                                )}

                                {content && content.length > 0 ? (
                                    <div className="lesson-prose space-y-6">
                                        {content.map((p, i) => (
                                            <p key={i}>{p}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center status italic">
                                        No in-depth content available for this section yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t-2 border-[var(--line)] bg-[var(--raised)] flex justify-end">
                            <button
                                onClick={onClose}
                                className="btn chalk !w-auto"
                            >
                                Got it
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};
