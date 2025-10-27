process.env.NODE_ENV = "test";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

import { Pool } from "pg";
import { initializeDatabase } from "../db/init-db";

export const testPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

export async function initializeTestDb() {
  await initializeDatabase(testPool);
}

export async function clearTestDb() {
  await testPool.query(`
    TRUNCATE TABLE 
      newsletter_subscribers, 
      reservations, 
      products,
      orders,
      order_items
    RESTART IDENTITY CASCADE
  `);
}
