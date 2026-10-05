"use client";
import { useState, useEffect } from "react";
import { PageHead } from "@/components/layout/PageHead";

const generateCandles = (count: number, start = 1.0800) => {
    const candles = [];
    let price = start;
    for (let i = 0; i < count; i++) {
        const move = (Math.random() - 0.48) * 0.003;
        const open = price;
        const close = price + move;
        const high = Math.max(open, close) + Math.random() * 0.001;
        const low = Math.min(open, close) - Math.random() * 0.001;
        price = close;
        candles.push({ open: +open.toFixed(4), close: +close.toFixed(4), high: +high.toFixed(4), low: +low.toFixed(4) });
    }
    return candles;
};

const allCandles = generateCandles(120);

function CandleChart({ candles, currentIndex, trades }: { candles: typeof allCandles, currentIndex: number, trades: { index: number, dir: string, entry: number }[] }) {
    const visible = candles.slice(Math.max(0, currentIndex - 50), currentIndex + 1);
    const prices = visible.flatMap(c => [c.high, c.low]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 0.001;
    const w = 560, h = 280;
    const candleWidth = Math.floor(w / visible.length) - 2;

    return (
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--sunken)", border: "2px solid var(--ink)" }}>
            {[0, 0.25, 0.5, 0.75, 1].map(pos => (
                <g key={pos}>
                    <line x1={0} x2={w} y1={h * pos} y2={h * pos} stroke="var(--line)" strokeWidth={1} />
                    <text x={4} y={h * pos - 3} fill="var(--muted)" fontSize={9}>{(max - range * pos).toFixed(4)}</text>
                </g>
            ))}
            {visible.map((c, i) => {
                const x = i * (w / visible.length) + candleWidth / 2;
                const isGreen = c.close >= c.open;
                const color = isGreen ? "var(--chalk)" : "var(--pencil)";
                const highY = ((max - c.high) / range) * h;
                const lowY = ((max - c.low) / range) * h;
                const openY = ((max - c.open) / range) * h;
                const closeY = ((max - c.close) / range) * h;
                const bodyTop = Math.min(openY, closeY);
                const bodyH = Math.max(Math.abs(openY - closeY), 1);
                return (
                    <g key={i}>
                        <line x1={x} x2={x} y1={highY} y2={lowY} stroke={color} strokeWidth={1} />
                        <rect x={x - candleWidth / 2} y={bodyTop} width={candleWidth} height={bodyH} fill={color} rx={1} />
                    </g>
                );
            })}
            {trades.map((t, i) => {
                const relIndex = t.index - (currentIndex > 50 ? currentIndex - 50 : 0);
                if (relIndex < 0 || relIndex >= visible.length) return null;
                const x = relIndex * (w / visible.length) + candleWidth / 2;
                const y = ((max - t.entry) / range) * h;
                const color = t.dir === "BUY" ? "var(--chalk)" : "var(--pencil)";
                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r={5} fill={color} />
                        <text x={x + 7} y={y + 4} fill={color} fontSize={9}>{t.dir}</text>
                    </g>
                );
            })}
        </svg>
    );
}

export default function BacktesterPage() {
    const [currentIndex, setCurrentIndex] = useState(50);
    const [playing, setPlaying] = useState(false);
    const [placedTrades, setPlacedTrades] = useState<{ index: number, dir: string, entry: number, outcome?: string, pips?: number }[]>([]);
    const [selectedPair, setSelectedPair] = useState("EUR/USD");
    const [speed, setSpeed] = useState(1);

    useEffect(() => {
        if (!playing) return;
        const interval = setInterval(() => {
            setCurrentIndex(ci => {
                if (ci >= allCandles.length - 1) { setPlaying(false); return ci; }
                return ci + 1;
            });
        }, 400 / speed);
        return () => clearInterval(interval);
    }, [playing, speed]);

    const addTrade = (dir: string) => {
        const entry = allCandles[currentIndex]?.close;
        if (!entry) return;
        setPlacedTrades(t => [...t, { index: currentIndex, dir, entry }]);
    };

    const stats = {
        wins: placedTrades.filter(t => t.outcome === "WIN").length,
        losses: placedTrades.filter(t => t.outcome === "LOSS").length,
        total: placedTrades.length,
    };

    return (
        <div>
            <PageHead
                title="Strategy Backtester"
                byline="Historical practice"
                lede="Step through price action and test your strategy without risking real money."
            />

            <div className="card" style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
                    <select className="field" style={{ width: "auto", minHeight: 44 }} value={selectedPair} onChange={e => setSelectedPair(e.target.value)}>
                        {["EUR/USD", "GBP/USD", "USD/JPY", "GBP/JPY", "AUD/USD"].map(p => <option key={p}>{p}</option>)}
                    </select>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                        {[1, 5, 10, 50].map(s => (
                            <button key={s} type="button" className={`filter-chip ${speed === s ? "is-active" : ""}`} aria-pressed={speed === s} onClick={() => setSpeed(s)}>
                                {s}x
                            </button>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", marginLeft: "auto" }}>
                        <button type="button" className="btn secondary" style={{ width: "auto" }} onClick={() => setPlaying(!playing)}>
                            {playing ? "Pause" : "Play"}
                        </button>
                        <button type="button" className="btn ghost" style={{ width: "auto" }} onClick={() => setCurrentIndex(ci => Math.min(ci + 1, allCandles.length - 1))}>
                            +1 bar
                        </button>
                    </div>
                </div>
            </div>

            <div className="split">
                <div>
                    <div className="card" style={{ padding: "var(--space-3)", marginBottom: "0.75rem" }}>
                        <CandleChart candles={allCandles} currentIndex={currentIndex} trades={placedTrades} />
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
                        <button type="button" className="btn chalk" style={{ width: "auto" }} onClick={() => addTrade("BUY")}>
                            BUY {allCandles[currentIndex]?.close.toFixed(4)}
                        </button>
                        <button type="button" className="btn" style={{ width: "auto", background: "var(--pencil)", color: "var(--on-chalk)" }} onClick={() => addTrade("SELL")}>
                            SELL {allCandles[currentIndex]?.close.toFixed(4)}
                        </button>
                        <span className="choice-meta" style={{ marginLeft: "auto" }}>Bar {currentIndex + 1} / {allCandles.length}</span>
                    </div>
                </div>

                <div style={{ display: "grid", gap: "1rem" }}>
                    <div className="admin-stat-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                        <div className="admin-stat"><strong>{stats.total}</strong><span>Trades</span></div>
                        <div className="admin-stat"><strong>{stats.wins}</strong><span>Wins</span></div>
                        <div className="admin-stat"><strong>{stats.losses}</strong><span>Losses</span></div>
                        <div className="admin-stat"><strong>{stats.total ? `${Math.round((stats.wins / stats.total) * 100)}%` : "—"}</strong><span>Win rate</span></div>
                    </div>

                    <div>
                        <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>My trades</p>
                        {placedTrades.length === 0 ? (
                            <div className="card status">No trades yet — click BUY or SELL.</div>
                        ) : (
                            <ul className="choice-list">
                                {placedTrades.map((t, i) => (
                                    <li key={i}>
                                        <div className="choice-card" style={{ cursor: "default" }}>
                                            <div className="choice-copy">
                                                <strong style={{ color: t.dir === "BUY" ? "var(--chalk)" : "var(--pencil)" }}>{t.dir}</strong>
                                                <span className="choice-meta font-tape" style={{ textTransform: "none" }}>{t.entry.toFixed(4)} · bar {t.index + 1}</span>
                                            </div>
                                            <button type="button" className="btn ghost" style={{ width: "auto", minHeight: 36, padding: "0.25rem 0.6rem", color: "var(--pencil)" }} onClick={() => setPlacedTrades(ts => ts.filter((_, ii) => ii !== i))}>
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="card">
                        <p className="kicker" style={{ marginBottom: "0.35rem" }}>Pro tip</p>
                        <p className="lede" style={{ fontSize: "0.95rem" }}>
                            Pause, mark your entry signal, then play to see if the pattern followed through.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
