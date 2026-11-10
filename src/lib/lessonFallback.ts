import { lessonDisplayTitle } from "@/lib/curriculumChapters";

type SeedSection = {
    title: string;
    text: string[];
    visualType?: string;
    videoUrl?: string | null;
};

type SeedLesson = {
    slug: string;
    title: string;
    sections: SeedSection[];
};

type LessonArticleData = {
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

let cachedSeed: SeedLesson[] | null = null;

function loadSeedLessons(): SeedLesson[] {
    if (cachedSeed) return cachedSeed;
    // CommonJS seed file — works from Next server runtime.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("../../seed/curriculum.js") as { lessons: SeedLesson[] };
    cachedSeed = Array.isArray(mod.lessons) ? mod.lessons : [];
    return cachedSeed;
}

/** Offline / DB-down fallback built from seed curriculum copy. */
export function getSeedLessonBySlug(
    slug: string,
    gradeId = "seed"
): LessonArticleData | null {
    const lesson = loadSeedLessons().find((row) => row.slug === slug);
    if (!lesson) return null;

    return {
        id: `seed-${lesson.slug}`,
        slug: lesson.slug,
        title: lessonDisplayTitle(lesson.slug, lesson.title),
        gradeId,
        grade: { id: gradeId, title: "Beginner" },
        sections: lesson.sections.map((section, order) => ({
            id: `seed-${lesson.slug}-${order}`,
            title: section.title,
            text: section.text,
            videoUrl: section.videoUrl ?? null,
            order,
        })),
    };
}

export function getSeedLessonRefs(gradeId = "seed") {
    return loadSeedLessons().map((lesson) => ({
        id: `seed-${lesson.slug}`,
        slug: lesson.slug,
        title: lessonDisplayTitle(lesson.slug, lesson.title),
        gradeId,
    }));
}
