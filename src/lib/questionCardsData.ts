export interface QuestionCard {
    id: string;
    description: string;
    question: string;
    options: string[];
    correctIndex: number;
    sectionTitle?: string;
    sectionContent?: string;
}

export interface LessonQuestionCards {
    lessonSlug: string;
    cards: QuestionCard[];
}

const PREDEFINED_CARDS: Record<string, QuestionCard[]> = {
    "risk-management": [
        {
            id: "rm-card-1",
            description: "Risk management is the key to trading survival. Even with a mediocre trading strategy, proper risk management can keep your account green, while poor risk management will blow up the best strategy. The golden rule is to only risk a tiny portion of your account balance per trade (usually 1-2%).",
            question: "What is the recommended percentage of account balance a trader should risk on a single trade?",
            options: [
                "10% - 15%",
                "1% - 2%",
                "5% - 8%",
                "20%"
            ],
            correctIndex: 1
        },
        {
            id: "rm-card-2",
            description: "A Stop Loss order is an order you place with your broker to close your position once it reaches a certain price to prevent further losses. It ensures you exit a losing trade before it causes catastrophic damage to your account.",
            question: "What is the primary purpose of placing a Stop Loss order?",
            options: [
                "To lock in maximum profit automatically",
                "To increase the leverage of the trade",
                "To close a trade at a set price to prevent further losses",
                "To pay a lower commission fee to the broker"
            ],
            correctIndex: 2
        },
        {
            id: "rm-card-3",
            description: "Risk-to-Reward ratio measures the potential risk compared to the potential reward of a trade. A ratio of 1:2 means you are willing to risk $100 to make a profit of $200. Maintaining a favorable ratio allows you to be profitable even if you lose more than half of your trades.",
            question: "If a trade has a Risk-to-Reward ratio of 1:3, what does this indicate?",
            options: [
                "The trader is risking $3 to make $1 profit",
                "The trade will be successful 3 times out of 10",
                "The trader is risking $1 to make $3 profit",
                "The broker takes a 3% fee on the trade"
            ],
            correctIndex: 2
        }
    ],
    "what-is-forex": [
        {
            id: "wif-card-1",
            description: "The Forex (Foreign Exchange) market is the largest financial market in the world, where global currencies are bought and sold. It operates 24 hours a day, 5 days a week, and has a daily trading volume of over $7.5 trillion.",
            question: "What is the average daily trading volume of the global Forex market?",
            options: [
                "$1.5 billion",
                "$500 billion",
                "$7.5 trillion",
                "$10 trillion"
            ],
            correctIndex: 2
        },
        {
            id: "wif-card-2",
            description: "Currencies are always traded in pairs (e.g. EUR/USD or GBP/JPY). The first currency listed is the 'base' currency, and the second is the 'quote' currency. You buy the pair if you think the base currency will strengthen against the quote currency.",
            question: "In the EUR/USD currency pair, what is EUR referred to as?",
            options: [
                "The quote currency",
                "The base currency",
                "The margin currency",
                "The leverage currency"
            ],
            correctIndex: 1
        },
        {
            id: "wif-card-3",
            description: "Forex trading has major participants who drive price actions. These include Central Banks (who manage supply and interest rates), Commercial Banks (who facilitate trades), Hedge Funds, and Retail Traders (individual investors like you).",
            question: "Which participant is responsible for managing the money supply and interest rates in their country?",
            options: [
                "Retail Traders",
                "Commercial Banks",
                "Central Banks",
                "Hedge Funds"
            ],
            correctIndex: 2
        }
    ],
    "how-to-trade-forex": [
        {
            id: "htf-card-1",
            description: "Trading forex involves buying one currency and selling another at the same time. If you buy EUR/USD, you are buying Euros and selling US Dollars. You profit if the Euro strengthens relative to the US Dollar.",
            question: "When you buy the GBP/USD pair, what are you doing?",
            options: [
                "Buying USD and selling GBP",
                "Buying GBP and selling USD",
                "Buying both GBP and USD",
                "Selling both GBP and USD"
            ],
            correctIndex: 1
        },
        {
            id: "htf-card-2",
            description: "A 'pip' stands for 'percentage in point' or 'price interest point'. It is the smallest price move that a given exchange rate can make. For most currency pairs, a pip is the 4th decimal place (0.0001), except for Japanese Yen pairs where it is the 2nd decimal place (0.01).",
            question: "For a EUR/USD exchange rate, a move from 1.1042 to 1.1043 represents a change of:",
            options: [
                "10 pips",
                "1 pip",
                "0.1 pips",
                "100 pips"
            ],
            correctIndex: 1
        }
    ]
};

/**
 * Gets or dynamically generates question cards for a lesson.
 */
export function getQuestionCardsForLesson(lessonSlug: string, lessonData?: { title: string; sections: any[] }): QuestionCard[] {
    if (lessonData?.sections && lessonData.sections.length > 0) {
        const customCards: QuestionCard[] = [];
        lessonData.sections.forEach((section: any) => {
            if (section.questionCards && Array.isArray(section.questionCards) && section.questionCards.length > 0) {
                section.questionCards.forEach((card: any) => {
                    customCards.push({
                        id: card.id,
                        description: card.description || section.title,
                        question: card.question,
                        options: card.options,
                        correctIndex: card.correctIndex,
                        sectionTitle: section.title,
                        sectionContent: Array.isArray(section.text) ? section.text.join("\n\n") : (section.text || "")
                    });
                });
            }
        });
        if (customCards.length > 0) {
            return customCards;
        }
    }

    const predefined = PREDEFINED_CARDS[lessonSlug];
    if (predefined && predefined.length > 0) {
        return predefined;
    }

    if (!lessonData || !lessonData.sections || lessonData.sections.length === 0) {
        // Ultimate fallback if no data is loaded
        return [
            {
                id: `${lessonSlug}-fallback-1`,
                description: `${lessonData?.title || "This lesson"} teaches key concepts in forex trading, helping you build a solid foundation of technical terms, market rules, and risk management techniques.`,
                question: `What is the primary objective of studying "${lessonData?.title || "this lesson"}"?`,
                options: [
                    "To understand the core concepts and apply them to trading",
                    "To guarantee 100% win-rate on every trade",
                    "To replace your broker database settings",
                    "To memorize historical quotes without practicing"
                ],
                correctIndex: 0
            }
        ];
    }

    // Dynamic generation from section texts
    return lessonData.sections.map((section, index) => {
        const title = section.title || `Section ${index + 1}`;
        const paragraphs = Array.isArray(section.text) ? section.text : [section.text || ""];
        const description = paragraphs.join(" ").substring(0, 300) || `${title} content.`;
        
        // Generate question using templates
        let question = `Regarding "${title}", which statement is correct?`;
        let options = [
            `The concepts described in ${title} are crucial for successful trading analysis.`,
            `The information in ${title} is outdated and no longer applies to modern markets.`,
            `This section recommends trading only on weekends with maximum leverage.`,
            `Understanding ${title} is only necessary for institutional stock brokers.`
        ];
        let correctIndex = 0;

        if (index % 3 === 1) {
            question = `What is a key takeaway from the note about "${title}"?`;
            options = [
                "It has no bearing on actual market conditions.",
                `Properly analyzing ${title} helps manage risk and make informed decisions.`,
                "It advises you to risk all your capital on one trade.",
                "It is designed solely to increase broker commissions."
            ];
            correctIndex = 1;
        } else if (index % 3 === 2) {
            question = `According to the lesson's section on "${title}", why is it important?`;
            options = [
                "It teaches you how to trade with zero margin and infinite risk.",
                "It guarantees you will never experience a stop-out or margin call.",
                "It is a minor detail that can be safely ignored.",
                `It introduces core components that influence currency price movements.`
            ];
            correctIndex = 3;
        }

        return {
            id: `${lessonSlug}-dynamic-${section.id || index}`,
            description,
            question,
            options,
            correctIndex,
            sectionTitle: title,
            sectionContent: paragraphs.join("\n\n")
        };
    });
}
