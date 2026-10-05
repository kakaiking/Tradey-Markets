"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, HelpCircle, Home, UserRound } from "lucide-react";

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

function isPracticeActive(pathname: string) {
    return (
        pathname.startsWith("/quizzes") ||
        pathname.startsWith("/learn/question-cards") ||
        pathname.startsWith("/learn/videos") ||
        pathname.startsWith("/tools") ||
        pathname.startsWith("/journal") ||
        pathname.startsWith("/backtester") ||
        pathname.startsWith("/charts")
    );
}

function isLearnActive(pathname: string) {
    if (isPracticeActive(pathname) || isHomeActive(pathname)) return false;
    return (
        pathname.startsWith("/learn") ||
        pathname.startsWith("/forexpedia") ||
        pathname.startsWith("/paths") ||
        pathname.startsWith("/psychology")
    );
}

function isYouActive(pathname: string) {
    return (
        pathname.startsWith("/account") ||
        pathname.startsWith("/achievements") ||
        pathname.startsWith("/premium") ||
        pathname.startsWith("/about")
    );
}

const schoolLinks = [
    { href: "/", label: "Home", match: isHomeActive, icon: Home },
    { href: "/learn", label: "Learn", match: isLearnActive, icon: BookOpen },
    { href: "/quizzes", label: "Practice", match: isPracticeActive, icon: HelpCircle },
    { href: "/account/signin", label: "You", match: isYouActive, icon: UserRound },
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
    const wide =
        onHome ||
        pathname.startsWith("/learn") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/calendar") ||
        pathname.startsWith("/charts") ||
        pathname.startsWith("/journal") ||
        pathname.startsWith("/backtester");

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
            <div className="app-shell app-shell--no-dock">
                <a className="skip" href="#main">
                    Skip to main content
                </a>
                <header className="site-header">
                    <div className="wrap">
                        <Link href="/" className="brand">
                            <span className="brand-mark">Tradey Markets</span>
                            <span className="brand-tag">Chart paper</span>
                        </Link>
                    </div>
                </header>
                <main id="main" className="app-main">
                    <div className="wrap">{children}</div>
                </main>
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
                            <span className="brand-mark">Tradey Admin</span>
                            <span className="brand-tag">Desk</span>
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
                <nav className="dock" aria-label="Admin">
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

    // school — home uses an in-page mobile header; desktop keeps the site header
    return (
        <div className={`app-shell${onHome ? " app-shell--home" : ""}`}>
            <a className="skip" href="#main">
                Skip to main content
            </a>
            <header className={onHome ? "site-header site-header--desktop-only" : "site-header"}>
                <div className="wrap">
                    <Link href="/" className="brand">
                        <span className="brand-mark">Tradey Markets</span>
                        <span className="brand-tag">Forex school</span>
                    </Link>
                    <nav className="nav nav-desktop" aria-label="Primary">
                        {schoolLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={link.match(pathname) ? "page" : undefined}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>
            <main id="main" className="app-main">
                <div
                    className={`wrap ${onHome ? "wrap--flush" : wide ? "wrap--wide" : ""}`}
                >
                    {children}
                </div>
            </main>
            <nav className="dock" aria-label="Main">
                {schoolLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            aria-current={link.match(pathname) ? "page" : undefined}
                        >
                            <Icon strokeWidth={2.25} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
