/**
 * Node-only boot work. Kept out of instrumentation.ts so the Edge bundle
 * never sees Node built-ins (dns) or Prisma.
 */
export async function registerNode() {
    try {
        const dns = await import("dns");
        if (typeof dns.setDefaultResultOrder === "function") {
            dns.setDefaultResultOrder("ipv4first");
        }
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
