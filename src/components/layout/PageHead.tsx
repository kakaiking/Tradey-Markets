"use client";

import type { ReactNode } from "react";
import { BackButton } from "@/components/layout/BackButton";

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
    return (
        <header className="page-head">
            <div className="page-head-lead">
                <BackButton href={backHref} fallbackHref="/quizzes" />
                {title ? (
                    <h1 className="page-head-title">{title}</h1>
                ) : byline ? (
                    <h1 className="page-head-title">{byline}</h1>
                ) : (
                    <span className="page-head-title-spacer" aria-hidden />
                )}
                {trail ? <div className="page-head-trail">{trail}</div> : null}
            </div>
            {title && byline ? <p className="kicker">{byline}</p> : null}
            {lede ? <p className="lede">{lede}</p> : null}
        </header>
    );
}
