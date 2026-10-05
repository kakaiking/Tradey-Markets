"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHead } from "@/components/layout/PageHead";

type Props = { gradeId: string; title?: string; subtitle?: string };

export default function LevelDetailPanel({ gradeId, title, subtitle }: Props) {
    const [lessons, setLessons] = useState<any[]>([]);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [gradeTitle, setGradeTitle] = useState(title || gradeId);
    const [gradeSubtitle, setGradeSubtitle] = useState(subtitle || "");

    useEffect(() => {
        async function fetchData() {
            try {
                const [progressRes, lessonsRes, gradesRes] = await Promise.all([
                    fetch("/api/user/progress/"),
                    fetch(`/api/lessons?gradeId=${gradeId}`),
                    fetch("/api/grades"),
                ]);

                if (progressRes.ok) {
                    const data = await progressRes.json();
                    if (data) {
                        setCompletedLessons(data.completedLessons ?? []);
                        if (data.progress && data.progress[gradeId] !== undefined) {
                            setProgress(data.progress[gradeId]);
                        }
                    }
                }

                if (lessonsRes.ok) {
                    const lessonsData = await lessonsRes.json();
                    setLessons(lessonsData.lessons || []);
                }

                if (gradesRes.ok) {
                    const gradesData = await gradesRes.json();
                    const match = (gradesData.grades || []).find((g: any) => g.id === gradeId);
                    if (match) {
                        setGradeTitle(match.title || gradeId);
                        setGradeSubtitle(match.subtitle || "");
                    }
                }
            } catch (err) {
                console.error("Failed to fetch data in LevelDetailPanel:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [gradeId]);

    return (
        <div>
            <PageHead
                title={gradeTitle}
                byline={gradeSubtitle || undefined}
                lede={`Grade progress ${loading ? "…" : `${progress}%`}`}
                backHref="/learn"
            />

            <div className="heat" style={{ margin: "0 auto 1.25rem", maxWidth: "100%" }} aria-hidden>
                <div className="heat-fill" style={{ width: loading ? "0%" : `${progress}%` }} />
            </div>

            {loading ? (
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
            ) : lessons.length === 0 ? (
                <p className="status">No lessons published yet.</p>
            ) : (
                <ul className="choice-list">
                    {lessons.map((lesson: any, i: number) => {
                        const isDone = completedLessons.includes(lesson.slug);
                        return (
                            <li key={lesson.id}>
                                <Link
                                    href={`/learn/${gradeId}/${lesson.slug}`}
                                    className="choice-card"
                                >
                                    <div className="choice-copy">
                                        <strong>{lesson.title}</strong>
                                        <span className="choice-meta">Lesson {i + 1}</span>
                                    </div>
                                    <span className={`choice-trail ${isDone ? "" : "locked"}`}>
                                        {isDone ? "Done" : "Open"}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
