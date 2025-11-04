import dotenv from "dotenv";
import { Pool, QueryResultRow } from "pg";
import { initializeDatabase } from "../db/init-db";

const envFileMap: Record<string, string> = {
  production: ".env.production",
  development: ".env.development",
  test: ".env.test",
};

const envFile = envFileMap[process.env.NODE_ENV || "development"];
dotenv.config({ path: envFile });

const useSSL =
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "development";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
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
