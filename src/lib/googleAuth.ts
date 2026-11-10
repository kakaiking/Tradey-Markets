import dns from "dns";
import { prisma } from "./prisma";

// Prefer IPv4 for Google API calls — IPv6 routes often ETIMEDOUT behind VPN/home routers.
if (typeof dns.setDefaultResultOrder === "function") {
    dns.setDefaultResultOrder("ipv4first");
}

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

const GOOGLE_FETCH_TIMEOUT_MS = 12_000;
const GOOGLE_FETCH_ATTEMPTS = 3;
const GOOGLE_FETCH_BACKOFF_MS = 400;

export const GOOGLE_OAUTH_STATE_COOKIE = "google_oauth_state";

export type GoogleProfile = {
    sub: string;
    email: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
    given_name?: string;
};

/** User-facing message for transient connectivity failures talking to Google. */
export const GOOGLE_NETWORK_ERROR_MESSAGE =
    "Couldn't reach Google. Check your connection (or VPN) and try again.";

const TRANSIENT_NETWORK_CODES = new Set([
    "ETIMEDOUT",
    "ECONNRESET",
    "ECONNREFUSED",
    "ENOTFOUND",
    "EAI_AGAIN",
    "EPIPE",
    "UND_ERR_CONNECT_TIMEOUT",
    "UND_ERR_HEADERS_TIMEOUT",
    "UND_ERR_BODY_TIMEOUT",
    "UND_ERR_SOCKET",
    "ABORT_ERR",
]);

function collectErrorCodes(error: unknown, into = new Set<string>()): Set<string> {
    if (!error || typeof error !== "object") return into;
    const err = error as { code?: string; cause?: unknown; errors?: unknown[] };
    if (typeof err.code === "string") into.add(err.code);
    if (err.cause) collectErrorCodes(err.cause, into);
    if (Array.isArray(err.errors)) {
        for (const nested of err.errors) collectErrorCodes(nested, into);
    }
    return into;
}

export function isTransientGoogleNetworkError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;
    const message = error.message.toLowerCase();
    if (
        message.includes("fetch failed") ||
        message.includes("network") ||
        message.includes("timed out") ||
        message.includes("timeout") ||
        message.includes("aborted")
    ) {
        return true;
    }
    for (const code of collectErrorCodes(error)) {
        if (TRANSIENT_NETWORK_CODES.has(code)) return true;
    }
    return false;
}

export function toGoogleAuthUserMessage(error: unknown): string {
    if (isTransientGoogleNetworkError(error)) return GOOGLE_NETWORK_ERROR_MESSAGE;
    if (error instanceof Error && error.message) {
        // Never surface raw undici/TypeError messages in the URL.
        if (/^fetch failed$/i.test(error.message)) return GOOGLE_NETWORK_ERROR_MESSAGE;
        return error.message;
    }
    return "Google sign-in failed";
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch Google endpoints with timeout + retries for transient network blips. */
async function googleFetch(url: string, init: RequestInit = {}): Promise<Response> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= GOOGLE_FETCH_ATTEMPTS; attempt++) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), GOOGLE_FETCH_TIMEOUT_MS);

        try {
            const res = await fetch(url, {
                ...init,
                signal: controller.signal,
                // Avoid caching token/userinfo responses on the server.
                cache: "no-store",
            });
            return res;
        } catch (error) {
            lastError = error;
            const retryable = isTransientGoogleNetworkError(error);
            if (!retryable || attempt === GOOGLE_FETCH_ATTEMPTS) break;
            console.warn(
                `[googleAuth] transient fetch failure (attempt ${attempt}/${GOOGLE_FETCH_ATTEMPTS}):`,
                error instanceof Error ? error.message : error
            );
            await sleep(GOOGLE_FETCH_BACKOFF_MS * attempt);
        } finally {
            clearTimeout(timer);
        }
    }

    if (isTransientGoogleNetworkError(lastError)) {
        throw new Error(GOOGLE_NETWORK_ERROR_MESSAGE, { cause: lastError });
    }
    throw lastError instanceof Error ? lastError : new Error("Google request failed");
}

function requireGoogleConfig() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri =
        process.env.GOOGLE_REDIRECT_URI ||
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
        throw new Error("Google OAuth is not configured (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET)");
    }

    return { clientId, clientSecret, redirectUri };
}

export function createOAuthState(): string {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function buildGoogleAuthUrl(state: string): string {
    const { clientId, redirectUri } = requireGoogleConfig();
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        state,
        access_type: "online",
        prompt: "select_account",
    });
    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeGoogleCode(code: string): Promise<string> {
    const { clientId, clientSecret, redirectUri } = requireGoogleConfig();
    const res = await googleFetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
        }),
    });

    if (!res.ok) {
        const detail = await res.text();
        // Auth codes are single-use; a timed-out first attempt can leave Google
        // having consumed the code — ask the user to restart cleanly.
        if (res.status === 400 && /invalid_grant/i.test(detail)) {
            throw new Error("Google sign-in expired. Please try again.");
        }
        throw new Error(`Google token exchange failed (${res.status})`);
    }

    const data = (await res.json()) as { access_token?: string };
    if (!data.access_token) {
        throw new Error("Google token response missing access_token");
    }
    return data.access_token;
}

export async function fetchGoogleProfile(accessToken: string): Promise<GoogleProfile> {
    const res = await googleFetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
        throw new Error(`Google userinfo failed (${res.status})`);
    }

    const profile = (await res.json()) as GoogleProfile;
    if (!profile.sub || !profile.email) {
        throw new Error("Google profile missing sub or email");
    }
    return profile;
}

function sanitizeUsernameBase(raw: string): string {
    const cleaned = raw
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .replace(/^_+|_+$/g, "")
        .slice(0, 24);
    return cleaned || "trader";
}

async function uniqueUsername(preferred: string): Promise<string> {
    if (!prisma) throw new Error("Database is not connected");

    const base = sanitizeUsernameBase(preferred);
    let candidate = base;
    let n = 0;
    while (n < 50) {
        const existing = await prisma.user.findUnique({
            where: { username: candidate },
            select: { id: true },
        });
        if (!existing) return candidate;
        n += 1;
        candidate = `${base}${n}`.slice(0, 28);
    }
    return `${base}${Date.now().toString(36).slice(-4)}`;
}

/** Find-or-create user from Google profile; link googleId onto matching email. */
export async function upsertUserFromGoogle(profile: GoogleProfile) {
    if (!prisma) throw new Error("Database is not connected");

    const email = profile.email.toLowerCase().trim();
    const avatar =
        profile.picture ||
        (profile.name || email).replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() ||
        "TM";

    const byGoogle = await prisma.user.findUnique({
        where: { googleId: profile.sub },
    });
    if (byGoogle) {
        if (profile.picture && byGoogle.avatar !== profile.picture) {
            return prisma.user.update({
                where: { id: byGoogle.id },
                data: { avatar: profile.picture },
            });
        }
        return byGoogle;
    }

    const byEmail = await prisma.user.findUnique({
        where: { email },
    });
    if (byEmail) {
        return prisma.user.update({
            where: { id: byEmail.id },
            data: {
                googleId: profile.sub,
                ...(profile.picture ? { avatar: profile.picture } : {}),
            },
        });
    }

    const localPart = email.split("@")[0] || profile.given_name || "trader";
    const username = await uniqueUsername(localPart);

    return prisma.user.create({
        data: {
            username,
            email,
            googleId: profile.sub,
            passwordHash: null,
            avatar,
            tier: "FREE",
            totalXP: 0,
            currentStreak: 0,
        },
    });
}
