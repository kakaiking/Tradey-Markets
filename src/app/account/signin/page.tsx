"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SigninPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!identifier || !password) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Invalid credentials. Please try again.");
            }

            router.push("/");
            setTimeout(() => {
                window.location.reload();
            }, 300);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-5) 0" }}>
            <div style={{ width: "min(100%, 24rem)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--space-5)" }}>
                    <Link href="/" className="font-display" style={{ fontSize: "1.5rem", fontWeight: 700, display: "inline-block", marginBottom: "1rem" }}>
                        Tradey Markets
                    </Link>
                    <h1 className="font-display" style={{ fontSize: "1.75rem", marginBottom: "0.35rem" }}>Welcome back</h1>
                    <p className="lede">Sign in to continue your trading journey</p>
                </div>

                <div className="card">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                        <button type="button" className="btn secondary" onClick={() => alert("Social login is coming soon!")}>
                            Google
                        </button>
                        <button type="button" className="btn secondary" onClick={() => alert("Social login is coming soon!")}>
                            Apple
                        </button>
                    </div>

                    <p className="kicker" style={{ textAlign: "center", marginBottom: "1rem" }}>or email</p>

                    {error && <p className="error" style={{ marginBottom: "0.75rem", textAlign: "center" }}>{error}</p>}

                    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
                        <div>
                            <label className="label" htmlFor="signin-id">Email or username</label>
                            <input
                                id="signin-id"
                                type="text"
                                className="field"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <label className="label" htmlFor="signin-pw">Password</label>
                                <a
                                    href="#"
                                    className="choice-meta"
                                    onClick={(e) => { e.preventDefault(); alert("Password reset is coming soon!"); }}
                                    style={{ color: "var(--chalk)" }}
                                >
                                    Forgot?
                                </a>
                            </div>
                            <input
                                id="signin-pw"
                                type="password"
                                className="field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="status" style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.95rem" }}>
                        Don&apos;t have an account?{" "}
                        <Link href="/account/signup" style={{ color: "var(--chalk)", fontWeight: 700 }}>Create account</Link>
                    </p>
                </div>

                <ul className="choice-list" style={{ marginTop: "1rem" }}>
                    {[
                        { title: "Free courses", meta: "Full curriculum" },
                        { title: "Streaks & XP", meta: "Stay consistent" },
                        { title: "AI insights", meta: "Journal coaching" },
                    ].map((item) => (
                        <li key={item.title}>
                            <div className="choice-card" style={{ cursor: "default" }}>
                                <div className="choice-copy">
                                    <strong>{item.title}</strong>
                                    <span className="choice-meta">{item.meta}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
