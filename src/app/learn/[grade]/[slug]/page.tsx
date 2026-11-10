import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonArticle } from "@/components/LessonArticle";
import { getCachedLessonBySlug, getCachedLessons } from "@/lib/catalogCache";
import {
    getChapterForLessonSlug,
    groupLessonsByChapter,
    lessonDisplayTitle,
    orderedCatalogLessons,
    type LessonRef,
} from "@/lib/curriculumChapters";
import { getSeedLessonBySlug, getSeedLessonRefs } from "@/lib/lessonFallback";

export const dynamic = "force-dynamic";

type PageProps = {
    params: Promise<{ grade: string; slug: string }>;
};

type ArticleLesson = {
    id: string;
    slug: string;
    title: string;
    gradeId: string;
    grade: { id: string; title: string };
    sections: {
        id: string;
        title: string;
        text: string[];
        videoUrl: string | null;
        order: number;
    }[];
};

export default async function LessonPage({ params }: PageProps) {
    const { grade: gradeParam, slug } = await params;

    let lesson: ArticleLesson | null = null;
    let usedFallback = false;

    try {
        const fromDb = await getCachedLessonBySlug(slug);
        if (fromDb) {
            lesson = fromDb as ArticleLesson;
        }
    } catch (err) {
        // String-only warn: console.error(Error) during RSC opens the Next overlay
        // even when we intentionally fall back to seed curriculum below.
        const detail = err instanceof Error ? err.message : String(err);
        console.warn(`Failed to load lesson by slug from DB: "${slug}" — ${detail}`);
    }

    if (!lesson) {
        const seed = getSeedLessonBySlug(slug, gradeParam || "seed");
        if (seed) {
            lesson = seed;
            usedFallback = true;
        }
    }

    if (!lesson) {
        notFound();
    }

    const gradeId = !usedFallback && lesson.gradeId === gradeParam ? gradeParam : lesson.gradeId;
    const chapter = getChapterForLessonSlug(lesson.slug);

    let lessonRefs: LessonRef[] = [];
    try {
        const allLessons = await getCachedLessons("");
        lessonRefs = allLessons.map(
            (row: { id: string; slug: string; title: string; gradeId: string }) => ({
                id: row.id,
                slug: row.slug,
                title: lessonDisplayTitle(row.slug, row.title),
                gradeId: row.gradeId,
            })
        );
    } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        console.warn(`Failed to load lesson catalog for navigation — ${detail}`);
        lessonRefs = getSeedLessonRefs(gradeId);
    }

    if (!lessonRefs.length) {
        lessonRefs = getSeedLessonRefs(gradeId);
    }

    const grouped = groupLessonsByChapter(lessonRefs);
    const siblings =
        grouped.find((g) => g.chapter.slug === chapter?.slug)?.lessons ??
        grouped.find((g) => g.lessons.some((l) => l.slug === lesson.slug))?.lessons ??
        lessonRefs.filter((l) => l.gradeId === gradeId);
    const catalogOrder = orderedCatalogLessons(lessonRefs);

    const chapterSlug = chapter?.slug ?? "more-lessons";
    const chapterTitle = chapter?.title ?? lesson.grade.title;

    return (
        <LessonArticle
            gradeId={gradeId}
            lessonSlug={lesson.slug}
            lessonTitle={lessonDisplayTitle(lesson.slug, lesson.title)}
            chapterSlug={chapterSlug}
            chapterTitle={chapterTitle}
            siblingLessons={siblings.length ? siblings : lessonRefs}
            navigationLessons={catalogOrder.length ? catalogOrder : lessonRefs}
            sections={lesson.sections.map((section) => ({
                id: section.id,
                title: section.title,
                text: section.text,
                videoUrl: section.videoUrl,
            }))}
        />
    );
}
