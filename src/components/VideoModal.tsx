"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    video: {
        id: string | number;
        videoId: string;
        title: string;
        description: string;
    } | null;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, video }) => {
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

    if (!video) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[color-mix(in_srgb,var(--ink)_50%,transparent)] backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl card !p-0 overflow-y-auto max-h-[90vh] z-[101]"
                    >
                        {/* Video Container */}
                        <div className="aspect-video w-full bg-[var(--sunken)] relative group border-b-2 border-[var(--ink)]">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
                                title={video.title}
                                frameBorder="0"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                            
                            {/* Close Button - Floats on top of video, but scrolls with it */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-3 bg-[var(--raised)] hover:bg-[var(--highlighter)] rounded-full transition-all text-[var(--ink)] z-[102] border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] hover:scale-105 active:scale-95"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Info Body */}
                        <div className="p-8 md:p-12 bg-[var(--raised)]">
                            <div className="max-w-4xl">
                                <div className="kicker flex items-center gap-2 mb-4 text-[var(--chalk)]">
                                    <div className="w-2 h-2 rounded-full bg-[var(--chalk)]" />
                                    Trading Education
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold font-display text-[var(--ink)] mb-8 leading-tight">
                                    {video.title}
                                </h2>
                                <div className="h-1 w-20 bg-[var(--highlighter)] border border-[var(--ink)] mb-8" />
                                <div className="lesson-prose !text-xl md:!text-2xl">
                                    <p>{video.description}</p>
                                </div>
                                
                                <div className="mt-12 pt-8 border-t-2 border-[var(--line)] flex flex-wrap gap-4">
                                    <button 
                                        onClick={onClose}
                                        className="btn chalk !w-auto"
                                    >
                                        Back to Library
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            )}
        </AnimatePresence>
    );
};
