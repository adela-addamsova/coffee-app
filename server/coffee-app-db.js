const Database = require('better-sqlite3');
const path = require('path');

// Opens your binary SQLite file located next to this file
const db = new Database(path.join(__dirname, 'coffee-app.db'), { timeout: 5000 });

const MAX_CAPACITY = 10;

// Create table if it doesn't exist
function initializeDatabase() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      datetime TEXT NOT NULL,
      guests INTEGER NOT NULL
    )
  `).run();

  db.prepare(`
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
      stock INTEGER NOT NULL DEFAULT 0
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      deleted_at DATETIME,
      ip_address TEXT
    )
  `).run();
}

initializeDatabase();

/**
 * Returns all reservations from the DB.
 */
function getAllReservations() {
  return db.prepare(`SELECT * FROM reservations`).all();
}

/**
 * Inserts a new reservation if the current guest count allows it.
 * @returns {boolean} True if successful, false if capacity exceeded.
 */
function createReservationIfAvailable(name, email, datetime, guests) {
  const result = db.prepare(`
    SELECT SUM(guests) as totalGuests FROM reservations WHERE datetime = ?
  `).get(datetime);

  const currentGuests = result.totalGuests || 0;

  if (currentGuests + guests > MAX_CAPACITY) {
    return false;
  }

  db.prepare(`
    INSERT INTO reservations (name, email, datetime, guests)
    VALUES (?, ?, ?, ?)
  `).run(name, email, datetime, guests);

  return true;
}

function getLatestProducts(limit = 4) {
  return db.prepare(`
    SELECT id, title, category, price, image_url
    FROM products
    WHERE deleted_at IS NULL
    AND stock > 0
    ORDER BY datetime(created_at) DESC
    LIMIT ?;
  `).all(limit);
}


function getAllProducts() {
  return db.prepare(`
    SELECT id, title, category, price, image_url
    FROM products
    WHERE deleted_at IS NULL
    AND stock > 0
    ORDER BY datetime(created_at) DESC;
  `).all();
}

function getProductsByCategory(category) {
  return db.prepare(`
    SELECT id, title, category, price, image_url
    FROM products
    WHERE deleted_at IS NULL AND stock > 0 AND category = ?
    ORDER BY datetime(created_at) DESC;
  `).all(category);
}

function getProductById(id, category) {
  return db.prepare(`
    SELECT *
    FROM products
    WHERE deleted_at IS NULL AND stock > 0 AND id = ? AND category = ?;
  `).get(id, category);
}

function isEmailSubscribed(email) {
  const result = db.prepare(`
    SELECT id FROM newsletter_subscribers
    WHERE email = ? AND deleted_at IS NULL
  `).get(email);

  return !!result;
}

function insertNewsletterSubscriber(email, ip_address = null) {
  return db.prepare(`
    INSERT INTO newsletter_subscribers (email, ip_address)
    VALUES (?, ?)
  `).run(email, ip_address);
}

module.exports = {
  getAllReservations,
  createReservationIfAvailable,
  getLatestProducts,
  getAllProducts,
  getProductsByCategory,
  getProductById,
  insertNewsletterSubscriber,
  isEmailSubscribed
};

