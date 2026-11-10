"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadGradesWithProgress } from "@/lib/clientCache";
import {
    groupLessonsByChapter,
    lessonArticleHref,
    lessonBlurb,
    lessonDisplayTitle,
    type LessonRef,
} from "@/lib/curriculumChapters";

type GradeRow = {
    id: string;
    title: string;
    subtitle?: string;
    progress: number;
    lessons?: { id: string; slug: string; title: string }[];
};

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

    const lessons: LessonRef[] = grades.flatMap((grade) =>
        (grade.lessons ?? []).map((lesson) => ({
            ...lesson,
            gradeId: grade.id,
        }))
    );

    if (lessons.length === 0) {
        return <p className="status">No lessons published yet.</p>;
    }

    const groups = groupLessonsByChapter(lessons);

    return (
        <div className="choice-list">
            {groups.map((group) => (
                <section key={group.chapter.slug}>
                    <p className="kicker" style={{ margin: "0.35rem 0 0.65rem", textAlign: "left" }}>
                        {group.chapter.title}
                    </p>
                    <ul className="choice-list">
                        {group.lessons.map((lesson) => {
                            const done = completed.includes(lesson.slug);
                            return (
                                <li key={lesson.id}>
                                    <Link
                                        href={lessonArticleHref(lesson.gradeId, lesson.slug)}
                                        className="choice-card"
                                    >
                                        <div className="choice-copy">
                                            <strong>
                                                {lessonDisplayTitle(lesson.slug, lesson.title)}
                                            </strong>
                                            <span className="choice-meta">
                                                {lessonBlurb(lesson.slug) || "Lesson"}
                                            </span>
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
