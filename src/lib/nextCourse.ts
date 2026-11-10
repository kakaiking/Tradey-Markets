import { getCachedLessons } from "@/lib/catalogCache";
import { getUserFromSession } from "@/lib/auth";
import { EMPTY_PROGRESS, getProgressForUser, type ProgressPayload } from "@/lib/progress";
import {
    CURRICULUM_CHAPTERS,
    chapterHref,
    chapterStatus,
    groupLessonsByChapter,
    type ChapterStatus,
} from "@/lib/curriculumChapters";

export type NextCourse = {
    index: number;
    total: number;
    title: string;
    href: string;
    slug: string;
    status: ChapterStatus;
    doneCount: number;
    lessonCount: number;
    ctaLabel: string;
};

type LessonRow = {
    slug: string;
    title: string;
    gradeId: string;
};

/** Seed-aligned static hero so cold Neon never leaves the card empty. */
export const STATIC_FALLBACK_COURSE: NextCourse = {
    index: 1,
    total: CURRICULUM_CHAPTERS.length,
    title: CURRICULUM_CHAPTERS[0]?.title ?? "What is Forex?",
    href: chapterHref(CURRICULUM_CHAPTERS[0]?.slug ?? "what-is-forex"),
    slug: CURRICULUM_CHAPTERS[0]?.slug ?? "what-is-forex",
    status: "not_started",
    doneCount: 0,
    lessonCount: CURRICULUM_CHAPTERS[0]?.lessonSlugs.length ?? 5,
    ctaLabel: "Start course.",
};

export const STATIC_FALLBACK_COURSES: NextCourse[] = CURRICULUM_CHAPTERS.map(
    (chapter, index) => ({
        index: index + 1,
        total: CURRICULUM_CHAPTERS.length,
        title: chapter.title,
        href: chapterHref(chapter.slug),
        slug: chapter.slug,
        status: "not_started" as const,
        doneCount: 0,
        lessonCount: chapter.lessonSlugs.length,
        ctaLabel: "Start course.",
    })
);

function ctaForStatus(status: ChapterStatus): string {
    if (status === "completed") return "Review course.";
    if (status === "in_progress") return "Continue course.";
    return "Start course.";
}

export function buildCourses(
    lessons: LessonRow[],
    completed: string[]
): NextCourse[] {
    const grouped = groupLessonsByChapter(lessons).filter((group) =>
        CURRICULUM_CHAPTERS.some((chapter) => chapter.slug === group.chapter.slug)
    );
    if (!grouped.length) return [];

    return grouped.map((group, index) => {
        const slugs = group.lessons.map((lesson) => lesson.slug);
        const status = chapterStatus(slugs, completed);
        const doneCount = slugs.filter((slug) => completed.includes(slug)).length;
        return {
            index: index + 1,
            total: grouped.length,
            title: group.chapter.title,
            href: chapterHref(group.chapter.slug),
            slug: group.chapter.slug,
            status,
            doneCount,
            lessonCount: slugs.length,
            ctaLabel: ctaForStatus(status),
        } satisfies NextCourse;
    });
}

function pickNextCourse(courses: NextCourse[]): NextCourse | null {
    if (!courses.length) return null;
    return courses.find((course) => course.status !== "completed") ?? courses[courses.length - 1] ?? null;
}

const HOME_BUDGET_MS = 600;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
    return new Promise((resolve) => {
        const timer = setTimeout(() => resolve(null), ms);
        promise
            .then((value) => {
                clearTimeout(timer);
                resolve(value);
            })
            .catch(() => {
                clearTimeout(timer);
                resolve(null);
            });
    });
}

export async function getCoursesForRequest(): Promise<{
    courses: NextCourse[];
    course: NextCourse;
    progress: ProgressPayload;
}> {
    const resolved = await withTimeout(
        (async () => {
            const lessons = await getCachedLessons("");
            if (!lessons.length) {
                return {
                    courses: STATIC_FALLBACK_COURSES,
                    course: STATIC_FALLBACK_COURSE,
                    progress: EMPTY_PROGRESS,
                };
            }

            let progress: ProgressPayload = EMPTY_PROGRESS;
            try {
                const user = await getUserFromSession();
                if (user?.id) {
                    progress = await getProgressForUser(user.id);
                }
            } catch {
                progress = EMPTY_PROGRESS;
            }

            const withProgress = buildCourses(lessons, progress.completedLessons);
            const courses =
                withProgress.length > 0 ? withProgress : buildCourses(lessons, []);
            const list = courses.length > 0 ? courses : STATIC_FALLBACK_COURSES;

            return {
                courses: list,
                course: pickNextCourse(list) ?? STATIC_FALLBACK_COURSE,
                progress,
            };
        })(),
        HOME_BUDGET_MS
    );

    return (
        resolved ?? {
            courses: STATIC_FALLBACK_COURSES,
            course: STATIC_FALLBACK_COURSE,
            progress: EMPTY_PROGRESS,
        }
    );
}

export async function getNextCourseForRequest(): Promise<{
    course: NextCourse;
    progress: ProgressPayload;
}> {
    const { course, progress } = await getCoursesForRequest();
    return { course, progress };
}
