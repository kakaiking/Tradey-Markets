import Link from "next/link";
import { webinars } from "@/lib/data";
import { PageHead } from "@/components/layout/PageHead";

export default function WebinarsPage() {
    const upcoming = webinars.filter(w => w.status === "upcoming");
    const replays = webinars.filter(w => w.status === "replay");

    return (
        <div>
            <PageHead
                title="Live Webinars"
                byline="Live education"
                lede="Weekly sessions with professional traders. Register, watch live, or catch the replay."
            />

            <div className="card" style={{ marginBottom: "1.5rem" }}>
                <span className="badge badge-pencil" style={{ marginBottom: "0.75rem" }}>Next live · Mon, Mar 9</span>
                <h2 className="font-display" style={{ fontSize: "1.4rem", marginBottom: "0.35rem" }}>Weekly Market Outlook: NFP Week Special</h2>
                <p className="lede" style={{ fontSize: "0.95rem", marginBottom: "1rem" }}>Hosted by Alex Rivera · 09:00 EST · 60 min · 847 registered</p>
                <button type="button" className="btn">Register free</button>
            </div>

            <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>Upcoming</p>
            <ul className="choice-list" style={{ marginBottom: "1.5rem" }}>
                {upcoming.map(w => (
                    <li key={w.id}>
                        <div className="choice-card" style={{ cursor: "default" }}>
                            <div className="choice-copy">
                                <strong>{w.title}</strong>
                                <span className="choice-meta">{w.category} · {w.date} · {w.time}</span>
                            </div>
                            <span className="badge">{w.status}</span>
                        </div>
                    </li>
                ))}
            </ul>

            <p className="kicker" style={{ marginBottom: "0.75rem", textAlign: "left" }}>Replays</p>
            <ul className="choice-list">
                {replays.map(w => (
                    <li key={w.id}>
                        <Link href="#" className="choice-card">
                            <div className="choice-copy">
                                <strong>{w.title}</strong>
                                <span className="choice-meta">{w.category} · {w.date}</span>
                            </div>
                            <span className="choice-trail">Watch</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
