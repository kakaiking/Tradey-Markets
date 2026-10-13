"use client";

import { useMemo, useState } from "react";
import {
    CandlestickChart,
    Check,
    Clock3,
    Compass,
    NotebookPen,
    Scale,
    Search,
    Sparkles,
    Calculator,
} from "lucide-react";

type Tab = "style" | "chart" | "sess" | "calc" | "rr" | "journal" | "leak" | "coach" | "check";

const tabs: { id: Tab; label: string; icon: typeof Compass }[] = [
    { id: "style", label: "My style", icon: Compass },
    { id: "chart", label: "Chart", icon: CandlestickChart },
    { id: "sess", label: "Sessions", icon: Clock3 },
    { id: "calc", label: "Size", icon: Calculator },
    { id: "rr", label: "R:R", icon: Scale },
    { id: "journal", label: "Journal", icon: NotebookPen },
    { id: "leak", label: "Leak finder", icon: Search },
    { id: "coach", label: "Coach", icon: Sparkles },
    { id: "check", label: "Checklist", icon: Check },
];

const questions = [
    ["How much time can you trade each day?", ["Under 30 min", "1–2 hours", "3–5 hours", "Full-time"]],
    ["A trade moves against you for hours. You feel…", ["Very stressed", "Uneasy", "Fine, I follow my plan", "I thrive on it"]],
    ["Your main goal?", ["Learn first", "Steady side income", "Active income", "Full-time career"]],
    ["Your experience?", ["Brand new", "Under 6 months", "6–24 months", "2+ years"]],
] as const;

const styles = [
    ["Position trader", "Weekly and Daily", "0.5–1%", "Few patient trades held for days or weeks."],
    ["Swing trader", "Daily and H4", "1%", "Hold for days and check charts once or twice a day."],
    ["Day trader", "H1 and M15", "1%", "Watch markets for hours and close trades the same day."],
    ["Scalper", "M5 and M1", "0.5%", "Fast trades. Needs focus, tight spreads, and strict discipline."],
];

const sessions = [
    ["Sydney", 21, 6],
    ["Tokyo", 0, 9],
    ["London", 7, 16],
    ["New York", 12, 21],
] as const;

const mistakes = ["Revenge trade", "No stop-loss", "Oversized", "FOMO entry", "Broke my plan", "Moved stop"];

const checklist = [
    "Higher-timeframe trend checked",
    "Support and resistance marked",
    "Entry trigger confirmed",
    "Stop-loss placed",
    "Reward at least 1:2",
    "Risk at or under 1–2% of account",
    "No major news in the next 30 min",
    "I am calm, not chasing",
];

const coach = [
    ["What is a good risk per trade?", "1–2% of the account, less while learning."],
    ["How do I handle a losing streak?", "Halve size, review the journal, and stop for the day at the daily loss limit."],
    ["Which timeframe should I use?", "Daily or H4 for direction, H1 for entries."],
    ["How much leverage is safe?", "Lower is safer. Size by stop-loss risk, not by available leverage."],
    ["When should I go live?", "After 50 demo trades, a written plan, and a readiness score of 70 or more."],
];

type Trade = { instrument: string; pnl: number; tags: string[]; note: string };

function openNow(hour: number, start: number, end: number) {
    return start < end ? hour >= start && hour < end : hour >= start || hour < end;
}

export default function AnalyzePage() {
    const [tab, setTab] = useState<Tab>("style");
    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);
    const [experience, setExperience] = useState(0);
    const [styleIndex, setStyleIndex] = useState<number | null>(null);
    const [balance, setBalance] = useState(1000);
    const [risk, setRisk] = useState(1);
    const [stop, setStop] = useState(20);
    const [pip, setPip] = useState(10);
    const [entry, setEntry] = useState(1.1);
    const [sl, setSl] = useState(1.098);
    const [tp, setTp] = useState(1.106);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [instrument, setInstrument] = useState("");
    const [pnl, setPnl] = useState(0);
    const [note, setNote] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [openCoach, setOpenCoach] = useState<number | null>(null);

    const now = useMemo(() => new Date(), []);
    const hour = now.getUTCHours();
    const riskDollars = (balance * risk) / 100;
    const lots = stop * pip ? riskDollars / (stop * pip) : 0;
    const riskDist = Math.abs(entry - sl);
    const ratio = riskDist ? Math.abs(tp - entry) / riskDist : 0;

    function answerStyle(value: number) {
        const nextScore = score + value + 1;
        const nextExp = step === 3 ? value : experience;
        if (step >= questions.length - 1) {
            let pick = Math.min(3, Math.floor((nextScore - 4) / 3.01));
            if (nextExp === 0) pick = Math.min(pick, 1);
            else if (nextExp === 1) pick = Math.min(pick, 2);
            setStyleIndex(pick);
        } else {
            setScore(nextScore);
            setExperience(nextExp);
            setStep(step + 1);
        }
    }

    function saveTrade() {
        if (!instrument.trim()) return;
        setTrades((list) => [...list, { instrument: instrument.trim(), pnl, tags, note }]);
        setInstrument("");
        setPnl(0);
        setNote("");
        setTags([]);
    }

    const leaks = mistakes
        .map((name) => {
            const matched = trades.filter((trade) => trade.tags.includes(name));
            return [name, matched.length, matched.reduce((sum, trade) => sum + trade.pnl, 0)] as const;
        })
        .filter((row) => row[1] > 0)
        .sort((a, b) => a[2] - b[2]);

    return (
        <div style={{ textAlign: "left" }}>
            <h1 className="font-display" style={{ fontSize: 26, margin: "4px 0 8px" }}>
                Analyze
            </h1>
            <div className="analyze-tabs" role="tablist">
                {tabs.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            aria-selected={tab === item.id}
                            className={`academy-pill${tab === item.id ? " on" : ""}`}
                            onClick={() => setTab(item.id)}
                        >
                            <Icon size={14} />
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {tab === "style" && styleIndex == null && (
                <div>
                    <p style={{ color: "var(--muted)" }}>
                        Question {step + 1} of {questions.length}
                    </p>
                    <h2 style={{ fontSize: 20 }}>{questions[step][0]}</h2>
                    {questions[step][1].map((option, index) => (
                        <button key={option} type="button" className="choice-card" style={{ margin: "8px 0" }} onClick={() => answerStyle(index)}>
                            <span>{option}</span>
                        </button>
                    ))}
                </div>
            )}

            {tab === "style" && styleIndex != null && (
                <div className="academy-card" style={{ textAlign: "center" }}>
                    <h2>{styles[styleIndex][0]}</h2>
                    <p style={{ color: "var(--muted)" }}>{styles[styleIndex][3]}</p>
                    <p>
                        Timeframes: {styles[styleIndex][1]}
                        <br />
                        Suggested risk: {styles[styleIndex][2]}
                    </p>
                    <button type="button" className="academy-btn" onClick={() => { setStyleIndex(null); setStep(0); setScore(0); }}>
                        Retake quiz
                    </button>
                </div>
            )}

            {tab === "chart" && (
                <div className="academy-card">
                    <h2>Chart desk</h2>
                    <p style={{ color: "var(--muted)" }}>Read structure on the live chart, then come back and size the trade.</p>
                    <a className="academy-btn" href="/charts">Open charts</a>
                </div>
            )}

            {tab === "sess" && (
                <div>
                    <p style={{ color: "var(--muted)" }}>
                        Now {now.toUTCString().slice(17, 22)} UTC
                    </p>
                    {sessions.map(([name, start, end]) => (
                        <div key={name} className="academy-card" style={{ marginBottom: 10 }}>
                            <strong>{name}</strong>{" "}
                            <span style={{ color: openNow(hour, start, end) ? "var(--ok)" : "var(--muted)" }}>
                                {openNow(hour, start, end) ? "Open" : "Closed"}
                            </span>
                            <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>
                                {String(start).padStart(2, "0")}:00 – {String(end).padStart(2, "0")}:00 UTC
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {tab === "calc" && (
                <div>
                    <label className="label">Account balance ($)</label>
                    <input className="field" type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} />
                    <label className="label">Risk per trade (%)</label>
                    <input className="field" type="number" value={risk} onChange={(e) => setRisk(Number(e.target.value))} />
                    <label className="label">Stop-loss (pips)</label>
                    <input className="field" type="number" value={stop} onChange={(e) => setStop(Number(e.target.value))} />
                    <label className="label">Pip value per 1 lot ($)</label>
                    <input className="field" type="number" value={pip} onChange={(e) => setPip(Number(e.target.value))} />
                    <div className="academy-card" style={{ marginTop: 12, background: "var(--sunken)" }}>
                        Max risk: ${riskDollars.toFixed(2)}
                        <br />
                        Position size: {lots.toFixed(2)} lots
                    </div>
                </div>
            )}

            {tab === "rr" && (
                <div>
                    <label className="label">Entry</label>
                    <input className="field" type="number" step="any" value={entry} onChange={(e) => setEntry(Number(e.target.value))} />
                    <label className="label">Stop-loss</label>
                    <input className="field" type="number" step="any" value={sl} onChange={(e) => setSl(Number(e.target.value))} />
                    <label className="label">Take-profit</label>
                    <input className="field" type="number" step="any" value={tp} onChange={(e) => setTp(Number(e.target.value))} />
                    <div className="academy-card" style={{ marginTop: 12, background: "var(--sunken)" }}>
                        R:R = 1 : {ratio.toFixed(2)}
                        <br />
                        Breakeven win rate: {ratio ? (100 / (1 + ratio)).toFixed(0) : "—"}%
                    </div>
                </div>
            )}

            {tab === "journal" && (
                <div>
                    <label className="label">Instrument</label>
                    <input className="field" value={instrument} placeholder="EUR/USD" onChange={(e) => setInstrument(e.target.value)} />
                    <label className="label">Result P/L ($)</label>
                    <input className="field" type="number" value={pnl} onChange={(e) => setPnl(Number(e.target.value))} />
                    <label className="label">Mistakes</label>
                    {mistakes.map((name) => (
                        <label key={name} style={{ display: "flex", gap: 8, margin: "6px 0" }}>
                            <input
                                type="checkbox"
                                checked={tags.includes(name)}
                                onChange={() =>
                                    setTags((list) => (list.includes(name) ? list.filter((item) => item !== name) : [...list, name]))
                                }
                            />
                            {name}
                        </label>
                    ))}
                    <label className="label">Notes</label>
                    <textarea className="field" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
                    <button type="button" className="academy-btn" style={{ marginTop: 12 }} onClick={saveTrade}>
                        Save trade
                    </button>
                    <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
                        {trades.slice().reverse().map((trade, index) => (
                            <li key={index} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                                <span>
                                    {trade.instrument}
                                    <br />
                                    <small style={{ color: "var(--muted)" }}>{trade.tags.join(", ")} {trade.note}</small>
                                </span>
                                <strong style={{ color: trade.pnl >= 0 ? "var(--ok)" : "var(--highlighter)" }}>{trade.pnl}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {tab === "leak" && (
                <div>
                    {leaks.length === 0 ? (
                        <p style={{ color: "var(--muted)" }}>Log trades in the journal and tag mistakes. This finds the habit costing the most.</p>
                    ) : (
                        <>
                            <div className="academy-card">
                                <span className="kicker">Biggest leak</span>
                                <h2>{leaks[0][0]}</h2>
                                <p>
                                    {leaks[0][1]} trade(s) · ${leaks[0][2].toFixed(2)}
                                </p>
                            </div>
                            {leaks.map((row) => (
                                <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                                    <span>{row[0]} ({row[1]})</span>
                                    <strong>${row[2].toFixed(2)}</strong>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}

            {tab === "coach" && (
                <div>
                    <p style={{ color: "var(--muted)" }}>Tap a question. Answers are written for practice, not live advice.</p>
                    {coach.map(([question, answer], index) => (
                        <div key={question}>
                            <button type="button" className="choice-card" style={{ margin: "8px 0" }} onClick={() => setOpenCoach(openCoach === index ? null : index)}>
                                <span>{question}</span>
                            </button>
                            {openCoach === index ? <div className="academy-card" style={{ background: "var(--sunken)" }}>{answer}</div> : null}
                        </div>
                    ))}
                </div>
            )}

            {tab === "check" && (
                <div>
                    {checklist.map((item) => (
                        <label key={item} style={{ display: "flex", gap: 10, margin: "10px 0" }}>
                            <input type="checkbox" />
                            {item}
                        </label>
                    ))}
                    <p style={{ color: "var(--muted)" }}>Not everything ticked? Skip the trade.</p>
                </div>
            )}
        </div>
    );
}
