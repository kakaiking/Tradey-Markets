"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton({
    href,
    fallbackHref = "/",
    className = "",
    label = "Go back",
}: {
    href?: string;
    fallbackHref?: string;
    className?: string;
    label?: string;
}) {
    const router = useRouter();

    return (
        <button
            type="button"
            className={["history-back", className].filter(Boolean).join(" ")}
            aria-label={label}
            onClick={() => {
                if (href) {
                    router.push(href);
                    return;
                }
                if (typeof window !== "undefined" && window.history.length > 1) {
                    router.back();
                    return;
                }
                router.push(fallbackHref);
            }}
        >
            <ChevronLeft size={28} strokeWidth={2.5} aria-hidden />
        </button>
    );
}
