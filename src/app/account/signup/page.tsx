"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [terms, setTerms] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!username || !email || !password) {
            setError("All fields are required.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (!terms) {
            setError("You must agree to the Terms of Service and Privacy Policy.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong during signup.");
            }

            router.push("/");
            setTimeout(() => {
                window.location.reload();
            }, 300);
        } catch (err: any) {
            setError(err.message || "An error occurred.");
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
                    <h1 className="font-display" style={{ fontSize: "1.75rem", marginBottom: "0.35rem" }}>Create your account</h1>
                    <p className="lede">Join traders learning the markets for free</p>
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
                            <label className="label" htmlFor="signup-user">Username</label>
                            <input
                                id="signup-user"
                                type="text"
                                className="field"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="tradingpro42"
                                required
                            />
                        </div>
                        <div>
                            <label className="label" htmlFor="signup-email">Email</label>
                            <input
                                id="signup-email"
                                type="email"
                                className="field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="label" htmlFor="signup-pw">Password</label>
                            <input
                                id="signup-pw"
                                type="password"
                                className="field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                required
                            />
                        </div>

                        <label style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start", textAlign: "left", fontSize: "0.9rem", color: "var(--muted)", cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                checked={terms}
                                onChange={(e) => setTerms(e.target.checked)}
                                style={{ marginTop: "0.2rem", width: "1.1rem", height: "1.1rem", accentColor: "var(--chalk)" }}
                            />
                            <span>
                                I agree to the <Link href="/terms" style={{ color: "var(--chalk)", fontWeight: 700 }}>Terms</Link> and{" "}
                                <Link href="/privacy" style={{ color: "var(--chalk)", fontWeight: 700 }}>Privacy Policy</Link>
                            </span>
                        </label>

                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? "Creating account..." : "Create free account"}
                        </button>
                    </form>

                    <p className="status" style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.95rem" }}>
                        Already have an account?{" "}
                        <Link href="/account/signin" style={{ color: "var(--chalk)", fontWeight: 700 }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
