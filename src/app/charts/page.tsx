"use client";
import { useState } from "react";
import { PageHead } from "@/components/layout/PageHead";

const generateCandles = (n = 80, start = 1.0820) => {
    let p = start;
    return Array.from({ length: n }, (_, i) => {
        const move = (Math.random() - 0.47) * 0.0025;
        const open = p;
        const close = p + move;
        const high = Math.max(open, close) + Math.random() * 0.0008;
        const low = Math.min(open, close) - Math.random() * 0.0008;
        p = close;
        return { open: +open.toFixed(4), close: +close.toFixed(4), high: +high.toFixed(4), low: +low.toFixed(4), index: i };
    });
};

const pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "GBP/JPY", "AUD/USD", "BTC/USD"];

export default function ChartsPage() {
    const [candles] = useState(() => generateCandles());
    const [selectedPair, setSelectedPair] = useState("EUR/USD");
    const [selectedTf, setSelectedTf] = useState("H1");

    const prices = candles.flatMap(c => [c.high, c.low]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 0.001;
    const W = 720, H = 300;
    const cw = Math.floor(W / candles.length) - 1;

    return (
        <div>
            <PageHead
                title="Chart Classroom"
                byline="Practice arena"
                lede="Practice reading charts with drawing tools — without leaving Tradey Markets."
            />

            <div className="card" style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", marginBottom: "1rem" }}>
                    <select className="field" style={{ width: "auto", minHeight: 44 }} value={selectedPair} onChange={e => setSelectedPair(e.target.value)}>
                        {pairs.map(p => <option key={p}>{p}</option>)}
                    </select>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                        {["M1", "M5", "M15", "H1", "H4", "D1"].map(tf => (
                            <button
                                key={tf}
                                type="button"
                                className={`filter-chip ${selectedTf === tf ? "is-active" : ""}`}
                                aria-pressed={selectedTf === tf}
                                onClick={() => setSelectedTf(tf)}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>

                <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background: "var(--sunken)", borderRadius: "var(--radius-sm)", border: "2px solid var(--ink)" }}>
                    {[0, 0.25, 0.5, 0.75, 1].map(pos => (
                        <line key={pos} x1={0} x2={W} y1={H * pos} y2={H * pos} stroke="var(--line)" strokeWidth={1} />
                    ))}
                    {candles.map((c, i) => {
                        const x = i * (W / candles.length) + cw / 2;
                        const isUp = c.close >= c.open;
                        const color = isUp ? "var(--chalk)" : "var(--pencil)";
                        const highY = ((max - c.high) / range) * H;
                        const lowY = ((max - c.low) / range) * H;
                        const openY = ((max - c.open) / range) * H;
                        const closeY = ((max - c.close) / range) * H;
                        const bodyTop = Math.min(openY, closeY);
                        const bodyH = Math.max(Math.abs(openY - closeY), 1);
                        return (
                            <g key={i}>
                                <line x1={x} x2={x} y1={highY} y2={lowY} stroke={color} strokeWidth={1} />
                                <rect x={x - cw / 2} y={bodyTop} width={cw} height={bodyH} fill={color} rx={1} />
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="card">
                <p className="kicker" style={{ marginBottom: "0.5rem" }}>Practice tip</p>
                <p className="lede" style={{ fontSize: "0.95rem" }}>
                    Mark swing highs/lows and ask: is structure making higher highs, or breaking down? {selectedPair} on {selectedTf}.
                </p>
            </div>
        </div>
    );
}
