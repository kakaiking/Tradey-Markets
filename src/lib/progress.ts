import { prisma } from "@/lib/prisma";
import { getCachedLessons } from "@/lib/catalogCache";

export type LessonResumeEntry = {
    sectionId: string;
    gradeId: string;
};

export type ProgressPayload = {
    completedLessons: string[];
    progress: Record<string, number>;
    resumes: Record<string, LessonResumeEntry>;
};

export const EMPTY_PROGRESS: ProgressPayload = {
    completedLessons: [],
    progress: {},
    resumes: {},
};

function progressFromLessons(
    lessons: { slug: string; gradeId: string }[],
    completedSlugs: string[]
): Record<string, number> {
    const lessonsByGrade: Record<string, string[]> = {};
    for (const lesson of lessons) {
        if (!lessonsByGrade[lesson.gradeId]) {
            lessonsByGrade[lesson.gradeId] = [];
        }
        lessonsByGrade[lesson.gradeId].push(lesson.slug);
    }

    const progress: Record<string, number> = {};
    for (const [gradeId, slugs] of Object.entries(lessonsByGrade)) {
        const total = slugs.length;
        if (total === 0) {
            progress[gradeId] = 0;
            continue;
        }
        const completedCount = slugs.filter((slug) => completedSlugs.includes(slug)).length;
        progress[gradeId] = Math.round((completedCount / total) * 100);
    }
    return progress;
}

/** Signed-in progress: completed rows + section resumes + catalog cache. */
export async function getProgressForUser(userId: string): Promise<ProgressPayload> {
    if (!prisma) return EMPTY_PROGRESS;

    const [completed, resumes, lessons] = await Promise.all([
        prisma.completedLesson.findMany({
            where: { userId },
            select: { lessonSlug: true },
        }),
        prisma.lessonResume.findMany({
            where: { userId },
            select: { lessonSlug: true, sectionId: true, gradeId: true },
        }),
        getCachedLessons(""),
    ]);

    const completedSlugs = completed.map((row: { lessonSlug: string }) => row.lessonSlug);
    const resumeMap: Record<string, LessonResumeEntry> = {};
    for (const row of resumes) {
        resumeMap[row.lessonSlug] = {
            sectionId: row.sectionId,
            gradeId: row.gradeId,
        };
    }

    return {
        completedLessons: completedSlugs,
        progress: progressFromLessons(lessons, completedSlugs),
        resumes: resumeMap,
    };
}

export async function upsertLessonResume(
    userId: string,
    data: { gradeId: string; lessonSlug: string; sectionId: string }
) {
    if (!prisma) return null;

    return prisma.lessonResume.upsert({
        where: {
            userId_lessonSlug: {
                userId,
                lessonSlug: data.lessonSlug,
            },
        },
        update: {
            sectionId: data.sectionId,
            gradeId: data.gradeId,
        },
        create: {
            userId,
            gradeId: data.gradeId,
            lessonSlug: data.lessonSlug,
            sectionId: data.sectionId,
        },
    });
}
