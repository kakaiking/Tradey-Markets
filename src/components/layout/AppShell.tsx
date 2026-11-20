"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { cachedJson, invalidateClientCache } from "@/lib/clientCache";

type ShellMode = "school" | "admin" | "auth" | "bare";

function resolveMode(pathname: string): ShellMode {
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/account/")) return "auth";
    if (pathname.startsWith("/privacy") || pathname.startsWith("/terms")) return "bare";
    return "school";
}

function isHomeActive(pathname: string) {
    return pathname === "/" || pathname === "";
}

function isLearnActive(pathname: string) {
    return (
        pathname.startsWith("/learn") ||
        pathname.startsWith("/quizzes") ||
        pathname.startsWith("/forexpedia") ||
        pathname.startsWith("/paths")
    );
}

function isMeActive(pathname: string) {
    return (
        pathname.startsWith("/me") ||
        pathname.startsWith("/account") ||
        pathname.startsWith("/achievements")
    );
}

function HouseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="1.25em"
            height="1.25em"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
            <path d="M10 21v-6h4v6" />
        </svg>
    );
}

function BookIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="1.25em"
            height="1.25em"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="1.25em"
            height="1.25em"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
        </svg>
    );
}

const schoolLinks: {
    href: string;
    label: string;
    match: (pathname: string) => boolean;
    icon: () => ReactNode;
}[] = [
    { href: "/", label: "Home", match: isHomeActive, icon: HouseIcon },
    { href: "/quizzes", label: "Learn", match: isLearnActive, icon: BookIcon },
    { href: "/me", label: "Me", match: isMeActive, icon: UserIcon },
];

const adminLinks = [
    { href: "/admin", label: "Dash", exact: true },
    { href: "/admin/lessons", label: "Lessons" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/videos", label: "Videos" },
    { href: "/admin/settings", label: "Settings" },
];

function adminCurrent(pathname: string, href: string, exact?: boolean) {
    if (exact) return pathname === href || pathname === `${href}/`;
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || "/";
    const mode = resolveMode(pathname);
    const onHome = pathname === "/" || pathname === "";
    const onReels = pathname.startsWith("/learn/videos");
    const wide = pathname.startsWith("/admin");
    const [signedIn, setSignedIn] = useState(false);

    useEffect(() => {
        let active = true;
        async function loadSession() {
            try {
                invalidateClientCache("auth-me");
                const data = await cachedJson<{ user: unknown } | null>(
                    "auth-me",
                    "/api/auth/me",
                    120_000
                );
                if (active) setSignedIn(Boolean(data?.user));
            } catch {
                if (active) setSignedIn(false);
            }
        }
        void loadSession();
        return () => {
            active = false;
        };
    }, []);

    const visibleSchoolLinks = schoolLinks.filter(
        (link) => link.href !== "/me" || signedIn
    );

    if (mode === "bare") {
        return (
            <div className="app-shell app-shell--no-dock">
                <a className="skip" href="#main">
                    Skip to main content
                </a>
                <main id="main" className="app-main">
                    <div className="wrap">{children}</div>
                </main>
            </div>
        );
    }

    if (mode === "auth") {
        return (
            <div className="app-shell app-shell--no-dock app-shell--auth">
                <a className="skip" href="#main">
                    Skip to main content
                </a>
                <div id="main" className="app-main app-main--auth">
                    {children}
                </div>
            </div>
        );
    }

    if (mode === "admin") {
        return (
            <div className="app-shell">
                <a className="skip" href="#main">
                    Skip to main content
                </a>
                <header className="site-header">
                    <div className="wrap">
                        <Link href="/admin" className="brand">
                            <BrandLogo href={null} size="sm" />
                            <span className="brand-mark">Admin</span>
                        </Link>
                        <nav className="nav nav-desktop" aria-label="Admin">
                            {adminLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={
                                        adminCurrent(pathname, link.href, link.exact)
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </header>
                <main id="main" className="app-main">
                    <div className={`wrap ${wide ? "wrap--wide" : ""}`}>{children}</div>
                </main>
                <nav
                    className="dock"
                    aria-label="Admin"
                    style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}
                >
                    {adminLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            aria-current={
                                adminCurrent(pathname, link.href, link.exact) ? "page" : undefined
                            }
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        );
    }

    return (
        <div
            className={`app-shell${onHome ? " app-shell--home" : ""}${onReels ? " app-shell--reels" : ""}`}
        >
            <a className="skip" href="#main">
                Skip to main content
            </a>
            {onHome || onReels ? null : (
                <header className="site-header">
                    <div className="wrap">
                        <div className="brand">
                            <BrandLogo href="/" size="md" priority />
                        </div>
                    </div>
                </header>
            )}
            <main id="main" className="app-main">
                <div
                    className={`wrap ${onHome || onReels ? "wrap--flush" : wide ? "wrap--wide" : ""}`}
                >
                    {children}
                </div>
            </main>
            <nav
                className="dock"
                aria-label="Main"
                style={{
                    gridTemplateColumns: `repeat(${visibleSchoolLinks.length}, minmax(0, 1fr))`,
                }}
            >
                {visibleSchoolLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            aria-current={link.match(pathname) ? "page" : undefined}
                        >
                            <Icon />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
