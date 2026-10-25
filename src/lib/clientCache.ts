const memory = new Map<string, { at: number; data: unknown }>();

function storageKey(key: string) {
    return `pips:${key}`;
}

export function readCache<T>(key: string, ttlMs: number): T | undefined {
    const now = Date.now();
    const mem = memory.get(key);
    if (mem && now - mem.at < ttlMs) return mem.data as T;

    if (typeof window === "undefined") return undefined;
    try {
        const raw = sessionStorage.getItem(storageKey(key));
        if (!raw) return undefined;
        const parsed = JSON.parse(raw) as { at: number; data: T };
        if (now - parsed.at >= ttlMs) return undefined;
        memory.set(key, parsed);
        return parsed.data;
    } catch {
        return undefined;
    }
}

export function writeCache(key: string, data: unknown) {
    const entry = { at: Date.now(), data };
    memory.set(key, entry);
    if (typeof window === "undefined") return;
    try {
        sessionStorage.setItem(storageKey(key), JSON.stringify(entry));
    } catch {
        /* quota or private mode */
    }
}

export function invalidateClientCache(prefix?: string) {
    for (const key of [...memory.keys()]) {
        if (!prefix || key.startsWith(prefix)) memory.delete(key);
    }
    if (typeof window === "undefined") return;
    try {
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
            const stored = sessionStorage.key(i);
            if (!stored?.startsWith("pips:")) continue;
            const name = stored.slice(5);
            if (!prefix || name.startsWith(prefix)) sessionStorage.removeItem(stored);
        }
    } catch {
        /* ignore */
    }
}

export async function cachedJson<T>(key: string, url: string, ttlMs = 60_000): Promise<T> {
    const hit = readCache<T>(key, ttlMs);
    if (hit !== undefined) return hit;

    const res = await fetch(url);
    if (res.status === 401) {
        writeCache(key, null);
        return null as T;
    }
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as T;
    writeCache(key, data);
    return data;
}

type GradeRow = {
    id: string;
    title?: string;
    subtitle?: string;
    [key: string]: unknown;
};
type GradePayload = { grades?: GradeRow[] };
type ProgressPayload = {
    progress?: Record<string, number>;
    completedLessons?: string[];
} | null;

export async function loadGradesWithProgress() {
    const [gradesJson, progressJson] = await Promise.all([
        cachedJson<GradePayload>("grades", "/api/grades"),
        cachedJson<ProgressPayload>("progress", "/api/user/progress").catch(() => null),
    ]);
    const progress = progressJson?.progress ?? {};
    const grades = (gradesJson?.grades ?? []).map((grade) => ({
        ...grade,
        progress: progress[grade.id] ?? 0,
    }));
    return {
        grades,
        progress,
        completedLessons: progressJson?.completedLessons ?? [],
    };
}
