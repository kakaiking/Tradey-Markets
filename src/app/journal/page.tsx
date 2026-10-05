"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PageHead } from "@/components/layout/PageHead";

const trades = [
    { id: 1, date: "Mar 5", pair: "EUR/USD", dir: "BUY", entry: 1.0820, sl: 1.0790, tp: 1.0880, outcome: "WIN", pips: 60, rr: 2.0, notes: "Clean break above resistance", emotion: "Confident" },
    { id: 2, date: "Mar 4", pair: "GBP/JPY", dir: "SELL", entry: 192.80, sl: 193.20, tp: 191.80, outcome: "WIN", pips: 100, rr: 2.5, notes: "Bearish engulfing at resistance", emotion: "Patient" },
    { id: 3, date: "Mar 4", pair: "USD/CAD", dir: "BUY", entry: 1.4380, sl: 1.4350, tp: 1.4410, outcome: "LOSS", pips: -30, rr: -1.0, notes: "Premature entry before news", emotion: "FOMO" },
    { id: 4, date: "Mar 3", pair: "AUD/USD", dir: "BUY", entry: 0.6240, sl: 0.6210, tp: 0.6310, outcome: "WIN", pips: 70, rr: 2.3, notes: "Strong GDP data breakout", emotion: "Calm" },
    { id: 5, date: "Mar 2", pair: "EUR/USD", dir: "SELL", entry: 1.0930, sl: 1.0970, tp: 1.0850, outcome: "LOSS", pips: -40, rr: -1.0, notes: "Revenge trade — broke rules", emotion: "Angry" },
];

const equityCurve = [
    { day: "Feb 24", balance: 9800 }, { day: "Feb 25", balance: 10050 }, { day: "Feb 26", balance: 10180 },
    { day: "Mar 1", balance: 10120 }, { day: "Mar 2", balance: 9960 }, { day: "Mar 3", balance: 10240 },
    { day: "Mar 4", balance: 10540 }, { day: "Mar 5", balance: 10720 },
];

const aiInsights = [
    { title: "Best session", insight: "You win 74% of trades in the London session. Consider focusing there." },
    { title: "Pattern detected", insight: "Three FOMO-tagged trades in 2 weeks — all losses. Add a 5-minute wait rule." },
    { title: "Cut winners early", insight: "Average winner closes at 1.4R while losers hit 1.0R — leaving money on the table." },
    { title: "Best pair", insight: "EUR/USD is your highest-performing pair with a 68% win rate." },
];

export default function JournalPage() {
    const [showForm, setShowForm] = useState(false);
    const wins = trades.filter(t => t.outcome === "WIN").length;
    const totalPips = trades.reduce((s, t) => s + t.pips, 0);
    const avgRR = trades.filter(t => t.outcome === "WIN").reduce((s, t) => s + t.rr, 0) / wins;

    return (
        <div>
            <PageHead
                title="Trade Journal"
                byline="Performance analytics"
                lede="Log trades, spot patterns, and let AI coach your improvement."
                trail={
                    <button type="button" className="btn" style={{ width: "auto", minHeight: 44, padding: "0.5rem 1rem" }} onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Close" : "Log trade"}
                    </button>
                }
            />

            {showForm && (
                <div className="card" style={{ marginBottom: "1.5rem", display: "grid", gap: "1rem" }}>
                    <p className="kicker">New trade entry</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))", gap: "0.75rem" }}>
                        {["Currency pair", "Entry price", "Stop loss", "Take profit"].map((label) => (
                            <div key={label}>
                                <label className="label">{label}</label>
                                <input className="field" placeholder={label} />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))", gap: "0.75rem" }}>
                        <div>
                            <label className="label">Direction</label>
                            <select className="field"><option>BUY</option><option>SELL</option></select>
                        </div>
                        <div>
                            <label className="label">Outcome</label>
                            <select className="field"><option>WIN</option><option>LOSS</option><option>BREAKEVEN</option><option>Open</option></select>
                        </div>
                        <div>
                            <label className="label">Emotion</label>
                            <select className="field"><option>Calm</option><option>Confident</option><option>Patient</option><option>Anxious</option><option>FOMO</option><option>Angry</option></select>
                        </div>
                    </div>
                    <textarea className="field" rows={2} placeholder="Notes — thesis? Did you follow your rules?" />
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        <button type="button" className="btn">Save trade</button>
                    </div>
                </div>
            )}

            <div className="admin-stat-grid" style={{ marginBottom: "1.5rem" }}>
                <div className="admin-stat"><strong>{Math.round((wins / trades.length) * 100)}%</strong><span>Win rate</span></div>
                <div className="admin-stat"><strong>+{totalPips}</strong><span>Total pips</span></div>
                <div className="admin-stat"><strong>{avgRR.toFixed(1)}R</strong><span>Avg R:R</span></div>
                <div className="admin-stat"><strong>{trades.length}</strong><span>Trades logged</span></div>
            </div>

            <div className="split" style={{ marginBottom: "1.5rem" }}>
                <div className="card">
                    <p className="kicker" style={{ marginBottom: "0.75rem" }}>Equity curve</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={equityCurve}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                            <XAxis dataKey="day" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} domain={["dataMin - 100", "dataMax + 100"]} />
                            <Tooltip contentStyle={{ background: "var(--raised)", border: "2px solid var(--ink)", borderRadius: "12px", color: "var(--ink)" }} />
                            <Line type="monotone" dataKey="balance" stroke="var(--chalk)" strokeWidth={2.5} dot={{ fill: "var(--chalk)", strokeWidth: 0, r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div>
                    <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>AI insights</p>
                    <ul className="choice-list">
                        {aiInsights.map((ins) => (
                            <li key={ins.title}>
                                <div className="choice-card" style={{ cursor: "default", gridTemplateColumns: "1fr" }}>
                                    <div className="choice-copy">
                                        <strong>{ins.title}</strong>
                                        <span className="lede" style={{ fontSize: "0.9rem" }}>{ins.insight}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>Trade log</p>
            <ul className="choice-list">
                {trades.map((t) => (
                    <li key={t.id}>
                        <div className="choice-card" style={{ cursor: "default" }}>
                            <div className="choice-copy">
                                <strong>{t.pair} · {t.dir}</strong>
                                <span className="choice-meta">{t.date} · {t.emotion} · {t.notes}</span>
                            </div>
                            <span className={`choice-trail ${t.outcome === "WIN" ? "" : "locked"}`} style={t.outcome !== "WIN" ? { color: "var(--pencil)" } : undefined}>
                                {t.pips > 0 ? "+" : ""}{t.pips} · {t.rr > 0 ? "+" : ""}{t.rr}R
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
