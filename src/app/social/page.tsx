import { socialPosts } from "@/lib/data";
import { PageHead } from "@/components/layout/PageHead";

export default function SocialPage() {
    return (
        <div>
            <PageHead
                title="Social Trade Feed"
                byline="Community ideas"
                lede="See how other traders are setting up entries, stops, and targets."
            />

            <ul className="choice-list">
                {socialPosts.map((post) => (
                    <li key={post.id}>
                        <div className="card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                                <div className="choice-copy">
                                    <strong>{post.author} {post.verified ? "✓" : ""}</strong>
                                    <span className="choice-meta">{post.handle} · {post.time}</span>
                                </div>
                                <span className={`badge ${post.outcome === "win" ? "badge-chalk" : post.outcome === "active" ? "badge-mark" : ""}`}>
                                    {post.outcome}
                                </span>
                            </div>

                            <div className="choice-card" style={{ cursor: "default", marginBottom: "0.75rem" }}>
                                <div className="choice-copy">
                                    <strong style={{ color: post.direction === "BUY" ? "var(--chalk)" : "var(--pencil)" }}>
                                        {post.direction} {post.pair}
                                    </strong>
                                    <span className="choice-meta font-tape" style={{ textTransform: "none" }}>
                                        Entry {post.entry} · SL {post.sl} · TP {post.tp}
                                    </span>
                                </div>
                            </div>

                            <p className="lede" style={{ fontSize: "0.95rem", marginBottom: "0.75rem" }}>{post.content}</p>

                            <div style={{ display: "flex", gap: "1rem" }}>
                                <span className="choice-meta">{post.likes} likes</span>
                                <span className="choice-meta">{post.comments} comments</span>
                                <button type="button" className="btn ghost" style={{ width: "auto", minHeight: 36, padding: "0.25rem 0.75rem", marginLeft: "auto" }}>
                                    Copy setup
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
