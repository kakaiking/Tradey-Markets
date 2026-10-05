import Link from "next/link";
import { latestArticles } from "@/lib/data";
import { PageHead } from "@/components/layout/PageHead";

const categories = ["All", "Recap", "Events", "Chart Art", "Analysis", "Psychology", "Crypto"];

export default function NewsPage() {
    const allArticles = [...latestArticles, ...latestArticles.map(a => ({ ...a, id: a.id + 100 }))];

    return (
        <div>
            <PageHead
                title="Market News"
                byline="Market intelligence"
                lede={`Daily forex & crypto coverage. Updated ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`}
            />

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem", justifyContent: "center" }}>
                {categories.map((cat, i) => (
                    <button key={cat} type="button" className={`filter-chip ${i === 0 ? "is-active" : ""}`} aria-pressed={i === 0}>
                        {cat}
                    </button>
                ))}
            </div>

            <ul className="choice-list">
                {allArticles.map((article) => (
                    <li key={article.id}>
                        <Link href={`/trading/${article.slug}`} className="choice-card">
                            <div className="choice-copy">
                                <strong>{article.title}</strong>
                                <span className="choice-meta">{article.category} · {article.date} · {article.readTime}</span>
                                <span className="lede" style={{ fontSize: "0.9rem" }}>{article.excerpt}</span>
                            </div>
                            <span className="choice-trail">→</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
