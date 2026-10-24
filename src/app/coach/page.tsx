import Link from "next/link";
import { Brain, MessageCircle, Sparkles, Star } from "lucide-react";
import { PageHead } from "@/components/layout/PageHead";

export default function CoachPage() {
    return (
        <div className="coach-hub">
            <PageHead
                title="Ask Coach"
                lede="Your personal tutor for questions you get stuck on — any time."
            />

            <section className="lesson-hero" style={{ marginBottom: "0.5rem" }}>
                <p className="lesson-hero-meta">Premium</p>
                <h2>Talk through a sticky idea</h2>
                <p className="lesson-hero-lede">
                    Short answers in plain language. Built for practice money, not tips.
                </p>
                <Link href="/premium" className="lesson-hero-cta">
                    Unlock Ask Coach
                </Link>
            </section>

            <ul className="hub-list">
                <li>
                    <Link href="/psychology" className="shortcut-row shortcut-row--coach">
                        <span className="shortcut-icon shortcut-icon--coach" aria-hidden>
                            <Star size={20} strokeWidth={2.25} fill="currentColor" />
                        </span>
                        <span className="shortcut-copy">
                            <strong>
                                Mindset modules <span className="premium-pill">PREMIUM</span>
                            </strong>
                            <span>Discipline, fear, and rule-following.</span>
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="/psychology" className="shortcut-row">
                        <span className="shortcut-icon shortcut-icon--practice" aria-hidden>
                            <Brain size={20} strokeWidth={2.25} />
                        </span>
                        <span className="shortcut-copy">
                            <strong>Trading psychology</strong>
                            <span>Lessons on emotions before entries.</span>
                        </span>
                    </Link>
                </li>
                <li>
                    <div className="shortcut-row" style={{ cursor: "default" }}>
                        <span className="shortcut-icon shortcut-icon--words" aria-hidden>
                            <MessageCircle size={20} strokeWidth={2.25} />
                        </span>
                        <span className="shortcut-copy">
                            <strong>Chat coming soon</strong>
                            <span>Ask Coach will open here for Premium members.</span>
                        </span>
                        <Sparkles size={18} color="var(--muted)" aria-hidden />
                    </div>
                </li>
            </ul>
        </div>
    );
}
