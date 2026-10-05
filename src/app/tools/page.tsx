"use client";
import { useState } from "react";
import { PageHead } from "@/components/layout/PageHead";

const tools = [
    { id: "position-size", title: "Position Size Calculator", desc: "Calculate lot size from risk tolerance." },
    { id: "pip-value", title: "Pip Value Calculator", desc: "How much each pip movement is worth." },
    { id: "pivot-point", title: "Pivot Point Calculator", desc: "Support & resistance from OHLC." },
    { id: "gain-loss", title: "Gain & Loss Calculator", desc: "Recovery needed after a loss." },
    { id: "correlation", title: "Currency Correlation", desc: "Measure pair correlations." },
    { id: "market-hours", title: "Market Hours Clock", desc: "Which sessions are open." },
    { id: "risk-meter", title: "Risk-On / Risk-Off Meter", desc: "Gauge market risk sentiment." },
];

function PositionSizeCalc() {
    const [balance, setBalance] = useState("10000");
    const [risk, setRisk] = useState("1");
    const [sl, setSl] = useState("50");
    const [pair, setPair] = useState("EUR/USD");

    const riskAmount = (parseFloat(balance) * parseFloat(risk)) / 100;
    const pipValue = pair.includes("JPY") ? 9.09 : 10;
    const lots = isNaN(riskAmount) || isNaN(parseFloat(sl)) ? 0 : riskAmount / (parseFloat(sl) * pipValue);

    return (
        <div style={{ display: "grid", gap: "1rem" }}>
            {[
                { label: "Account Balance ($)", value: balance, setter: setBalance },
                { label: "Risk % per Trade", value: risk, setter: setRisk },
                { label: "Stop Loss (pips)", value: sl, setter: setSl },
            ].map(({ label, value, setter }) => (
                <div key={label}>
                    <label className="label">{label}</label>
                    <input type="number" className="field" value={value} onChange={e => setter(e.target.value)} />
                </div>
            ))}
            <div>
                <label className="label">Currency pair</label>
                <input type="text" className="field" value={pair} onChange={e => setPair(e.target.value)} />
            </div>
            <div className="card" style={{ background: "var(--sunken)", boxShadow: "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span className="status">Risk amount</span>
                    <span className="font-tape">${riskAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span className="status">Pip value</span>
                    <span className="font-tape">${pipValue.toFixed(2)}/pip</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>Recommended lot size</strong>
                    <strong className="font-display" style={{ fontSize: "1.5rem" }}>{lots.toFixed(2)}</strong>
                </div>
            </div>
        </div>
    );
}

function PivotPointCalc() {
    const [high, setHigh] = useState("1.0920");
    const [low, setLow] = useState("1.0760");
    const [close, setClose] = useState("1.0850");

    const h = parseFloat(high), l = parseFloat(low), c = parseFloat(close);
    const pp = (h + l + c) / 3;
    const r1 = 2 * pp - l;
    const s1 = 2 * pp - h;
    const r2 = pp + (h - l);
    const s2 = pp - (h - l);
    const r3 = h + 2 * (pp - l);
    const s3 = l - 2 * (h - pp);

    return (
        <div style={{ display: "grid", gap: "1rem" }}>
            {[
                { label: "High", value: high, setter: setHigh },
                { label: "Low", value: low, setter: setLow },
                { label: "Close", value: close, setter: setClose },
            ].map(({ label, value, setter }) => (
                <div key={label}>
                    <label className="label">{label}</label>
                    <input type="number" step="0.0001" className="field" value={value} onChange={e => setter(e.target.value)} />
                </div>
            ))}
            <ul className="choice-list">
                {[
                    { label: "R3", val: r3 },
                    { label: "R2", val: r2 },
                    { label: "R1", val: r1 },
                    { label: "PP", val: pp },
                    { label: "S1", val: s1 },
                    { label: "S2", val: s2 },
                    { label: "S3", val: s3 },
                ].map(({ label, val }) => (
                    <li key={label}>
                        <div className="choice-card" style={{ cursor: "default" }}>
                            <div className="choice-copy"><strong>{label}</strong></div>
                            <span className="choice-trail font-tape">{isNaN(val) ? "—" : val.toFixed(4)}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function MarketHoursClock() {
    const sessions = [
        { name: "Sydney", active: true },
        { name: "Tokyo", active: true },
        { name: "London", active: false },
        { name: "New York", active: false },
    ];

    return (
        <div style={{ display: "grid", gap: "1rem" }}>
            <div className="card" style={{ textAlign: "center", background: "var(--sunken)", boxShadow: "none" }}>
                <div className="font-display" style={{ fontSize: "2rem" }}>
                    {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </div>
                <p className="choice-meta" style={{ marginTop: "0.35rem" }}>Local time</p>
            </div>
            <ul className="choice-list">
                {sessions.map(s => (
                    <li key={s.name}>
                        <div className="choice-card" style={{ cursor: "default" }}>
                            <div className="choice-copy"><strong>{s.name}</strong></div>
                            <span className={`badge ${s.active ? "badge-chalk" : ""}`}>{s.active ? "Open" : "Closed"}</span>
                        </div>
                    </li>
                ))}
            </ul>
            <p className="lede" style={{ fontSize: "0.95rem" }}>
                London–NY overlap (12:00–16:00 UTC) is usually the highest liquidity window.
            </p>
        </div>
    );
}

function RiskMeter() {
    const score = 62;
    return (
        <div style={{ display: "grid", gap: "1rem" }}>
            <div className="card" style={{ textAlign: "center", background: "var(--sunken)", boxShadow: "none" }}>
                <p className="kicker" style={{ marginBottom: "0.5rem" }}>Market sentiment</p>
                <div className="heat" style={{ margin: "0 auto 0.75rem", maxWidth: "100%" }}>
                    <div className="heat-fill" style={{ width: `${score}%` }} />
                </div>
                <strong className="font-display" style={{ fontSize: "2rem" }}>{score}</strong>
                <p className="lede" style={{ fontSize: "0.95rem", marginTop: "0.35rem" }}>Neutral — balanced between risk assets and safe havens</p>
            </div>
            <ul className="choice-list">
                {[
                    { label: "JPY Strength", val: 42 },
                    { label: "Gold Demand", val: 58 },
                    { label: "S&P 500 Momentum", val: 65 },
                    { label: "VIX Level", val: 38 },
                ].map(({ label, val }) => (
                    <li key={label}>
                        <div className="choice-card" style={{ cursor: "default" }}>
                            <div className="choice-copy"><strong>{label}</strong></div>
                            <span className="choice-trail">{val}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function ToolsPage() {
    const [activeTool, setActiveTool] = useState("position-size");
    const active = tools.find(t => t.id === activeTool);

    const renderCalc = () => {
        switch (activeTool) {
            case "position-size": return <PositionSizeCalc />;
            case "pivot-point": return <PivotPointCalc />;
            case "market-hours": return <MarketHoursClock />;
            case "risk-meter": return <RiskMeter />;
            default:
                return <div className="card status" style={{ textAlign: "center" }}>Interactive calculator coming soon.</div>;
        }
    };

    return (
        <div>
            <PageHead
                title="Trading Tools"
                byline="Trader's toolkit"
                lede="Essential calculators and visualizers — free and in one place."
            />

            <div className="split">
                <ul className="choice-list">
                    {tools.map(tool => (
                        <li key={tool.id}>
                            <button
                                type="button"
                                className="choice-card"
                                onClick={() => setActiveTool(tool.id)}
                                style={activeTool === tool.id ? { background: "var(--highlighter)" } : undefined}
                            >
                                <div className="choice-copy">
                                    <strong>{tool.title}</strong>
                                    <span className="choice-meta" style={{ textTransform: "none", letterSpacing: 0 }}>{tool.desc}</span>
                                </div>
                                <span className={`choice-trail${activeTool === tool.id ? " active" : ""}`}>
                                    {activeTool === tool.id ? "On" : "→"}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="card">
                    <p className="kicker" style={{ marginBottom: "0.35rem" }}>{active?.title}</p>
                    <p className="lede" style={{ fontSize: "0.95rem", marginBottom: "1.25rem" }}>{active?.desc}</p>
                    {renderCalc()}
                </div>
            </div>
        </div>
    );
}
