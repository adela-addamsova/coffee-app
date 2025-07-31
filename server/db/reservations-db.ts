import type { Database as DBType } from "better-sqlite3";

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
 * Core hours configuration.
 * Example: 9:00–17:00 on weekdays, 10:00–14:00 on weekends
 */
function isValidReservationTime(datetimeStr: string): boolean {
  const date = new Date(datetimeStr);
  if (isNaN(date.getTime())) return false;

  const day = date.getDay();
  const hour = date.getHours();
  const minute = date.getMinutes();

  // Weekdays: 9:00–17:00
  if (day >= 1 && day <= 5) {
    return hour >= 6 && (hour < 17 || (hour === 17 && minute === 0));
  }

  // Weekends: 10:00–14:00
  if (day === 0 || day === 6) {
    return hour >= 7 && (hour < 17 || (hour === 17 && minute === 0));
  }

  return false;
}

/**
 * Returns all reservations from the DB.
 */
function getAllReservations(dbInstance: DBType): Reservation[] {
  return dbInstance
    .prepare(`SELECT * FROM reservations`)
    .all() as Reservation[];
}

/**
 * Inserts a new reservation if the time and guest count are valid
 * @returns {boolean} True if successful, false if time or capacity is invalid
 */
function createReservationIfAvailable(
  name: string,
  email: string,
  datetime: string,
  guests: number,
  dbInstance: DBType,
): boolean {
  if (!isValidReservationTime(datetime)) {
    return false;
  }

  const result = dbInstance
    .prepare(
      `
    SELECT SUM(guests) as totalGuests FROM reservations WHERE datetime = ?
  `,
    )
    .get(datetime) as ReservationSummary;

  const currentGuests = result?.totalGuests ?? 0;

  if (currentGuests + guests > MAX_CAPACITY) {
    return false;
  }

  dbInstance
    .prepare(
      `
    INSERT INTO reservations (name, email, datetime, guests)
    VALUES (?, ?, ?, ?)
  `,
    )
    .run(name, email, datetime, guests);

  return true;
}

export { getAllReservations, createReservationIfAvailable };
