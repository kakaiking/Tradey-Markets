import { brokers } from "@/lib/data";
import { PageHead } from "@/components/layout/PageHead";

const filters = ["All", "ECN/STP", "Market Maker", "US Clients", "Low Min Deposit", "Best Spreads", "MT4", "MT5", "cTrader"];

export default function BrokersPage() {
    return (
        <div>
            <PageHead
                title="Broker Reviews"
                byline="Independent reviews"
                lede="Community-driven reviews to help you find the right broker for your style."
            />

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem", justifyContent: "center" }}>
                {filters.map((f, i) => (
                    <button key={f} type="button" className={`filter-chip ${i === 0 ? "is-active" : ""}`} aria-pressed={i === 0}>
                        {f}
                    </button>
                ))}
            </div>

            <ul className="choice-list">
                {brokers.map((broker, i) => (
                    <li key={broker.id}>
                        <div className="choice-card" style={{ cursor: "default" }}>
                            <div className="choice-copy">
                                <strong>{broker.name}</strong>
                                <span className="choice-meta">
                                    {broker.rating}/5 · {broker.reviews} reviews · {broker.type}
                                </span>
                                <span className="lede" style={{ fontSize: "0.9rem" }}>
                                    Min deposit {broker.minDeposit} · {broker.spread}
                                </span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
                                {i < 3 ? <span className="badge badge-mark">#{i + 1}</span> : null}
                                <span className="choice-trail">{broker.logo}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
