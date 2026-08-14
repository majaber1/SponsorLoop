import { Pool, type QueryResultRow } from "pg";

const globalForDb = globalThis as unknown as { sponsorLoopPool?: Pool };

export const databaseEnabled = Boolean(process.env.DATABASE_URL);

export const pool = databaseEnabled
  ? globalForDb.sponsorLoopPool ?? new Pool({ connectionString: process.env.DATABASE_URL, max: 10 })
  : null;

if (process.env.NODE_ENV !== "production" && pool) globalForDb.sponsorLoopPool = pool;

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []) {
  if (!pool) throw new Error("DATABASE_URL is not configured");
  return pool.query<T>(text, values);
}
