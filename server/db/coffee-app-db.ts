import dotenv from "dotenv";
dotenv.config();
import { Pool, QueryResult, QueryResultRow } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function query<T extends QueryResultRow = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const res: QueryResult<T> = await pool.query(text, params);
  return res.rows;
}

export default pool;
