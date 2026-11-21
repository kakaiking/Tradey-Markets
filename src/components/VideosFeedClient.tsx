"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Volume2, VolumeX, Loader2 } from "lucide-react";
import { tradingVideos } from "@/lib/data";
import { BackButton } from "@/components/layout/BackButton";
import {
    VideoLessonSheet,
    type DescriptionLevel,
} from "@/components/VideoLessonSheet";
import type { VideoLessonContentMap } from "@/lib/videoLessonContent";

type VideosFeedClientProps = {
    lessonContentBySlug: VideoLessonContentMap;
};

export function VideosFeedClient({
    lessonContentBySlug,
}: VideosFeedClientProps) {
    const [activeVideoId, setActiveVideoId] = useState<string>(
        tradingVideos[0]?.id ?? ""
    );
    const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});
    const [showToast, setShowToast] = useState(false);
    const [activeHearts, setActiveHearts] = useState<
        Record<string, { id: number; x: number; y: number }[]>
    >({});
    const [isMuted, setIsMuted] = useState(false);
    const [playingStates, setPlayingStates] = useState<Record<string, boolean>>(
        {}
    );
    const [readyVideos, setReadyVideos] = useState<Record<string, boolean>>({});
    const [failedVideos, setFailedVideos] = useState<Record<string, boolean>>(
        {}
    );
    const [embedAttempt, setEmbedAttempt] = useState<Record<string, number>>(
        {}
    );
    /** Prefer privacy host first; flip to youtube.com after a soft fail. */
    const [embedHost, setEmbedHost] = useState<
        Record<string, "https://www.youtube-nocookie.com" | "https://www.youtube.com">
    >({});
    const [descriptionLevel, setDescriptionLevel] =
        useState<DescriptionLevel>(0);
    const [descriptionVideoId, setDescriptionVideoId] = useState<string | null>(
        null
    );

    const [commentsStore, setCommentsStore] = useState<
        Record<
            string,
            { id: string; user: string; text: string; time: string }[]
        >
    >({
        "v-what-is-forex-trading": [
            {
                id: "c1",
                user: "Alpha_Trader",
                text: "This finally made forex make sense to me! Thank you!",
                time: "2h ago",
            },
            {
                id: "c2",
                user: "ForexQueen",
                text: "Best basic explanation ever.",
                time: "4h ago",
            },
            {
                id: "c3",
                user: "RiskManager",
                text: "Clear on what the market actually is before jumping into charts.",
                time: "6h ago",
            },
        ],
        "v-what-is-a-pip": [
            {
                id: "c4",
                user: "CandleStickGuru",
                text: "Pips finally clicked after this.",
                time: "1h ago",
            },
            {
                id: "c5",
                user: "ScalpKing",
                text: "Yen pairs vs majors — that tip saved me.",
                time: "3h ago",
            },
        ],
        "v-how-a-forex-trade-works": [
            {
                id: "c6",
                user: "CapitalShield",
                text: "Direction plus lot size — simple and true.",
                time: "30m ago",
            },
            {
                id: "c7",
                user: "PipsMaster",
                text: "Wish I had this before my first live ticket.",
                time: "2h ago",
            },
        ],
        "v-types-of-forex-orders": [
            {
                id: "c8",
                user: "MindsetFirst",
                text: "Limit vs stop finally makes sense.",
                time: "10m ago",
            },
            {
                id: "c9",
                user: "FomoFighter",
                text: "Using stops properly changed my week.",
                time: "1h ago",
            },
        ],
        "v-forex-demo-account": [
            {
                id: "c10",
                user: "RevengeNoMore",
                text: "Demo first. No shortcuts.",
                time: "5m ago",
            },
            {
                id: "c11",
                user: "SafetyFirst",
                text: "Treat demo like real money or the lessons won’t stick.",
                time: "2h ago",
            },
        ],
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const sheetOpenRef = useRef(false);
    const isMutedRef = useRef(false);
    const playerRef = useRef<{
        playVideo: () => void;
        pauseVideo: () => void;
        mute: () => void;
        unMute: () => void;
        setVolume: (volume: number) => void;
        destroy: () => void;
    } | null>(null);

    useEffect(() => {
        isMutedRef.current = isMuted;
    }, [isMuted]);

    const sheetOpen = descriptionLevel > 0 && descriptionVideoId !== null;
    sheetOpenRef.current = sheetOpen;
    const activeDescriptionVideo = tradingVideos.find(
        (v) => v.id === descriptionVideoId
    );
    const lessonBundle = activeDescriptionVideo?.lessonSlug
        ? lessonContentBySlug[activeDescriptionVideo.lessonSlug]
        : undefined;

    useEffect(() => {
        if (!activeVideoId) return;
        setPlayingStates((prev) => ({ ...prev, [activeVideoId]: true }));
        // Shrinking the player for the split view can re-fire intersection and
        // change the active id — never wipe an open lesson sheet because of that.
        if (sheetOpenRef.current) return;
        setDescriptionLevel(0);
        setDescriptionVideoId(null);
    }, [activeVideoId]);

    // Level 3 covers the video: pause without destroying the player.
    // Level 2 (and close) keep / resume playback in the top band.
    useEffect(() => {
        if (!playerRef.current || !readyVideos[activeVideoId]) return;
        try {
            if (descriptionLevel === 2) {
                playerRef.current.pauseVideo();
                setPlayingStates((prev) => ({
                    ...prev,
                    [activeVideoId]: false,
                }));
            } else {
                playerRef.current.playVideo();
                setPlayingStates((prev) => ({
                    ...prev,
                    [activeVideoId]: true,
                }));
            }
        } catch {
            /* player may be mid-teardown */
        }
    }, [descriptionLevel, activeVideoId, readyVideos]);

    const openLessonSheet = (videoId: string) => {
        // Set synchronously so IntersectionObserver ignores the pane resize.
        sheetOpenRef.current = true;
        setDescriptionVideoId(videoId);
        setDescriptionLevel(1);
    };

    const handleLevelChange = (level: DescriptionLevel) => {
        sheetOpenRef.current = level > 0;
        setDescriptionLevel(level);
        if (level === 0) {
            setDescriptionVideoId(null);
        }
    };

    const togglePlay = (id: string) => {
        if (!readyVideos[id] || !playerRef.current) return;
        // Level 3 covers the player; level 2 still allows tap-to-pause in the top band.
        if (descriptionLevel === 2) return;

        const currentlyPlaying = playingStates[id] !== false;
        const nextPlaying = !currentlyPlaying;

        setPlayingStates((prev) => ({ ...prev, [id]: nextPlaying }));
        if (nextPlaying) playerRef.current.playVideo();
        else playerRef.current.pauseVideo();
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (sheetOpenRef.current) return;
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
                threshold: 0.6,
            }
        );

        const cards = containerRef.current?.querySelectorAll("[data-video-card]");
        cards?.forEach((card) => observer.observe(card));

        return () => {
            cards?.forEach((card) => observer.unobserve(card));
        };
    }, []);

    /** Soft-fail: switch host once before showing the desk-note error. */
    const softFailEmbed = (id: string) => {
        const usingFallback =
            embedHost[id] === "https://www.youtube.com" ||
            (embedAttempt[id] || 0) >= 1;
        if (!usingFallback) {
            setEmbedHost((prev) => ({
                ...prev,
                [id]: "https://www.youtube.com",
            }));
            setReadyVideos((prev) => ({ ...prev, [id]: false }));
            setEmbedAttempt((prev) => ({
                ...prev,
                [id]: (prev[id] || 0) + 1,
            }));
            return;
        }
        setReadyVideos((prev) => ({ ...prev, [id]: false }));
        setFailedVideos((prev) => ({ ...prev, [id]: true }));
    };

    // Preload the IFrame API as soon as the feed mounts so the first clip
    // does not spend its whole budget waiting on the script tag.
    useEffect(() => {
        const win = window as unknown as {
            YT?: { Player?: unknown };
            onYouTubeIframeAPIReady?: () => void;
        };
        if (win.YT?.Player || document.getElementById("yt-iframe-api")) return;

        const script = document.createElement("script");
        script.id = "yt-iframe-api";
        script.async = true;
        script.src = "https://www.youtube.com/iframe_api";
        script.onerror = () => {
            // Leave a flag so mount logic can surface a real failure.
            (
                window as unknown as { __ytApiLoadFailed?: boolean }
            ).__ytApiLoadFailed = true;
        };
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (!activeVideoId || failedVideos[activeVideoId]) return;

        const video = tradingVideos.find((item) => item.id === activeVideoId);
        if (!video) return;

        const slotId = `yt-slot-${activeVideoId}`;
        const host =
            embedHost[activeVideoId] ?? "https://www.youtube-nocookie.com";
        let cancelled = false;
        let player: { destroy: () => void } | null = null;
        // VPN / cold DNS routinely take >4s; give the API + first frame room.
        const LOAD_BUDGET_MS = 16000;
        const timeout = window.setTimeout(() => {
            if (!cancelled) softFailEmbed(activeVideoId);
        }, LOAD_BUDGET_MS);

        const markReady = (
            target: NonNullable<typeof playerRef.current>
        ) => {
            if (cancelled) return;
            window.clearTimeout(timeout);
            playerRef.current = target;
            setReadyVideos((prev) => ({
                ...prev,
                [activeVideoId]: true,
            }));
        };

        const mount = () => {
            if (
                (
                    window as unknown as { __ytApiLoadFailed?: boolean }
                ).__ytApiLoadFailed
            ) {
                if (!cancelled) softFailEmbed(activeVideoId);
                return;
            }
            const YT = (
                window as unknown as {
                    YT?: {
                        Player: new (
                            id: string,
                            options: object
                        ) => { destroy: () => void };
                    };
                }
            ).YT;
            if (cancelled || !YT?.Player || !document.getElementById(slotId))
                return;
            player = new YT.Player(slotId, {
                videoId: video.videoId,
                host,
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
                    onReady: (event: {
                        target: NonNullable<typeof playerRef.current>;
                    }) => {
                        if (cancelled) return;
                        // Start muted so autoplay is allowed, then unmute
                        // immediately when the user wants sound on open.
                        event.target.mute();
                        event.target.playVideo();
                        if (!isMutedRef.current) {
                            event.target.unMute();
                            event.target.setVolume(100);
                        }
                        markReady(event.target);
                    },
                    onStateChange: (event: {
                        data: number;
                        target: NonNullable<typeof playerRef.current>;
                    }) => {
                        if (cancelled) return;
                        // 1 = playing, 3 = buffering — both mean the embed works.
                        if (event.data === 1 || event.data === 3) {
                            markReady(event.target);
                        }
                    },
                    onError: () => {
                        if (cancelled) return;
                        window.clearTimeout(timeout);
                        softFailEmbed(activeVideoId);
                    },
                },
            });
        };

        const win = window as unknown as {
            YT?: { Player?: unknown };
            onYouTubeIframeAPIReady?: () => void;
        };
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
                script.async = true;
                script.src = "https://www.youtube.com/iframe_api";
                script.onerror = () => {
                    (
                        window as unknown as { __ytApiLoadFailed?: boolean }
                    ).__ytApiLoadFailed = true;
                    if (!cancelled) softFailEmbed(activeVideoId);
                };
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
        // softFailEmbed closes over embedHost/embedAttempt intentionally.
        // Do NOT depend on descriptionLevel — sheet open/close must not remount the player.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeVideoId, failedVideos, embedAttempt, embedHost]);

    const retryEmbed = (id: string) => {
        const win = window as unknown as {
            __ytApiLoadFailed?: boolean;
            YT?: unknown;
            onYouTubeIframeAPIReady?: () => void;
        };
        win.__ytApiLoadFailed = false;
        // Drop a dead script tag so the next mount can fetch iframe_api again.
        if (!win.YT) {
            document.getElementById("yt-iframe-api")?.remove();
            win.onYouTubeIframeAPIReady = undefined;
        }
        setFailedVideos((prev) => ({ ...prev, [id]: false }));
        setReadyVideos((prev) => ({ ...prev, [id]: false }));
        setPlayingStates((prev) => ({ ...prev, [id]: true }));
        setEmbedHost((prev) => ({
            ...prev,
            [id]: "https://www.youtube.com",
        }));
        setEmbedAttempt((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }));
    };

    useEffect(() => {
        if (!activeVideoId || !readyVideos[activeVideoId] || !playerRef.current)
            return;
        if (isMuted) playerRef.current.mute();
        else {
            playerRef.current.unMute();
            playerRef.current.setVolume(100);
        }
    }, [isMuted, activeVideoId, readyVideos]);

    const handleShareClick = (videoId: string) => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(
                `${window.location.origin}/learn/videos?v=${videoId}`
            );
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    const handleAddComment = (text: string) => {
        if (!descriptionVideoId || !text.trim()) return;

        const newComment = {
            id: `c_user_${Date.now()}`,
            user: "You (Pro Trader)",
            text: text.trim(),
            time: "Just now",
        };

        setCommentsStore((prev) => ({
            ...prev,
            [descriptionVideoId]: [
                newComment,
                ...(prev[descriptionVideoId] || []),
            ],
        }));
    };

    const handleDoubleClick = (
        e: React.MouseEvent<HTMLDivElement>,
        videoId: string
    ) => {
        if (descriptionLevel === 2) return;
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
                [videoId]: (prev[videoId] || []).filter(
                    (h) => h.id !== newHeart.id
                ),
            }));
        }, 800);

        if (!likedVideos[videoId]) {
            setLikedVideos((prev) => ({ ...prev, [videoId]: true }));
        }
    };

    // Level 2 must shrink the player into the visible top band — a full-bleed
    // iframe under a 70% sheet only shows YouTube chrome (audio still plays).
    const videoPaneClass =
        descriptionLevel === 2
            ? "absolute inset-x-0 top-0 h-0 overflow-hidden opacity-0 pointer-events-none"
            : descriptionLevel === 1
              ? "absolute inset-x-0 top-0 z-20 h-[30%] min-h-[30%] overflow-hidden"
              : "relative w-full flex-1 min-h-0";

    return (
        <div className="relative h-full w-full flex flex-col bg-black overflow-hidden">
            <BackButton
                fallbackHref="/"
                className="history-back--on-media absolute top-[max(0.75rem,env(safe-area-inset-top))] left-2 z-30"
            />

            <div className={videoPaneClass}>
                <div
                    ref={containerRef}
                    className={`w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none ${
                        sheetOpen ? "overflow-hidden" : ""
                    }`}
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {tradingVideos.map((video, idx) => {
                        const isActive = activeVideoId === video.id;
                        const activeIndex = tradingVideos.findIndex(
                            (v) => v.id === activeVideoId
                        );
                        const isWithinWindow =
                            Math.abs(idx - activeIndex) <= 1;

                        if (!isWithinWindow) {
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
                                onDoubleClick={(e) =>
                                    handleDoubleClick(e, video.id)
                                }
                            >
                                <div className="absolute inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden bg-black">
                                    {isActive && !failedVideos[video.id] && (
                                        <div
                                            key={`${video.id}-${embedAttempt[video.id] || 0}`}
                                            className="absolute inset-0 overflow-hidden bg-black"
                                        >
                                            {/*
                                              Split view is a short wide band. Size the
                                              player to 16:9 of the full width and center
                                              it so the picture cover-crops (no side bars).
                                            */}
                                            <div
                                                className={`absolute left-0 w-full [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0 ${
                                                    descriptionLevel === 1
                                                        ? "top-1/2 h-[56.25vw] min-h-full -translate-y-1/2"
                                                        : "inset-0"
                                                }`}
                                            >
                                                <div
                                                    id={`yt-slot-${video.id}`}
                                                    className="h-full w-full"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {isActive &&
                                        !failedVideos[video.id] &&
                                        !readyVideos[video.id] && (
                                            <div className="absolute inset-0 z-[15] flex items-center justify-center bg-black pointer-events-none">
                                                <Loader2
                                                    className="h-10 w-10 animate-spin text-white"
                                                    strokeWidth={2.25}
                                                />
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
                                                    YouTube isn’t reachable from
                                                    this connection. The lesson
                                                    is still here when the
                                                    network is.
                                                </p>
                                                <div className="mt-3 flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            retryEmbed(video.id)
                                                        }
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
                                    {playingStates[video.id] === false &&
                                        descriptionLevel !== 2 && (
                                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 pointer-events-none">
                                                <div className="w-16 h-16 bg-[var(--raised)] border border-[var(--line)] rounded-full flex items-center justify-center shadow-[var(--card-shadow)] transition-transform duration-300 scale-100">
                                                    <Play
                                                        className="text-[var(--ink)] fill-[var(--ink)] ml-1.5"
                                                        size={24}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        setIsMuted(
                                                            (prev) => !prev
                                                        );
                                                    }}
                                                    className="pointer-events-auto flex flex-col items-center"
                                                >
                                                    <div className="p-3 rounded-full bg-black/40 text-white backdrop-blur-sm">
                                                        {!isMuted ? (
                                                            <Volume2
                                                                size={20}
                                                            />
                                                        ) : (
                                                            <VolumeX
                                                                size={20}
                                                            />
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-bold text-white mt-1 select-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                                                        {!isMuted
                                                            ? "Sound On"
                                                            : "Mute"}
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                    <div
                                        onClick={() => togglePlay(video.id)}
                                        className={`absolute inset-0 z-10 bg-transparent cursor-pointer ${
                                            descriptionLevel === 2
                                                ? "pointer-events-none"
                                                : "pointer-events-auto"
                                        }`}
                                    />
                                </div>

                                {!sheetOpen && (
                                    <>
                                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 via-black/15 to-transparent pointer-events-none z-10" />

                                        <div className="absolute left-4 right-4 bottom-[4.75rem] z-20 text-left pointer-events-auto max-w-2xl">
                                            <h4 className="font-display font-bold text-white text-[15px] leading-snug mb-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.75)]">
                                                {video.title}
                                            </h4>
                                            {video.description ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openLessonSheet(
                                                            video.id
                                                        )
                                                    }
                                                    className="flex w-full items-baseline gap-1.5 text-left mb-2.5 font-reading text-white text-[13px] leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.75)]"
                                                    aria-label="Open lesson"
                                                >
                                                    <span className="min-w-0 truncate">
                                                        {video.description}
                                                    </span>
                                                    <span className="shrink-0 text-white/65 font-semibold">
                                                        Read more
                                                    </span>
                                                </button>
                                            ) : null}
                                        </div>
                                    </>
                                )}

                                {activeHearts[video.id]?.map((heart) => (
                                    <motion.div
                                        key={heart.id}
                                        initial={{
                                            scale: 0,
                                            opacity: 1,
                                            y: 0,
                                            rotate: Math.random() * 40 - 20,
                                        }}
                                        animate={{
                                            scale: [1, 1.7, 1],
                                            opacity: [1, 1, 0],
                                            y: -90,
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            ease: "easeOut",
                                        }}
                                        className="absolute z-30 pointer-events-none text-[var(--pencil)] text-6xl"
                                        style={{
                                            left: heart.x - 30,
                                            top: heart.y - 30,
                                        }}
                                    >
                                        ❤️
                                    </motion.div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence mode="sync">
                {sheetOpen && activeDescriptionVideo ? (
                    <VideoLessonSheet
                        key={activeDescriptionVideo.id}
                        level={descriptionLevel}
                        onLevelChange={handleLevelChange}
                        title={activeDescriptionVideo.title}
                        description={activeDescriptionVideo.description}
                        paragraphs={lessonBundle?.paragraphs ?? []}
                        sections={lessonBundle?.sections ?? []}
                        cards={lessonBundle?.cards ?? []}
                        lessonTitle={lessonBundle?.title}
                        comments={
                            commentsStore[activeDescriptionVideo.id] || []
                        }
                        onShare={() =>
                            handleShareClick(activeDescriptionVideo.id)
                        }
                        onAddComment={handleAddComment}
                    />
                ) : null}
            </AnimatePresence>

            {showToast && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 snackbar snackbar-ok text-xs font-extrabold z-50 flex items-center gap-1">
                    Link copied to clipboard!
                </div>
            )}
        </div>
    );
}
