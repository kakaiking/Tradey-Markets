"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { cachedJson } from "@/lib/clientCache";

type LessonRow = {
    slug: string;
    title: string;
    gradeId: string;
};

type NextLesson = {
    index: number;
    total: number;
    title: string;
    href: string;
};

const moreTools: { href: string; title: string; mark: ReactNode }[] = [
    {
        href: "/premium",
        title: "Premium",
        mark: (
            <svg viewBox="0 0 48 48" className="explore-mark">
                <rect x="8" y="10" width="32" height="28" rx="8" fill="#f5c518" />
                <path d="M16 22l4 3 4-7 4 7 4-3v12H16V22z" fill="#fff" />
            </svg>
        ),
    },
    {
        href: "/analyze",
        title: "Analyze",
        mark: (
            <svg viewBox="0 0 48 48" className="explore-mark">
                <rect x="8" y="8" width="32" height="32" rx="8" fill="#0e6cb8" />
                <path d="M14 30l6-8 5 4 9-12" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="34" cy="14" r="2.4" fill="#14b8a6" />
            </svg>
        ),
    },
    {
        href: "/journal",
        title: "Trade journal",
        mark: (
            <svg viewBox="0 0 48 48" className="explore-mark">
                <rect x="10" y="8" width="28" height="32" rx="7" fill="#0e6cb8" />
                <rect x="10" y="28" width="28" height="12" rx="6" fill="#14b8a6" />
                <text x="24" y="22" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800" fontFamily="Arial, sans-serif">MT</text>
            </svg>
        ),
    },
    {
        href: "/charts",
        title: "Charts",
        mark: (
            <svg viewBox="0 0 48 48" className="explore-mark">
                <rect x="9" y="9" width="30" height="30" rx="7" fill="#111" />
                <path d="M17 31V21M24 31V15M31 31v-8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        href: "/calendar",
        title: "Calendar",
        mark: (
            <svg viewBox="0 0 48 48" className="explore-mark">
                <rect x="8" y="10" width="32" height="28" rx="7" fill="#e8eef6" />
                <rect x="8" y="10" width="32" height="9" rx="7" fill="#e23b3b" />
                <rect x="14" y="24" width="6" height="6" rx="1.5" fill="#163a78" />
                <rect x="21" y="24" width="6" height="6" rx="1.5" fill="#163a78" />
                <rect x="28" y="24" width="6" height="6" rx="1.5" fill="#14b8a6" />
            </svg>
        ),
    },
    {
        href: "/tools",
        title: "Tools",
        mark: (
            <svg viewBox="0 0 48 48" className="explore-mark">
                <rect x="8" y="8" width="32" height="32" rx="8" fill="#163a78" />
                <path d="M28 16a6 6 0 0 0-8.5 8.5L14 30l4 4 5.5-5.5A6 6 0 0 0 28 16z" fill="none" stroke="#f5c518" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="29.5" cy="18.5" r="2" fill="#f5c518" />
            </svg>
        ),
    },
    {
        href: "/alerts",
        title: "Alerts",
        mark: (
            <svg viewBox="0 0 48 48" className="explore-mark">
                <path d="M24 10c-6 0-10 4.2-10 10v5.2l-3 4.3c-.5.7 0 1.7.9 1.7h24.2c.9 0 1.4-1 .9-1.7l-3-4.3V20c0-5.8-4-10-10-10z" fill="#f25b4a" />
                <path d="M20 33.5a4 4 0 0 0 8 0" fill="none" stroke="#163a78" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        href: "/about",
        title: "About",
        mark: (
            <svg viewBox="0 0 48 48" className="explore-mark">
                <circle cx="24" cy="24" r="15" fill="#1f6feb" />
                <rect x="22" y="20" width="4" height="12" rx="2" fill="#fff" />
                <circle cx="24" cy="16" r="2.2" fill="#fff" />
            </svg>
        ),
    },
];

export default function HomePage() {
    const [lesson, setLesson] = useState<NextLesson | null>(null);
    const [ready, setReady] = useState(false);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadNext() {
            try {
                const [lessonsJson, progressJson] = await Promise.all([
                    cachedJson<{ lessons?: LessonRow[] }>("lessons", "/api/lessons"),
                    cachedJson<{ completedLessons?: string[] }>("progress", "/api/user/progress").catch(
                        () => ({ completedLessons: [] as string[] })
                    ),
                ]);

                const lessons: LessonRow[] = Array.isArray(lessonsJson.lessons)
                    ? lessonsJson.lessons
                    : [];
                if (!lessons.length || cancelled) {
                    if (!cancelled) setLesson(null);
                    return;
                }

                const completed = Array.isArray(progressJson.completedLessons)
                    ? progressJson.completedLessons
                    : [];

                const nextIndex = lessons.findIndex((row) => !completed.includes(row.slug));
                const index = nextIndex === -1 ? lessons.length : nextIndex;
                const current =
                    nextIndex === -1 ? lessons[lessons.length - 1] : lessons[nextIndex];
                if (!current || cancelled) return;

                setLesson({
                    index: Math.min(index + 1, lessons.length),
                    total: lessons.length,
                    title: current.title,
                    href: "/quizzes",
                });
            } catch {
                if (!cancelled) setLesson(null);
            } finally {
                if (!cancelled) setReady(true);
            }
        }

        loadNext();
        return () => {
            cancelled = true;
        };
    }, []);

    const ticks = useMemo(() => {
        const total = lesson?.total ?? 0;
        const index = lesson?.index ?? 0;
        const count = Math.min(Math.max(total, 1), 10);
        const active = Math.min(Math.max(index, 0), count);
        return Array.from({ length: count }, (_, i) => i < active);
    }, [lesson]);

    return (
        <div className="home-app">
            <div className="home-brand-row">
                <span className="home-brand">Pipsology</span>
            </div>

            <h1 className="home-greeting">Hi! Ready to learn how money markets work?</h1>

            <section className="lesson-hero" aria-labelledby="next-lesson-title">
                {!ready ? (
                    <>
                        <p className="lesson-hero-meta">Loading your next lesson</p>
                        <h2 id="next-lesson-title" className="lesson-hero-pending">
                            …
                        </h2>
                    </>
                ) : lesson ? (
                    <>
                        <p className="lesson-hero-meta">
                            Lesson {lesson.index} of {lesson.total}
                        </p>
                        <h2 id="next-lesson-title">{lesson.title}</h2>
                        <Link href={lesson.href} className="lesson-hero-cta">
                            Start lesson.
                        </Link>
                    </>
                ) : (
                    <>
                        <p className="lesson-hero-meta">No lessons published yet</p>
                        <h2 id="next-lesson-title">Your curriculum will show up here.</h2>
                        <Link href="/quizzes" className="lesson-hero-cta">
                            Browse lessons.
                        </Link>
                    </>
                )}
                <ul className="lesson-ticks" aria-hidden>
                    {ticks.map((on, i) => (
                        <li key={i} className={on ? "on" : undefined} />
                    ))}
                </ul>
            </section>

            <section className="explore" aria-labelledby="explore-title">
                <h2 id="explore-title" className="explore-title">
                    Explore Pipsology
                </h2>
                <ul className="explore-grid">
                    <li>
                        <Link href="/quizzes" className="explore-tile">
                            <span className="explore-disc" aria-hidden>
                                <svg viewBox="0 0 48 48" className="explore-mark">
                                    <rect x="6" y="10" width="36" height="28" rx="6" fill="#e8eef6" />
                                    <rect x="6" y="10" width="36" height="9" rx="6" fill="#1f6feb" />
                                    <circle cx="34" cy="30" r="8" fill="#e23b3b" />
                                    <path d="M31 30.2l2 2.1 4.2-4.4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <span className="explore-label">Learn</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/coach" className="explore-tile">
                            <span className="explore-disc" aria-hidden>
                                <svg viewBox="0 0 48 48" className="explore-mark">
                                    <rect x="8" y="8" width="32" height="32" rx="8" fill="#163a78" />
                                    <path d="M24 14.5l2.4 5.1 5.6.7-4.1 3.8 1.1 5.5L24 26.8l-5 2.8 1.1-5.5-4.1-3.8 5.6-.7z" fill="#f5c518" />
                                </svg>
                            </span>
                            <span className="explore-label">Ask Coach</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/forexpedia" className="explore-tile">
                            <span className="explore-disc" aria-hidden>
                                <svg viewBox="0 0 48 48" className="explore-mark">
                                    <path d="M10 12h14a8 8 0 0 1 8 8v16H18a8 8 0 0 0-8 8V12z" fill="#f25b4a" />
                                    <path d="M24 12h14v32a8 8 0 0 0-8-8H24V12z" fill="#ff8a78" />
                                </svg>
                            </span>
                            <span className="explore-label">Word book</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/charts" className="explore-tile">
                            <span className="explore-disc" aria-hidden>
                                <svg viewBox="0 0 48 48" className="explore-mark">
                                    <rect x="9" y="9" width="30" height="30" rx="7" fill="#111" />
                                    <path d="M17 31V21M24 31V15M31 31v-8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
                                </svg>
                            </span>
                            <span className="explore-label">Charts</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/journal" className="explore-tile">
                            <span className="explore-disc" aria-hidden>
                                <svg viewBox="0 0 48 48" className="explore-mark">
                                    <rect x="10" y="8" width="28" height="32" rx="7" fill="#0e6cb8" />
                                    <rect x="10" y="28" width="28" height="12" rx="6" fill="#14b8a6" />
                                    <text x="24" y="22" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800" fontFamily="Arial, sans-serif">MT</text>
                                </svg>
                            </span>
                            <span className="explore-label">Journal</span>
                        </Link>
                    </li>
                    <li>
                        <button
                            type="button"
                            className={`explore-tile explore-tile--btn${showMore ? " is-open" : ""}`}
                            aria-expanded={showMore}
                            aria-controls="explore-more"
                            onClick={() => setShowMore((open) => !open)}
                        >
                            <span className="explore-disc" aria-hidden>
                                <svg viewBox="0 0 48 48" className="explore-mark">
                                    <g fill="#e23b3b">
                                        <rect x="8" y="8" width="9" height="9" rx="2.2" />
                                        <rect x="19.5" y="8" width="9" height="9" rx="2.2" fill="#f4f4f4" stroke="#e23b3b" strokeWidth="1.2" />
                                        <rect x="31" y="8" width="9" height="9" rx="2.2" />
                                        <rect x="8" y="19.5" width="9" height="9" rx="2.2" fill="#f4f4f4" stroke="#e23b3b" strokeWidth="1.2" />
                                        <rect x="19.5" y="19.5" width="9" height="9" rx="2.2" />
                                        <rect x="31" y="19.5" width="9" height="9" rx="2.2" fill="#f4f4f4" stroke="#e23b3b" strokeWidth="1.2" />
                                        <rect x="8" y="31" width="9" height="9" rx="2.2" />
                                        <rect x="19.5" y="31" width="9" height="9" rx="2.2" fill="#f4f4f4" stroke="#e23b3b" strokeWidth="1.2" />
                                        <rect x="31" y="31" width="9" height="9" rx="2.2" />
                                    </g>
                                </svg>
                            </span>
                            <span className="explore-label">{showMore ? "Less" : "More"}</span>
                        </button>
                    </li>
                </ul>

                {showMore ? (
                    <ul id="explore-more" className="explore-grid explore-more" aria-label="More tools">
                        {moreTools.map((row) => (
                            <li key={row.href}>
                                <Link href={row.href} className="explore-tile">
                                    <span className="explore-disc" aria-hidden>
                                        {row.mark}
                                    </span>
                                    <span className="explore-label">{row.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </section>
        </div>
    );
}
