import { query } from "./coffee-app-db";

const MAX_CAPACITY = 10;

export interface Reservation {
  id: number;
  name: string;
  email: string;
  datetime: string;
  guests: number;
}

export interface ReservationSummary {
  totalguests: number | null;
}

/**
 * Core hours configuration.
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
export async function getAllReservations(): Promise<Reservation[]> {
  return query<Reservation>("SELECT * FROM reservations");
}

/**
 * Inserts a new reservation if the time and guest count are valid
 * @returns {boolean} True if successful, false if time or capacity is invalid
 */
export async function createReservationIfAvailable(
  name: string,
  email: string,
  datetime: string,
  guests: number,
): Promise<boolean> {
  if (!isValidReservationTime(datetime)) {
    return false;
  }

  const result = await query<ReservationSummary>(
    `
    SELECT SUM(guests) AS totalguests
    FROM reservations
    WHERE datetime = $1
    `,
    [datetime],
  );

  const currentGuests = result[0]?.totalguests ?? 0;

  if (currentGuests + guests > MAX_CAPACITY) {
    return false;
  }

  await query(
    `
    INSERT INTO reservations (name, email, datetime, guests)
    VALUES ($1, $2, $3, $4)
    `,
    [name, email, datetime, guests],
  );

  return true;
}
