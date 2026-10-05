"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
    Landmark, Building2, TrendingUp, User, Globe, DollarSign, ArrowRightLeft, 
    History, MoveHorizontal, MapPin, Briefcase, Building, Scale, Lock, 
    Coins, AlertTriangle, Zap, Headphones, Wallet, Ruler, ClipboardList, 
    Smartphone, Rewind, Trophy, Eye, RefreshCw, Ghost, TrendingDown, BookOpen,
    Play, Heart, Share2, Music, Volume2, VolumeX,
    Maximize2, Minimize2
} from "lucide-react";

export interface SectionContent {
    id: string;
    title: string;
    text: string[];
    visualType: string;
    inDepth?: string[];
    videoUrl?: string;
}

interface ScrollytellingLessonProps {
    sections: SectionContent[];
    grade: string;
    slug: string;
}

import { generateInDepthContent } from "@/lib/lessonHelpers";

export const ScrollytellingLesson: React.FC<ScrollytellingLessonProps> = ({ sections, grade, slug }) => {
    const [activeSection, setActiveSection] = useState(0);
    const [likedSections, setLikedSections] = useState<Record<string, boolean>>({});
    const [sectionLikes, setSectionLikes] = useState<Record<string, number>>({});
    const [bookmarkedSections, setBookmarkedSections] = useState<Record<string, boolean>>({});
    const [showToast, setShowToast] = useState(false);
    const [activeHearts, setActiveHearts] = useState<Record<string, { id: number; x: number; y: number }[]>>({});
    const [isMuted, setIsMuted] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [readyVideos, setReadyVideos] = useState<Record<string, boolean>>({});
    const [playingStates, setPlayingStates] = useState<Record<string, boolean>>({});
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Reset playing state to true when active section changes to hide play overlay on snap
    useEffect(() => {
        const activeSecId = sections[activeSection]?.id;
        if (activeSecId) {
            setPlayingStates((prev) => ({ ...prev, [activeSecId]: true }));
        }
    }, [activeSection, sections]);

    const togglePlay = (id: string) => {
        if (!readyVideos[id]) return;
        const iframe = document.getElementById(`youtube-iframe-${id}`) as HTMLIFrameElement | null;
        if (!iframe || !iframe.contentWindow) return;

        const currentlyPlaying = playingStates[id] !== false; // defaults to true
        const nextPlaying = !currentlyPlaying;

        setPlayingStates((prev) => ({ ...prev, [id]: nextPlaying }));

        iframe.contentWindow.postMessage(
            JSON.stringify({
                event: "command",
                func: nextPlaying ? "playVideo" : "pauseVideo",
                args: []
            }),
            "*"
        );
    };

    const toggleExpandSection = (secId: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [secId]: !prev[secId]
        }));
    };
    
    // Collapse any expanded section when clicking outside the expanded text container
    useEffect(() => {
        const hasExpanded = Object.values(expandedSections).some(Boolean);
        if (!hasExpanded) return;

        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Ignore if click is within the description panel or on the "read more" button
            if (target.closest("[data-description-panel]") || target.closest("[data-read-more-btn]")) {
                return;
            }
            // Collapse all expanded sections
            setExpandedSections({});
        };

        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [expandedSections]);
    
    const containerRef = useRef<HTMLDivElement>(null);

    // Initializing mock likes count for each section
    useEffect(() => {
        const initialLikes: Record<string, number> = {};
        sections.forEach((sec, idx) => {
            initialLikes[sec.id] = 120 + idx * 45 + Math.floor(Math.random() * 20);
        });
        setSectionLikes(initialLikes);
    }, [sections]);

    // Observe active slide during native snap scrolling
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const secIdx = entry.target.getAttribute("data-section-index");
                        if (secIdx !== null) {
                            setActiveSection(parseInt(secIdx));
                        }
                    }
                });
            },
            {
                root: containerRef.current,
                threshold: 0.6, // Fire when 60% of the slide height is visible
            }
        );

        const cards = containerRef.current?.querySelectorAll("[data-section-card]");
        cards?.forEach((card) => observer.observe(card));

        return () => {
            cards?.forEach((card) => observer.unobserve(card));
        };
    }, [sections]);

    // Listen for YouTube Iframe API ready messages
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (!event.origin.includes("youtube") && !event.origin.includes("youtube-nocookie")) return;
            try {
                const data = JSON.parse(event.data);
                if (data.event === "onReady" || data.event === "initialDelivery") {
                    const iframes = document.querySelectorAll("iframe");
                    for (let i = 0; i < iframes.length; i++) {
                        if (iframes[i].contentWindow === event.source) {
                            const idAttr = iframes[i].id;
                            if (idAttr) {
                                const id = idAttr.replace("youtube-iframe-", "");
                                setReadyVideos((prev) => ({ ...prev, [id]: true }));
                            }
                            break;
                        }
                    }
                }
            } catch (e) {
                // Ignore parsing errors for other messages
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    // Handle Mute/Unmute state using YouTube postMessage API to avoid reloading/restarting the video
    useEffect(() => {
        const activeSecId = sections[activeSection]?.id;
        if (!activeSecId) return;
        if (!readyVideos[activeSecId]) return;

        const toggleSound = () => {
            const iframe = document.getElementById(`youtube-iframe-${activeSecId}`) as HTMLIFrameElement | null;
            if (iframe && iframe.contentWindow) {
                if (isMuted) {
                    iframe.contentWindow.postMessage(
                        JSON.stringify({
                            event: "command",
                            func: "mute",
                            args: []
                        }),
                        "*"
                    );
                } else {
                    iframe.contentWindow.postMessage(
                        JSON.stringify({
                            event: "command",
                            func: "unMute",
                            args: []
                        }),
                        "*"
                    );
                    iframe.contentWindow.postMessage(
                        JSON.stringify({
                            event: "command",
                            func: "setVolume",
                            args: [100]
                        }),
                        "*"
                    );
                }
            }
        };

        toggleSound();
    }, [isMuted, activeSection, sections, readyVideos]);

    // Interaction Handlers
    const handleLikeClick = (secId: string) => {
        const isLiked = likedSections[secId];
        setLikedSections((prev) => ({ ...prev, [secId]: !isLiked }));
        setSectionLikes((prev) => ({
            ...prev,
            [secId]: isLiked ? (prev[secId] || 0) - 1 : (prev[secId] || 0) + 1,
        }));
    };

    const handleBookmarkClick = (secId: string) => {
        setBookmarkedSections((prev) => ({ ...prev, [secId]: !bookmarkedSections[secId] }));
    };

    const handleShareClick = (secId: string) => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(`${window.location.origin}/learn/${grade}/${slug}?sec=${secId}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    // Double click to Like + Floating Heart effect
    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>, secId: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newHeart = { id: Date.now() + Math.random(), x, y };
        setActiveHearts((prev) => ({
            ...prev,
            [secId]: [...(prev[secId] || []), newHeart],
        }));

        setTimeout(() => {
            setActiveHearts((prev) => ({
                ...prev,
                [secId]: (prev[secId] || []).filter((h) => h.id !== newHeart.id),
            }));
        }, 800);

        if (!likedSections[secId]) {
            setLikedSections((prev) => ({ ...prev, [secId]: true }));
            setSectionLikes((prev) => ({ ...prev, [secId]: (prev[secId] || 0) + 1 }));
        }
    };

    const scrollToSection = (idx: number) => {
        const cards = containerRef.current?.querySelectorAll("[data-section-card]");
        if (cards && cards[idx]) {
            cards[idx].scrollIntoView({ behavior: "smooth" });
        }
    };

    const extractVideoId = (url?: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="w-full h-full relative flex flex-col items-center">
            {/* Snapping Scroll Area (occupies full container width & height) */}
            <div className="w-full h-full rounded-[var(--radius)] border-2 border-[var(--ink)] shadow-[var(--card-shadow)] overflow-hidden relative bg-[var(--paper)] flex flex-col">
                <div
                    ref={containerRef}
                    className="flex-1 w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {sections.map((section, idx) => {
                        const videoId = extractVideoId(section.videoUrl);
                        const isActive = activeSection === idx;
                        
                        return (
                            <div
                                key={section.id}
                                data-section-card
                                data-section-index={idx}
                                className="w-full h-full snap-start snap-always relative overflow-hidden flex flex-col justify-end bg-[var(--sunken)]"
                                onDoubleClick={(e) => handleDoubleClick(e, section.id)}
                            >
                                {/* Background Layer (Video or interactive visual) */}
                                {videoId ? (
                                    <div className="absolute inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden bg-[var(--sunken)]">
                                        {isActive && (
                                            <>
                                                {/* If paused, show the high-quality still thumbnail to hide YouTube's native pause overlay */}
                                                {playingStates[section.id] === false && (
                                                    <img
                                                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                                        alt={section.title}
                                                        className="absolute inset-0 w-full h-full object-cover z-5 opacity-100 animate-fade-in"
                                                    />
                                                )}
                                                <iframe
                                                    id={`youtube-iframe-${section.id}`}
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1`}
                                                    title={section.title}
                                                    frameBorder="0"
                                                    className={`w-full h-full object-cover pointer-events-none scale-[1.3] origin-center transition-opacity duration-300 ${
                                                        playingStates[section.id] !== false
                                                            ? "opacity-100" 
                                                            : "opacity-0 pointer-events-none"
                                                    }`}
                                                ></iframe>
                                            </>
                                        )}
                                        {/* Custom Play Button Overlay Widget */}
                                        {playingStates[section.id] === false && (
                                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                <div className="w-16 h-16 bg-[var(--raised)] border-2 border-[var(--ink)] rounded-full flex items-center justify-center shadow-[var(--card-shadow)] transition-transform duration-300 scale-100">
                                                    <Play className="text-[var(--ink)] fill-[var(--ink)] ml-1.5" size={24} />
                                                </div>
                                            </div>
                                        )}
                                        {/* Transparent overlay that shields the iframe from receiving touch/click events, completely preventing pause overlays */}
                                        <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto bg-transparent" />
                                    </div>
                                ) : (
                                    /* Interactive diagram on chart paper when there is no video */
                                    <div className="absolute inset-0 w-full h-full bg-[var(--paper)] z-0 overflow-hidden flex items-center justify-center bg-grid">
                                        <div className="relative z-10 w-full max-w-xs md:max-w-sm aspect-square flex items-center justify-center card select-none">
                                            <div className="scale-90 md:scale-100 transition-transform text-[var(--ink)]">
                                                {renderVisual(section.visualType)}
                                            </div>
                                        </div>
                                    </div>
                                )}



                                {/* Transparent touch/click shielding layer that sits on top of the background layer to swallow all interactions and prevent the iframe controls from ever being triggered */}
                                <div 
                                     onClick={() => {
                                         if (expandedSections[section.id]) {
                                             toggleExpandSection(section.id);
                                         } else {
                                             togglePlay(section.id);
                                         }
                                     }}
                                     className="absolute inset-0 w-full h-full z-15 pointer-events-auto bg-transparent cursor-pointer" 
                                 />

                                {/* Sidebar Actions Panel */}
                                <div className="absolute right-6 bottom-8 flex flex-col items-center gap-4 z-20 pointer-events-auto">
                                    {/* Academy Avatar */}
                                    {!isFullscreen && (
                                        <div className="relative mb-1">
                                            <div className="w-11 h-11 rounded-full border-2 border-[var(--ink)] bg-[var(--raised)] flex items-center justify-center font-bold text-xs text-[var(--chalk)] select-none shadow-[2px_2px_0_var(--ink)]">
                                                PA
                                            </div>
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[var(--chalk)] text-[var(--on-chalk)] rounded-full w-4.5 h-4.5 flex items-center justify-center font-extrabold text-[10px] border border-[var(--ink)] select-none">
                                                ✓
                                            </div>
                                        </div>
                                    )}

                                    {/* Like Button */}
                                    {!isFullscreen && (
                                        <button
                                            onClick={() => handleLikeClick(section.id)}
                                            className="flex flex-col items-center group"
                                        >
                                            <div className={`p-3 rounded-full border-2 border-[var(--ink)] transition-all duration-300 shadow-[2px_2px_0_var(--ink)] ${
                                                likedSections[section.id]
                                                    ? "bg-[color-mix(in_srgb,var(--pencil)_18%,var(--raised))] text-[var(--pencil)] scale-110"
                                                    : "bg-[var(--raised)] text-[var(--ink)] hover:bg-[var(--highlighter)]"
                                            }`}>
                                                <Heart size={20} fill={likedSections[section.id] ? "currentColor" : "none"} />
                                            </div>
                                            <span className="text-xs font-bold text-[var(--ink)] mt-1 select-none drop-shadow-[0_1px_0_var(--raised)]">
                                                {sectionLikes[section.id] || 0}
                                            </span>
                                        </button>
                                    )}


                                    {/* Share Button */}
                                    {!isFullscreen && (
                                        <button
                                            onClick={() => handleShareClick(section.id)}
                                            className="flex flex-col items-center group"
                                        >
                                            <div className="p-3 bg-[var(--raised)] hover:bg-[var(--highlighter)] text-[var(--ink)] rounded-full transition-all border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]">
                                                <Share2 size={20} />
                                            </div>
                                            <span className="text-xs font-bold text-[var(--ink)] mt-1 select-none drop-shadow-[0_1px_0_var(--raised)]">Share</span>
                                        </button>
                                    )}

                                    {/* Mute/Unmute Button */}
                                    {!isFullscreen && (
                                        <button
                                            onClick={() => setIsMuted((prev) => !prev)}
                                            className="flex flex-col items-center group"
                                        >
                                            <div className={`p-3 rounded-full border-2 border-[var(--ink)] transition-all duration-300 shadow-[2px_2px_0_var(--ink)] ${
                                                !isMuted
                                                    ? "bg-[color-mix(in_srgb,var(--chalk)_22%,var(--raised))] text-[var(--chalk)] scale-110"
                                                    : "bg-[var(--raised)] text-[var(--ink)] hover:bg-[var(--highlighter)]"
                                            }`}>
                                                {!isMuted ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
                                            </div>
                                            <span className="text-xs font-bold text-[var(--ink)] mt-1 select-none drop-shadow-[0_1px_0_var(--raised)]">
                                                {!isMuted ? "Sound On" : "Mute"}
                                            </span>
                                        </button>
                                    )}

                                    {/* Full Screen Button */}
                                    <button
                                        onClick={() => setIsFullscreen((prev) => !prev)}
                                        className="flex flex-col items-center group"
                                    >
                                        <div className={`p-3 rounded-full border-2 border-[var(--ink)] transition-all duration-300 shadow-[2px_2px_0_var(--ink)] ${
                                            isFullscreen
                                                ? "bg-[var(--highlighter)] text-[var(--ink)] scale-110"
                                                : "bg-[var(--raised)] text-[var(--ink)] hover:bg-[var(--highlighter)]"
                                        }`}>
                                            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                        </div>
                                        <span className="text-xs font-bold text-[var(--ink)] mt-1 select-none drop-shadow-[0_1px_0_var(--raised)]">
                                            {isFullscreen ? "Exit" : "Fullscreen"}
                                        </span>
                                    </button>
                                </div>

                                {/* Bottom Details Panel */}
                                {!isFullscreen && (
                                    <div 
                                        data-description-panel
                                        className={`absolute left-4 bottom-4 z-20 text-left pointer-events-auto w-fit max-w-[min(440px,calc(100%-5.5rem))] transition-all duration-300 card !p-4 ${
                                            expandedSections[section.id] ? "" : ""
                                        }`}
                                    >
                                        <h4 className="font-display font-bold text-[var(--ink)] text-lg md:text-xl leading-snug mb-2">
                                            {section.title}
                                        </h4>
                                        
                                        {/* Scrollable section prose */}
                                        <div className="max-h-[22vh] overflow-y-auto pr-2 scrollbar-none mb-0 lesson-prose !text-xs md:!text-sm !leading-relaxed space-y-2">
                                            {(() => {
                                                const combinedText = section.text.join(" ");
                                                const isLongText = combinedText.length > 100;
                                                const isExpanded = !!expandedSections[section.id];
                                                
                                                if (isLongText && !isExpanded) {
                                                    return (
                                                        <p className="!mb-0">
                                                            {combinedText.slice(0, 100)}...
                                                            <button 
                                                                data-read-more-btn
                                                                onClick={() => toggleExpandSection(section.id)}
                                                                className="text-[var(--chalk)] hover:text-[var(--ink)] font-semibold ml-1 focus:outline-none transition-colors"
                                                            >
                                                                read more
                                                            </button>
                                                        </p>
                                                    );
                                                }
                                                
                                                return section.text.map((paragraph, pIdx) => (
                                                    <p key={pIdx} className="!mb-0">
                                                        {paragraph}
                                                        {isLongText && pIdx === section.text.length - 1 && (
                                                            <button 
                                                                onClick={() => toggleExpandSection(section.id)}
                                                                className="text-[var(--chalk)] hover:text-[var(--ink)] font-semibold ml-2 focus:outline-none transition-colors inline-block"
                                                            >
                                                                read less
                                                            </button>
                                                        )}
                                                    </p>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {/* Double Tap Heart Overlays */}
                                {activeHearts[section.id]?.map((heart) => (
                                    <motion.div
                                        key={heart.id}
                                        initial={{ scale: 0, opacity: 1, y: 0, rotate: Math.random() * 40 - 20 }}
                                        animate={{ scale: [1, 1.7, 1], opacity: [1, 1, 0], y: -90 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="absolute z-30 pointer-events-none text-[var(--pencil)] text-6xl"
                                        style={{ left: heart.x - 30, top: heart.y - 30 }}
                                    >
                                        ❤️
                                    </motion.div>
                                ))}
                            </div>
                        );
                    })}
                </div>

                {/* Vertical Progress Navigation Dots */}
                {!isFullscreen && (
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20">
                        {sections.map((section, idx) => {
                            const isActive = activeSection === idx;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(idx)}
                                    className={`w-2 rounded-full border border-[var(--ink)] transition-all duration-300 ${
                                        isActive ? "h-6 bg-[var(--highlighter)]" : "h-2 bg-[var(--raised)] hover:bg-[var(--chalk)]"
                                    }`}
                                />
                            );
                        })}
                    </div>
                )}



                {/* Link Share Toast */}
                {showToast && (
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 snackbar snackbar-ok text-xs font-extrabold z-50 flex items-center gap-1">
                        Section link copied to clipboard!
                    </div>
                )}
            </div>
        </div>
    );
};

const renderVisual = (type: string) => {
    switch (type) {
        // Preschool L1
        case "l1-intro":
            return (
                <div className="relative">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-48 h-48 border-2 border-dashed border-[color-mix(in_srgb,var(--chalk)_40%,var(--ink))] rounded-full flex items-center justify-center">
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                            <Globe className="text-[var(--chalk)]" size={80} />
                        </motion.div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="absolute -right-4 -top-4 bg-[var(--raised)] p-3 rounded-xl border border-[var(--line)] shadow-xl">
                        <div className="text-xs text-[var(--muted)] uppercase tracking-widest font-bold">Volume</div>
                        <div className="text-xl font-bold text-[var(--chalk)]">High</div>
                    </motion.div>
                </div>
            );
        case "l1-scale":
            return (
                <div className="space-y-6 text-center">
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl font-black text-[var(--ink)]">
                        $7.5T
                    </motion.div>
                    <div className="text-sm text-[var(--chalk)] font-medium uppercase tracking-[0.2em]">Traded per day</div>
                    <div className="flex gap-2 justify-center">
                        {[...Array(5)].map((_, i) => (
                            <motion.div key={i} initial={{ height: 10 }} animate={{ height: [10, 40, 15, 30, 10] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} className="w-2 bg-[color-mix(in_srgb,var(--chalk)_40%,transparent)] rounded-full" />
                        ))}
                    </div>
                </div>
            );
        case "l1-participants":
            return (
                <div className="grid grid-cols-2 gap-4">
                    {[{ icon: Landmark, label: "Central Banks" }, { icon: Building2, label: "Banks" }, { icon: TrendingUp, label: "Hedge Funds" }, { icon: User, label: "You" }].map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[var(--sunken)] border border-[var(--line)] p-4 rounded-2xl flex flex-col items-center gap-2">
                            <item.icon className="text-[var(--chalk)]" size={24} />
                            <div className="text-[10px] text-[var(--muted)] font-bold uppercase">{item.label}</div>
                        </motion.div>
                    ))}
                </div>
            );
        case "l1-pairs":
            return (
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-[var(--sunken)] border border-[var(--line)] flex items-center justify-center text-2xl">🇪🇺</div>
                        <div className="text-xs font-bold">EUR</div>
                    </div>
                    <ArrowRightLeft className="text-[var(--line)]" size={32} />
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-[color-mix(in_srgb,var(--chalk)_18%,var(--raised))] border border-[color-mix(in_srgb,var(--chalk)_45%,var(--ink))] flex items-center justify-center text-2xl">🇺🇸</div>
                        <div className="text-xs font-bold">USD</div>
                    </div>
                </div>
            );

        // Preschool L2
        case "l2-how-intro":
            return (
                <div className="relative w-40 h-40">
                    <motion.div animate={{ rotate: [0, 180, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-full h-full border-4 border-dashed border-[var(--line)] rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">🔄</div>
                </div>
            );
        case "l2-buy-sell":
            return (
                <div className="flex gap-8">
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-xl bg-[color-mix(in_srgb,var(--chalk)_18%,var(--raised))] text-[var(--chalk)] flex items-center justify-center text-3xl font-bold">▲</div>
                        <span className="text-[var(--chalk)] font-bold">BUY</span>
                    </motion.div>
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-xl bg-[color-mix(in_srgb,var(--pencil)_18%,var(--raised))] text-[var(--pencil)] flex items-center justify-center text-3xl font-bold">▼</div>
                        <span className="text-[var(--pencil)] font-bold">SELL</span>
                    </motion.div>
                </div>
            );
        case "l2-pips-lots":
            return (
                <div className="text-center font-mono text-4xl tracking-widest">
                    1.10<motion.span animate={{ color: ["var(--ink)", "var(--chalk)", "var(--ink)"] }} transition={{ duration: 2, repeat: Infinity }} className="font-bold">4</motion.span>2
                    <div className="text-sm font-sans text-[var(--chalk)] mt-2 uppercase tracking-normal">The Pip</div>
                </div>
            );

        // Preschool L3
        case "l3-sessions":
            return (
                <div className="relative w-48 h-48 border-4 border-[var(--line)] rounded-full flex items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute w-1 h-20 bg-[var(--chalk)] origin-bottom rounded-full" style={{ bottom: "50%" }} />
                    <div className="w-3 h-3 bg-[var(--ink)] rounded-full z-10" />
                </div>
            );
        case "l3-overlap":
            return (
                <div className="flex -space-x-8">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} className="w-24 h-24 rounded-full bg-[color-mix(in_srgb,var(--ink)_25%,var(--sunken))] flex items-center justify-center text-xs font-bold">London</motion.div>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }} className="w-24 h-24 rounded-full bg-[color-mix(in_srgb,var(--chalk)_40%,transparent)] flex items-center justify-center text-xs font-bold">NY</motion.div>
                </div>
            );

        // Preschool L4
        case "l4-major-players":
            return (
                <div className="relative">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }}>
                        <Building2 size={80} className="text-[var(--ink)]" />
                    </motion.div>
                    <div className="text-center text-xs text-[var(--muted)] font-bold mt-2 uppercase">Institutional</div>
                </div>
            );
        case "l4-retail":
            return (
                <div className="relative">
                    <motion.div animate={{ x: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }}>
                        <User size={64} className="text-[var(--chalk)]" />
                    </motion.div>
                    <div className="text-center text-xs text-[var(--muted)] font-bold mt-2 uppercase">Retail</div>
                </div>
            );

        // Preschool L5
        case "l5-liquidity":
            return (
                <div className="flex gap-1 overflow-hidden h-24 items-end">
                    {[...Array(12)].map((_, i) => (
                        <motion.div key={i} animate={{ height: ["20%", "100%", "20%"] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }} className="w-4 bg-[color-mix(in_srgb,var(--ink)_35%,var(--sunken))] rounded-t-sm" />
                    ))}
                </div>
            );
        case "l5-low-costs":
            return (
                <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }} className="bg-[color-mix(in_srgb,var(--chalk)_18%,var(--raised))] border border-[var(--chalk)] p-6 rounded-2xl">
                    <div className="text-3xl font-bold text-[var(--chalk)]">0%</div>
                    <div className="text-xs uppercase font-bold text-[var(--chalk)]/70 mt-1">Commission</div>
                </motion.div>
            );

        // Preschool L6
        case "l6-leverage":
            return (
                <div className="flex items-center gap-4">
                    <div className="text-xl font-bold">$1</div>
                    <div className="flex-1 h-2 bg-[var(--sunken)] rounded-full overflow-hidden">
                        <motion.div animate={{ width: ["0%", "100%", "0%"] }} transition={{ duration: 3, repeat: Infinity }} className="h-full bg-[var(--chalk)]" />
                    </div>
                    <div className="text-3xl font-bold text-[var(--chalk)]">$50</div>
                </div>
            );
        case "l6-margin-call":
            return (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-6xl text-[var(--pencil)]">
                    ⚠️
                </motion.div>
            );

        // Kindergarten L1
        case "k1-broker-intro":
            return (
                <div className="flex items-center gap-4 text-4xl">
                    <div className="opacity-50">👤</div>
                    <motion.div animate={{ x: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }} className="text-[var(--ink)]">↔️</motion.div>
                    <div className="opacity-50">🏦</div>
                </div>
            );
        case "k1-regulation":
            return (
                <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 3, repeat: Infinity }} className="w-24 h-24 bg-[color-mix(in_srgb,var(--highlighter)_28%,var(--raised))] border-2 border-[var(--highlighter)] rounded-full flex items-center justify-center text-4xl">
                    ⭐
                </motion.div>
            );

        // Kindergarten L2
        case "k2-platform":
            return (
                <div className="w-48 h-32 bg-[var(--sunken)] rounded-lg border border-[var(--line)] p-2 relative overflow-hidden">
                    <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute top-1/2 w-full h-0.5 bg-[color-mix(in_srgb,var(--chalk)_50%,transparent)]" />
                    <div className="w-full h-full bg-[var(--sunken)] rounded flex items-center justify-center">💻</div>
                </div>
            );

        // Kindergarten L3
        case "k3-technical":
            return (
                <div className="w-full h-32 flex items-end gap-1 px-4 relative">
                    <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <motion.path 
                            initial={{ d: "M 0 50 Q 25 20 50 50 Q 75 80 100 30" }}
                            animate={{ d: ["M 0 50 Q 25 20 50 50 Q 75 80 100 30", "M 0 30 Q 25 60 50 30 Q 75 0 100 50", "M 0 50 Q 25 20 50 50 Q 75 80 100 30"] }} 
                            fill="none" 
                            stroke="var(--chalk)" 
                            strokeWidth="2" 
                            transition={{ duration: 4, repeat: Infinity }} 
                        />
                    </motion.svg>
                </div>
            );
        case "k3-fundamental":
            return (
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-6xl">
                    📰
                </motion.div>
            );

        // Elementary L1
        case "e1-support":
            return (
                <div className="relative w-full h-40 flex flex-col items-center justify-end pb-4">
                    <motion.div animate={{ y: [-80, 0, -80] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="w-8 h-8 bg-[var(--chalk)] rounded-full mb-2" />
                    <div className="w-3/4 h-2 bg-[var(--sunken)] rounded-full" />
                </div>
            );
        case "e1-resistance":
            return (
                <div className="relative w-full h-40 flex flex-col items-center justify-start pt-4">
                    <div className="w-3/4 h-2 bg-[var(--sunken)] rounded-full" />
                    <motion.div animate={{ y: [80, 0, 80] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="w-8 h-8 bg-[var(--pencil)] rounded-full mt-2" />
                </div>
            );

        // Elementary L2
        case "e2-candle":
            return (
                <div className="flex flex-col items-center">
                    <div className="w-1 h-8 bg-[var(--chalk)]" />
                    <motion.div animate={{ height: [40, 60, 40] }} transition={{ duration: 2, repeat: Infinity }} className="w-8 bg-[var(--chalk)] rounded-sm" />
                    <div className="w-1 h-12 bg-[var(--chalk)]" />
                </div>
            );

        case "l1-history":
            return (
                <div className="relative">
                    <History size={64} className="text-[var(--ink)]" />
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="w-1 h-8 bg-[var(--muted)] rounded-full origin-bottom" style={{ transform: 'translateY(-50%)' }} />
                    </motion.div>
                </div>
            );
        case "l2-bull-bear":
            return (
                <div className="flex gap-12">
                    <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                        <TrendingUp size={64} className="text-[var(--chalk)]" />
                    </motion.div>
                    <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
                        <TrendingDown size={64} className="text-[var(--pencil)]" />
                    </motion.div>
                </div>
            );
        case "l2-spread":
            return (
                <motion.div animate={{ scaleX: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <MoveHorizontal size={80} className="text-[var(--ink)]" />
                </motion.div>
            );
        case "l3-tokyo":
        case "l3-london":
        case "l3-new-york":
            return (
                <div className="relative w-48 h-32 bg-[var(--sunken)] rounded-xl border border-[var(--line)] flex items-center justify-center overflow-hidden">
                    <Globe size={120} className="text-[var(--line)] absolute -bottom-10 -right-10" />
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                        <MapPin size={48} className="text-[var(--pencil)] fill-[color-mix(in_srgb,var(--pencil)_20%,transparent)]" />
                    </motion.div>
                    <div className="absolute bottom-2 text-[10px] font-bold uppercase tracking-tighter opacity-50">
                        {type.split('-')[1]} Session
                    </div>
                </div>
            );
        case "l4-hedge-funds":
            return (
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Briefcase size={80} className="text-[var(--ink)]" />
                </motion.div>
            );
        case "l4-corporations":
            return (
                <div className="relative">
                    <Building size={80} className="text-[var(--ink)]" />
                    <motion.div 
                        animate={{ opacity: [0, 1, 0], x: [-20, 20] }} 
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-1/2 left-full text-[var(--ink)]"
                    >
                        <DollarSign size={24} />
                    </motion.div>
                </div>
            );
        case "l4-governments":
            return (
                <div className="relative">
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }}>
                        <Landmark size={80} className="text-[var(--highlighter)]" />
                    </motion.div>
                </div>
            );
        case "l5-no-middlemen":
            return (
                <div className="relative w-48 h-2 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[var(--sunken)] rounded-full" />
                    <motion.div 
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        className="absolute h-full bg-[var(--pencil)] rounded-full"
                    />
                    <div className="flex gap-16 absolute -top-8">
                        <User size={32} className="text-[var(--muted)]" />
                        <Building2 size={32} className="text-[var(--muted)]" />
                    </div>
                </div>
            );
        case "l5-24-hour":
            return (
                <div className="relative">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                        <Globe size={80} className="text-[var(--ink)]" />
                    </motion.div>
                </div>
            );
        case "l5-no-manipulation":
            return (
                <motion.div animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                    <Scale size={80} className="text-[var(--ink)]" />
                </motion.div>
            );
        case "l6-margin-used":
            return (
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Lock size={80} className="text-[var(--highlighter)]" />
                </motion.div>
            );
        case "l6-equity":
            return (
                <div className="flex flex-col items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        >
                            <Coins size={32} className="text-[var(--highlighter)]" />
                        </motion.div>
                    ))}
                </div>
            );
        case "l6-stop-out":
            return (
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }} 
                    transition={{ duration: 0.5, repeat: Infinity }}
                >
                    <AlertTriangle size={80} className="text-[var(--pencil)]" />
                </motion.div>
            );
        case "k1-execution":
            return (
                <div className="relative">
                    <Zap size={80} className="text-[var(--highlighter)] fill-[color-mix(in_srgb,var(--highlighter)_25%,transparent)]" />
                    <motion.div 
                        animate={{ scale: [1, 1.5], opacity: [1, 0] }} 
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0"
                    >
                        <Zap size={80} className="text-[var(--highlighter)]" />
                    </motion.div>
                </div>
            );
        case "k1-customer-service":
            return (
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Headphones size={80} className="text-[var(--ink)]" />
                </motion.div>
            );
        case "k1-deposit-withdraw":
            return (
                <div className="relative">
                    <Wallet size={80} className="text-[var(--chalk)]" />
                    <motion.div 
                        animate={{ y: [-20, 20], opacity: [0, 1, 0] }} 
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -right-8 top-0"
                    >
                        <DollarSign size={32} className="text-[var(--chalk)]" />
                    </motion.div>
                </div>
            );
        case "k2-charting-tools":
            return (
                <div className="relative w-48 h-32 border border-[var(--line)] rounded-lg overflow-hidden">
                    <motion.div 
                        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="p-4"
                    >
                        <Ruler size={48} className="text-[var(--ink)]" />
                    </motion.div>
                </div>
            );
        case "k2-order-types":
            return (
                <div className="relative">
                    <ClipboardList size={80} className="text-[var(--muted)]" />
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -right-2 -bottom-2 bg-[var(--chalk)] rounded-full p-1"
                    >
                        <Zap size={16} className="text-[var(--on-chalk)]" />
                    </motion.div>
                </div>
            );
        case "k2-mobile":
            return (
                <div className="relative">
                    <Smartphone size={80} className="text-[var(--muted)]" />
                    <motion.div 
                        animate={{ height: ["20%", "60%", "20%"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-4 left-1/2 -translate-x-1/2 w-8 bg-[color-mix(in_srgb,var(--chalk)_40%,transparent)] rounded-sm"
                    />
                </div>
            );
        case "k2-backtesting":
            return (
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                    <Rewind size={80} className="text-[var(--muted)]" />
                </motion.div>
            );
        case "k3-sentiment":
            return (
                <div className="flex gap-4">
                    <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                        <User size={48} className="text-[var(--chalk)]" />
                    </motion.div>
                    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }}>
                        <User size={48} className="text-[var(--pencil)]" />
                    </motion.div>
                </div>
            );
        case "k3-which-is-best":
            return (
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} 
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Trophy size={80} className="text-[var(--highlighter)]" />
                </motion.div>
            );
        case "k3-self-fulfilling":
            return (
                <div className="relative">
                    <Eye size={80} className="text-[var(--ink)]" />
                    {[...Array(3)].map((_, i) => (
                        <motion.div 
                            key={i}
                            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                            transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }}
                            className="absolute inset-0 border-2 border-[var(--line)] rounded-full"
                        />
                    ))}
                </div>
            );
        case "e1-breakout":
            return (
                <div className="relative w-48 h-2 bg-[var(--sunken)] rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "circIn" }}
                        className="w-12 h-full bg-[var(--chalk)]"
                    />
                </div>
            );
        case "e1-role-reversal":
            return (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                    <RefreshCw size={80} className="text-[var(--ink)]" />
                </motion.div>
            );
        case "e1-fakeout":
            return (
                <motion.div 
                    animate={{ y: [0, -20, 0], opacity: [0.2, 1, 0.2] }} 
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Ghost size={80} className="text-[var(--muted)]" />
                </motion.div>
            );
        case "e2-wicks":
            return (
                <div className="flex flex-col items-center">
                    <motion.div animate={{ height: [20, 40, 20] }} transition={{ duration: 2, repeat: Infinity }} className="w-0.5 bg-[var(--muted)]" />
                    <div className="w-6 h-12 border border-[var(--muted)]" />
                    <motion.div animate={{ height: [40, 20, 40] }} transition={{ duration: 2, repeat: Infinity }} className="w-0.5 bg-[var(--muted)]" />
                </div>
            );
        case "e2-bullish-candle":
            return (
                <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-[var(--chalk)]" />
                    <motion.div 
                        initial={{ height: 10 }}
                        animate={{ height: 60 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-8 bg-[var(--chalk)] rounded-sm"
                    />
                    <div className="w-0.5 h-6 bg-[var(--chalk)]" />
                </div>
            );
        case "e2-bearish-candle":
            return (
                <div className="flex flex-col items-center">
                    <div className="w-0.5 h-6 bg-[var(--pencil)]" />
                    <motion.div 
                        initial={{ height: 60 }}
                        animate={{ height: 10 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-8 bg-[var(--pencil)] rounded-sm"
                    />
                    <div className="w-0.5 h-4 bg-[var(--pencil)]" />
                </div>
            );
        case "e2-doji":
            return (
                <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute w-full h-0.5 bg-[var(--ink)]" />
                    <div className="absolute h-full w-0.5 bg-[var(--ink)]" />
                </div>
            );

        default:
            return <div className="text-8xl">📊</div>;
    }
};


