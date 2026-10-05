"use client";
import Image from "next/image";
import Link from "next/link";
import { PageHead } from "@/components/layout/PageHead";

const stats = [
    { label: "Traders empowered", value: "50K+" },
    { label: "Pips analyzed", value: "12M+" },
    { label: "Learning paths", value: "150+" },
    { label: "Live webinars", value: "500+" },
];

const values = [
    {
        title: "Uncompromising transparency",
        description: "Honest data. No fluff, no get-rich-quick schemes — real market insights and proven strategies.",
    },
    {
        title: "Education first",
        description: "We bridge theory and live market execution so retail traders can grow with confidence.",
    },
    {
        title: "Precision tools",
        description: "Journaling and analysis tools built to catch the pips that matter in your process.",
    },
];

export default function AboutPage() {
    return (
        <div>
            <PageHead
                title="About Tradey Markets"
                byline="Our mission"
                lede="Democratizing institutional-grade trading education and tools for the retail trader."
                backHref="/"
            />

            <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "1.5rem" }}>
                <div style={{ position: "relative", aspectRatio: "16 / 10", background: "var(--sunken)" }}>
                    <Image
                        src="/tradeymarkets/tradeymarkets_about_hero_1777017887435.png"
                        alt="Tradey Markets"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            <div className="admin-stat-grid" style={{ marginBottom: "1.5rem" }}>
                {stats.map((stat) => (
                    <div key={stat.label} className="admin-stat">
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                    </div>
                ))}
            </div>

            <div className="card" style={{ marginBottom: "1.5rem" }}>
                <p className="kicker" style={{ marginBottom: "0.5rem" }}>Why we exist</p>
                <p className="lede">
                    Trading is often shrouded in complexity and misleading promises. We built a classroom that prioritizes the trader&apos;s growth over everything else — tools and knowledge to find your own edge, not someone else&apos;s signals.
                </p>
            </div>

            <ul className="choice-list" style={{ marginBottom: "1.5rem" }}>
                {values.map((value) => (
                    <li key={value.title}>
                        <div className="choice-card" style={{ cursor: "default", gridTemplateColumns: "1fr" }}>
                            <div className="choice-copy">
                                <strong>{value.title}</strong>
                                <span className="lede" style={{ fontSize: "0.95rem" }}>{value.description}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="card" style={{ textAlign: "center" }}>
                <h2 className="font-display" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Ready to start?</h2>
                <p className="lede" style={{ marginBottom: "1.25rem" }}>Join traders mastering the markets with Tradey Markets.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
                    <Link href="/account/signup" className="btn">Sign up free</Link>
                    <Link href="/learn" className="btn secondary">Browse courses</Link>
                </div>
            </div>
        </div>
    );
}
