"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const cleanPathname = pathname.replace(/\/$/, "");
    const isVideosPage = cleanPathname === "/learn/videos";
    const isQuestionCardsPage = cleanPathname === "/learn/question-cards";

    // Only video/card surfaces need locked overflow; school pages scroll normally.
    if (isVideosPage || isQuestionCardsPage) {
        return (
            <div
                className={
                    isVideosPage
                        ? "relative h-full min-h-0 flex-1 w-full overflow-hidden"
                        : "relative h-[calc(100dvh-var(--header-h))] md:h-full min-h-[60vh] w-full overflow-hidden"
                }
            >
                {children}
            </div>
        );
    }

    return <div className="school-shell">{children}</div>;
}
