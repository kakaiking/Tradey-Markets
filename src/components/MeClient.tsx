"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { ModeSwitch } from "@/components/ModeSwitch";
import { getPracticeCounts } from "@/lib/practiceProgress";
import { THEMES, useTheme, type Appearance } from "@/lib/theme";

type Tab = "achievements" | "personalization";

type Stats = {
    lessonsFinished: number;
    quizzesPassed: number;
    cardsPassed: number;
    totalXP: number;
    currentStreak: number;
    signedIn: boolean;
    username: string | null;
};

export function MeClient() {
    const { appearance, setAppearance } = useTheme();
    const [tab, setTab] = useState<Tab>("achievements");
    const [stats, setStats] = useState<Stats>({
        lessonsFinished: 0,
        quizzesPassed: 0,
        cardsPassed: 0,
        totalXP: 0,
        currentStreak: 0,
        signedIn: false,
        username: null,
    });

    useEffect(() => {
        let active = true;

        function loadLocal() {
            const practice = getPracticeCounts();
            if (!active) return;
            setStats((prev) => ({
                ...prev,
                quizzesPassed: practice.quizzesPassed,
                cardsPassed: practice.cardsPassed,
            }));
        }

        async function loadRemote() {
            try {
                const [progressRes, meRes] = await Promise.all([
                    fetch("/api/user/progress/", { credentials: "include" }),
                    fetch("/api/auth/me/", { credentials: "include" }),
                ]);
                const progress = progressRes.ok ? await progressRes.json() : null;
                const me = meRes.ok ? await meRes.json() : null;
                if (!active) return;

                const completed = Array.isArray(progress?.completedLessons)
                    ? progress.completedLessons.length
                    : 0;
                const user = me?.user ?? null;

                setStats((prev) => ({
                    ...prev,
                    lessonsFinished: completed,
                    totalXP: user?.totalXP ?? 0,
                    currentStreak: user?.currentStreak ?? 0,
                    signedIn: Boolean(user),
                    username: user?.username ?? null,
                }));
            } catch {
                /* keep local counts */
            }
        }

        loadLocal();
        void loadRemote();

        const onPractice = () => loadLocal();
        window.addEventListener("pipsology-practice", onPractice);
        window.addEventListener("storage", onPractice);
        return () => {
            active = false;
            window.removeEventListener("pipsology-practice", onPractice);
            window.removeEventListener("storage", onPractice);
        };
    }, []);

    function onTheme(next: Appearance) {
        setAppearance(next);
    }

    return (
        <div className="me-screen">
            <header className="me-head">
                <div className="me-id">
                    <h1 className="me-title">
                        {stats.username ? stats.username : "Me"}
                    </h1>
                    <p className="me-mail">
                        {stats.signedIn
                            ? `${stats.totalXP.toLocaleString()} XP · ${stats.currentStreak}-day streak`
                            : "Your progress and look — all in one place."}
                    </p>
                </div>
            </header>

            <ModeSwitch
                label="Me"
                variant="tabs"
                value={tab}
                options={[
                    ["achievements", "Achievements"],
                    ["personalization", "Custom"],
                ]}
                onChange={setTab}
            />

            {tab === "achievements" ? (
                <section
                    className="me-panel"
                    role="tabpanel"
                    id="panel-achievements"
                    aria-labelledby="tab-achievements"
                >
                    <ul className="stat-grid" aria-label="Your achievements">
                        <li className="stat-card">
                            <p className="stat-value">{stats.lessonsFinished}</p>
                            <p className="stat-label">Lessons finished</p>
                        </li>
                        <li className="stat-card">
                            <p className="stat-value">{stats.quizzesPassed}</p>
                            <p className="stat-label">Quizzes passed</p>
                        </li>
                        <li className="stat-card">
                            <p className="stat-value">{stats.cardsPassed}</p>
                            <p className="stat-label">Question cards passed</p>
                        </li>
                    </ul>

                    {!stats.signedIn ? (
                        <Link href="/account/signin" className="shortcut-row">
                            <span
                                className="shortcut-icon shortcut-icon--practice"
                                aria-hidden
                            >
                                <LogIn size={20} strokeWidth={2.25} />
                            </span>
                            <span className="shortcut-copy">
                                <strong>Sign in</strong>
                                <span>Save progress across devices.</span>
                            </span>
                        </Link>
                    ) : null}
                </section>
            ) : null}

            {tab === "personalization" ? (
                <section
                    className="me-panel"
                    role="tabpanel"
                    id="panel-personalization"
                    aria-labelledby="tab-personalization"
                >
                    <div className="theme-grid" role="radiogroup" aria-label="Theme">
                        {THEMES.map((theme) => {
                            const selected = appearance === theme.id;
                            return (
                                <button
                                    key={theme.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    className={`theme-card${selected ? " is-selected" : ""}`}
                                    onClick={() => onTheme(theme.id)}
                                >
                                    <span
                                        className="theme-stage"
                                        style={{ background: theme.stage.bg }}
                                        aria-hidden="true"
                                    >
                                        <span
                                            className="theme-stage-bar"
                                            style={{ background: theme.stage.bar }}
                                        />
                                        <span
                                            className="theme-stage-line"
                                            style={{
                                                background: theme.stage.ink,
                                                width: "72%",
                                            }}
                                        />
                                        <span
                                            className="theme-stage-line is-mute"
                                            style={{
                                                background: theme.stage.mute,
                                                width: "46%",
                                            }}
                                        />
                                        <span
                                            className="theme-stage-dock"
                                            style={{ background: theme.stage.dock }}
                                        >
                                            <span
                                                style={{
                                                    background: theme.stage.accent,
                                                }}
                                            />
                                        </span>
                                    </span>
                                    <span className="theme-name">{theme.name}</span>
                                    <span className="theme-note">{theme.note}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>
            ) : null}
        </div>
    );
}
