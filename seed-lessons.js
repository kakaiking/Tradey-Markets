const dns = require("dns");
const { Pool } = require("pg");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { lessons, events } = require("./seed/curriculum");
require("dotenv").config({ quiet: true });

dns.setDefaultResultOrder("ipv4first");

async function seed() {
    const connectionString =
        process.env.POSTGRES_PRISMA_URL ??
        process.env.DATABASE_URL ??
        process.env.POSTGRES_URL ??
        process.env.POSTGRES_URL_NON_POOLING;

    if (!connectionString) {
        console.error("Connection string not found in environment.");
        process.exit(1);
    }

    const pool = new Pool({
        connectionString,
        connectionTimeoutMillis: 25000,
        ssl: connectionString.includes("sslmode=disable") ? undefined : { rejectUnauthorized: false },
    });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        await prisma.$connect();
        console.log("Connected.");

        const grade = await prisma.grade.upsert({
            where: { title: "Starters" },
            update: {
                subtitle: "Pairs, pips, sessions, and who moves the market.",
                color: "#22c55e",
            },
            create: {
                title: "Starters",
                subtitle: "Pairs, pips, sessions, and who moves the market.",
                color: "#22c55e",
            },
        });

        console.log("Clearing lessons, sections, and question cards...");
        await prisma.lesson.deleteMany({});

        const slugs = lessons.map((lesson) => lesson.slug);
        const removedProgress = await prisma.completedLesson.deleteMany({
            where: { lessonSlug: { notIn: slugs } },
        });
        console.log(`Removed ${removedProgress.count} progress rows for retired lessons.`);

        console.log(`Seeding ${lessons.length} lessons...`);
        for (let i = 0; i < lessons.length; i++) {
            const lesson = lessons[i];
            const createdAt = new Date(Date.UTC(2026, 0, 6, 8, 0, i));
            await prisma.lesson.create({
                data: {
                    slug: lesson.slug,
                    title: lesson.title,
                    gradeId: grade.id,
                    createdAt,
                    sections: {
                        create: lesson.sections.map((sec, order) => ({
                            title: sec.title,
                            text: sec.text,
                            visualType: sec.visualType || "default",
                            videoUrl: sec.videoUrl,
                            order,
                            questionCards: {
                                create: (sec.questionCards || []).map((card) => ({
                                    description: card.description,
                                    question: card.question,
                                    options: card.options,
                                    correctIndex: card.correctIndex,
                                })),
                            },
                        })),
                    },
                },
            });
        }

        console.log("Replacing community events...");
        await prisma.event.deleteMany({});
        await prisma.event.createMany({ data: events });

        const [lessonCount, sectionCount, cardCount, videoCount, eventCount] = await Promise.all([
            prisma.lesson.count(),
            prisma.lessonSection.count(),
            prisma.questionCard.count(),
            prisma.lessonSection.count({ where: { videoUrl: { not: null } } }),
            prisma.event.count(),
        ]);

        console.log(
            `Seeded grade "${grade.title}" with ${lessonCount} lessons, ${sectionCount} sections, ${cardCount} question cards, ${videoCount} videos, ${eventCount} events.`
        );
    } catch (err) {
        console.error("Seed failed:", err);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

seed();
