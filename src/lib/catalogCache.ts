import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export const CATALOG_TAG = "catalog";

export const getCachedLessons = unstable_cache(
    async (gradeId: string) => {
        return prisma.lesson.findMany({
            where: gradeId ? { gradeId } : {},
            select: {
                id: true,
                slug: true,
                title: true,
                gradeId: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: "asc" },
        });
    },
    ["public-lessons"],
    { revalidate: 120, tags: [CATALOG_TAG] }
);

export const getCachedGrades = unstable_cache(
    async () => {
        return prisma.grade.findMany({
            include: {
                lessons: {
                    select: { id: true, slug: true, title: true },
                    orderBy: { createdAt: "asc" },
                },
            },
            orderBy: { createdAt: "asc" },
        });
    },
    ["public-grades"],
    { revalidate: 120, tags: [CATALOG_TAG] }
);

export const getCachedRecentLessons = unstable_cache(
    async () => {
        return prisma.lesson.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { grade: true },
        });
    },
    ["recent-lessons"],
    { revalidate: 60, tags: [CATALOG_TAG] }
);

export const getCachedLessonBySlug = unstable_cache(
    async (slug: string) => {
        return prisma.lesson.findUnique({
            where: { slug },
            select: {
                id: true,
                slug: true,
                title: true,
                gradeId: true,
                grade: { select: { id: true, title: true } },
                sections: {
                    select: {
                        id: true,
                        title: true,
                        text: true,
                        videoUrl: true,
                        order: true,
                    },
                    orderBy: { order: "asc" },
                },
            },
        });
    },
    ["public-lesson-by-slug"],
    { revalidate: 120, tags: [CATALOG_TAG] }
);

/** Lightweight list with first-section teaser for chapter overviews. */
export const getCachedLessonsWithTeasers = unstable_cache(
    async () => {
        return prisma.lesson.findMany({
            select: {
                id: true,
                slug: true,
                title: true,
                gradeId: true,
                sections: {
                    select: { title: true, text: true },
                    orderBy: { order: "asc" },
                    take: 1,
                },
            },
            orderBy: { createdAt: "asc" },
        });
    },
    ["public-lessons-teasers"],
    { revalidate: 120, tags: [CATALOG_TAG] }
);

export function invalidateCatalog() {
    revalidateTag(CATALOG_TAG, "max");
}
