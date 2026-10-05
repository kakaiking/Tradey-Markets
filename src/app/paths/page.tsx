import Link from "next/link";
import { learningPaths } from "@/lib/data";
import { PageHead } from "@/components/layout/PageHead";

const onboardingQuiz = [
    { q: "How long have you been trading?", opts: ["Complete beginner", "< 1 year", "1–3 years", "3+ years"] },
    { q: "What most interests you?", opts: ["Technical Analysis", "Fundamental Analysis", "Both equally", "Not sure yet"] },
    { q: "How much time per day?", opts: ["< 30 mins", "30–60 mins", "1–2 hours", "Full-time"] },
    { q: "Your primary goal?", opts: ["Supplement income", "Full-time trading", "Learn the basics", "Trade professionally"] },
];

export default function PathsPage() {
    return (
        <div>
            <PageHead
                title="Learning Paths"
                byline="Personalized education"
                lede="Take a 2-minute assessment or browse preset curricula built for your style."
            />

            <div className="split">
                <div className="card">
                    <p className="kicker" style={{ marginBottom: "0.5rem" }}>Find my path</p>
                    <p className="lede" style={{ fontSize: "0.95rem", marginBottom: "1rem" }}>Answer four quick questions for a suggested curriculum.</p>
                    <form style={{ display: "grid", gap: "1rem" }}>
                        {onboardingQuiz.map((item) => (
                            <div key={item.q}>
                                <label className="label">{item.q}</label>
                                <select className="field" defaultValue="">
                                    <option value="" disabled>Select…</option>
                                    {item.opts.map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                        <button type="button" className="btn">Generate my path</button>
                    </form>
                </div>

                <div>
                    <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>Browse paths</p>
                    <ul className="choice-list">
                        {learningPaths.map((path) => (
                            <li key={path.id}>
                                <Link href={`/paths/${path.id}`} className="choice-card">
                                    <div className="choice-copy">
                                        <strong>{path.title}</strong>
                                        <span className="choice-meta">{path.level} · {path.weeks} weeks</span>
                                        <span className="lede" style={{ fontSize: "0.9rem" }}>{path.desc}</span>
                                    </div>
                                    <span className="choice-trail">→</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
