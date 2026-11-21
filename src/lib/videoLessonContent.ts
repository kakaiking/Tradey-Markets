import { prisma } from "@/lib/prisma";
import { tradingVideos } from "@/lib/data";
import {
    getQuestionCardsForLesson,
    type QuestionCard,
} from "@/lib/questionCardsData";

export type VideoLessonContent = {
    title: string;
    paragraphs: string[];
    cards: QuestionCard[];
};

export type VideoLessonContentMap = Record<string, VideoLessonContent>;

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

    let lessons: {
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
    }[] = [];

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
            })) as typeof lessons;
        } catch (err) {
            console.error("Failed to load video lesson content:", err);
        }
    }

    for (const slug of slugs) {
        const lesson = lessons.find((l) => l.slug === slug);
        const paragraphs = lesson
            ? lesson.sections.flatMap((s) =>
                  Array.isArray(s.text) ? s.text : [String(s.text || "")]
              ).filter(Boolean)
            : [];

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
            cards,
        };
    }

    return map;
}
