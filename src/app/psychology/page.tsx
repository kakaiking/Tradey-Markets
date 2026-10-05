import Link from "next/link";
import { psychologyModules } from "@/lib/data";
import { PageHead } from "@/components/layout/PageHead";

const reflectionPrompts = [
    "Think of your last 3 losing trades. Write down the emotion you felt just before entering each one.",
    "What is your biggest trading fear right now? Where does that fear come from?",
    "When was the last time you broke one of your own rules? What happened as a result?",
];

export default function PsychologyPage() {
    return (
        <div>
            <PageHead
                title="Trading Psychology"
                byline="The mindset edge"
                lede="Most traders fail from mindset, not strategy. Master emotions, master your trading."
            />

            <div className="card" style={{ marginBottom: "1.5rem" }}>
                <blockquote className="font-reading" style={{ fontSize: "1.15rem", marginBottom: "0.75rem", fontStyle: "italic" }}>
                    “The most important thing in trading is to have discipline. Almost no one has it.”
                </blockquote>
                <cite className="choice-meta">— Mark Minervini</cite>
            </div>

            <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>Psychology playbook</p>
            <ul className="choice-list" style={{ marginBottom: "1.5rem" }}>
                {psychologyModules.map((mod) => (
                    <li key={mod.id}>
                        <Link href={`/psychology/${mod.slug}`} className="choice-card">
                            <div className="choice-copy">
                                <strong>{mod.title}</strong>
                                <span className="choice-meta">{mod.lessons} lessons</span>
                                <span className="lede" style={{ fontSize: "0.9rem" }}>{mod.desc}</span>
                            </div>
                            <span className="choice-trail">→</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="card">
                <p className="kicker" style={{ marginBottom: "0.75rem" }}>Daily reflection</p>
                <ul className="choice-list">
                    {reflectionPrompts.map((prompt) => (
                        <li key={prompt}>
                            <div className="choice-card" style={{ cursor: "default", gridTemplateColumns: "1fr" }}>
                                <div className="choice-copy">
                                    <span className="lede" style={{ fontSize: "0.95rem" }}>{prompt}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
