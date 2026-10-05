"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function PageHead({
    title,
    byline,
    lede,
    trail,
    backHref,
}: {
    title?: string;
    byline?: ReactNode;
    lede?: ReactNode;
    trail?: ReactNode;
    backHref?: string;
}) {
    const router = useRouter();

    return (
        <header className="page-head">
            <div className="page-head-lead">
                <button
                    type="button"
                    className="history-back"
                    onClick={() => {
                        if (backHref) {
                            router.push(backHref);
                            return;
                        }
                        if (typeof window !== "undefined" && window.history.length > 1) {
                            router.back();
                            return;
                        }
                        router.push("/learn");
                    }}
                >
                    Back
                </button>
                {trail ? <div className="page-head-trail">{trail}</div> : null}
            </div>
            {title ? <h1>{title}</h1> : null}
            {byline ? (
                title ? (
                    <p className="kicker">{byline}</p>
                ) : (
                    <h1>{byline}</h1>
                )
            ) : null}
            {lede ? <p className="lede">{lede}</p> : null}
        </header>
    );
}
