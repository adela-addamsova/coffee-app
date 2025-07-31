import type { Database as DBType } from "better-sqlite3";

export function initializeReservations(dbInstance: DBType): void {
  dbInstance
    .prepare(
      `
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      datetime TEXT NOT NULL,
      guests INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME
    )
  `,
    )
    .run();
}

export function initializeProducts(dbInstance: DBType): void {
  dbInstance
    .prepare(
      `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        image_url TEXT NOT NULL,
        category TEXT,
        price REAL NOT NULL,
        ingredients TEXT,
        weight TEXT,
        origin TEXT,
        taste_profile TEXT,
        full_description TEXT,
        stock INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        deleted_at DATETIME
    )
    `,
    )
    .run();
}

export function initializeSubscribers(dbInstance: DBType): void {
  dbInstance
    .prepare(
      `
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      deleted_at DATETIME,
      ip_address TEXT
    )
  `,
    )
    .run();
}

export default function initializeDatabase(dbInstance: DBType): void {
  initializeReservations(dbInstance);
  initializeProducts(dbInstance);
  initializeSubscribers(dbInstance);
}
