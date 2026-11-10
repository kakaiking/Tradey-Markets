"use client";
import { useState, useEffect } from "react";
import { Globe, Users, Info, Clock } from "lucide-react";
import { calendarEvents } from "@/lib/data";
import { PageHead } from "@/components/layout/PageHead";

const currencies = ["All", "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD"];
const impacts = ["All", "high", "medium", "low"];
const dateFilters = ["Today", "Tomorrow", "This Week", "Next Week"];

const allEvents = [
    ...calendarEvents,
    { id: 6, time: "09:00", currency: "GBP", event: "Industrial Production m/m", impact: "medium", forecast: "0.2%", previous: "-0.1%", actual: "" },
    { id: 7, time: "10:30", currency: "EUR", event: "German CPI m/m", impact: "high", forecast: "0.3%", previous: "0.4%", actual: "" },
    { id: 8, time: "13:00", currency: "USD", event: "30-Year Bond Auction", impact: "low", forecast: "—", previous: "4.68|2.4", actual: "" },
];

const impactDot: Record<string, string> = {
    high: "var(--pencil)",
    medium: "var(--highlighter)",
    low: "var(--chalk)",
};

const flagMap: Record<string, string> = { USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", AUD: "🇦🇺", CAD: "🇨🇦", CHF: "🇨🇭", NZD: "🇳🇿" };

export default function CalendarPage() {
    const [view, setView] = useState<"economic" | "community">("economic");
    const [activeCurrency, setActiveCurrency] = useState("All");
    const [activeImpact, setActiveImpact] = useState("All");
    const [activeDateFilter, setActiveDateFilter] = useState("Today");
    const [communityEvents, setCommunityEvents] = useState<any[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("/api/admin/events");
                if (response.ok) {
                    const data = await response.json();
                    setCommunityEvents(data.events || []);
                }
            } catch (error) {
                console.error("Error fetching community events:", error);
            }
        };
        fetchEvents();
    }, []);

    const filtered = allEvents.filter(e =>
        (activeCurrency === "All" || e.currency === activeCurrency) &&
        (activeImpact === "All" || e.impact === activeImpact)
    );

    return (
        <div>
            <PageHead
                title={view === "economic" ? "Economic Calendar" : "Scheduled Events"}
                byline={view === "economic" ? "Real-time market events" : "Tradey Markets events"}
                lede={
                    view === "economic"
                        ? "Track high-impact releases that move forex & crypto. Filters update the list instantly."
                        : "Join live sessions, webinars, and community meetups."
                }
                trail={
                    <div style={{ display: "flex", gap: "0.35rem" }}>
                        <button
                            type="button"
                            className={`filter-chip ${view === "economic" ? "is-active" : ""}`}
                            aria-pressed={view === "economic"}
                            onClick={() => setView("economic")}
                        >
                            <Globe size={12} /> Economic
                        </button>
                        <button
                            type="button"
                            className={`filter-chip ${view === "community" ? "is-active" : ""}`}
                            aria-pressed={view === "community"}
                            onClick={() => setView("community")}
                        >
                            <Users size={12} /> Community
                        </button>
                    </div>
                }
            />

            {view === "economic" ? (
                <div className="split" style={{ gridTemplateColumns: "1fr" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem", justifyContent: "center" }}>
                        {dateFilters.map(d => (
                            <button
                                key={d}
                                type="button"
                                className={`filter-chip ${activeDateFilter === d ? "is-active" : ""}`}
                                aria-pressed={activeDateFilter === d}
                                onClick={() => setActiveDateFilter(d)}
                            >
                                {d}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem", justifyContent: "center" }}>
                        {impacts.map(i => (
                            <button
                                key={i}
                                type="button"
                                className={`filter-chip ${activeImpact === i ? "is-active" : ""}`}
                                aria-pressed={activeImpact === i}
                                onClick={() => setActiveImpact(i)}
                            >
                                {i === "high" ? "High" : i === "medium" ? "Medium" : i === "low" ? "Low" : "All impact"}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem", justifyContent: "center" }}>
                        {currencies.map(c => (
                            <button
                                key={c}
                                type="button"
                                className={`filter-chip ${activeCurrency === c ? "is-active" : ""}`}
                                aria-pressed={activeCurrency === c}
                                onClick={() => setActiveCurrency(c)}
                            >
                                {c !== "All" && flagMap[c]} {c}
                            </button>
                        ))}
                    </div>

                    <ul className="choice-list">
                        {filtered.map((ev) => (
                            <li key={ev.id}>
                                <div className="choice-card" style={{ cursor: "default" }}>
                                    <div className="choice-copy">
                                        <strong>{ev.event}</strong>
                                        <span className="choice-meta">
                                            {ev.time} · {flagMap[ev.currency] || "🌍"} {ev.currency} · {ev.impact} impact
                                        </span>
                                        <span className="choice-meta" style={{ marginTop: "0.35rem", textTransform: "none", letterSpacing: 0 }}>
                                            Forecast {ev.forecast} · Previous {ev.previous}
                                            {ev.actual ? ` · Actual ${ev.actual}` : ""}
                                        </span>
                                    </div>
                                    <span
                                        className="choice-trail"
                                        style={{ color: impactDot[ev.impact] }}
                                        title={ev.impact}
                                    >
                                        ●
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="card" style={{ marginTop: "1.5rem" }}>
                        <p className="kicker" style={{ marginBottom: "0.75rem" }}>How to read impact</p>
                        <div style={{ display: "grid", gap: "0.75rem", textAlign: "left" }}>
                            <p className="lede" style={{ fontSize: "0.95rem" }}>
                                <span className="impact-high">High</span> — NFP, CPI, central banks. Expect volatility.
                            </p>
                            <p className="lede" style={{ fontSize: "0.95rem" }}>
                                <span className="impact-medium">Medium</span> — Notable data; watch for moderate moves.
                            </p>
                            <p className="lede" style={{ fontSize: "0.95rem" }}>
                                <span className="impact-low">Low</span> — Usually limited reaction; safer around the print.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="split">
                    <div style={{ display: "grid", gap: "1rem" }}>
                        <div className="card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                <h3 className="font-display" style={{ fontSize: "1.15rem", margin: 0 }}>May 2026</h3>
                                <div style={{ display: "flex", gap: "0.35rem" }}>
                                    <button type="button" className="btn ghost" style={{ minHeight: 36, minWidth: 36, padding: "0.25rem 0.6rem", width: "auto" }}>←</button>
                                    <button type="button" className="btn ghost" style={{ minHeight: 36, minWidth: 36, padding: "0.25rem 0.6rem", width: "auto" }}>→</button>
                                </div>
                            </div>
                            <div className="choice-meta" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem", textAlign: "center", marginBottom: "0.5rem" }}>
                                {"SMTWTFS".split("").map((d, i) => <div key={i}>{d}</div>)}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem", textAlign: "center" }}>
                                {Array.from({ length: 31 }).map((_, i) => {
                                    const day = i + 1;
                                    const hasEvent = communityEvents.some(e => e.date?.endsWith(`-${day < 10 ? "0" + day : day}`));
                                    return (
                                        <div
                                            key={i}
                                            className={hasEvent ? "badge badge-chalk" : ""}
                                            style={{
                                                padding: "0.4rem 0",
                                                borderRadius: "0.65rem",
                                                fontWeight: hasEvent ? 700 : 500,
                                                color: hasEvent ? undefined : "var(--muted)",
                                            }}
                                        >
                                            {day}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="card">
                            <p className="kicker" style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                                <Info size={14} /> About events
                            </p>
                            <p className="lede" style={{ fontSize: "0.95rem" }}>
                                Community events are scheduled by the Tradey Markets team. Registered users get a reminder 15 minutes before start.
                            </p>
                        </div>
                    </div>

                    <ul className="choice-list">
                        {communityEvents.length === 0 ? (
                            <li className="card status" style={{ textAlign: "center" }}>No community events scheduled yet.</li>
                        ) : (
                            communityEvents.map((event) => (
                                <li key={event.id}>
                                    <div className="choice-card" style={{ gridTemplateColumns: "1fr", alignItems: "stretch", gap: "0.85rem" }}>
                                        <div className="choice-copy">
                                            <span className="choice-meta" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                <span className={`badge ${event.impact === "high" ? "badge-pencil" : event.impact === "medium" ? "badge-mark" : "badge-chalk"}`}>
                                                    {event.type}
                                                </span>
                                                <Clock size={12} /> {event.time}
                                            </span>
                                            <strong style={{ fontSize: "1.1rem" }}>{event.title}</strong>
                                            <span className="lede" style={{ fontSize: "0.95rem" }}>{event.description}</span>
                                            <span className="choice-meta">
                                                {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
                                            </span>
                                        </div>
                                        <button type="button" className="btn secondary">Add to Calendar</button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
