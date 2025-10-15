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
    );
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
    );
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
    );
  `,
    )
    .run();
}

export function initializeOrders(dbInstance: DBType): void {
  dbInstance
    .prepare(
      `
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      customer_city TEXT NOT NULL,
      customer_postalcode TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipment_method TEXT NOT NULL CHECK(shipment_method IN ('standard','express')),
      payment_method TEXT NOT NULL CHECK(payment_method IN ('card','bank-transfer','cash')),
      total_amount INT NOT NULL,
      paid BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      deleted_at DATETIME
    );
  `,
    )
    .run();
}

export function initializeOrderItems(dbInstance: DBType): void {
  dbInstance
    .prepare(
      `
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price INT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `,
    )
    .run();
}

export default function initializeDatabase(dbInstance: DBType): void {
  initializeReservations(dbInstance);
  initializeProducts(dbInstance);
  initializeSubscribers(dbInstance);
  initializeOrders(dbInstance);
  initializeOrderItems(dbInstance);
}
