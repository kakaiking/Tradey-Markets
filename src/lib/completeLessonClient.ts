import { cachedJson, invalidateClientCache } from "@/lib/clientCache";

export const COMPLETED_LESSONS_KEY = "tradey-markets-completed-lessons";

function readGuestCompleted(): Set<string> {
    if (typeof window === "undefined") return new Set();
    try {
        const raw = localStorage.getItem(COMPLETED_LESSONS_KEY);
        if (!raw) return new Set();
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return new Set();
        return new Set(parsed.filter((v): v is string => typeof v === "string"));
    } catch {
        return new Set();
    }
}

function writeGuestCompleted(values: Set<string>): void {
    localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify([...values]));
}

/** Guest-local completed lesson slugs (client only). */
export function getGuestCompletedLessons(): string[] {
    return [...readGuestCompleted()];
}

/** Merge SSR/server completed with guest localStorage (deduped). */
export function mergeCompletedLists(...lists: (string[] | undefined)[]): string[] {
    const set = new Set<string>();
    for (const list of lists) {
        if (!list) continue;
        for (const slug of list) {
            if (slug) set.add(slug);
        }
    }
    return [...set];
}

/**
 * Mark a lesson complete. Signed-in users hit POST /api/user/progress;
 * guests persist to localStorage. Always invalidates progress caches.
 */
export async function completeLesson(opts: {
    gradeId: string;
    lessonSlug: string;
}): Promise<{ ok: boolean; completedLessons: string[] }> {
    const { gradeId, lessonSlug } = opts;

    try {
        const me = await cachedJson<{ user: unknown } | null>("auth-me", "/api/auth/me", 120_000);
        if (me?.user) {
            const res = await fetch("/api/user/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ gradeId, lessonSlug }),
            });

            invalidateClientCache("progress");
            invalidateClientCache("next-lesson");

            if (!res.ok) {
                // Fall through to guest mirror so UI still advances
                const guest = readGuestCompleted();
                guest.add(lessonSlug);
                writeGuestCompleted(guest);
                return { ok: false, completedLessons: [...guest] };
            }

            const data = (await res.json()) as { completedLessons?: string[] };
            const completed = data.completedLessons ?? [];
            // Keep guest mirror in sync for chapter hydrate edge cases
            const guest = readGuestCompleted();
            guest.add(lessonSlug);
            writeGuestCompleted(guest);
            return { ok: true, completedLessons: completed.length ? completed : [...guest] };
        }

        const guest = readGuestCompleted();
        guest.add(lessonSlug);
        writeGuestCompleted(guest);
        invalidateClientCache("progress");
        invalidateClientCache("next-lesson");
        return { ok: true, completedLessons: [...guest] };
    } catch {
        const guest = readGuestCompleted();
        guest.add(lessonSlug);
        writeGuestCompleted(guest);
        invalidateClientCache("progress");
        invalidateClientCache("next-lesson");
        return { ok: false, completedLessons: [...guest] };
    }
}
