"use client";
import { useState } from "react";
import { glossaryTerms } from "@/lib/data";
import { PageHead } from "@/components/layout/PageHead";

const categories = ["All", "Basics", "Technical Analysis", "Indicators", "Risk Management", "Trading Costs", "Account"];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function ForexpediaPage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeLetter, setActiveLetter] = useState<string | null>(null);

    const filtered = glossaryTerms.filter(t => {
        const matchSearch = t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === "All" || t.category === activeCategory;
        const matchLetter = !activeLetter || t.term[0].toUpperCase() === activeLetter;
        return matchSearch && matchCat && matchLetter;
    });

    return (
        <div>
            <PageHead
                title="Forexpedia"
                byline="Reference library"
                lede="Your complete forex & trading glossary. Find definitions for every term you encounter."
            />

            <div className="split" style={{ marginBottom: "1.5rem" }}>
                <div className="card">
                    <p className="kicker" style={{ marginBottom: "0.5rem" }}>Term of the day</p>
                    <h3 className="font-display" style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>Fibonacci</h3>
                    <p className="lede" style={{ fontSize: "0.95rem" }}>
                        Retracement levels from the Fibonacci sequence (23.6%, 38.2%, 61.8%) used to spot support and resistance during pullbacks.
                    </p>
                </div>
                <div className="card">
                    <p className="kicker" style={{ marginBottom: "0.5rem" }}>Topic of the day</p>
                    <h3 className="font-display" style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>Technical Analysis</h3>
                    <p className="lede" style={{ fontSize: "0.95rem" }}>
                        Chart analysis, indicators, patterns, and price action — from candlesticks to Elliott Wave.
                    </p>
                    <button type="button" className="btn secondary" style={{ marginTop: "1rem" }} onClick={() => setActiveCategory("Technical Analysis")}>
                        Browse topic
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <label className="label" htmlFor="forexpedia-search">Search terms</label>
                <input
                    id="forexpedia-search"
                    className="field"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setActiveLetter(null); }}
                    placeholder="Search terms… (e.g. pip, leverage, RSI)"
                />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem", justifyContent: "center" }}>
                {alphabet.map(l => (
                    <button
                        key={l}
                        type="button"
                        className={`filter-chip ${activeLetter === l ? "is-active" : ""}`}
                        aria-pressed={activeLetter === l}
                        onClick={() => { setActiveLetter(activeLetter === l ? null : l); setSearch(""); }}
                        style={{ minWidth: 36, padding: "0.25rem 0.45rem" }}
                    >
                        {l}
                    </button>
                ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem", justifyContent: "center" }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        type="button"
                        className={`filter-chip ${activeCategory === cat ? "is-active" : ""}`}
                        aria-pressed={activeCategory === cat}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="card status" style={{ textAlign: "center" }}>
                    No terms found{search ? ` for “${search}”` : ""}.
                </div>
            ) : (
                <ul className="choice-list">
                    {filtered.map((t) => (
                        <li key={t.slug}>
                            <div className="choice-card" style={{ cursor: "default", alignItems: "start" }}>
                                <div className="choice-copy">
                                    <strong>{t.term}</strong>
                                    <span className="lede" style={{ fontSize: "0.95rem" }}>{t.definition}</span>
                                </div>
                                <span className="badge">{t.category}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {filtered.length > 0 && (
                <p className="status" style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.85rem" }}>
                    Showing {filtered.length} of {glossaryTerms.length} terms
                </p>
            )}
        </div>
    );
}
