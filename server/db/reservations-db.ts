import db from './coffee-app-db';

const MAX_CAPACITY = 10;

export interface Reservation {
  id: number;
  name: string;
  email: string;
  datetime: string;
  guests: number;
}

export interface ReservationSummary {
  totalGuests: number | null;
}

/**
 * Returns all reservations from the DB.
 */
function getAllReservations(): Reservation[] {
  return db.prepare(`SELECT * FROM reservations`).all() as Reservation[];
}

/**
 * Inserts a new reservation if the current guest count allows it
 * @returns {boolean} True if successful, false if capacity exceeded
 */
function createReservationIfAvailable(
  name: string,
  email: string,
  datetime: string,
  guests: number
): boolean {
  const result = db.prepare(`
    SELECT SUM(guests) as totalGuests FROM reservations WHERE datetime = ?
  `).get(datetime) as ReservationSummary;

  const currentGuests = result?.totalGuests ?? 0;

  if (currentGuests + guests > MAX_CAPACITY) {
    return false;
  }

  db.prepare(`
    INSERT INTO reservations (name, email, datetime, guests)
    VALUES (?, ?, ?, ?)
  `).run(name, email, datetime, guests);

  return true;
}

export {
  getAllReservations,
  createReservationIfAvailable
};