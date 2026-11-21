import { prisma } from "@/lib/prisma";
import { tradingVideos } from "@/lib/data";
import { getSeedLessonBySlug } from "@/lib/lessonFallback";
import {
    getQuestionCardsForLesson,
    type QuestionCard,
} from "@/lib/questionCardsData";

export type VideoLessonSection = {
    title: string;
    paragraphs: string[];
};

export type VideoLessonContent = {
    title: string;
    paragraphs: string[];
    sections: VideoLessonSection[];
    cards: QuestionCard[];
};

export type VideoLessonContentMap = Record<string, VideoLessonContent>;

type LessonRow = {
    slug: string;
    title: string;
    sections: {
        id: string;
        title: string;
        text: string[];
        questionCards: {
            id: string;
            description: string;
            question: string;
            options: string[];
            correctIndex: number;
        }[];
    }[];
};

function normalizeSections(
    sections: { title: string; text: string[] | string }[]
): VideoLessonSection[] {
    return sections
        .map((s) => ({
            title: s.title || "",
            paragraphs: (Array.isArray(s.text) ? s.text : [String(s.text || "")]).filter(
                Boolean
            ),
        }))
        .filter((s) => s.paragraphs.length > 0 || s.title);
}

function flattenParagraphs(sections: VideoLessonSection[]): string[] {
    return sections.flatMap((s) => {
        if (s.title && s.paragraphs.length > 0) {
            return [s.title, ...s.paragraphs];
        }
        return s.paragraphs;
    });
}

export async function loadVideoLessonContent(): Promise<VideoLessonContentMap> {
    const slugs = [
        ...new Set(
            tradingVideos
                .map((v) => v.lessonSlug)
                .filter((slug): slug is string => Boolean(slug))
        ),
    ];

    const map: VideoLessonContentMap = {};

    if (slugs.length === 0) return map;

    let lessons: LessonRow[] = [];

    if (prisma) {
        try {
            lessons = (await prisma.lesson.findMany({
                where: { slug: { in: slugs } },
                select: {
                    slug: true,
                    title: true,
                    sections: {
                        orderBy: { order: "asc" },
                        select: {
                            id: true,
                            title: true,
                            text: true,
                            questionCards: true,
                        },
                    },
                },
            })) as LessonRow[];
        } catch (err) {
            console.error("Failed to load video lesson content:", err);
        }
    }

    for (const slug of slugs) {
        const dbLesson = lessons.find((l) => l.slug === slug);
        const seedLesson = !dbLesson ? getSeedLessonBySlug(slug) : null;
        const lesson = dbLesson || seedLesson;

        const sections = lesson
            ? normalizeSections(lesson.sections)
            : [];

        const paragraphs = flattenParagraphs(sections);

        const cards = getQuestionCardsForLesson(
            slug,
            lesson
                ? {
                      title: lesson.title,
                      sections: lesson.sections,
                  }
                : undefined
        );

        const videoFallback = tradingVideos.find((v) => v.lessonSlug === slug);
        map[slug] = {
            title: lesson?.title || videoFallback?.title || slug,
            paragraphs:
                paragraphs.length > 0
                    ? paragraphs
                    : videoFallback?.description
                      ? [videoFallback.description]
                      : [],
            sections:
                sections.length > 0
                    ? sections
                    : videoFallback?.description
                      ? [{ title: "", paragraphs: [videoFallback.description] }]
                      : [],
            cards,
        };
    }

    return map;
}
