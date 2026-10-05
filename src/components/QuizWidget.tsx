"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";

interface Question {
    q: string;
    options: string[];
    answer: number;
    explanation: string;
}

interface Quiz {
    slug: string;
    title: string;
    questions: Question[];
}

export function QuizWidget({ quiz }: { quiz: Quiz }) {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    const q = quiz.questions[current];

    const handleSelect = (i: number) => {
        if (answered) return;
        setSelected(i);
        setAnswered(true);
        if (i === q.answer) setScore(s => s + 1);
    };

    const next = () => {
        if (current < quiz.questions.length - 1) {
            setCurrent(c => c + 1);
            setSelected(null);
            setAnswered(false);
        } else {
            setDone(true);
        }
    };

    const reset = () => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setDone(false); };

    if (done) {
        const pct = Math.round((score / quiz.questions.length) * 100);
        return (
            <div className="card" style={{ textAlign: "center" }}>
                <p className="kicker" style={{ marginBottom: "0.5rem" }}>Quiz complete</p>
                <h3 className="font-display" style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{pct}%</h3>
                <p className="lede" style={{ marginBottom: "1.25rem" }}>{score} of {quiz.questions.length} correct</p>
                <div className="heat" style={{ margin: "0 auto 1.25rem" }}>
                    <div className="heat-fill" style={{ width: `${pct}%` }} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
                    <button type="button" onClick={reset} className="btn secondary">
                        <RotateCcw size={15} /> Try again
                    </button>
                    <Link href="/learn" className="btn chalk">
                        Continue learning <ArrowRight size={15} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span className="choice-meta">Question {current + 1} of {quiz.questions.length}</span>
                    <span className="choice-meta">{score} correct</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(current / quiz.questions.length) * 100}%` }} />
                </div>
            </div>

            <h3 className="font-display" style={{ fontSize: "1.15rem", marginBottom: "1rem", textAlign: "left" }}>{q.q}</h3>

            <ul className="choice-list" style={{ marginBottom: "1rem" }}>
                {q.options.map((opt, i) => {
                    let trail = String.fromCharCode(65 + i);
                    let extra = "";
                    if (answered) {
                        if (i === q.answer) {
                            trail = "✓";
                            extra = " active";
                        } else if (i === selected) {
                            trail = "✗";
                            extra = " locked";
                        } else {
                            extra = " locked";
                        }
                    }
                    return (
                        <li key={i}>
                            <button
                                type="button"
                                onClick={() => handleSelect(i)}
                                className={`choice-card${answered && i !== q.answer && i !== selected ? " locked" : ""}`}
                                disabled={answered && i !== q.answer && i !== selected}
                            >
                                <div className="choice-copy">
                                    <strong style={{ fontWeight: 600 }}>{opt}</strong>
                                    {answered && i === q.answer && (
                                        <span className="choice-meta" style={{ color: "var(--chalk)" }}>Correct</span>
                                    )}
                                    {answered && i === selected && i !== q.answer && (
                                        <span className="choice-meta" style={{ color: "var(--pencil)" }}>Your answer</span>
                                    )}
                                </div>
                                <span className={`choice-trail${extra}`}>
                                    {answered && i === q.answer ? <CheckCircle size={16} /> : answered && i === selected ? <XCircle size={16} /> : trail}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            {answered && (
                <div className="card" style={{ marginBottom: "1rem", background: "var(--sunken)", boxShadow: "none" }}>
                    <p className="kicker" style={{ marginBottom: "0.35rem" }}>Explanation</p>
                    <p className="lede" style={{ fontSize: "0.95rem" }}>{q.explanation}</p>
                </div>
            )}

            {answered && (
                <button type="button" onClick={next} className="btn">
                    {current < quiz.questions.length - 1 ? "Next question" : "See results"}
                </button>
            )}
        </div>
    );
}
