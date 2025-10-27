import type { Pool } from "pg";

export async function initializeReservations(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reservations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      datetime TIMESTAMP NOT NULL,
      guests INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP
    );
  `);
}

export async function initializeProducts(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL,
      category TEXT,
      price NUMERIC(10,2) NOT NULL,
      ingredients TEXT,
      weight TEXT,
      origin TEXT,
      taste_profile TEXT,
      full_description TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP,
      deleted_at TIMESTAMP
    );
  `);
}

export async function initializeSubscribers(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP,
      deleted_at TIMESTAMP,
      ip_address TEXT
    );
  `);
}

export async function initializeOrders(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      customer_city TEXT NOT NULL,
      customer_postalcode TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipment_method TEXT NOT NULL CHECK (shipment_method IN ('standard','express')),
      payment_method TEXT NOT NULL CHECK (payment_method IN ('card','bank-transfer','cash')),
      total_amount INTEGER NOT NULL,
      paid BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP,
      deleted_at TIMESTAMP
    );
  `);
}

export async function initializeOrderItems(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id),
      quantity INTEGER NOT NULL,
      price INTEGER NOT NULL
    );
  `);
}

export async function initializeDatabase(pool: Pool): Promise<void> {
  await initializeReservations(pool);
  await initializeProducts(pool);
  await initializeSubscribers(pool);
  await initializeOrders(pool);
  await initializeOrderItems(pool);
}
