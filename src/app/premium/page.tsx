import Link from "next/link";
import { Check } from "lucide-react";
import { PageHead } from "@/components/layout/PageHead";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        highlight: false,
        features: [
            "Beginner through Expert (5 levels)",
            "Full Forexpedia glossary",
            "Economic Calendar",
            "All trading calculators",
            "Community forum participation",
            "3 journal entries per month",
        ],
        cta: "Get started free",
        ctaHref: "/account/signup",
    },
    {
        name: "Premium",
        price: "$19",
        period: "per month",
        annualNote: "Or $15/mo billed annually",
        highlight: true,
        features: [
            "Everything in Free",
            "Master through Professional levels",
            "AI Trade Journal — unlimited",
            "Strategy Backtester",
            "Event Trading Guides",
            "Weekly Market Recaps",
            "Unlimited MarketVision™",
            "Priority webinar access",
        ],
        cta: "Start 7-day free trial",
        ctaHref: "/account/signup?plan=premium",
    },
    {
        name: "Teams",
        price: "$49",
        period: "per month",
        annualNote: "Up to 5 members",
        highlight: false,
        features: [
            "Everything in Premium",
            "5 team member accounts",
            "Shared journal workspace",
            "Team leaderboard",
            "Dedicated account manager",
            "API access",
        ],
        cta: "Contact us",
        ctaHref: "/about",
    },
];

const premiumFeatures = [
    { title: "Full curriculum", desc: "Access Master through Professional with advanced modules." },
    { title: "AI journal insights", desc: "Spot session biases, emotional triggers, and R:R problems." },
    { title: "Strategy backtester", desc: "Test strategies on historical data before risking capital." },
    { title: "Event trading guides", desc: "Setup guides for NFP, FOMC, CPI, and major releases." },
    { title: "Weekly market recaps", desc: "What moved markets and which setups worked each week." },
    { title: "Unlimited MarketVision™", desc: "All pairs, timeframes, and technical metrics at a glance." },
];

export default function PremiumPage() {
    return (
        <div>
            <PageHead
                title="Premium"
                byline="Tradey Markets Premium"
                lede="Unlock the full platform — advanced curriculum, AI journal, backtesting, and weekly guides."
            />

            <div className="split" style={{ marginBottom: "1.5rem" }}>
                {plans.map((plan) => (
                    <div key={plan.name} className="card" style={plan.highlight ? { background: "color-mix(in srgb, var(--highlighter) 22%, var(--raised))" } : undefined}>
                        {plan.highlight ? <span className="badge badge-mark" style={{ marginBottom: "0.75rem" }}>Most popular</span> : null}
                        <p className="kicker" style={{ marginBottom: "0.35rem" }}>{plan.name}</p>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem", marginBottom: "0.35rem" }}>
                            <strong className="font-display" style={{ fontSize: "2rem" }}>{plan.price}</strong>
                            <span className="status">/{plan.period}</span>
                        </div>
                        {plan.annualNote ? <p className="choice-meta" style={{ marginBottom: "1rem" }}>{plan.annualNote}</p> : <div style={{ marginBottom: "1rem" }} />}
                        <ul className="choice-list" style={{ marginBottom: "1.25rem" }}>
                            {plan.features.map((f) => (
                                <li key={f} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", textAlign: "left" }}>
                                    <Check size={14} style={{ marginTop: "0.2rem", color: "var(--chalk)", flexShrink: 0 }} />
                                    <span style={{ fontSize: "0.95rem" }}>{f}</span>
                                </li>
                            ))}
                        </ul>
                        <Link href={plan.ctaHref} className={plan.highlight ? "btn" : "btn secondary"}>{plan.cta}</Link>
                    </div>
                ))}
            </div>

            <p className="kicker" style={{ marginBottom: "0.75rem" }}>What&apos;s included</p>
            <ul className="choice-list" style={{ marginBottom: "1.5rem" }}>
                {premiumFeatures.map((f) => (
                    <li key={f.title}>
                        <div className="choice-card" style={{ cursor: "default", gridTemplateColumns: "1fr" }}>
                            <div className="choice-copy">
                                <strong>{f.title}</strong>
                                <span className="lede" style={{ fontSize: "0.9rem" }}>{f.desc}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="card">
                <p className="kicker" style={{ marginBottom: "0.75rem" }}>FAQ</p>
                <ul className="choice-list">
                    {[
                        { q: "Can I cancel anytime?", a: "Yes. Cancel instantly from account settings — no hidden fees." },
                        { q: "Is there a free trial?", a: "Premium includes a 7-day free trial. You won't be charged until it ends." },
                        { q: "What payment methods?", a: "Card, Google Pay, and Apple Pay via Stripe." },
                        { q: "Is content updated?", a: "Yes — weekly recaps, event guides, and analysis from the editorial team." },
                    ].map(({ q, a }) => (
                        <li key={q}>
                            <div className="choice-card" style={{ cursor: "default", gridTemplateColumns: "1fr" }}>
                                <div className="choice-copy">
                                    <strong>{q}</strong>
                                    <span className="lede" style={{ fontSize: "0.9rem" }}>{a}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
