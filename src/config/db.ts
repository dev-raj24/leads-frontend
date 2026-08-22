// config/db.ts — the ONE place a Postgres connection is created.
// Services import `db` from here and write raw SQL. No query builder.

import { Pool } from "pg";
import { env } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var __leadworksPool: Pool | undefined;
}

function createPool(): Pool | null {
  if (!env.databaseUrl) return null;
  return new Pool({
    connectionString: env.databaseUrl,
    max: 10,
    idleTimeoutMillis: 30_000,
  });
}

// Reuse the pool across hot-reloads in dev (Next.js re-evaluates modules).
export const pool = global.__leadworksPool ?? createPool();
if (!env.isProd) global.__leadworksPool = pool ?? undefined;

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "DATABASE_URL is not set. Add it to .env.local (see .env.example) to connect a Postgres database."
    );
    this.name = "DatabaseNotConfiguredError";
  }
}

/** Thin query helper every service calls. Always parametrized ($1, $2 ...). */
export async function query<T = unknown>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  if (!pool) throw new DatabaseNotConfiguredError();
  const result = await pool.query(text, params);
  return result.rows as T[];
}
