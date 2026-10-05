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

/** Flat colorful glyphs for explore circles. */
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
                        d="M5 8h9c.8 0 1.5.4 2 1l1 1.2 1-1.2c.5-.6 1.2-1 2-1h9v15.5c0 1.1-.9 2-2 2H19c-.8 0-1.5-.4-2-1l-1-1.2-1 1.2c-.5.6-1.2 1-2 1H7c-1.1 0-2-.9-2-2V8Z"
                        fill="var(--chalk)"
                        fillOpacity="0.2"
                    />
                    <path
                        d="M16 9.5v14.5M6.5 9h8c.6 0 1.1.2 1.5.6L17 11l1-1.4c.4-.4.9-.6 1.5-.6h8"
                        stroke="var(--chalk)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8.5 14h4.5M8.5 17.5h3.5M8.5 21h4.8"
                        stroke="var(--chalk)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M19 14h4.5M19 17.5h3.5M19 21h4.8"
                        stroke="#5b8def"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                </svg>
            );
        case "quizzes":
            return (
                <svg {...common}>
                    <rect x="7" y="5" width="18" height="22" rx="3.5" fill="var(--highlighter)" fillOpacity="0.35" />
                    <rect x="7" y="5" width="18" height="22" rx="3.5" stroke="#d4a40a" strokeWidth="1.8" />
                    <path d="M12.5 5v3M19.5 5v3" stroke="#d4a40a" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="12.2" cy="14.2" r="1.5" fill="var(--chalk)" />
                    <path d="M15.5 14.2h6" stroke="var(--ink)" strokeWidth="1.7" strokeLinecap="round" opacity="0.55" />
                    <circle cx="12.2" cy="19" r="1.5" fill="var(--pencil)" />
                    <path d="M15.5 19h4.5" stroke="var(--ink)" strokeWidth="1.7" strokeLinecap="round" opacity="0.4" />
                    <path
                        d="M11.2 23.8l1.6 1.5 3.4-3.6"
                        stroke="var(--chalk)"
                        strokeWidth="2"
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
                        y="10"
                        width="13.5"
                        height="14"
                        rx="2.5"
                        fill="#8b6bc9"
                        fillOpacity="0.55"
                        transform="rotate(-14 11.75 17)"
                    />
                    <rect
                        x="9"
                        y="8"
                        width="13.5"
                        height="14"
                        rx="2.5"
                        fill="#5b8def"
                        fillOpacity="0.7"
                        transform="rotate(6 15.75 15)"
                    />
                    <rect x="12" y="6.5" width="13.5" height="14" rx="2.5" fill="var(--highlighter)" />
                    <text
                        x="18.75"
                        y="16"
                        textAnchor="middle"
                        fill="var(--on-highlighter)"
                        fontSize="10"
                        fontWeight="800"
                        fontFamily="var(--font-tape)"
                    >
                        ?
                    </text>
                </svg>
            );
        case "charts":
            return (
                <svg {...common}>
                    <path d="M7.5 24.5h17" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
                    <path d="M10 9v13" stroke="var(--chalk)" strokeWidth="2" strokeLinecap="round" />
                    <rect x="8" y="12.5" width="4" height="6" rx="0.8" fill="var(--chalk)" />
                    <path d="M16.5 7.5v16" stroke="var(--pencil)" strokeWidth="2" strokeLinecap="round" />
                    <rect x="14.5" y="11" width="4" height="7.5" rx="0.8" fill="var(--pencil)" />
                    <path d="M23 10.5v13" stroke="#5b8def" strokeWidth="2" strokeLinecap="round" />
                    <rect x="21" y="14" width="4" height="5.5" rx="0.8" fill="#5b8def" />
                </svg>
            );
        case "calendar":
            return (
                <svg {...common}>
                    <rect x="5.5" y="8" width="21" height="18" rx="3.5" fill="#c47a2b" fillOpacity="0.2" />
                    <rect x="5.5" y="8" width="21" height="5.5" rx="3.5" fill="#c47a2b" />
                    <path d="M5.5 13.5h21" stroke="#c47a2b" strokeWidth="1.4" />
                    <path d="M11 6v4.5M21 6v4.5" stroke="#c47a2b" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="11" cy="18" r="1.4" fill="var(--chalk)" />
                    <circle cx="16" cy="18" r="1.4" fill="var(--highlighter)" />
                    <circle cx="21" cy="18" r="1.4" fill="var(--pencil)" />
                    <circle cx="11" cy="22.5" r="1.4" fill="#5b8def" />
                    <circle cx="16" cy="22.5" r="1.4" fill="#8b6bc9" />
                </svg>
            );
        case "more":
            return (
                <svg {...common}>
                    <rect x="6" y="6" width="8.5" height="8.5" rx="2.4" fill="var(--chalk)" />
                    <rect x="17.5" y="6" width="8.5" height="8.5" rx="2.4" fill="#5b8def" />
                    <rect x="6" y="17.5" width="8.5" height="8.5" rx="2.4" fill="var(--pencil)" />
                    <rect x="17.5" y="17.5" width="8.5" height="8.5" rx="2.4" fill="var(--highlighter)" />
                    <path
                        d="M20.2 21.75h3.1M21.75 20.2v3.1"
                        stroke="var(--on-highlighter)"
                        strokeWidth="1.7"
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
