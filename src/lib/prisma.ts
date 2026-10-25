import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const globalForPrisma = globalThis as unknown as {
    prisma: any;
    pool: Pool | undefined;
    poolUrl: string | undefined;
};

let prismaInstance: any;

if (typeof window === "undefined") {
    // Prefer the Neon pooler. A suspended compute does not accept the direct
    // host (P1001), while the pooler accepts the connection and wakes it.
    // node-postgres uses unnamed statements, which Neon's transaction pooler allows.
    const connectionString =
        process.env.DATABASE_URL ??
        process.env.POSTGRES_PRISMA_URL ??
        process.env.POSTGRES_URL ??
        process.env.DATABASE_URL_UNPOOLED ??
        process.env.POSTGRES_URL_NON_POOLING;

    if (connectionString) {
        const previousUrl = globalForPrisma.poolUrl;
        let pool: Pool;
        if (globalForPrisma.pool && previousUrl === connectionString) {
            pool = globalForPrisma.pool;
        } else {
            if (globalForPrisma.pool) {
                void globalForPrisma.pool.end().catch(() => {});
            }
            const isDev = process.env.NODE_ENV !== "production";
            pool = new Pool({
                connectionString,
                max: isDev ? 5 : 10,
                idleTimeoutMillis: isDev ? 15000 : 30000,
                connectionTimeoutMillis: 15000,
            });
            pool.on("error", (err) => {
                console.error("Unexpected error on idle pg client:", err);
            });
            if (process.env.NODE_ENV !== "production") {
                globalForPrisma.pool = pool;
                globalForPrisma.poolUrl = connectionString;
            }
        }

        const poolChanged = previousUrl !== connectionString;
        if (globalForPrisma.prisma && !poolChanged) {
            prismaInstance = globalForPrisma.prisma;
        } else {
            const adapter = new PrismaPg(pool);
            const basePrismaInstance = new PrismaClient({
                adapter,
                log:
                    process.env.NODE_ENV === "development"
                        ? ["query", "warn"]
                        : [],
            });
            
            // Retry on Neon cold starts (P1001) and connection timeouts.
            prismaInstance = basePrismaInstance.$extends({
                query: {
                    async $allOperations({ model, operation, args, query }) {
                        let retries = 4;
                        let delay = 2000;
                        while (retries > 0) {
                            try {
                                return await query(args);
                            } catch (error: any) {
                                const message = error.message ?? "";
                                const isTransient =
                                    error.code === "P1001" ||
                                    error.code === "P1002" ||
                                    error.code === "ETIMEDOUT" ||
                                    error.code === "ECONNREFUSED" ||
                                    error.code === "ECONNRESET" ||
                                    message.includes("Can't reach database server") ||
                                    message.includes("timeout") ||
                                    message.includes("ETIMEDOUT") ||
                                    message.includes("Connection terminated") ||
                                    message.includes("pool");

                                if (isTransient && retries > 1) {
                                    console.warn(
                                        `[Prisma] Transient DB error on ${model}.${operation} (${error.code ?? "unknown"}). Retrying in ${delay}ms... (${retries - 1} left)`
                                    );
                                    await new Promise((resolve) => setTimeout(resolve, delay));
                                    retries--;
                                    delay *= 1.5;
                                } else {
                                    throw error;
                                }
                            }
                        }
                    },
                },
            });

            if (process.env.NODE_ENV !== "production") {
                globalForPrisma.prisma = prismaInstance;
            }
        }
    } else {
        prismaInstance = null as any;
    }
} else {
    prismaInstance = null as any;
}

export const prisma = prismaInstance;

