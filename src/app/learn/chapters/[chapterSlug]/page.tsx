import { notFound } from "next/navigation";
import { ChapterOverview, type ChapterLessonRow } from "@/components/ChapterOverview";
import { getCachedLessonsWithTeasers } from "@/lib/catalogCache";
import { getUserFromSession } from "@/lib/auth";
import { EMPTY_PROGRESS, getProgressForUser } from "@/lib/progress";
import {
    getChapterBySlug,
    groupLessonsByChapter,
    lessonBlurb,
    lessonDisplayTitle,
    type LessonRef,
} from "@/lib/curriculumChapters";

export const dynamic = "force-dynamic";

type PageProps = {
    params: Promise<{ chapterSlug: string }>;
};

type TeaserLesson = {
    id: string;
    slug: string;
    title: string;
    gradeId: string;
    sections: { title: string; text: string[] }[];
};

export default async function ChapterPage({ params }: PageProps) {
    const { chapterSlug } = await params;
    const chapterDef = getChapterBySlug(chapterSlug);

    const allLessons = (await getCachedLessonsWithTeasers()) as TeaserLesson[];
    const refs: LessonRef[] = allLessons.map((lesson) => ({
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        gradeId: lesson.gradeId,
    }));
    const grouped = groupLessonsByChapter(refs);

    const matched = grouped.find((g) => g.chapter.slug === chapterSlug);
    const fallbackLessons: LessonRef[] = chapterDef
        ? chapterDef.lessonSlugs
              .map((slug) => refs.find((lesson) => lesson.slug === slug))
              .filter((lesson): lesson is LessonRef => Boolean(lesson))
        : [];

    const chapter = matched?.chapter ?? chapterDef;
    const chapterLessons: LessonRef[] = matched?.lessons ?? fallbackLessons;

    if (!chapter || chapterLessons.length === 0) {
        notFound();
    }

    let completed: string[] = EMPTY_PROGRESS.completedLessons;
    try {
        const user = await getUserFromSession();
        if (user?.id) {
            const progress = await getProgressForUser(user.id);
            completed = progress.completedLessons;
        }
    } catch {
        completed = EMPTY_PROGRESS.completedLessons;
    }

    const lessons: ChapterLessonRow[] = chapterLessons.map((lesson) => {
        const first = allLessons.find((row) => row.slug === lesson.slug)?.sections[0];
        const fallbackTeaser = first?.text?.[0] || first?.title || "";
        return {
            id: lesson.id,
            slug: lesson.slug,
            title: lessonDisplayTitle(lesson.slug, lesson.title),
            gradeId: lesson.gradeId,
            teaser: lessonBlurb(lesson.slug, fallbackTeaser),
        };
    });

    return (
        <ChapterOverview
            chapterSlug={chapter.slug}
            chapterTitle={chapter.title}
            completed={completed}
            lessons={lessons}
        />
    );
}
