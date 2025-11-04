import path from "path";
import dotenv from "dotenv";
import { Pool } from "pg";
import { initializeDatabase } from "../db/init-db";

process.env.NODE_ENV = "test";
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

export const testPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

export async function initializeTestDb() {
  try {
    await initializeDatabase(testPool);
  } catch (_err) {
    //
  }
}

export async function clearTestDb() {
  try {
    await testPool.query(`
      TRUNCATE TABLE 
        newsletter_subscribers, 
        reservations, 
        products,
        orders,
        order_items
      RESTART IDENTITY CASCADE
    `);
  } catch (_err) {
    //
  }
}
