const Database = require('better-sqlite3');

const db = new Database('reservations.db');
const MAX_CAPACITY = 10;

// Create table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    datetime TEXT NOT NULL,
    guests INTEGER NOT NULL
  )
`).run();

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

module.exports = {
  getAllReservations,
  createReservationIfAvailable,
};
