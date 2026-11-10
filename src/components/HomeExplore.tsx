import Link from "next/link";
import type { ReactNode } from "react";

const exploreTools: { href: string; title: string; mark: ReactNode }[] = [
    {
        href: "/quizzes",
        title: "Learn",
        mark: (
            <svg viewBox="0 0 48 48" className="explore-mark">
                <rect x="6" y="10" width="36" height="28" rx="6" fill="#e8eef6" />
                <rect x="6" y="10" width="36" height="9" rx="6" fill="#1f6feb" />
                <circle cx="34" cy="30" r="8" fill="#e23b3b" />
                <path
                    d="M31 30.2l2 2.1 4.2-4.4"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        href: "/forexpedia",
        title: "Word book",
        mark: (
            <svg viewBox="0 0 48 48" className="explore-mark">
                <path
                    d="M10 12h14a8 8 0 0 1 8 8v16H18a8 8 0 0 0-8 8V12z"
                    fill="#f25b4a"
                />
                <path d="M24 12h14v32a8 8 0 0 0-8-8H24V12z" fill="#ff8a78" />
            </svg>
        ),
    },
    {
        href: "/analyze",
        title: "Analyze",
        mark: (
            <svg viewBox="0 0 48 48" className="explore-mark">
                <rect x="8" y="8" width="32" height="32" rx="8" fill="#0e6cb8" />
                <path
                    d="M14 30l6-8 5 4 9-12"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="34" cy="14" r="2.4" fill="#14b8a6" />
            </svg>
        ),
    },
    {
        href: "/calendar",
        title: "Calendar",
        mark: (
            <svg viewBox="0 0 48 48" className="explore-mark">
                <rect x="8" y="10" width="32" height="28" rx="7" fill="#e8eef6" />
                <rect x="8" y="10" width="32" height="9" rx="7" fill="#e23b3b" />
                <rect x="14" y="24" width="6" height="6" rx="1.5" fill="#163a78" />
                <rect x="21" y="24" width="6" height="6" rx="1.5" fill="#163a78" />
                <rect x="28" y="24" width="6" height="6" rx="1.5" fill="#14b8a6" />
            </svg>
        ),
    },
    {
        href: "/tools",
        title: "Tools",
        mark: (
            <svg viewBox="0 0 48 48" className="explore-mark">
                <rect x="8" y="8" width="32" height="32" rx="8" fill="#163a78" />
                <path
                    d="M28 16a6 6 0 0 0-8.5 8.5L14 30l4 4 5.5-5.5A6 6 0 0 0 28 16z"
                    fill="none"
                    stroke="#f5c518"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="29.5" cy="18.5" r="2" fill="#f5c518" />
            </svg>
        ),
    },
];

export function HomeExplore() {
    return (
        <section className="explore" aria-labelledby="explore-title">
            <h2 id="explore-title" className="explore-title">
                Quick actions
            </h2>
            <ul className="explore-grid">
                {exploreTools.map((row) => (
                    <li key={row.href}>
                        <Link href={row.href} className="explore-tile">
                            <span className="explore-disc" aria-hidden>
                                {row.mark}
                            </span>
                            <span className="explore-label">{row.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
