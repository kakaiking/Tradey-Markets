import { PageHead } from "@/components/layout/PageHead";

const pairs = [
    { pair: "EUR/USD", strength: 72, rsi: 38, atr: "0.0085", trend: "DOWN", ema: "Below", vol: "Low" },
    { pair: "GBP/USD", strength: 81, rsi: 56, atr: "0.0124", trend: "UP", ema: "Above", vol: "Medium" },
    { pair: "USD/JPY", strength: 44, rsi: 65, atr: "0.72", trend: "UP", ema: "Above", vol: "High" },
    { pair: "AUD/USD", strength: 63, rsi: 45, atr: "0.0063", trend: "NEUTRAL", ema: "At", vol: "Low" },
    { pair: "USD/CAD", strength: 55, rsi: 52, atr: "0.0091", trend: "NEUTRAL", ema: "Above", vol: "Medium" },
    { pair: "NZD/USD", strength: 68, rsi: 41, atr: "0.0058", trend: "DOWN", ema: "Below", vol: "Low" },
    { pair: "EUR/GBP", strength: 33, rsi: 29, atr: "0.0044", trend: "DOWN", ema: "Below", vol: "Low" },
    { pair: "GBP/JPY", strength: 88, rsi: 72, atr: "1.25", trend: "UP", ema: "Above", vol: "High" },
];

const currencyStrength = [
    { ccy: "GBP", val: 88 },
    { ccy: "JPY", val: 78 },
    { ccy: "USD", val: 66 },
    { ccy: "EUR", val: 48 },
    { ccy: "NZD", val: 42 },
    { ccy: "AUD", val: 38 },
    { ccy: "CAD", val: 34 },
    { ccy: "CHF", val: 28 },
];

export default function MarketVisionPage() {
    return (
        <div>
            <PageHead
                title="MarketVision™"
                byline="Visual analytics"
                lede="Technical snapshot across major forex pairs at a glance."
                trail={<span className="badge badge-chalk">Live data</span>}
            />

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem", justifyContent: "center" }}>
                {["H1", "H4", "D1", "W1"].map((tf, i) => (
                    <button key={tf} type="button" className={`filter-chip ${i === 1 ? "is-active" : ""}`} aria-pressed={i === 1}>
                        {tf}
                    </button>
                ))}
            </div>

            <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>Currency strength</p>
            <ul className="choice-list" style={{ marginBottom: "1.5rem" }}>
                {currencyStrength.map((c) => (
                    <li key={c.ccy}>
                        <div className="choice-card" style={{ cursor: "default" }}>
                            <div className="choice-copy" style={{ flex: 1 }}>
                                <strong>{c.ccy}</strong>
                                <div className="heat" style={{ marginTop: "0.4rem", maxWidth: "100%" }}>
                                    <div className="heat-fill" style={{ width: `${c.val}%` }} />
                                </div>
                            </div>
                            <span className="choice-trail">{c.val}</span>
                        </div>
                    </li>
                ))}
            </ul>

            <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>Pair dashboard</p>
            <ul className="choice-list">
                {pairs.map((p) => (
                    <li key={p.pair}>
                        <div className="choice-card" style={{ cursor: "default" }}>
                            <div className="choice-copy">
                                <strong>{p.pair}</strong>
                                <span className="choice-meta">
                                    RSI {p.rsi} · ATR {p.atr} · EMA {p.ema} · Vol {p.vol}
                                </span>
                                <div className="heat" style={{ marginTop: "0.4rem", maxWidth: "12rem" }}>
                                    <div className="heat-fill" style={{ width: `${p.strength}%` }} />
                                </div>
                            </div>
                            <span
                                className="choice-trail"
                                style={{
                                    color:
                                        p.trend === "UP"
                                            ? "var(--chalk)"
                                            : p.trend === "DOWN"
                                              ? "var(--pencil)"
                                              : "var(--muted)",
                                }}
                            >
                                {p.trend}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
