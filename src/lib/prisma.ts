import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const globalForPrisma = globalThis as unknown as {
    prisma: any;
    pool: Pool | undefined;
};

let prismaInstance: any;

if (typeof window === "undefined") {
    // Use the NON-POOLING direct connection for the pg adapter at runtime.
    // The pooled URL (POSTGRES_PRISMA_URL) uses pgBouncer which is incompatible with pg.Pool.
    const connectionString =
        process.env.DATABASE_URL_UNPOOLED ??
        process.env.POSTGRES_URL_NON_POOLING ??
        process.env.DATABASE_URL;

    if (connectionString) {
        let pool: Pool;
        if (globalForPrisma.pool) {
            pool = globalForPrisma.pool;
        } else {
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
            }
        }

        if (globalForPrisma.prisma) {
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
            
            // Add global query retry extension to handle Neon DB cold starts/timeouts
            prismaInstance = basePrismaInstance.$extends({
                query: {
                    async $allOperations({ model, operation, args, query }) {
                        let retries = 3;
                        let delay = 1500;
                        while (retries > 0) {
                            try {
                                return await query(args);
                            } catch (error: any) {
                                const isTimeout =
                                    error.code === "ETIMEDOUT" ||
                                    error.message?.includes("timeout") ||
                                    error.message?.includes("ETIMEDOUT") ||
                                    error.message?.includes("pool");
                                
                                if (isTimeout && retries > 1) {
                                    console.warn(`[Prisma Extension] Connection timed out on ${model}.${operation}. Retrying in ${delay}ms... (${retries - 1} left)`);
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

