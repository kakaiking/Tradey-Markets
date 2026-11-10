"use client";

import { useEffect, useState, type ReactNode } from "react";

function GoogleMark() {
    return (
        <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
            <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
            />
            <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
            />
            <path
                fill="#4CAF50"
                d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
            />
            <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.8-6.5 7.3l6.2 5.2C38.9 37.1 44 31.2 44 24c0-1.2-.1-2.3-.4-3.5z"
            />
        </svg>
    );
}

function TradeyMark({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 32 32"
            width="112"
            height="112"
            aria-hidden="true"
        >
            <rect width="32" height="32" rx="8" fill="var(--chalk)" />
            <path
                d="M11 22V10H16.5C18.433 10 20 11.567 20 13.5C20 15.433 18.433 17 16.5 17H13V22H11ZM13 15H16.5C17.3284 15 18 14.3284 18 13.5C18 12.6716 17.3284 12 16.5 12H13V15Z"
                fill="#ffffff"
            />
        </svg>
    );
}

/** Chart-tape atmosphere — school of markets, not a fake event stub. */
function AuthBrandAtmosphere() {
    return (
        <div className="auth-brand-atmosphere" aria-hidden="true">
            <div className="auth-brand-blobs" />
            <svg
                className="auth-brand-svg"
                viewBox="0 0 900 900"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
            >
                <defs>
                    <linearGradient id="auth-tape-a" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="var(--chalk)" stopOpacity="0" />
                        <stop offset="35%" stopColor="var(--chalk)" stopOpacity="0.55" />
                        <stop offset="70%" stopColor="var(--highlighter)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="var(--chalk)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="auth-tape-b" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--highlighter)" stopOpacity="0" />
                        <stop offset="45%" stopColor="var(--highlighter)" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="var(--chalk)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="auth-tape-c" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0.15" />
                        <stop offset="50%" stopColor="var(--chalk)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--highlighter)" stopOpacity="0.1" />
                    </linearGradient>
                    <radialGradient id="auth-pool" cx="50%" cy="48%" r="38%">
                        <stop offset="0%" stopColor="var(--highlighter)" stopOpacity="0.16" />
                        <stop offset="40%" stopColor="var(--chalk)" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="var(--chalk)" stopOpacity="0" />
                    </radialGradient>
                    <filter id="auth-soft" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="18" />
                    </filter>
                </defs>

                <ellipse cx="450" cy="420" rx="280" ry="220" fill="url(#auth-pool)" />

                <g className="auth-brand-drift" opacity="0.9">
                    <circle cx="120" cy="160" r="140" fill="var(--chalk)" fillOpacity="0.35" />
                    <circle cx="820" cy="120" r="170" fill="#0a0a0a" fillOpacity="0.45" />
                    <circle cx="780" cy="780" r="200" fill="var(--chalk)" fillOpacity="0.28" />
                    <circle cx="80" cy="720" r="160" fill="#0f3d28" fillOpacity="0.35" />
                    <circle cx="450" cy="820" r="110" fill="var(--highlighter)" fillOpacity="0.08" />
                </g>

                <g className="auth-brand-weave">
                    <path
                        d="M-40 210 C 160 140, 280 280, 450 240 C 640 195, 760 90, 960 150"
                        fill="none"
                        stroke="url(#auth-tape-a)"
                        strokeWidth="56"
                        strokeLinecap="round"
                    />
                    <path
                        d="M-60 520 C 140 460, 300 610, 470 560 C 660 505, 780 640, 980 580"
                        fill="none"
                        stroke="url(#auth-tape-b)"
                        strokeWidth="42"
                        strokeLinecap="round"
                    />
                    <path
                        d="M-40 760 C 200 690, 340 820, 520 740 C 700 660, 820 780, 960 720"
                        fill="none"
                        stroke="url(#auth-tape-c)"
                        strokeWidth="64"
                        strokeLinecap="round"
                    />
                </g>

                {/* Candlestick silhouettes — the school’s instrument */}
                <g fill="var(--highlighter)" fillOpacity="0.18">
                    <rect x="180" y="340" width="18" height="90" rx="2" />
                    <rect x="186" y="310" width="6" height="150" rx="1" />
                    <rect x="240" y="300" width="18" height="120" rx="2" />
                    <rect x="246" y="270" width="6" height="180" rx="1" />
                    <rect x="300" y="360" width="18" height="70" rx="2" />
                    <rect x="306" y="340" width="6" height="110" rx="1" />
                    <rect x="560" y="280" width="18" height="140" rx="2" />
                    <rect x="566" y="250" width="6" height="190" rx="1" />
                    <rect x="620" y="320" width="18" height="100" rx="2" />
                    <rect x="626" y="290" width="6" height="150" rx="1" />
                    <rect x="680" y="350" width="18" height="80" rx="2" />
                    <rect x="686" y="330" width="6" height="120" rx="1" />
                </g>

                <circle
                    cx="900"
                    cy="0"
                    r="220"
                    fill="var(--highlighter)"
                    fillOpacity="0.1"
                    filter="url(#auth-soft)"
                />
                <circle
                    cx="0"
                    cy="900"
                    r="260"
                    fill="var(--chalk)"
                    fillOpacity="0.35"
                    filter="url(#auth-soft)"
                />
            </svg>

            <div className="auth-brand-grain" />
            <div className="auth-brand-vignette" />
        </div>
    );
}

function AuthShell({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div className="auth-shell">
            <aside className="auth-brand">
                <AuthBrandAtmosphere />
                <div className="auth-brand-lockup">
                    <TradeyMark className="auth-brand-mark" />
                    <p className="auth-brand-name">Tradey Markets</p>
                </div>
            </aside>

            <main className="auth-panel">
                <div className="auth-panel-inner">
                    <h1 className="auth-panel-title">{title}</h1>
                    <div className="auth-panel-body">{children}</div>
                </div>
            </main>
        </div>
    );
}

function friendlyAuthError(raw: string): string {
    const normalized = raw.trim().toLowerCase();
    if (
        !normalized ||
        normalized === "fetch failed" ||
        normalized.includes("etimedout") ||
        normalized.includes("network") ||
        normalized.includes("timed out") ||
        normalized.includes("couldn't reach google")
    ) {
        return "Couldn't reach Google. Check your connection (or VPN) and try again.";
    }
    if (normalized === "access_denied") {
        return "Google sign-in was cancelled.";
    }
    return raw;
}

export default function SigninPage() {
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        const oauthError = new URLSearchParams(window.location.search).get("error");
        if (oauthError) {
            setError(friendlyAuthError(oauthError));
            // Drop the raw technical message from the address bar.
            const url = new URL(window.location.href);
            url.searchParams.delete("error");
            window.history.replaceState({}, "", url.pathname + url.search);
        }
    }, []);

    function continueWithGoogle() {
        setBusy(true);
        setError("");
        const next = new URLSearchParams(window.location.search).get("next");
        const qs = next ? `?next=${encodeURIComponent(next)}` : "";
        window.location.href = `/api/auth/google${qs}`;
    }

    return (
        <AuthShell title="Sign in">
            {error ? (
                <p className="error" role="alert">
                    {error}
                </p>
            ) : null}
            <button
                className="btn google auth-google"
                type="button"
                disabled={busy}
                onClick={continueWithGoogle}
            >
                {busy ? <span className="auth-google-spin" aria-hidden="true" /> : <GoogleMark />}
                {busy ? "Redirecting…" : "Continue with Google"}
            </button>
        </AuthShell>
    );
}
