"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const cleanPathname = pathname.replace(/\/$/, "");
    const pathParts = cleanPathname.split("/").filter(Boolean);

    const isVideosPage = cleanPathname === "/learn/videos";
    const isLessonPage = pathParts.length === 3 && pathParts[0] === "learn";
    const isFullscreenPage = isVideosPage || isLessonPage;

    if (isFullscreenPage) {
        return (
            <div className="relative h-[calc(100dvh-var(--header-h))] md:h-full min-h-[60vh] w-full overflow-hidden">
                {children}
            </div>
        );
    }

    return <>{children}</>;
}
