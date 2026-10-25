const QUIZ_KEY = "pipsology-quizzes-passed";
const CARD_KEY = "pipsology-cards-passed";

function readSet(key: string): Set<string> {
    if (typeof window === "undefined") return new Set();
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return new Set();
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return new Set();
        return new Set(parsed.filter((v): v is string => typeof v === "string"));
    } catch {
        return new Set();
    }
}

function writeSet(key: string, values: Set<string>): void {
    localStorage.setItem(key, JSON.stringify([...values]));
}

export function getPassedQuizzes(): string[] {
    return [...readSet(QUIZ_KEY)];
}

export function getPassedCards(): string[] {
    return [...readSet(CARD_KEY)];
}

/** Mark a quiz passed when score is at least 70%. */
export function recordQuizPass(slug: string, pct: number): void {
    if (pct < 70) return;
    const next = readSet(QUIZ_KEY);
    if (next.has(slug)) return;
    next.add(slug);
    writeSet(QUIZ_KEY, next);
    window.dispatchEvent(new Event("pipsology-practice"));
}

/** Mark a question card passed when answered correctly. */
export function recordCardPass(cardId: string): void {
    if (!cardId) return;
    const next = readSet(CARD_KEY);
    if (next.has(cardId)) return;
    next.add(cardId);
    writeSet(CARD_KEY, next);
    window.dispatchEvent(new Event("pipsology-practice"));
}

export function getPracticeCounts(): {
    quizzesPassed: number;
    cardsPassed: number;
} {
    return {
        quizzesPassed: readSet(QUIZ_KEY).size,
        cardsPassed: readSet(CARD_KEY).size,
    };
}
