import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LessonAdvanceLink } from "@/components/LessonAdvanceLink";
import { LessonProgressTracker } from "@/components/LessonProgressTracker";
import { BackButton } from "@/components/layout/BackButton";
import {
    estimateReadMinutes,
    getAdjacentLesson,
    lessonArticleHref,
    type LessonRef,
} from "@/lib/curriculumChapters";
import { getYouTubeId } from "@/lib/youtube";

export type LessonSectionView = {
    id: string;
    title: string;
    text: string[];
    videoUrl: string | null;
};

type Props = {
    gradeId: string;
    lessonSlug: string;
    lessonTitle: string;
    chapterSlug: string;
    chapterTitle: string;
    sections: LessonSectionView[];
    siblingLessons: LessonRef[];
    /** Full school order for prev/next across chapters */
    navigationLessons?: LessonRef[];
};

export function LessonArticle({
    gradeId,
    lessonSlug,
    lessonTitle,
    chapterSlug,
    chapterTitle,
    sections,
    siblingLessons,
    navigationLessons,
}: Props) {
    const minutes = estimateReadMinutes(sections);
    const { prev, next } = getAdjacentLesson(
        lessonSlug,
        navigationLessons?.length ? navigationLessons : siblingLessons
    );
    const sectionIds = sections.map((s) => s.id);
    const courseHref = `/learn/chapters/${chapterSlug}`;
    const lessonIndex = siblingLessons.findIndex((lesson) => lesson.slug === lessonSlug);
    const position = lessonIndex >= 0 ? lessonIndex + 1 : 1;
    const total = Math.max(siblingLessons.length, 1);
    const throughPercent = Math.round((position / total) * 100);

    return (
        <div className="lesson-article">
            <LessonProgressTracker
                gradeId={gradeId}
                lessonSlug={lessonSlug}
                sectionIds={sectionIds}
            />

            <header className="lesson-reader-bar">
                <div className="lesson-reader-lead">
                    <BackButton href={courseHref} fallbackHref={courseHref} label="Back to course" />
                    <Link href={courseHref} className="lesson-reader-course">
                        {chapterTitle}
                    </Link>
                    <p className="lesson-reader-count" aria-label={`Lesson ${position} of ${total}`}>
                        {position}
                        <span aria-hidden> / </span>
                        {total}
                    </p>
                </div>
                <div
                    className="lesson-reader-track"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={throughPercent}
                    aria-label="Place in course"
                >
                    <span
                        className="lesson-reader-fill"
                        style={{ width: `${throughPercent}%` }}
                    />
                </div>
            </header>

            <article className="lesson-article-main">
                <header className="lesson-article-header">
                    <h1 className="lesson-article-title">{lessonTitle}</h1>
                    <p className="lesson-article-meta">{minutes} min read</p>
                </header>

                <div className="lesson-article-body">
                    {sections.map((section) => {
                        const videoId = getYouTubeId(section.videoUrl);
                        return (
                            <section
                                key={section.id}
                                id={section.id}
                                className="lesson-article-section"
                            >
                                <h2>{section.title}</h2>
                                {section.text.map((paragraph, i) => (
                                    <p key={`${section.id}-p-${i}`}>{paragraph}</p>
                                ))}
                                {videoId ? (
                                    <div className="lesson-article-video">
                                        <iframe
                                            title={`Video: ${section.title}`}
                                            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            loading="lazy"
                                        />
                                    </div>
                                ) : null}
                            </section>
                        );
                    })}
                </div>

                <footer className="lesson-article-footer">
                    {prev ? (
                        <Link
                            href={lessonArticleHref(prev.gradeId, prev.slug)}
                            className="lesson-continue lesson-continue--prev"
                        >
                            <ChevronLeft size={20} strokeWidth={2.4} aria-hidden />
                            <strong>{prev.title}</strong>
                        </Link>
                    ) : null}

                    {next ? (
                        <LessonAdvanceLink
                            href={lessonArticleHref(next.gradeId, next.slug)}
                            gradeId={gradeId}
                            lessonSlug={lessonSlug}
                            className="lesson-continue"
                        >
                            <strong>{next.title}</strong>
                            <ChevronRight size={20} strokeWidth={2.4} aria-hidden />
                        </LessonAdvanceLink>
                    ) : (
                        <LessonAdvanceLink
                            href={courseHref}
                            gradeId={gradeId}
                            lessonSlug={lessonSlug}
                            className="lesson-continue"
                        >
                            <strong>Back to {chapterTitle}</strong>
                            <ChevronRight size={20} strokeWidth={2.4} aria-hidden />
                        </LessonAdvanceLink>
                    )}
                </footer>
            </article>
        </div>
    );
}
