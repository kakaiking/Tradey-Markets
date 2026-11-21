/**
 * Warm the Neon pooler on server boot so the first home request is less likely
 * to pay a cold-start tax. Also pin DNS to IPv4-first so Google OAuth fetches
 * don't hang on flaky IPv6 routes (common with VPN / home NAT).
 *
 * Node-only work lives in instrumentation.node.ts so Turbopack/Edge never
 * analyzes `dns` / Prisma imports in this entry file.
 */
export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { registerNode } = await import("./instrumentation.node");
        await registerNode();
    }
}
