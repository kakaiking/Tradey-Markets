"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Play, Heart, MessageCircle, Share2, 
    X, Send, Volume2, VolumeX, Loader2
} from "lucide-react";
import { tradingVideos } from "@/lib/data";
import { BackButton } from "@/components/layout/BackButton";

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
    const [failedVideos, setFailedVideos] = useState<Record<string, boolean>>({});
    const [embedAttempt, setEmbedAttempt] = useState<Record<string, number>>({});
    const [openDescriptionId, setOpenDescriptionId] = useState<string | null>(null);
    
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
    const playerRef = useRef<{
        playVideo: () => void;
        pauseVideo: () => void;
        mute: () => void;
        unMute: () => void;
        setVolume: (volume: number) => void;
        destroy: () => void;
    } | null>(null);

    // Reset playing state to true when active video changes to hide play overlay on snap
    useEffect(() => {
        if (activeVideoId) {
            setPlayingStates((prev) => ({ ...prev, [activeVideoId]: true }));
            setOpenDescriptionId(null);
            setOpenCommentsId(null);
        }
    }, [activeVideoId]);

    const togglePlay = (id: string) => {
        if (!readyVideos[id] || !playerRef.current) return;

        const currentlyPlaying = playingStates[id] !== false; // defaults to true
        const nextPlaying = !currentlyPlaying;

        setPlayingStates((prev) => ({ ...prev, [id]: nextPlaying }));
        if (nextPlaying) playerRef.current.playVideo();
        else playerRef.current.pauseVideo();
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

    // Official player API. A raw iframe never sends onReady unless we complete
    // YouTube's handshake, so the old timer treated a live connection as a failure
    // and aborted the embed mid-load.
    useEffect(() => {
        if (!activeVideoId || failedVideos[activeVideoId]) return;
        const video = tradingVideos.find((item) => item.id === activeVideoId);
        if (!video) return;

        const slotId = `yt-slot-${activeVideoId}`;
        let cancelled = false;
        let player: { destroy: () => void } | null = null;
        const timeout = window.setTimeout(() => {
            if (!cancelled) setFailedVideos((prev) => (prev[activeVideoId] ? prev : { ...prev, [activeVideoId]: true }));
        }, 4000);

        const mount = () => {
            const YT = (window as unknown as { YT?: { Player: new (id: string, options: object) => { destroy: () => void } } }).YT;
            if (cancelled || !YT?.Player || !document.getElementById(slotId)) return;
            player = new YT.Player(slotId, {
                videoId: video.videoId,
                host: "https://www.youtube-nocookie.com",
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    playsinline: 1,
                    iv_load_policy: 3,
                    disablekb: 1,
                    origin: window.location.origin,
                },
                events: {
                    onReady: (event: { target: NonNullable<typeof playerRef.current> }) => {
                        if (cancelled) return;
                        window.clearTimeout(timeout);
                        playerRef.current = event.target;
                        event.target.mute();
                        event.target.playVideo();
                        setReadyVideos((prev) => ({ ...prev, [activeVideoId]: true }));
                    },
                    onStateChange: (event: { data: number; target: NonNullable<typeof playerRef.current> }) => {
                        if (cancelled) return;
                        if (event.data === 1 || event.data === 3) {
                            window.clearTimeout(timeout);
                            playerRef.current = event.target;
                            setReadyVideos((prev) => ({ ...prev, [activeVideoId]: true }));
                        }
                    },
                    onError: () => {
                        if (cancelled) return;
                        window.clearTimeout(timeout);
                        setReadyVideos((prev) => ({ ...prev, [activeVideoId]: false }));
                        setFailedVideos((prev) => ({ ...prev, [activeVideoId]: true }));
                    },
                },
            });
        };

        const win = window as unknown as { YT?: { Player?: unknown }; onYouTubeIframeAPIReady?: () => void };
        if (win.YT?.Player) {
            mount();
        } else {
            const previous = win.onYouTubeIframeAPIReady;
            win.onYouTubeIframeAPIReady = () => {
                previous?.();
                mount();
            };
            if (!document.getElementById("yt-iframe-api")) {
                const script = document.createElement("script");
                script.id = "yt-iframe-api";
                script.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(script);
            }
        }

        return () => {
            cancelled = true;
            window.clearTimeout(timeout);
            playerRef.current = null;
            try {
                player?.destroy();
            } catch {
                // Player may already be gone with the slide.
            }
        };
    }, [activeVideoId, failedVideos, embedAttempt]);

    const retryEmbed = (id: string) => {
        setFailedVideos((prev) => ({ ...prev, [id]: false }));
        setReadyVideos((prev) => ({ ...prev, [id]: false }));
        setPlayingStates((prev) => ({ ...prev, [id]: true }));
        setEmbedAttempt((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    useEffect(() => {
        if (!activeVideoId || !readyVideos[activeVideoId] || !playerRef.current) return;
        if (isMuted) playerRef.current.mute();
        else {
            playerRef.current.unMute();
            playerRef.current.setVolume(100);
        }
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

    return (
        <div className="relative h-full w-full">
            <div className="flex justify-center items-center relative w-full h-full">
                <div className="w-full h-full overflow-hidden relative bg-black flex flex-col">
                    <BackButton
                        fallbackHref="/quizzes"
                        className="history-back--on-media absolute top-[max(0.75rem,env(safe-area-inset-top))] left-2 z-30"
                    />
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
                                        className="w-full h-full snap-start snap-always relative bg-black flex flex-col items-center justify-center"
                                    >
                                        <div className="flex flex-col items-center gap-3 text-white/40">
                                            <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/25 animate-spin" />
                                            <div className="w-16 h-2 bg-white/15 rounded" />
                                        </div>
                                    </div>
                                );
                            }

                                return (
                                    <div
                                        key={video.id}
                                        data-video-card
                                        data-video-id={video.id}
                                        className="w-full h-full snap-start snap-always relative overflow-hidden flex flex-col justify-end bg-black"
                                        onDoubleClick={(e) => handleDoubleClick(e, video.id)}
                                    >
                                        {/* Auto-playing YouTube Iframe */}
                                        <div className="absolute inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden bg-black">
                                            {isActive && !failedVideos[video.id] && (
                                                <div key={`${video.id}-${embedAttempt[video.id] || 0}`} className="absolute inset-0 overflow-hidden bg-black [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0">
                                                    <div id={`yt-slot-${video.id}`} className="h-full w-full" />
                                                </div>
                                            )}
                                            {isActive && !failedVideos[video.id] && !readyVideos[video.id] && (
                                                <div className="absolute inset-0 z-[15] flex items-center justify-center bg-black pointer-events-none">
                                                    <Loader2 className="h-10 w-10 animate-spin text-white" strokeWidth={2.25} />
                                                </div>
                                            )}
                                            {isActive && failedVideos[video.id] && (
                                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black px-8 pointer-events-auto">
                                                    <div className="w-full max-w-[17rem] rounded-[var(--radius)] border-2 border-[var(--ink)] bg-[var(--raised)] px-4 py-4 text-left shadow-[4px_4px_0_var(--ink)]">
                                                        <p className="font-tape text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--lesson)]">
                                                            Desk note
                                                        </p>
                                                        <h3 className="font-display mt-1 text-[15px] font-extrabold leading-tight text-[var(--ink)]">
                                                            This clip didn’t load
                                                        </h3>
                                                        <p className="mt-1.5 font-reading text-[12px] leading-snug text-[var(--muted)]">
                                                            YouTube isn’t reachable from this connection. The lesson is still here when the network is.
                                                        </p>
                                                        <div className="mt-3 flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => retryEmbed(video.id)}
                                                                className="rounded-full bg-[var(--highlighter)] px-3 py-1.5 text-[12px] font-extrabold text-[var(--on-highlighter)]"
                                                            >
                                                                Try again
                                                            </button>
                                                            <a
                                                                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="rounded-full border border-[var(--ink)] px-3 py-1.5 text-[12px] font-extrabold text-[var(--ink)]"
                                                            >
                                                                Open YouTube
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Custom Play Button Overlay Widget */}
                                            {playingStates[video.id] === false && (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20 pointer-events-none">
                                                    <div className="w-16 h-16 bg-[var(--raised)] border border-[var(--line)] rounded-full flex items-center justify-center shadow-[var(--card-shadow)] transition-transform duration-300 scale-100">
                                                        <Play className="text-[var(--ink)] fill-[var(--ink)] ml-1.5" size={24} />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            setIsMuted((prev) => !prev);
                                                        }}
                                                        className="pointer-events-auto flex flex-col items-center"
                                                    >
                                                        <div className="p-3 rounded-full bg-black/40 text-white backdrop-blur-sm">
                                                            {!isMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
                                                        </div>
                                                        <span className="text-xs font-bold text-white mt-1 select-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                                                            {!isMuted ? "Sound On" : "Mute"}
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                            {/* Shield layer that absorbs clicks and touches, preventing native pause/control overlays, now handles togglePlay */}
                                            <div 
                                                onClick={() => togglePlay(video.id)}
                                                className="absolute inset-0 w-full h-full z-10 pointer-events-auto bg-transparent cursor-pointer" 
                                            />
                                        </div>

                                        {/* Soft bottom scrim — Instagram-style, light fade for caption legibility */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 via-black/15 to-transparent pointer-events-none z-10" />

                                        {/* Sidebar Actions Panel */}
                                        <div className="absolute right-4 bottom-[4.75rem] flex flex-col items-center gap-5 z-20 pointer-events-auto">
                                            {/* Like Button */}
                                            <button
                                                onClick={() => handleLikeClick(video.id)}
                                                className="flex flex-col items-center group"
                                            >
                                                <div className={`p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
                                                    likedVideos[video.id]
                                                        ? "bg-white/20 text-red-400 scale-110"
                                                        : "bg-black/40 text-white hover:bg-black/55"
                                                }`}>
                                                    <Heart size={20} fill={likedVideos[video.id] ? "currentColor" : "none"} />
                                                </div>
                                                <span className="text-xs font-bold text-white mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                                                    {videoLikes[video.id] || 0}
                                                </span>
                                            </button>

                                            {/* Comments Button */}
                                            <button
                                                onClick={() => {
                                                    setOpenDescriptionId(null);
                                                    setOpenCommentsId(video.id);
                                                }}
                                                className="flex flex-col items-center group"
                                            >
                                                <div className="p-3 bg-black/40 hover:bg-black/55 text-white rounded-full transition-all backdrop-blur-sm">
                                                    <MessageCircle size={20} />
                                                </div>
                                                <span className="text-xs font-bold text-white mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                                                    {commentsStore[video.id]?.length || 0}
                                                </span>
                                            </button>


                                            {/* Share Button */}
                                            <button
                                                onClick={() => handleShareClick(video.id)}
                                                className="flex flex-col items-center group"
                                            >
                                                <div className="p-3 bg-black/40 hover:bg-black/55 text-white rounded-full transition-all backdrop-blur-sm">
                                                    <Share2 size={20} />
                                                </div>
                                                <span className="text-xs font-bold text-white mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">Share</span>
                                            </button>
                                        </div>

                                        {/* Bottom Details Panel — Instagram Reels caption pattern */}
                                        <div className="absolute left-4 right-24 bottom-[4.75rem] z-20 text-left pointer-events-auto max-w-2xl">
                                            <h4 className="font-display font-bold text-white text-[15px] leading-snug mb-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.75)]">
                                                {video.title}
                                            </h4>
                                            {video.description ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOpenCommentsId(null);
                                                        setOpenDescriptionId(video.id);
                                                    }}
                                                    className="flex w-full items-baseline gap-1.5 text-left mb-2.5 font-reading text-white text-[13px] leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.75)]"
                                                    aria-label="Read full description"
                                                >
                                                    <span className="min-w-0 truncate">{video.description}</span>
                                                    <span className="shrink-0 text-white/65 font-semibold">
                                                        Read more
                                                    </span>
                                                </button>
                                            ) : null}
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
                                                className="close-x"
                                                aria-label="Close comments"
                                            >
                                                <X size={16} strokeWidth={3} />
                                            </button>
                                        </div>

                                        {/* Comments list */}
                                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
                                            {commentsStore[openCommentsId]?.map((c) => (
                                                <div key={c.id} className="flex gap-3 text-left">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--sunken)] border border-[var(--ink)] flex items-center justify-center font-bold text-xs text-[var(--ink)] shrink-0">
                                                        {c.user.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 bg-[var(--paper)] border border-[var(--line)] rounded-[var(--radius-sm)] p-3">
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
                                                className="flex-1 bg-[var(--raised)] hover:bg-[var(--highlighter)] focus:bg-[var(--raised)] text-[var(--ink)] rounded-lg px-3 py-2 text-xs md:text-sm border border-[var(--line)] outline-none focus:border-[var(--chalk)] transition-all font-medium"
                                            />
                                            <button
                                                type="submit"
                                                className="p-2 bg-[var(--highlighter)] hover:brightness-95 text-[var(--ink)] rounded-lg transition-all border border-[var(--line)]"
                                            >
                                                <Send size={14} />
                                            </button>
                                        </form>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        {/* Description Slide Drawer */}
                        <AnimatePresence>
                            {openDescriptionId && (
                                <>
                                    <div
                                        className="absolute inset-0 bg-[color-mix(in_srgb,var(--ink)_40%,transparent)] z-30 pointer-events-auto"
                                        onClick={() => setOpenDescriptionId(null)}
                                    />
                                    <motion.div
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        exit={{ y: "100%" }}
                                        transition={{ type: "spring", damping: 25, stiffness: 220 }}
                                        className="absolute bottom-0 left-0 right-0 h-[65%] bg-[var(--raised)] border-t-2 border-[var(--ink)] rounded-t-[var(--radius)] z-40 flex flex-col overflow-hidden pointer-events-auto shadow-[var(--card-shadow)]"
                                    >
                                        <div className="px-6 py-4 border-b-2 border-[var(--line)] flex items-center justify-between gap-3">
                                            <span className="font-bold text-[var(--ink)] text-sm font-display min-w-0 truncate">
                                                {tradingVideos.find((v) => v.id === openDescriptionId)?.title}
                                            </span>
                                            <button
                                                onClick={() => setOpenDescriptionId(null)}
                                                className="close-x"
                                                aria-label="Close description"
                                            >
                                                <X size={16} strokeWidth={3} />
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
                                            <p className="text-[var(--ink)] text-sm leading-relaxed font-reading text-left">
                                                {tradingVideos.find((v) => v.id === openDescriptionId)?.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
