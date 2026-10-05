"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Play, Heart, MessageCircle, Share2, 
    Music, X, Send, ChevronDown, Volume2, VolumeX
} from "lucide-react";
import { tradingVideos } from "@/lib/data";

export default function VideosPage() {
    // Immersive Feed States
    const [activeVideoId, setActiveVideoId] = useState<string>("v1");
    const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});
    const [videoLikes, setVideoLikes] = useState<Record<string, number>>({
        v1: 1543,
        v2: 892,
        v3: 1204,
        v4: 765,
        v5: 981,
    });
    const [bookmarkedVideos, setBookmarkedVideos] = useState<Record<string, boolean>>({});
    const [showToast, setShowToast] = useState(false);
    const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);
    const [newCommentText, setNewCommentText] = useState("");
    const [activeHearts, setActiveHearts] = useState<Record<string, { id: number; x: number; y: number }[]>>({});
    const [isMuted, setIsMuted] = useState(true);
    const [playingStates, setPlayingStates] = useState<Record<string, boolean>>({});
    const [readyVideos, setReadyVideos] = useState<Record<string, boolean>>({});
    
    // Simulated Commentary Database
    const [commentsStore, setCommentsStore] = useState<Record<string, { id: string; user: string; text: string; time: string }[]>>({
        v1: [
            { id: "c1", user: "Alpha_Trader", text: "This finally made pips make sense to me! Thank you!", time: "2h ago" },
            { id: "c2", user: "ForexQueen", text: "Best basic explanation ever.", time: "4h ago" },
            { id: "c3", user: "RiskManager", text: "Is leverage really that risky for beginners? I think 1:10 is fine.", time: "6h ago" }
        ],
        v2: [
            { id: "c4", user: "CandleStickGuru", text: "Pure price action is the only way to go. Indicators just lag.", time: "1h ago" },
            { id: "c5", user: "ScalpKing", text: "What timeframe is best for this? 5m or 15m?", time: "3h ago" }
        ],
        v3: [
            { id: "c6", user: "CapitalShield", text: "Risk management is indeed the holy grail. Never trade without it.", time: "30m ago" },
            { id: "c7", user: "PipsMaster", text: "1% rule changed my trading life. Simple but so effective.", time: "2h ago" }
        ],
        v4: [
            { id: "c8", user: "MindsetFirst", text: "Trading psychology is 90% of the game.", time: "10m ago" },
            { id: "c9", user: "FomoFighter", text: "Handling FOMO is my biggest struggle. Excellent tips.", time: "1h ago" }
        ],
        v5: [
            { id: "c10", user: "RevengeNoMore", text: "Revenge trading ruined my last week. Never again.", time: "5m ago" },
            { id: "c11", user: "SafetyFirst", text: "Leverage is a double-edged sword. Awesome warning.", time: "2h ago" }
        ]
    });

    const containerRef = useRef<HTMLDivElement>(null);

    // Reset playing state to true when active video changes to hide play overlay on snap
    useEffect(() => {
        if (activeVideoId) {
            setPlayingStates((prev) => ({ ...prev, [activeVideoId]: true }));
        }
    }, [activeVideoId]);

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

    // Observe active slide during native snap scrolling
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const videoId = entry.target.getAttribute("data-video-id");
                        if (videoId) {
                            setActiveVideoId(videoId);
                        }
                    }
                });
            },
            {
                root: containerRef.current,
                threshold: 0.6, // Fire when 60% of the slide height is visible
            }
        );

        const cards = containerRef.current?.querySelectorAll("[data-video-card]");
        cards?.forEach((card) => observer.observe(card));

        return () => {
            cards?.forEach((card) => observer.unobserve(card));
        };
    }, []);

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
        const activeVidId = activeVideoId;
        if (!activeVidId) return;
        if (!readyVideos[activeVidId]) return;

        const toggleSound = () => {
            const iframe = document.getElementById(`youtube-iframe-${activeVidId}`) as HTMLIFrameElement | null;
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
    }, [isMuted, activeVideoId, readyVideos]);

    // Immersive Interaction Handlers
    const handleLikeClick = (videoId: string) => {
        const isLiked = likedVideos[videoId];
        setLikedVideos((prev) => ({ ...prev, [videoId]: !isLiked }));
        setVideoLikes((prev) => ({
            ...prev,
            [videoId]: isLiked ? (prev[videoId] || 0) - 1 : (prev[videoId] || 0) + 1,
        }));
    };

    const handleBookmarkClick = (videoId: string) => {
        setBookmarkedVideos((prev) => ({ ...prev, [videoId]: !bookmarkedVideos[videoId] }));
    };

    const handleShareClick = (videoId: string) => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(`${window.location.origin}/learn/videos?v=${videoId}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText.trim() || !openCommentsId) return;

        const newComment = {
            id: `c_user_${Date.now()}`,
            user: "You (Pro Trader)",
            text: newCommentText,
            time: "Just now",
        };

        setCommentsStore((prev) => ({
            ...prev,
            [openCommentsId]: [newComment, ...(prev[openCommentsId] || [])],
        }));

        setNewCommentText("");
    };

    // Double click to Like + Spawn Floating Heart effect
    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>, videoId: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newHeart = { id: Date.now() + Math.random(), x, y };
        setActiveHearts((prev) => ({
            ...prev,
            [videoId]: [...(prev[videoId] || []), newHeart],
        }));

        setTimeout(() => {
            setActiveHearts((prev) => ({
                ...prev,
                [videoId]: (prev[videoId] || []).filter((h) => h.id !== newHeart.id),
            }));
        }, 800);

        if (!likedVideos[videoId]) {
            setLikedVideos((prev) => ({ ...prev, [videoId]: true }));
            setVideoLikes((prev) => ({ ...prev, [videoId]: (prev[videoId] || 0) + 1 }));
        }
    };

    const scrollToVideo = (idx: number) => {
        const cards = containerRef.current?.querySelectorAll("[data-video-card]");
        if (cards && cards[idx]) {
            cards[idx].scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative" style={{ height: "calc(100vh - 40px)" }}>
            <div className="flex justify-center items-center relative w-full" style={{ height: "100%" }}>
                
                {/* Snapping Scroll Area (occupies full container width & height) */}
                <div className="w-full rounded-[var(--radius)] border-2 border-[var(--ink)] shadow-[var(--card-shadow)] overflow-hidden relative bg-[var(--paper)] flex flex-col" style={{ height: "100%" }}>
                    <div
                        ref={containerRef}
                        className="flex-1 w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {tradingVideos.map((video, idx) => {
                            const isActive = activeVideoId === video.id;
                            const activeIndex = tradingVideos.findIndex((v) => v.id === activeVideoId);
                            
                            // Sliding Window: Render full UI ONLY for active slide, previous slide, and next slide
                            const isWithinWindow = Math.abs(idx - activeIndex) <= 1;

                            if (!isWithinWindow) {
                                // Ultra-lightweight placeholder div keeping the snapping track height perfectly intact
                                return (
                                    <div
                                        key={video.id}
                                        data-video-card
                                        data-video-id={video.id}
                                        className="w-full h-full snap-start snap-always relative bg-[var(--sunken)] flex flex-col items-center justify-center"
                                    >
                                        <div className="flex flex-col items-center gap-3 text-[var(--muted)]">
                                            <div className="w-8 h-8 rounded-full border-2 border-dashed border-[var(--line)] animate-spin" />
                                            <div className="w-16 h-2 bg-[var(--line)] rounded" />
                                        </div>
                                    </div>
                                );
                            }

                                return (
                                    <div
                                        key={video.id}
                                        data-video-card
                                        data-video-id={video.id}
                                        className="w-full h-full snap-start snap-always relative overflow-hidden flex flex-col justify-end bg-[var(--sunken)]"
                                        onDoubleClick={(e) => handleDoubleClick(e, video.id)}
                                    >
                                        {/* Auto-playing YouTube Iframe */}
                                        <div className="absolute inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden bg-[var(--sunken)]">
                                            {isActive && (
                                                <>
                                                    {/* If paused, show the high-quality still thumbnail to hide YouTube's native pause overlay */}
                                                    {playingStates[video.id] === false && (
                                                        <img
                                                            src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                                                            alt={video.title}
                                                            className="absolute inset-0 w-full h-full object-cover z-5 opacity-60 animate-fade-in"
                                                        />
                                                    )}
                                                    <iframe
                                                        id={`youtube-iframe-${video.id}`}
                                                        width="100%"
                                                        height="100%"
                                                        src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1`}
                                                        title={video.title}
                                                        frameBorder="0"
                                                        className={`w-full h-full object-cover pointer-events-none scale-[1.3] origin-center transition-opacity duration-300 ${
                                                            playingStates[video.id] !== false ? "opacity-100" : "opacity-0 pointer-events-none"
                                                        }`}
                                                    ></iframe>
                                                </>
                                            )}
                                            {/* Custom Play Button Overlay Widget */}
                                            {playingStates[video.id] === false && (
                                                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                    <div className="w-16 h-16 bg-[var(--raised)] border-2 border-[var(--ink)] rounded-full flex items-center justify-center shadow-[var(--card-shadow)] transition-transform duration-300 scale-100">
                                                        <Play className="text-[var(--ink)] fill-[var(--ink)] ml-1.5" size={24} />
                                                    </div>
                                                </div>
                                            )}
                                            {/* Shield layer that absorbs clicks and touches, preventing native pause/control overlays, now handles togglePlay */}
                                            <div 
                                                onClick={() => togglePlay(video.id)}
                                                className="absolute inset-0 w-full h-full z-10 pointer-events-auto bg-transparent cursor-pointer" 
                                            />
                                        </div>

                                        {/* Gradient Dark Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--paper)_88%,transparent)] via-transparent to-[color-mix(in_srgb,var(--paper)_35%,transparent)] pointer-events-none z-10" />

                                        {/* Sidebar Actions Panel */}
                                        <div className="absolute right-6 bottom-8 flex flex-col items-center gap-5 z-20 pointer-events-auto">
                                            {/* Creator Avatar */}
                                            <div className="relative mb-1">
                                                <div className="w-11 h-11 rounded-full border-2 border-[var(--ink)] bg-[var(--raised)] flex items-center justify-center font-bold text-xs text-[var(--chalk)] shadow-[2px_2px_0_var(--ink)]">
                                                    PA
                                                </div>
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[var(--chalk)] text-[var(--on-chalk)] rounded-full w-4.5 h-4.5 flex items-center justify-center font-extrabold text-[10px] border border-[var(--ink)]">
                                                    +
                                                </div>
                                            </div>

                                            {/* Like Button */}
                                            <button
                                                onClick={() => handleLikeClick(video.id)}
                                                className="flex flex-col items-center group"
                                            >
                                                <div className={`p-3 rounded-full border-2 border-[var(--ink)] transition-all duration-300 shadow-[2px_2px_0_var(--ink)] ${
                                                    likedVideos[video.id]
                                                        ? "bg-[color-mix(in_srgb,var(--pencil)_18%,var(--raised))] text-[var(--pencil)] scale-110"
                                                        : "bg-[var(--raised)] text-[var(--ink)] hover:bg-[var(--highlighter)]"
                                                }`}>
                                                    <Heart size={20} fill={likedVideos[video.id] ? "currentColor" : "none"} />
                                                </div>
                                                <span className="text-xs font-bold text-[var(--ink)] mt-1 drop-shadow-[0_1px_0_var(--raised)]">
                                                    {videoLikes[video.id] || 0}
                                                </span>
                                            </button>

                                            {/* Comments Button */}
                                            <button
                                                onClick={() => setOpenCommentsId(video.id)}
                                                className="flex flex-col items-center group"
                                            >
                                                <div className="p-3 bg-[var(--raised)] hover:bg-[var(--highlighter)] text-[var(--ink)] rounded-full transition-all border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]">
                                                    <MessageCircle size={20} />
                                                </div>
                                                <span className="text-xs font-bold text-[var(--ink)] mt-1 drop-shadow-[0_1px_0_var(--raised)]">
                                                    {commentsStore[video.id]?.length || 0}
                                                </span>
                                            </button>


                                            {/* Share Button */}
                                            <button
                                                onClick={() => handleShareClick(video.id)}
                                                className="flex flex-col items-center group"
                                            >
                                                <div className="p-3 bg-[var(--raised)] hover:bg-[var(--highlighter)] text-[var(--ink)] rounded-full transition-all border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]">
                                                    <Share2 size={20} />
                                                </div>
                                                <span className="text-xs font-bold text-[var(--ink)] mt-1 drop-shadow-[0_1px_0_var(--raised)]">Share</span>
                                            </button>

                                            {/* Mute/Unmute Button */}
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

                                            {/* Vinyl disc spin animation */}
                                            <div className="w-10 h-10 rounded-full border-2 border-[var(--ink)] bg-[var(--raised)] flex items-center justify-center animate-spin mt-1.5 shadow-[2px_2px_0_var(--ink)]" style={{ animationDuration: "5s" }}>
                                                <div className="w-6 h-6 rounded-full bg-[color-mix(in_srgb,var(--chalk)_18%,var(--raised))] border border-[var(--chalk)] flex items-center justify-center font-bold text-[8px] text-[var(--chalk)]">
                                                    P
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Details Panel */}
                                        <div className="absolute left-8 right-28 bottom-8 z-20 text-left pointer-events-auto max-w-2xl">

                                            <h4 className="font-display font-bold text-[var(--ink)] text-lg md:text-xl leading-snug mb-1.5">
                                                {video.title}
                                            </h4>
                                            <p className="font-reading text-[var(--muted)] text-xs md:text-sm leading-relaxed mb-3">
                                                {video.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-[var(--muted)] text-[10px] md:text-xs font-semibold bg-[var(--raised)] border-2 border-[var(--ink)] px-3 py-1.5 rounded-xl w-fit shadow-[2px_2px_0_var(--ink)]">
                                                <Music size={12} className="text-[var(--chalk)]" />
                                                <span>Original Sound - Pipsology Academy</span>
                                            </div>
                                        </div>

                                        {/* Double Tap Heart Overlays */}
                                        {activeHearts[video.id]?.map((heart) => (
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
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20">
                            {tradingVideos.map((video, idx) => {
                                const isActive = activeVideoId === video.id;
                                return (
                                    <button
                                        key={video.id}
                                        onClick={() => scrollToVideo(idx)}
                                        className={`w-2 rounded-full transition-all duration-300 ${
                                            isActive ? "h-6 bg-[var(--highlighter)] border border-[var(--ink)]" : "h-2 bg-[var(--raised)] border border-[var(--ink)] hover:bg-[var(--chalk)]"
                                        }`}
                                    />
                                );
                            })}
                        </div>

                        {/* Swipe Indicator (Helpful UX) */}
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-[var(--muted)] text-[10px] flex flex-col items-center gap-1.5 kicker animate-pulse">
                            <span>Scroll down for next video</span>
                            <ChevronDown size={14} className="animate-bounce" />
                        </div>

                        {/* Link Share Toast */}
                        {showToast && (
                            <div className="absolute top-16 left-1/2 -translate-x-1/2 snackbar snackbar-ok text-xs font-extrabold z-50 flex items-center gap-1">
                                Link copied to clipboard!
                            </div>
                        )}

                        {/* Comments Slide Drawer */}
                        <AnimatePresence>
                            {openCommentsId && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        className="absolute inset-0 bg-[color-mix(in_srgb,var(--ink)_40%,transparent)] z-30 pointer-events-auto"
                                        onClick={() => setOpenCommentsId(null)}
                                    />
                                    {/* Drawer Panel */}
                                    <motion.div
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        exit={{ y: "100%" }}
                                        transition={{ type: "spring", damping: 25, stiffness: 220 }}
                                        className="absolute bottom-0 left-0 right-0 h-[65%] bg-[var(--raised)] border-t-2 border-[var(--ink)] rounded-t-[var(--radius)] z-40 flex flex-col overflow-hidden pointer-events-auto shadow-[var(--card-shadow)]"
                                    >
                                        <div className="px-6 py-4 border-b-2 border-[var(--line)] flex items-center justify-between">
                                            <span className="font-bold text-[var(--ink)] text-sm font-display">
                                                Comments ({commentsStore[openCommentsId]?.length || 0})
                                            </span>
                                            <button
                                                onClick={() => setOpenCommentsId(null)}
                                                className="p-1 bg-[var(--sunken)] hover:bg-[var(--highlighter)] rounded-full text-[var(--ink)] border border-[var(--ink)]"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>

                                        {/* Comments list */}
                                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
                                            {commentsStore[openCommentsId]?.map((c) => (
                                                <div key={c.id} className="flex gap-3 text-left">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--sunken)] border border-[var(--ink)] flex items-center justify-center font-bold text-xs text-[var(--ink)] shrink-0">
                                                        {c.user.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 bg-[var(--paper)] border-2 border-[var(--ink)] rounded-[var(--radius-sm)] p-3">
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
                                            ))}
                                        </div>

                                        {/* Comments Submit Box */}
                                        <form
                                            onSubmit={handleCommentSubmit}
                                            className="p-3 border-t-2 border-[var(--line)] bg-[var(--paper)] flex items-center gap-2"
                                        >
                                            <input
                                                type="text"
                                                value={newCommentText}
                                                onChange={(e) => setNewCommentText(e.target.value)}
                                                placeholder="Add an expert comment..."
                                                className="flex-1 bg-[var(--raised)] hover:bg-[var(--highlighter)] focus:bg-[var(--raised)] text-[var(--ink)] rounded-lg px-3 py-2 text-xs md:text-sm border-2 border-[var(--ink)] outline-none focus:border-[var(--chalk)] transition-all font-medium"
                                            />
                                            <button
                                                type="submit"
                                                className="p-2 bg-[var(--highlighter)] hover:brightness-95 text-[var(--ink)] rounded-lg transition-all border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]"
                                            >
                                                <Send size={14} />
                                            </button>
                                        </form>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
