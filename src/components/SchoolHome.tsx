"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { loadGradesWithProgress } from "@/lib/clientCache";
import {
    CURRICULUM_CHAPTERS,
    chapterStatus,
    groupLessonsByChapter,
    lessonArticleHref,
    lessonBlurb,
    lessonDisplayTitle,
    type ChapterStatus,
    type LessonRef,
} from "@/lib/curriculumChapters";
import { PageHead } from "@/components/layout/PageHead";

type CourseFilter = "all" | "not_started" | "in_progress" | "completed";

const FILTERS: { id: CourseFilter; label: string }[] = [
    { id: "all", label: "All courses" },
    { id: "not_started", label: "Not started" },
    { id: "in_progress", label: "In progress" },
    { id: "completed", label: "Completed" },
];

function statusLabel(status: ChapterStatus) {
    if (status === "completed") return "Completed";
    if (status === "in_progress") return "In progress";
    return "Not started";
}

export function SchoolHome() {
    const [lessons, setLessons] = useState<LessonRef[]>([]);
    const [completed, setCompleted] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<CourseFilter>("all");

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
                console.error("Failed to load school home:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const courses = useMemo(() => {
        const grouped = groupLessonsByChapter(lessons);
        return grouped.map((group, index) => {
            const slugs = group.lessons.map((l) => l.slug);
            const status = chapterStatus(slugs, completed);
            const doneCount = slugs.filter((s) => completed.includes(s)).length;
            return {
                index: index + 1,
                chapter: group.chapter,
                lessons: group.lessons,
                status,
                doneCount,
                ctaHref: `/learn/chapters/${group.chapter.slug}`,
                ctaLabel:
                    status === "completed"
                        ? "Review course"
                        : status === "in_progress"
                          ? "Continue"
                          : "Start course",
            };
        });
    }, [lessons, completed]);

    const visible = courses.filter((course) => {
        if (filter === "all") return true;
        return course.status === filter;
    });

    return (
        <div className="school-home">
            <PageHead
                title="Lessons"
                lede="Read each lesson like a short textbook chapter — then practice with question cards when you are ready."
                backHref="/quizzes"
            />

            <div className="school-filters" role="tablist" aria-label="Filter courses">
                {FILTERS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={filter === item.id}
                        className={`school-filter${filter === item.id ? " is-active" : ""}`}
                        onClick={() => setFilter(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <ul className="course-list" aria-busy="true">
                    {[1, 2, 3].map((n) => (
                        <li key={n} className="course-card course-card--skeleton" />
                    ))}
                </ul>
            ) : visible.length === 0 ? (
                <p className="status">No courses match this filter.</p>
            ) : (
                <ul className="course-list">
                    {visible.map((course) => (
                        <li key={course.chapter.slug} className="course-card course-card--roadmap">
                            <div className="course-card-top">
                                <span className="course-number" aria-hidden>
                                    {course.index}
                                </span>
                                <div className="course-card-copy">
                                    <h2 className="course-card-title">{course.chapter.title}</h2>
                                    <p className="course-card-blurb">{course.chapter.blurb}</p>
                                </div>
                            </div>
                            <div className="course-card-actions">
                                <Link href={course.ctaHref} className="course-cta">
                                    {course.ctaLabel}
                                </Link>
                                <span className="course-meta">
                                    {course.lessons.length}{" "}
                                    {course.lessons.length === 1 ? "Lesson" : "Lessons"}
                                    {" · "}
                                    {statusLabel(course.status)}
                                    {course.status === "in_progress"
                                        ? ` (${course.doneCount}/${course.lessons.length})`
                                        : ""}
                                </span>
                            </div>

                            <ol className="lesson-timeline lesson-timeline--nested">
                                {course.lessons.map((lesson) => {
                                    const done = completed.includes(lesson.slug);
                                    return (
                                        <li key={lesson.id} className="lesson-timeline-item">
                                            <Link
                                                href={lessonArticleHref(lesson.gradeId, lesson.slug)}
                                                className={`lesson-timeline-link${done ? " is-done" : ""}`}
                                            >
                                                <span className="lesson-timeline-node" aria-hidden>
                                                    {done ? <Check size={14} strokeWidth={2.8} /> : null}
                                                </span>
                                                <div className="lesson-timeline-copy">
                                                    <strong>
                                                        {lessonDisplayTitle(lesson.slug, lesson.title)}
                                                    </strong>
                                                    <p>{lessonBlurb(lesson.slug)}</p>
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ol>
                        </li>
                    ))}
                </ul>
            )}

            {!loading && lessons.length === 0 && CURRICULUM_CHAPTERS.length > 0 && (
                <p className="status">No lessons published yet.</p>
            )}
        </div>
    );
}
