"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadGradesWithProgress } from "@/lib/clientCache";

type LessonRow = {
    id: string;
    slug: string;
    title: string;
};

type GradeRow = {
    id: string;
    title: string;
    subtitle?: string;
    progress: number;
    lessons?: LessonRow[];
};

const chapters: { title: string; slugs: string[] }[] = [
    {
        title: "What is Forex?",
        slugs: [
            "what-is-forex-trading",
            "what-is-traded-in-forex",
            "buying-and-selling-currency-pairs",
            "forex-market-size-and-liquidity",
            "ways-to-trade-currencies",
        ],
    },
    {
        title: "How Do You Trade Forex?",
        slugs: [
            "how-a-forex-trade-works",
            "when-to-buy-or-sell",
            "what-is-a-pip",
            "lot-size-in-forex",
            "what-is-a-spread",
            "bid-and-ask-price",
            "forex-lingo",
            "types-of-forex-orders",
            "order-types-cheat-sheet",
            "forex-demo-account",
            "can-you-get-rich-trading-forex",
        ],
    },
    {
        title: "When Can You Trade Forex?",
        slugs: [
            "forex-trading-sessions",
            "tokyo-session",
            "london-session",
            "new-york-session",
            "best-times-of-day",
            "best-days-of-the-week",
        ],
    },
    {
        title: "Who Trades Forex?",
        slugs: ["forex-market-structure", "who-trades-forex", "retail-forex-history"],
    },
    {
        title: "Why Trade Forex?",
        slugs: ["what-makes-fx-unique", "forex-vs-stocks", "forex-vs-futures"],
    },
];

function groupLessons<T extends LessonRow>(lessons: T[]) {
    const used = new Set<string>();
    const groups = chapters
        .map((chapter) => {
            const items = chapter.slugs
                .map((slug) => lessons.find((lesson) => lesson.slug === slug))
                .filter((lesson): lesson is LessonRow => Boolean(lesson));
            items.forEach((lesson) => used.add(lesson.slug));
            return { title: chapter.title, lessons: items };
        })
        .filter((group) => group.lessons.length > 0);

    const rest = lessons.filter((lesson) => !used.has(lesson.slug));
    if (rest.length > 0) {
        groups.push({ title: "More lessons", lessons: rest });
    }
    return groups;
}

export default function CurriculumMap() {
    const [grades, setGrades] = useState<GradeRow[]>([]);
    const [completed, setCompleted] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGradesAndProgress() {
            try {
                const { grades: withProgress, completedLessons } = await loadGradesWithProgress();
                setGrades(withProgress as GradeRow[]);
                setCompleted(completedLessons);
            } catch (err) {
                console.error("Failed to fetch curriculum map data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchGradesAndProgress();
    }, []);

    if (loading) {
        return (
            <ul className="choice-list" aria-busy="true">
                {[1, 2, 3].map((n) => (
                    <li key={n}>
                        <div className="choice-card" style={{ opacity: 0.5 }}>
                            <div className="choice-copy">
                                <strong>Loading…</strong>
                                <span className="choice-meta">Lesson</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    const lessons = grades.flatMap((grade) =>
        (grade.lessons ?? []).map((lesson) => ({ ...lesson, gradeId: grade.id }))
    );

    if (lessons.length === 0) {
        return <p className="status">No lessons published yet.</p>;
    }

    const groups = groupLessons(lessons);

    return (
        <div className="choice-list">
            {groups.map((group) => (
                <section key={group.title}>
                    <p className="kicker" style={{ margin: "0.35rem 0 0.65rem", textAlign: "left" }}>
                        {group.title}
                    </p>
                    <ul className="choice-list">
                        {group.lessons.map((lesson, index) => {
                            const done = completed.includes(lesson.slug);
                            return (
                                <li key={lesson.id}>
                                    <Link
                                        href={`/learn/question-cards/?grade=${lesson.gradeId}&slug=${lesson.slug}`}
                                        className="choice-card"
                                    >
                                        <div className="choice-copy">
                                            <strong>{lesson.title}</strong>
                                            <span className="choice-meta">Lesson {index + 1}</span>
                                        </div>
                                        <span className="choice-trail">{done ? "Done" : "Open"}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}
        </div>
    );
}
