import { getCachedLessons } from "@/lib/catalogCache";
import { getUserFromSession } from "@/lib/auth";
import { EMPTY_PROGRESS, getProgressForUser, type ProgressPayload } from "@/lib/progress";
import { lessonArticleHref } from "@/lib/curriculumChapters";

export type NextLesson = {
    index: number;
    total: number;
    title: string;
    href: string;
    slug: string;
    gradeId: string;
};

type LessonRow = {
    slug: string;
    title: string;
    gradeId: string;
};

/** Seed-aligned static hero so cold Neon never leaves the card empty. */
export const STATIC_FALLBACK_LESSON: NextLesson = {
    index: 1,
    total: 28,
    title: "What Is Forex Trading?",
    href: "/learn/chapters/what-is-forex",
    slug: "what-is-forex-trading",
    gradeId: "preschool",
};

function pickNextLesson(
    lessons: LessonRow[],
    completed: string[],
    resumes: ProgressPayload["resumes"] = {}
): NextLesson | null {
    if (!lessons.length) return null;

    const nextIndex = lessons.findIndex((row) => !completed.includes(row.slug));
    const index = nextIndex === -1 ? lessons.length : nextIndex;
    const current =
        nextIndex === -1 ? lessons[lessons.length - 1] : lessons[nextIndex];
    if (!current) return null;

    const sectionId = resumes[current.slug]?.sectionId;

    return {
        index: Math.min(index + 1, lessons.length),
        total: lessons.length,
        title: current.title,
        href: lessonArticleHref(current.gradeId, current.slug, sectionId),
        slug: current.slug,
        gradeId: current.gradeId,
    };
}

/** First catalog lesson as a safe SSR fallback when progress is unavailable. */
export async function getFallbackNextLesson(): Promise<NextLesson> {
    try {
        const lessons = await getCachedLessons("");
        return pickNextLesson(lessons, []) ?? STATIC_FALLBACK_LESSON;
    } catch {
        return STATIC_FALLBACK_LESSON;
    }
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

export async function getNextLessonForRequest(): Promise<{
    lesson: NextLesson;
    progress: ProgressPayload;
}> {
    const resolved = await withTimeout(
        (async () => {
            const lessons = await getCachedLessons("");
            if (!lessons.length) {
                return { lesson: STATIC_FALLBACK_LESSON, progress: EMPTY_PROGRESS };
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

            const lesson =
                pickNextLesson(lessons, progress.completedLessons, progress.resumes) ??
                pickNextLesson(lessons, [], progress.resumes) ??
                STATIC_FALLBACK_LESSON;

            return { lesson, progress };
        })(),
        HOME_BUDGET_MS
    );

    return resolved ?? { lesson: STATIC_FALLBACK_LESSON, progress: EMPTY_PROGRESS };
}
