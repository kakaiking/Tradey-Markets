/**
 * Warm the Neon pooler on server boot so the first home request is less likely
 * to pay a cold-start tax. Also pin DNS to IPv4-first so Google OAuth fetches
 * don't hang on flaky IPv6 routes (common with VPN / home NAT).
 */
export async function register() {
    if (process.env.NEXT_RUNTIME !== "nodejs") return;

    try {
        const dns = await import("dns");
        dns.setDefaultResultOrder("ipv4first");
    } catch {
        // ignore — older runtimes without setDefaultResultOrder
    }

    try {
        const { prisma } = await import("@/lib/prisma");
        if (!prisma) return;
        await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
        console.warn("[instrumentation] DB warm ping skipped:", error);
    }
}
