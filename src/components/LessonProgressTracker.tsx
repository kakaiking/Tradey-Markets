"use client";

import { useEffect, useMemo, useRef } from "react";
import { cachedJson, invalidateClientCache } from "@/lib/clientCache";

type ProgressPayload = {
    resumes?: Record<string, { sectionId: string; gradeId: string }>;
} | null;

type Props = {
    gradeId: string;
    lessonSlug: string;
    sectionIds: string[];
};

export function LessonProgressTracker({ gradeId, lessonSlug, sectionIds }: Props) {
    const lastSavedRef = useRef<string | null>(null);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const signedInRef = useRef(false);
    const sectionKey = useMemo(() => sectionIds.join("|"), [sectionIds]);
    const ids = useMemo(() => sectionKey.split("|").filter(Boolean), [sectionKey]);

    useEffect(() => {
        let cancelled = false;

        async function restore() {
            // Explicit URL hash wins over saved resume
            if (typeof window !== "undefined" && window.location.hash) {
                return;
            }

            try {
                const me = await cachedJson<{ user: unknown } | null>("auth-me", "/api/auth/me", 120_000);
                if (cancelled || !me?.user) return;
                signedInRef.current = true;

                const progress = await cachedJson<ProgressPayload>("progress", "/api/user/progress", 15_000);
                const resume = progress?.resumes?.[lessonSlug];
                if (!resume?.sectionId || !ids.includes(resume.sectionId)) return;

                const el = document.getElementById(resume.sectionId);
                if (el) {
                    lastSavedRef.current = resume.sectionId;
                    // Defer so layout/images settle
                    requestAnimationFrame(() => {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                    });
                }
            } catch {
                /* guest or offline — ignore */
            }
        }

        restore();
        return () => {
            cancelled = true;
        };
    }, [lessonSlug, ids]);

    useEffect(() => {
        if (!ids.length) return;

        const saveSection = (sectionId: string) => {
            if (!signedInRef.current) return;
            if (lastSavedRef.current === sectionId) return;

            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
            saveTimerRef.current = setTimeout(async () => {
                try {
                    // Confirm signed in once (also covers late auth)
                    if (!signedInRef.current) {
                        const me = await cachedJson<{ user: unknown } | null>(
                            "auth-me",
                            "/api/auth/me",
                            120_000
                        );
                        if (!me?.user) return;
                        signedInRef.current = true;
                    }

                    const res = await fetch("/api/user/progress", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ gradeId, lessonSlug, sectionId }),
                    });
                    if (!res.ok) return;
                    lastSavedRef.current = sectionId;
                    invalidateClientCache("progress");
                } catch {
                    /* ignore save errors */
                }
            }, 1500);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                const top = visible[0];
                if (!top?.target?.id) return;
                saveSection(top.target.id);
            },
            {
                root: null,
                rootMargin: "-20% 0px -45% 0px",
                threshold: [0.15, 0.35, 0.55],
            }
        );

        for (const id of ids) {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        }

        // Kick auth check early so scroll saves work
        cachedJson<{ user: unknown } | null>("auth-me", "/api/auth/me", 120_000)
            .then((me) => {
                if (me?.user) signedInRef.current = true;
            })
            .catch(() => undefined);

        return () => {
            observer.disconnect();
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, [gradeId, lessonSlug, ids]);

    return null;
}
