import dotenv from "dotenv";
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

import { Pool, QueryResultRow } from "pg";
import { initializeDatabase } from "../db/init-db";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function query<T extends QueryResultRow = Record<string, unknown>>(
  text: string,
  params?: unknown[],
  poolInstance?: Pool,
): Promise<T[]> {
  const res = await (poolInstance || pool).query(text, params);
  return res.rows;
}

(async () => {
  try {
    await initializeDatabase(pool);
  } catch (_err) {
    //
  }
})();

export default pool;
