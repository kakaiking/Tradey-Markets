"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { cachedJson, invalidateClientCache } from "@/lib/clientCache";

type AuthGateLinkProps = {
    href: string;
    className?: string;
    children: ReactNode;
};

export function AuthGateLink({ href, className, children }: AuthGateLinkProps) {
    const router = useRouter();

    async function onClick(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        try {
            invalidateClientCache("auth-me");
            const data = await cachedJson<{ user: unknown } | null>(
                "auth-me",
                "/api/auth/me",
                120_000
            );
            if (data?.user) {
                router.push(href);
                return;
            }
        } catch {
            /* treat as logged out */
        }
        router.push(`/account/signin?next=${encodeURIComponent(href)}`);
    }

    return (
        <Link href={href} className={className} onClick={onClick}>
            {children}
        </Link>
    );
}
