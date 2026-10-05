import { achievements } from "@/lib/data";
import { PageHead } from "@/components/layout/PageHead";

const leaderboardData = [
    { rank: 1, name: "FXProTrader", xp: 12840, streak: 45, level: "Elite" },
    { rank: 2, name: "PipKing_EA", xp: 11250, streak: 32, level: "Expert" },
    { rank: 3, name: "SwingMaster_R", xp: 9870, streak: 21, level: "Expert" },
    { rank: 4, name: "YouGrindhard", xp: 7540, streak: 18, level: "Advanced" },
    { rank: 5, name: "CryptoKingdom", xp: 6920, streak: 14, level: "Advanced" },
    { rank: 6, name: "You", xp: 2450, streak: 7, level: "Intermediate", isMe: true },
];

const dailyMissions = [
    { title: "Complete 1 lesson", reward: 30, done: true },
    { title: "Log a trade in Journal", reward: 50, done: true },
    { title: "Post a comment in Forum", reward: 20, done: false },
    { title: "Run 1 backtesting session", reward: 40, done: false },
];

const userXP = 2450;
const levelMin = 1500;
const levelMax = 3000;
const pct = ((userXP - levelMin) / (levelMax - levelMin)) * 100;

export default function AchievementsPage() {
    return (
        <div>
            <PageHead
                title="Achievements"
                byline="Progression system"
                lede="Earn XP, unlock badges, and climb the leaderboard as you grow."
            />

            <div className="card" style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                <p className="kicker" style={{ marginBottom: "0.35rem" }}>Current level</p>
                <h2 className="font-display" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Intermediate</h2>
                <p className="choice-meta" style={{ marginBottom: "0.75rem" }}>{userXP.toLocaleString()} XP · 7-day streak</p>
                <div className="heat" style={{ margin: "0 auto" }}>
                    <div className="heat-fill" style={{ width: `${pct}%` }} />
                </div>
                <p className="status" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>Next: Advanced at {levelMax.toLocaleString()} XP</p>
            </div>

            <div className="split">
                <div>
                    <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>Daily missions</p>
                    <ul className="choice-list" style={{ marginBottom: "1.5rem" }}>
                        {dailyMissions.map((m) => (
                            <li key={m.title}>
                                <div className="choice-card" style={{ cursor: "default" }}>
                                    <div className="choice-copy">
                                        <strong>{m.title}</strong>
                                        <span className="choice-meta">+{m.reward} XP</span>
                                    </div>
                                    <span className={`badge ${m.done ? "badge-chalk" : ""}`}>{m.done ? "Done" : "Open"}</span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>Badges</p>
                    <ul className="choice-list">
                        {achievements.map((a) => (
                            <li key={a.id}>
                                <div className={`choice-card${a.earned ? "" : " locked"}`} style={{ cursor: "default" }}>
                                    <div className="choice-copy">
                                        <strong>{a.title}</strong>
                                        <span className="choice-meta">{a.desc} · +{a.xp} XP</span>
                                    </div>
                                    <span className={`choice-trail${a.earned ? "" : " locked"}`}>{a.earned ? "Earned" : "Locked"}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>Leaderboard</p>
                    <ul className="choice-list">
                        {leaderboardData.map((row) => (
                            <li key={row.rank}>
                                <div className="choice-card" style={{ cursor: "default", ...(row.isMe ? { background: "color-mix(in srgb, var(--highlighter) 25%, var(--raised))" } : {}) }}>
                                    <div className="choice-copy">
                                        <strong>#{row.rank} {row.name}</strong>
                                        <span className="choice-meta">{row.level} · {row.streak} day streak</span>
                                    </div>
                                    <span className="choice-trail">{row.xp.toLocaleString()} XP</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
