"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHead } from "@/components/layout/PageHead";
import {
    getGuestCompletedLessons,
    mergeCompletedLists,
} from "@/lib/completeLessonClient";
import {
    chapterHref,
    chapterStatus,
    firstIncompleteSlug,
    getAdjacentChapter,
    lessonArticleHref,
    type ChapterStatus,
} from "@/lib/curriculumChapters";

export type ChapterLessonRow = {
    id: string;
    slug: string;
    title: string;
    gradeId: string;
    teaser: string;
};

type Props = {
    chapterSlug: string;
    chapterTitle: string;
    lessons: ChapterLessonRow[];
    completed: string[];
};

export function ChapterOverview({
    chapterSlug,
    chapterTitle,
    lessons,
    completed: serverCompleted,
}: Props) {
    const [completed, setCompleted] = useState(serverCompleted);

    useEffect(() => {
        setCompleted(mergeCompletedLists(serverCompleted, getGuestCompletedLessons()));
    }, [serverCompleted]);

    const slugs = lessons.map((l) => l.slug);
    const status: ChapterStatus = chapterStatus(slugs, completed);
    const doneCount = lessons.filter((l) => completed.includes(l.slug)).length;
    const total = lessons.length;
    const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);
    const nextSlug = firstIncompleteSlug(slugs, completed);
    const nextLesson = lessons.find((l) => l.slug === nextSlug) ?? lessons[0];
    const { prev: prevCourse, next: nextCourse } = getAdjacentChapter(chapterSlug);

    return (
        <div className="chapter-overview">
            <PageHead title={chapterTitle} backHref="/quizzes" />

            <div className="chapter-progress">
                <div
                    className="chapter-progress-track"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                    aria-label="Course progress"
                >
                    <span
                        className="chapter-progress-fill"
                        style={{ width: `${percent}%` }}
                    />
                </div>
                {nextLesson ? (
                    <div className="chapter-progress-cta">
                        <Link
                            href={lessonArticleHref(nextLesson.gradeId, nextLesson.slug)}
                            className="course-cta"
                        >
                            {doneCount > 0 ? "Continue" : "Start"}
                        </Link>
                    </div>
                ) : null}
            </div>

            <ol className="lesson-timeline">
                {lessons.map((lesson) => {
                    const done = completed.includes(lesson.slug);
                    const isNext =
                        status === "in_progress" &&
                        lesson.slug === nextLesson?.slug;
                    return (
                        <li key={lesson.id} className="lesson-timeline-item">
                            <Link
                                href={lessonArticleHref(lesson.gradeId, lesson.slug)}
                                className={`lesson-timeline-link${done ? " is-done" : ""}${isNext ? " is-next" : ""}`}
                            >
                                <span className="lesson-timeline-node" aria-hidden>
                                    {done ? <Check size={14} strokeWidth={2.8} /> : null}
                                </span>
                                <div className="lesson-timeline-copy">
                                    <strong>
                                        {lesson.title}
                                        {isNext ? (
                                            <span className="lesson-next-badge">Continue</span>
                                        ) : null}
                                    </strong>
                                    {lesson.teaser ? <p>{lesson.teaser}</p> : null}
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ol>

            {prevCourse || nextCourse ? (
                <footer className="lesson-article-footer chapter-course-nav">
                    {prevCourse ? (
                        <Link
                            href={chapterHref(prevCourse.slug)}
                            className="lesson-continue lesson-continue--prev"
                        >
                            <ChevronLeft size={20} strokeWidth={2.4} aria-hidden />
                            <strong>{prevCourse.title}</strong>
                        </Link>
                    ) : null}

                    {nextCourse ? (
                        <Link
                            href={chapterHref(nextCourse.slug)}
                            className="lesson-continue"
                        >
                            <strong>{nextCourse.title}</strong>
                            <ChevronRight size={20} strokeWidth={2.4} aria-hidden />
                        </Link>
                    ) : null}
                </footer>
            ) : null}
        </div>
    );
}
