"use client";

import Link from "next/link";
import { Bell, Brain, NotebookPen } from "lucide-react";

type ExploreKind = "lessons" | "quizzes" | "cards" | "charts" | "calendar" | "more";

const exploreItems: {
    href: string;
    label: string;
    kind: ExploreKind;
    badge?: string;
}[] = [
    { href: "/learn", label: "Lessons", kind: "lessons", badge: "+" },
    { href: "/quizzes", label: "Quizzes", kind: "quizzes" },
    { href: "/learn/question-cards", label: "Cards", kind: "cards" },
    { href: "/charts", label: "Charts", kind: "charts" },
    { href: "/calendar", label: "Calendar", kind: "calendar" },
    { href: "/tools", label: "More", kind: "more" },
];

const highlights = [
    {
        href: "/learn",
        title: "Forex foundations",
        description: "Pairs, pips, and lots — open Grade 1 and start clean.",
        tags: ["Pairs", "Pips", "Lots"],
        visual: "foundations" as const,
    },
    {
        href: "/learn/question-cards",
        title: "Practice cards",
        description: "Short drills that stick. Flip, answer, lock it in.",
        tags: ["Drill", "Recall", "Daily"],
        visual: "cards" as const,
    },
    {
        href: "/psychology",
        title: "Trader psychology",
        description: "Rules for risk, tilt, and staying flat when you should.",
        tags: ["Mindset", "Risk"],
        visual: "psych" as const,
    },
    {
        href: "/calendar",
        title: "Session clock",
        description: "See which desk is open before you open a chart.",
        tags: ["London", "NY", "Tokyo"],
        visual: "session" as const,
    },
    {
        href: "/journal",
        title: "Trade journal",
        description: "Log the setup, not the story. Review what you actually did.",
        tags: ["Review", "Notes"],
        visual: "journal" as const,
    },
];

/** Desk-stamp glyphs — chalkboard cuts, not generic line icons. */
function ExploreGlyph({ kind }: { kind: ExploreKind }) {
    const common = {
        viewBox: "0 0 32 32",
        fill: "none",
        "aria-hidden": true as const,
        className: "explore-glyph",
    };

    switch (kind) {
        case "lessons":
            return (
                <svg {...common}>
                    <path
                        d="M5 7.5h9.2c.7 0 1.3.3 1.8.8L17 9.5l1-1.2c.5-.5 1.1-.8 1.8-.8H29v16.2c0 1-.8 1.8-1.8 1.8H18.8c-.7 0-1.3-.3-1.8-.8L17 24l-1 1.2c-.5.5-1.1.8-1.8.8H6.8c-1 0-1.8-.8-1.8-1.8V7.5Z"
                        fill="currentColor"
                        fillOpacity="0.14"
                    />
                    <path
                        d="M16 9.2v15.3M6.2 8.2h8.4c.6 0 1.1.2 1.4.6L17 10.2l1-1.4c.3-.4.8-.6 1.4-.6h8.4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8.2 13.5h5.2M8.2 17h4.2M8.2 20.5h5.6"
                        stroke="var(--chalk)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                    <path
                        d="M18.6 13.5h5.2M18.6 17h4.2M18.6 20.5h5.6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.45"
                    />
                </svg>
            );
        case "quizzes":
            return (
                <svg {...common}>
                    <rect
                        x="6.2"
                        y="5.5"
                        width="19.6"
                        height="21"
                        rx="3.2"
                        fill="currentColor"
                        fillOpacity="0.12"
                        stroke="currentColor"
                        strokeWidth="1.7"
                    />
                    <path
                        d="M12.2 5.5v3.2M19.8 5.5v3.2"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                    />
                    <circle cx="12.2" cy="14.8" r="1.35" fill="var(--highlighter)" />
                    <path
                        d="M15.4 14.8h6.2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                    <circle cx="12.2" cy="19.4" r="1.35" fill="currentColor" fillOpacity="0.35" />
                    <path
                        d="M15.4 19.4h4.6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        opacity="0.45"
                    />
                    <path
                        d="M11.1 23.6l1.5 1.4 3.2-3.4"
                        stroke="var(--chalk)"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        case "cards":
            return (
                <svg {...common}>
                    <rect
                        x="5"
                        y="9.5"
                        width="14"
                        height="14"
                        rx="2.4"
                        fill="currentColor"
                        fillOpacity="0.1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        transform="rotate(-12 12 16.5)"
                    />
                    <rect
                        x="8.5"
                        y="8"
                        width="14"
                        height="14"
                        rx="2.4"
                        fill="currentColor"
                        fillOpacity="0.14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        transform="rotate(4 15.5 15)"
                    />
                    <rect
                        x="11.5"
                        y="7"
                        width="14"
                        height="14"
                        rx="2.4"
                        fill="var(--raised)"
                        stroke="currentColor"
                        strokeWidth="1.7"
                    />
                    <text
                        x="18.5"
                        y="16.2"
                        textAnchor="middle"
                        fill="var(--highlighter)"
                        fontSize="9"
                        fontWeight="700"
                        fontFamily="var(--font-tape)"
                    >
                        ?
                    </text>
                </svg>
            );
        case "charts":
            return (
                <svg {...common}>
                    <path
                        d="M8 22.5V12.2M12.4 22.5V9.5M16.8 22.5V14.2M21.2 22.5V11"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        opacity="0.28"
                    />
                    <path
                        d="M10.2 8.2v11.2"
                        stroke="var(--chalk)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                    <rect x="8.4" y="11.5" width="3.6" height="5.4" rx="0.7" fill="var(--chalk)" />
                    <path
                        d="M18.4 10.5v11"
                        stroke="var(--pencil)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                    <rect x="16.6" y="14.2" width="3.6" height="4.6" rx="0.7" fill="var(--pencil)" />
                    <path
                        d="M6.5 24.2h19"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.35"
                    />
                </svg>
            );
        case "calendar":
            return (
                <svg {...common}>
                    <rect
                        x="6"
                        y="8"
                        width="20"
                        height="17.5"
                        rx="3"
                        fill="currentColor"
                        fillOpacity="0.1"
                        stroke="currentColor"
                        strokeWidth="1.7"
                    />
                    <path
                        d="M6 12.8h20"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                    <path
                        d="M11.2 6.2v3.4M20.8 6.2v3.4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                    />
                    <circle cx="11.2" cy="17.2" r="1.2" fill="currentColor" opacity="0.35" />
                    <circle cx="16" cy="17.2" r="1.2" fill="currentColor" opacity="0.35" />
                    <circle cx="20.8" cy="17.2" r="1.55" fill="var(--highlighter)" />
                    <circle cx="11.2" cy="21.4" r="1.2" fill="currentColor" opacity="0.25" />
                    <circle cx="16" cy="21.4" r="1.2" fill="var(--chalk)" />
                </svg>
            );
        case "more":
            return (
                <svg {...common}>
                    <rect
                        x="6.2"
                        y="6.2"
                        width="8.2"
                        height="8.2"
                        rx="2.2"
                        fill="currentColor"
                        fillOpacity="0.12"
                        stroke="currentColor"
                        strokeWidth="1.6"
                    />
                    <rect
                        x="17.6"
                        y="6.2"
                        width="8.2"
                        height="8.2"
                        rx="2.2"
                        fill="currentColor"
                        fillOpacity="0.12"
                        stroke="currentColor"
                        strokeWidth="1.6"
                    />
                    <rect
                        x="6.2"
                        y="17.6"
                        width="8.2"
                        height="8.2"
                        rx="2.2"
                        fill="currentColor"
                        fillOpacity="0.12"
                        stroke="currentColor"
                        strokeWidth="1.6"
                    />
                    <rect
                        x="17.6"
                        y="17.6"
                        width="8.2"
                        height="8.2"
                        rx="2.2"
                        fill="var(--highlighter)"
                        fillOpacity="0.85"
                        stroke="currentColor"
                        strokeWidth="1.6"
                    />
                    <path
                        d="M20.2 21.7h3M21.7 20.2v3"
                        stroke="var(--on-highlighter)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            );
    }
}

function HighlightVisual({ kind }: { kind: (typeof highlights)[number]["visual"] }) {
    if (kind === "foundations") {
        return (
            <div className="hl-visual hl-visual--foundations" aria-hidden>
                <span className="hl-candle hl-candle--up" />
                <span className="hl-candle hl-candle--down" />
                <span className="hl-candle hl-candle--up tall" />
                <span className="hl-coin">Fx</span>
            </div>
        );
    }
    if (kind === "cards") {
        return (
            <div className="hl-visual hl-visual--cards" aria-hidden>
                <span className="hl-card-stack back" />
                <span className="hl-card-stack mid" />
                <span className="hl-card-stack front">?</span>
            </div>
        );
    }
    if (kind === "psych") {
        return (
            <div className="hl-visual hl-visual--psych" aria-hidden>
                <Brain size={72} strokeWidth={1.25} />
            </div>
        );
    }
    if (kind === "session") {
        return (
            <div className="hl-visual hl-visual--session" aria-hidden>
                <span className="hl-globe" />
                <span className="hl-orbit" />
            </div>
        );
    }
    return (
        <div className="hl-visual hl-visual--journal" aria-hidden>
            <NotebookPen size={68} strokeWidth={1.25} />
        </div>
    );
}

export default function HomePage() {
    return (
        <div className="home-app">
            <header className="home-top">
                <Link href="/alerts" className="home-icon-btn" aria-label="Alerts">
                    <Bell size={20} strokeWidth={2} />
                </Link>
            </header>

            <section className="home-explore" aria-labelledby="explore-heading">
                <h2 id="explore-heading">Explore</h2>
                <ul className="explore-grid">
                    {exploreItems.map((item) => (
                        <li key={item.href + item.label}>
                            <Link href={item.href} className="explore-item">
                                <span className={`explore-orb explore-orb--${item.kind}`}>
                                    <ExploreGlyph kind={item.kind} />
                                    {item.badge ? (
                                        <span className="explore-badge">{item.badge}</span>
                                    ) : null}
                                </span>
                                <span className="explore-label">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="home-highlights" aria-labelledby="highlights-heading">
                <h2 id="highlights-heading">Highlights</h2>
                <div className="highlights-scroller" role="list">
                    {highlights.map((card) => (
                        <Link
                            key={card.href + card.title}
                            href={card.href}
                            className="highlight-card"
                            role="listitem"
                        >
                            <HighlightVisual kind={card.visual} />
                            <div className="highlight-copy">
                                <h3>{card.title}</h3>
                                <p>{card.description}</p>
                            </div>
                            <ul className="highlight-tags">
                                {card.tags.map((tag) => (
                                    <li key={tag}>{tag}</li>
                                ))}
                            </ul>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
