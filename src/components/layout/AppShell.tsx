"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, House, MessageCircle, UserRound } from "lucide-react";

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

function isCoachActive(pathname: string) {
    return pathname.startsWith("/coach") || pathname.startsWith("/psychology");
}

function isMeActive(pathname: string) {
    return (
        pathname.startsWith("/me") ||
        pathname.startsWith("/account") ||
        pathname.startsWith("/achievements")
    );
}

const schoolLinks = [
    { href: "/", label: "Home", match: isHomeActive, icon: House },
    { href: "/quizzes", label: "Learn", match: isLearnActive, icon: BookOpen },
    { href: "/coach", label: "Coach", match: isCoachActive, icon: MessageCircle },
    { href: "/me", label: "Me", match: isMeActive, icon: UserRound },
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
                            <span className="brand-mark">Pipsology</span>
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
                            <span className="brand-mark">Pipsology Admin</span>
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
                <nav className="dock" aria-label="Admin" style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}>
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
        <div className={`app-shell${onHome ? " app-shell--home" : ""}${onReels ? " app-shell--reels" : ""}`}>
            <a className="skip" href="#main">
                Skip to main content
            </a>
            {onHome || onReels ? null : (
                <header className="site-header">
                    <div className="wrap">
                        <Link href="/" className="brand">
                            <span className="brand-mark">Pipsology</span>
                        </Link>
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
