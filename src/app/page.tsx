"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
    Bell,
    BookOpen,
    Calculator,
    CalendarDays,
    CandlestickChart,
    Clock3,
    Compass,
    Eye,
    EyeOff,
    HelpCircle,
    Layers,
    NotebookPen,
    Sparkles,
    UserRound,
    Wrench,
    X,
} from "lucide-react";

type ExploreKind = "lessons" | "quizzes" | "cards" | "charts" | "calendar" | "more";

const exploreItems: { href: string; label: string; kind: ExploreKind; icon: typeof BookOpen }[] = [
    { href: "/learn", label: "Lessons", kind: "lessons", icon: BookOpen },
    { href: "/quizzes", label: "Quizzes", kind: "quizzes", icon: HelpCircle },
    { href: "/learn/question-cards", label: "Cards", kind: "cards", icon: Layers },
    { href: "/charts", label: "Charts", kind: "charts", icon: CandlestickChart },
    { href: "/calendar", label: "Calendar", kind: "calendar", icon: CalendarDays },
    { href: "/tools", label: "More", kind: "more", icon: Calculator },
];

const accounts = [
    { href: "/learn", title: "Foundations", detail: "Open" },
    { href: "/paths", title: "Paths", detail: "Open" },
    { href: "/psychology", title: "Psychology", detail: "Open" },
    { href: "/forexpedia", title: "Glossary", detail: "Open" },
];

const bannerSeed = [
    {
        id: "style",
        href: "/paths",
        title: "Find your trading style",
        body: "A short path through risk, sessions, and what to study next.",
        icon: Compass,
    },
    {
        id: "journal",
        href: "/journal",
        title: "Trade journal",
        body: "Log the setup, not the story. Review what you actually did.",
        icon: NotebookPen,
    },
    {
        id: "charts",
        href: "/charts",
        title: "Chart desk",
        body: "Read structure before you size a position.",
        icon: CandlestickChart,
    },
    {
        id: "calendar",
        href: "/calendar",
        title: "Session clock",
        body: "See which desk is open before you open a chart.",
        icon: Clock3,
    },
];

const highlights = [
    {
        href: "/calendar",
        title: "Session clock",
        description: "Check London, New York, and Tokyo before the chart.",
        tags: ["London", "NY", "Tokyo"],
        icon: Clock3,
    },
    {
        href: "/journal",
        title: "Trade journal",
        description: "Log every trade and what it taught you.",
        tags: ["Win rate", "Notes"],
        icon: NotebookPen,
    },
    {
        href: "/tools",
        title: "Trading tools",
        description: "Size, reward, and the rest of the desk.",
        tags: ["Size", "Tools"],
        icon: Wrench,
    },
];

export default function HomePage() {
    const [hidden, setHidden] = useState(false);
    const [banners, setBanners] = useState(bannerSeed);
    const [dot, setDot] = useState(0);
    const score = hidden ? "••••" : "0";
    const IconEye = hidden ? EyeOff : Eye;

    const dots = useMemo(() => banners.map((b) => b.id), [banners]);

    return (
        <div className="home-app">
            <header className="home-top">
                <Link href="/account/signin" className="home-icon-btn" aria-label="You">
                    <UserRound size={18} />
                </Link>
                <Link href="/psychology" className="ask-coach">
                    <Sparkles size={16} />
                    Ask Coach
                </Link>
                <div className="home-top-actions">
                    <button
                        type="button"
                        className="home-icon-btn"
                        aria-label={hidden ? "Show score" : "Hide score"}
                        onClick={() => setHidden((v) => !v)}
                    >
                        <IconEye size={18} />
                    </button>
                    <Link href="/alerts" className="home-icon-btn" aria-label="Alerts">
                        <Bell size={18} />
                    </Link>
                </div>
            </header>

            <section className="readiness" aria-label="Trader readiness">
                <div>
                    <small className="section-kicker" style={{ margin: 0 }}>
                        Trader readiness
                    </small>
                    <div className="readiness-score">
                        {score}
                        <small>/100</small>
                    </div>
                    <small style={{ color: "var(--muted)" }}>Keep practising on demo. Aim for 70+.</small>
                </div>
                <Link href="/learn" className="academy-btn">
                    Continue
                </Link>
            </section>

            <h2 className="section-kicker">My learning accounts</h2>
            <div className="account-row">
                {accounts.map((account) => (
                    <Link key={account.href + account.title} href={account.href} className="account-card">
                        <BookOpen size={28} />
                        {account.title}
                        <strong>
                            {hidden ? "••••" : account.detail}{" "}
                            <small style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600 }}>lessons</small>
                        </strong>
                    </Link>
                ))}
            </div>

            {banners.length > 0 ? (
                <>
                    <div
                        className="banner-row"
                        onScroll={(event) => {
                            const el = event.currentTarget;
                            const child = el.firstElementChild as HTMLElement | null;
                            if (!child) return;
                            const index = Math.round(el.scrollLeft / (child.offsetWidth + 12));
                            setDot(Math.min(Math.max(index, 0), banners.length - 1));
                        }}
                    >
                        {banners.map((banner) => {
                            const Icon = banner.icon;
                            return (
                                <Link key={banner.id} href={banner.href} className="banner">
                                    <div>
                                        <h3>{banner.title}</h3>
                                        <p>{banner.body}</p>
                                    </div>
                                    <Icon size={36} />
                                    <button
                                        type="button"
                                        className="banner-x"
                                        aria-label={`Dismiss ${banner.title}`}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            setBanners((list) => list.filter((item) => item.id !== banner.id));
                                        }}
                                    >
                                        <X size={14} />
                                    </button>
                                </Link>
                            );
                        })}
                    </div>
                    <div className="banner-dots" aria-hidden>
                        {dots.map((id, index) => (
                            <i key={id} className={index === dot ? "on" : undefined} />
                        ))}
                    </div>
                </>
            ) : null}

            <section className="home-explore" aria-labelledby="explore-heading">
                <h2 id="explore-heading" className="section-kicker">
                    Explore
                </h2>
                <ul className="explore-grid">
                    {exploreItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.href + item.label}>
                                <Link href={item.href} className="explore-item">
                                    <span className={`explore-orb explore-orb--${item.kind}`}>
                                        <Icon size={28} strokeWidth={1.75} />
                                    </span>
                                    <span className="explore-label">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </section>

            <section className="academy-card" style={{ marginTop: 8 }}>
                <h3 style={{ margin: "0 0 4px" }}>What&apos;s new</h3>
                <p style={{ margin: 0, color: "var(--muted)" }}>
                    Readiness, journal, and Ask Coach. Built for risk-first practice.
                </p>
            </section>

            <section className="home-highlights" aria-labelledby="highlights-heading">
                <h2 id="highlights-heading" className="section-kicker">
                    Highlights
                </h2>
                <div className="highlights-scroller" role="list">
                    {highlights.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Link key={card.href + card.title} href={card.href} className="academy-card" role="listitem" style={{ flex: "0 0 72%" }}>
                                <h3 style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <Icon size={18} />
                                    {card.title}
                                </h3>
                                <p style={{ color: "var(--muted)" }}>{card.description}</p>
                                <ul className="tag-row">
                                    {card.tags.map((tag) => (
                                        <li key={tag}>{tag}</li>
                                    ))}
                                </ul>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>
                Educational content only, not financial advice. Practice on a demo account first.
            </p>
        </div>
    );
}
