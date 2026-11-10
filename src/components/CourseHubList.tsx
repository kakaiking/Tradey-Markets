"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AuthGateLink } from "@/components/AuthGateLink";
import { loadGradesWithProgress } from "@/lib/clientCache";
import {
    CURRICULUM_CHAPTERS,
    chapterStatus,
    groupLessonsByChapter,
    type LessonRef,
} from "@/lib/curriculumChapters";

export function CourseHubList() {
    const [lessons, setLessons] = useState<LessonRef[]>([]);
    const [completed, setCompleted] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const { grades, completedLessons } = await loadGradesWithProgress();
                setLessons(
                    grades.flatMap((grade) =>
                        (grade.lessons ?? []).map((lesson) => ({
                            id: lesson.id,
                            slug: lesson.slug,
                            title: lesson.title,
                            gradeId: grade.id,
                        }))
                    )
                );
                setCompleted(completedLessons);
            } catch (err) {
                console.error("Failed to load courses:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const courses = useMemo(() => {
        const grouped = groupLessonsByChapter(lessons);
        return CURRICULUM_CHAPTERS.map((chapter) => {
            const matched = grouped.find((group) => group.chapter.slug === chapter.slug);
            const chapterLessons = matched?.lessons ?? [];
            if (chapterLessons.length === 0) return null;
            const slugs = chapterLessons.map((lesson) => lesson.slug);
            const status = chapterStatus(slugs, completed);
            const doneCount = slugs.filter((slug) => completed.includes(slug)).length;
            return {
                chapter,
                lessonCount: slugs.length,
                status,
                doneCount,
                href: `/learn/chapters/${chapter.slug}`,
            };
        }).filter((course): course is NonNullable<typeof course> => Boolean(course));
    }, [lessons, completed]);

    if (loading) {
        return (
            <section className="hub-courses" aria-busy="true">
                <h2 className="hub-section-title">Courses</h2>
                <ul className="hub-list">
                    {[1, 2, 3].map((n) => (
                        <li key={n}>
                            <div className="continue-strip continue-strip--loading">
                                <span className="continue-strip-kicker">Loading</span>
                                <strong>…</strong>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        );
    }

    if (courses.length === 0) {
        return (
            <section className="hub-courses">
                <h2 className="hub-section-title">Courses</h2>
                <p className="status">No courses published yet.</p>
            </section>
        );
    }

    return (
        <section className="hub-courses">
            <h2 className="hub-section-title">Courses</h2>
            <ul className="hub-list">
                {courses.map((course) => (
                    <li key={course.chapter.slug}>
                        <AuthGateLink href={course.href} className="continue-strip">
                            <div className="continue-strip-copy">
                                <strong>{course.chapter.title}</strong>
                                <span className="continue-strip-meta">
                                    {course.lessonCount}{" "}
                                    {course.lessonCount === 1 ? "lesson" : "lessons"}
                                    {course.status === "in_progress"
                                        ? ` · ${course.doneCount}/${course.lessonCount}`
                                        : ""}
                                </span>
                            </div>
                            <span className="continue-strip-trail" aria-hidden>
                                <ArrowRight size={18} strokeWidth={2.4} />
                            </span>
                        </AuthGateLink>
                    </li>
                ))}
            </ul>
        </section>
    );
}
