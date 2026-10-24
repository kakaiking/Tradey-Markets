"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Star } from "lucide-react";

type LessonRow = {
    slug: string;
    title: string;
    gradeId: string;
};

const FALLBACK = {
    index: 1,
    total: 10,
    title: "What is a currency exchange?",
    lede: "A 3 minute lesson. No experience needed.",
    href: "/learn",
};

export default function HomePage() {
    const [lesson, setLesson] = useState(FALLBACK);

    useEffect(() => {
        let cancelled = false;

        async function loadNext() {
            try {
                const [lessonsRes, progressRes] = await Promise.all([
                    fetch("/api/lessons"),
                    fetch("/api/user/progress"),
                ]);

                if (!lessonsRes.ok) return;
                const lessonsJson = await lessonsRes.json();
                const lessons: LessonRow[] = Array.isArray(lessonsJson.lessons)
                    ? lessonsJson.lessons
                    : [];
                if (!lessons.length) return;

                let completed: string[] = [];
                if (progressRes.ok) {
                    const progressJson = await progressRes.json();
                    completed = Array.isArray(progressJson.completedLessons)
                        ? progressJson.completedLessons
                        : [];
                }

                const nextIndex = lessons.findIndex((row) => !completed.includes(row.slug));
                const index = nextIndex === -1 ? lessons.length : nextIndex;
                const current =
                    nextIndex === -1 ? lessons[lessons.length - 1] : lessons[nextIndex];
                if (!current || cancelled) return;

                setLesson({
                    index: Math.min(index + 1, lessons.length),
                    total: lessons.length,
                    title: current.title,
                    lede: "A 3 minute lesson. No experience needed.",
                    href: `/learn/${current.gradeId}/${current.slug}`,
                });
            } catch {
                /* keep fallback */
            }
        }

        loadNext();
        return () => {
            cancelled = true;
        };
    }, []);

    const ticks = useMemo(() => {
        const count = Math.min(Math.max(lesson.total, 1), 10);
        const active = Math.min(Math.max(lesson.index, 1), count);
        return Array.from({ length: count }, (_, i) => i < active);
    }, [lesson.index, lesson.total]);

    return (
        <div className="home-app">
            <div className="home-brand-row">
                <span className="home-brand">Pipsology</span>
                <span className="practice-money-pill">Practice money only</span>
            </div>

            <h1 className="home-greeting">Hi! Ready to learn how money markets work?</h1>

            <section className="lesson-hero" aria-labelledby="next-lesson-title">
                <p className="lesson-hero-meta">
                    Lesson {lesson.index} of {lesson.total}
                </p>
                <h2 id="next-lesson-title">{lesson.title}</h2>
                <p className="lesson-hero-lede">{lesson.lede}</p>
                <Link href={lesson.href} className="lesson-hero-cta">
                    Start lesson.
                </Link>
                <ul className="lesson-ticks" aria-hidden>
                    {ticks.map((on, i) => (
                        <li key={i} className={on ? "on" : undefined} />
                    ))}
                </ul>
            </section>

            <ul className="home-shortcuts">
                <li>
                    <Link href="/quizzes" className="shortcut-row">
                        <span className="shortcut-icon shortcut-icon--practice" aria-hidden>
                            <CheckCircle2 size={22} strokeWidth={2.25} />
                        </span>
                        <span className="shortcut-copy">
                            <strong>Practice</strong>
                            <span>Quick quizzes and games.</span>
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="/coach" className="shortcut-row shortcut-row--coach">
                        <span className="shortcut-icon shortcut-icon--coach" aria-hidden>
                            <Star size={22} strokeWidth={2.25} fill="currentColor" />
                        </span>
                        <span className="shortcut-copy">
                            <strong>
                                Ask Coach <span className="premium-pill">PREMIUM</span>
                            </strong>
                            <span>Your personal tutor, any time.</span>
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="/forexpedia" className="shortcut-row">
                        <span className="shortcut-icon shortcut-icon--words" aria-hidden>
                            <BookOpen size={22} strokeWidth={2.25} />
                        </span>
                        <span className="shortcut-copy">
                            <strong>Word book</strong>
                            <span>What does that word mean?</span>
                        </span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}
