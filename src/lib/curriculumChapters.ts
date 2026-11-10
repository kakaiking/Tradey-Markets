export type CurriculumChapter = {
    slug: string;
    title: string;
    blurb: string;
    lessonSlugs: string[];
};

export type LessonMeta = {
    slug: string;
    /** BabyPips-style display title when it differs from the seeded short title */
    title?: string;
    blurb: string;
};

export type LessonRef = {
    id: string;
    slug: string;
    title: string;
    gradeId: string;
};

export type ChapterStatus = "not_started" | "in_progress" | "completed";

/** Short lesson blurbs matching the School of Pipsology chapter pages. */
export const LESSON_META: Record<string, LessonMeta> = {
    "what-is-forex-trading": {
        slug: "what-is-forex-trading",
        title: "What Is Forex Trading?",
        blurb:
            "Learn about this massively huge financial market where fiat currencies are traded.",
    },
    "what-is-traded-in-forex": {
        slug: "what-is-traded-in-forex",
        title: "What is Traded in Forex?",
        blurb:
            "Currencies are the name of the game. Yes, you can buy and sell currencies against each other as a short-term trade, long-term investment, or something in-between.",
    },
    "buying-and-selling-currency-pairs": {
        slug: "buying-and-selling-currency-pairs",
        title: "Buying And Selling Currency Pairs",
        blurb:
            "The first thing that you need to know about forex trading is that currencies are traded in pairs; you can’t buy or sell a currency without another.",
    },
    "forex-market-size-and-liquidity": {
        slug: "forex-market-size-and-liquidity",
        title: "Forex Market Size and Liquidity",
        blurb:
            "The Forex market is yuuuuuuuuggggeeee! And that comes with a lot of benefits for currency traders!",
    },
    "ways-to-trade-currencies": {
        slug: "ways-to-trade-currencies",
        title: "How to Trade Forex: Ways to Trade Currencies (Spot, CFDs, Futures and More)",
        blurb:
            "Some of the more popular ways that traders participate in the forex market is through the spot market, futures, options, and exchange-traded funds.",
    },
    "how-a-forex-trade-works": {
        slug: "how-a-forex-trade-works",
        title: "How Forex Trading Makes (and Loses) Money: How a Trade Works",
        blurb:
            "What is forex trading? How does forex trading work? What you need to know on how to get started in trading forex.",
    },
    "when-to-buy-or-sell": {
        slug: "when-to-buy-or-sell",
        title: "Know When to Buy or Sell a Currency Pair",
        blurb: "Let's start with the very basics. First, what drives the value of a currency?",
    },
    "what-is-a-pip": {
        slug: "what-is-a-pip",
        title: "What Is a Pip in Forex? Pips and Pipettes Explained",
        blurb:
            "You've probably heard of the terms \"pips,\" \"pipettes,\" and \"lots\" thrown around, and here we're going to explain what they are and show you how their values are calculated.",
    },
    "lot-size-in-forex": {
        slug: "lot-size-in-forex",
        title: "Lot Size in Forex: What Is a Lot? (Standard, Mini, Micro, Nano)",
        blurb:
            "How many units of currency can we trade? What size positions can we trade and what are they called?",
    },
    "what-is-a-spread": {
        slug: "what-is-a-spread",
        title: "What is a Spread in Forex Trading?",
        blurb:
            "The forex spread is the gap between a pair's bid and ask price, and it's how \"no commission\" brokers get paid. See how spreads are measured in pips.",
    },
    "bid-and-ask-price": {
        slug: "bid-and-ask-price",
        title: "Bid and Ask Price in Forex Explained (With Examples)",
        blurb: "Learn the concepts of bid and ask prices in trading.",
    },
    "forex-lingo": {
        slug: "forex-lingo",
        title: "Impress Your Date with Forex Lingo",
        blurb:
            "Wanna impress your crush? Here are some forex terms to help you wow that special someone!",
    },
    "types-of-forex-orders": {
        slug: "types-of-forex-orders",
        title: "Types of Forex Orders",
        blurb:
            "Buying and selling currencies can be simple once you know the main order types and when to use each one.",
    },
    "order-types-cheat-sheet": {
        slug: "order-types-cheat-sheet",
        title: "Trading Order Types Cheat Sheet",
        blurb:
            "A cheat sheet that covers the most common order types, their functionality, and the advantages and disadvantages of each.",
    },
    "forex-demo-account": {
        slug: "forex-demo-account",
        title: "Forex Demo Account: Practice Trading Without Risk",
        blurb:
            "Currency market behavior is constantly evolving. Trade on demo first to get a lot of the rookie mistakes out of the way before risking live capital. There are no take-backs in the real market.",
    },
    "can-you-get-rich-trading-forex": {
        slug: "can-you-get-rich-trading-forex",
        title: "Can You Get Rich By Trading Forex?",
        blurb:
            "While possible if you're a trading genius with ice in your veins and you're luckier than a lottery winner, building wealth through trading takes time and practice to build the skills and experience needed to be successful.",
    },
    "forex-trading-sessions": {
        slug: "forex-trading-sessions",
        title: "Forex Trading Sessions",
        blurb:
            "Just because the forex market is open 24 hours a day doesn't mean it's always active! See how the forex market is broken up into four major trading sessions and which ones provide the most opportunities.",
    },
    "tokyo-session": {
        slug: "tokyo-session",
        title: "When Can You Trade Forex: Tokyo Session",
        blurb:
            "Godzilla, Nintendo, and sushi! What's not to like about Tokyo?!? The Tokyo session is sometimes referred to as the Asian session, which is also the session where we start fresh every day!",
    },
    "london-session": {
        slug: "london-session",
        title: "When Can You Trade Forex: London Session",
        blurb:
            "Not only is London the home of Big Ben, David Beckham, and the Queen, but it’s also considered the forex capital of the world—raking in about 30% of all forex transactions every day!",
    },
    "new-york-session": {
        slug: "new-york-session",
        title: "When Can You Trade Forex: New York Session",
        blurb:
            "New York baby! The concrete jungle where forex dreams are made of! Just like Asia and Europe, the U.S. is considered one of the top financial centers in the world, so it definitely sees its fair share of action—and then some!",
    },
    "best-times-of-day": {
        slug: "best-times-of-day",
        title: "Best Times of Day to Trade Forex",
        blurb:
            "Trading is all about volatility and liquidity. Which times of day provide the most dynamic market action and volumes?",
    },
    "best-days-of-the-week": {
        slug: "best-days-of-the-week",
        title: "Best Days of the Week to Trade Forex",
        blurb:
            "Each trader should know when to trade and when NOT to trade. Read on to find out the best and worst times to trade.",
    },
    "forex-market-structure": {
        slug: "forex-market-structure",
        title: "Forex Market Structure",
        blurb:
            "Because there is no centralized market, tight competition between banks normally leads to having the best prices! Boo yeah!",
    },
    "who-trades-forex": {
        slug: "who-trades-forex",
        title: "Forex Market Players: Who Trades Forex?",
        blurb: "The forex market is basically comprised of five different groups.",
    },
    "retail-forex-history": {
        slug: "retail-forex-history",
        title: "Know Your Retail Forex History!",
        blurb: "Learn how retail forex trading started and other important forex history.",
    },
    "what-makes-fx-unique": {
        slug: "what-makes-fx-unique",
        title: "Why Trade Forex: Learn What Makes FX Trading Unique",
        blurb: "Why trade forex: Learn why forex is a popular starting point for beginners.",
    },
    "forex-vs-stocks": {
        slug: "forex-vs-stocks",
        title: "Forex vs. Stocks: Key Differences",
        blurb:
            "Nobody likes bullies! Good thing for us, unlike the stock market, there is no one financial institute large enough to corner the forex market!",
    },
    "forex-vs-futures": {
        slug: "forex-vs-futures",
        title: "Why Trade Forex: Forex vs. Futures",
        blurb:
            "What advantages does forex trading hold over futures trading? Is trading forex better than trading futures?",
    },
};

/** BabyPips School order: What → How → Who → When → Why */
export const CURRICULUM_CHAPTERS: CurriculumChapter[] = [
    {
        slug: "what-is-forex",
        title: "What is Forex?",
        blurb:
            "Think the stock market is huge? Think again. Learn about the LARGEST financial market in the world and how to trade in it.",
        lessonSlugs: [
            "what-is-forex-trading",
            "what-is-traded-in-forex",
            "buying-and-selling-currency-pairs",
            "forex-market-size-and-liquidity",
            "ways-to-trade-currencies",
        ],
    },
    {
        slug: "how-do-you-trade-forex",
        title: "How Do You Trade Forex?",
        blurb: "Now, it's time to learn HOW to rake in the moolah!",
        lessonSlugs: [
            "how-a-forex-trade-works",
            "when-to-buy-or-sell",
            "what-is-a-pip",
            "lot-size-in-forex",
            "what-is-a-spread",
            "bid-and-ask-price",
            "forex-lingo",
            "types-of-forex-orders",
            "order-types-cheat-sheet",
            "forex-demo-account",
            "can-you-get-rich-trading-forex",
        ],
    },
    {
        slug: "who-trades-forex",
        title: "Who Trades Forex?",
        blurb:
            "From money exchangers, to banks, to hedge fund managers, to local Joes like your Uncle Pete - everybody participates in the forex market!",
        lessonSlugs: ["forex-market-structure", "who-trades-forex", "retail-forex-history"],
    },
    {
        slug: "when-can-you-trade-forex",
        title: "When Can You Trade Forex?",
        blurb:
            "Now that you know who participates in the forex market, it's time to learn when you can trade!",
        lessonSlugs: [
            "forex-trading-sessions",
            "tokyo-session",
            "london-session",
            "new-york-session",
            "best-times-of-day",
            "best-days-of-the-week",
        ],
    },
    {
        slug: "why-trade-forex",
        title: "Why Trade Forex?",
        blurb:
            "Want to know some reasons why traders love the forex market? Read on to find out what makes it so attractive!",
        lessonSlugs: ["what-makes-fx-unique", "forex-vs-stocks", "forex-vs-futures"],
    },
];

const MORE_CHAPTER: CurriculumChapter = {
    slug: "more-lessons",
    title: "More lessons",
    blurb: "Additional lessons outside the core beginner chapters.",
    lessonSlugs: [],
};

export function getLessonMeta(slug: string): LessonMeta | undefined {
    return LESSON_META[slug];
}

export function lessonDisplayTitle(slug: string, fallback: string): string {
    return LESSON_META[slug]?.title ?? fallback;
}

export function lessonBlurb(slug: string, fallback = ""): string {
    return LESSON_META[slug]?.blurb ?? fallback;
}

export function getChapterBySlug(chapterSlug: string): CurriculumChapter | undefined {
    return CURRICULUM_CHAPTERS.find((chapter) => chapter.slug === chapterSlug);
}

export function getChapterForLessonSlug(lessonSlug: string): CurriculumChapter | undefined {
    return CURRICULUM_CHAPTERS.find((chapter) => chapter.lessonSlugs.includes(lessonSlug));
}

export function groupLessonsByChapter<T extends { slug: string }>(
    lessons: T[]
): { chapter: CurriculumChapter; lessons: T[] }[] {
    const used = new Set<string>();
    const groups = CURRICULUM_CHAPTERS.map((chapter) => {
        const items = chapter.lessonSlugs
            .map((slug) => lessons.find((lesson) => lesson.slug === slug))
            .filter((lesson): lesson is T => Boolean(lesson));
        items.forEach((lesson) => used.add(lesson.slug));
        return { chapter, lessons: items };
    }).filter((group) => group.lessons.length > 0);

    const rest = lessons.filter((lesson) => !used.has(lesson.slug));
    if (rest.length > 0) {
        groups.push({
            chapter: { ...MORE_CHAPTER, lessonSlugs: rest.map((lesson) => lesson.slug) },
            lessons: rest,
        });
    }

    return groups;
}

export function chapterStatus(
    lessonSlugs: string[],
    completed: string[]
): ChapterStatus {
    if (lessonSlugs.length === 0) return "not_started";
    const done = lessonSlugs.filter((slug) => completed.includes(slug)).length;
    if (done === 0) return "not_started";
    if (done >= lessonSlugs.length) return "completed";
    return "in_progress";
}

export function firstIncompleteSlug(
    lessonSlugs: string[],
    completed: string[]
): string | undefined {
    return lessonSlugs.find((slug) => !completed.includes(slug)) ?? lessonSlugs[0];
}

export function getAdjacentLesson(
    lessonSlug: string,
    orderedLessons: LessonRef[]
): { prev: LessonRef | null; next: LessonRef | null } {
    const index = orderedLessons.findIndex((lesson) => lesson.slug === lessonSlug);
    if (index === -1) return { prev: null, next: null };
    return {
        prev: index > 0 ? orderedLessons[index - 1] : null,
        next: index < orderedLessons.length - 1 ? orderedLessons[index + 1] : null,
    };
}

export function getAdjacentChapter(
    chapterSlug: string
): { prev: CurriculumChapter | null; next: CurriculumChapter | null } {
    const index = CURRICULUM_CHAPTERS.findIndex((chapter) => chapter.slug === chapterSlug);
    if (index === -1) {
        if (chapterSlug === MORE_CHAPTER.slug) {
            const last = CURRICULUM_CHAPTERS[CURRICULUM_CHAPTERS.length - 1] ?? null;
            return { prev: last, next: null };
        }
        return { prev: null, next: null };
    }
    return {
        prev: index > 0 ? CURRICULUM_CHAPTERS[index - 1] : null,
        next: index < CURRICULUM_CHAPTERS.length - 1 ? CURRICULUM_CHAPTERS[index + 1] : null,
    };
}

export function chapterHref(chapterSlug: string): string {
    return `/learn/chapters/${chapterSlug}`;
}

/** Flat catalog order: chapter order, then any leftover lessons. */
export function orderedCatalogLessons(lessons: LessonRef[]): LessonRef[] {
    return groupLessonsByChapter(lessons).flatMap((group) => group.lessons);
}

export function lessonArticleHref(
    gradeId: string,
    slug: string,
    sectionId?: string | null
): string {
    const base = `/learn/${gradeId}/${slug}`;
    if (!sectionId) return base;
    return `${base}#${sectionId}`;
}

export function estimateReadMinutes(sections: { text: string[] }[]): number {
    const words = sections.reduce(
        (sum, section) =>
            sum +
            section.text.reduce(
                (inner, paragraph) => inner + paragraph.trim().split(/\s+/).filter(Boolean).length,
                0
            ),
        0
    );
    return Math.max(1, Math.ceil(words / 200));
}
