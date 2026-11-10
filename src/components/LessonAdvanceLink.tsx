"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { completeLesson } from "@/lib/completeLessonClient";

type Props = {
    href: string;
    gradeId: string;
    lessonSlug: string;
    className?: string;
    children: ReactNode;
};

/**
 * Footer advance control: marks the current lesson complete, then navigates.
 * Prevents the race where Next fires before CompletedLesson is written.
 */
export function LessonAdvanceLink({
    href,
    gradeId,
    lessonSlug,
    className,
    children,
}: Props) {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function handleClick(e: MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        if (pending) return;
        setPending(true);
        try {
            await completeLesson({ gradeId, lessonSlug });
            router.push(href);
            router.refresh();
        } catch {
            router.push(href);
        } finally {
            setPending(false);
        }
    }

    return (
        <a
            href={href}
            className={className}
            onClick={handleClick}
            aria-busy={pending || undefined}
        >
            {children}
        </a>
    );
}
