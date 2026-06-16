import { PrismaClient } from "@prisma/client";
import { log } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const isDev = process.env.NODE_ENV !== "production";

// In dev, wire up Prisma event listeners so we can observe queries and errors.
// Slow queries (>200 ms) are always flagged. All queries appear only with DEBUG_MODE=true.
// In production a plain client is returned — no overhead.
function createPrismaClient(): PrismaClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = isDev
    ? new PrismaClient({
        log: [
          { level: "warn", emit: "event" },
          { level: "error", emit: "event" },
          { level: "query", emit: "event" },
        ],
      })
    : new PrismaClient({ log: ["error"] });

  if (isDev) {
    client.$on("warn", (e: { message: string }) => log.db.warn(e.message));
    client.$on("error", (e: { message: string }) => log.db.error(e.message));
    client.$on("query", (e: { query: string; duration: number }) => {
      if (e.duration > 200) {
        log.db.slowQuery(e.query, e.duration);
      } else {
        log.db.query(e.query, e.duration);
      }
    });
  }

  return client as PrismaClient;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (isDev) globalForPrisma.prisma = prisma;
export default prisma;
