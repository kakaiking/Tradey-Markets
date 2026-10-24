import Link from "next/link";
import {
    Award,
    BarChart3,
    Bell,
    CalendarDays,
    CandlestickChart,
    Crown,
    Info,
    LogIn,
    NotebookPen,
    Wrench,
} from "lucide-react";
import { PageHead } from "@/components/layout/PageHead";

const rows = [
    {
        href: "/account/signin",
        title: "Sign in",
        subtitle: "Save progress across devices.",
        icon: LogIn,
    },
    {
        href: "/achievements",
        title: "Achievements",
        subtitle: "Badges from lessons and quizzes.",
        icon: Award,
    },
    {
        href: "/premium",
        title: "Premium",
        subtitle: "Unlock Ask Coach and more.",
        icon: Crown,
    },
    {
        href: "/analyze",
        title: "Analyze",
        subtitle: "Journal, charts, and session tools.",
        icon: BarChart3,
    },
    {
        href: "/journal",
        title: "Trade journal",
        subtitle: "Log the setup, not the story.",
        icon: NotebookPen,
    },
    {
        href: "/charts",
        title: "Charts",
        subtitle: "Practice reading price action.",
        icon: CandlestickChart,
    },
    {
        href: "/calendar",
        title: "Calendar",
        subtitle: "See which sessions are open.",
        icon: CalendarDays,
    },
    {
        href: "/tools",
        title: "Tools",
        subtitle: "Position size and risk helpers.",
        icon: Wrench,
    },
    {
        href: "/alerts",
        title: "Alerts",
        subtitle: "Reminders and announcements.",
        icon: Bell,
    },
    {
        href: "/about",
        title: "About Pipsology",
        subtitle: "Why we teach practice money only.",
        icon: Info,
    },
];

export default function MePage() {
    return (
        <div className="me-hub">
            <PageHead
                title="Me"
                lede="Your account, tools, and progress — all in one place."
            />
            <ul className="hub-list">
                {rows.map((row) => {
                    const Icon = row.icon;
                    return (
                        <li key={row.href}>
                            <Link href={row.href} className="shortcut-row">
                                <span className="shortcut-icon shortcut-icon--practice" aria-hidden>
                                    <Icon size={20} strokeWidth={2.25} />
                                </span>
                                <span className="shortcut-copy">
                                    <strong>{row.title}</strong>
                                    <span>{row.subtitle}</span>
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
