export const AUTH_NEXT_COOKIE = "auth_next";

/** Allow only same-app relative paths; reject open redirects. */
export function safeNextPath(raw: string | null | undefined, fallback = "/"): string {
    if (!raw) return fallback;
    let decoded = raw;
    try {
        decoded = decodeURIComponent(raw);
    } catch {
        return fallback;
    }
    const path = decoded.trim();
    if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
        return fallback;
    }
    return path;
}
