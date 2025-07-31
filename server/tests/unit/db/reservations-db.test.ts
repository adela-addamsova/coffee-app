import Database from "better-sqlite3";
import type { Database as DBType } from "better-sqlite3";
import {
  getAllReservations,
  createReservationIfAvailable,
  Reservation,
} from "@db/reservations-db";
import { initializeReservations } from "@db/init-db";

let testDb: DBType;

beforeEach(() => {
  testDb = new Database(":memory:");
  initializeReservations(testDb);

  const insert = testDb.prepare(`
    INSERT INTO reservations (name, email, datetime, guests)
    VALUES (?, ?, ?, ?)
  `);

  insert.run("Alice", "alice@example.com", "2025-08-01T12:00:00", 4);
  insert.run("Bob", "bob@example.com", "2025-08-01T12:00:00", 3);
});

afterEach(() => {
  testDb.close();
});

describe("Reservations DB operations", () => {
  test("returns all reservations", () => {
    const reservations: Reservation[] = getAllReservations(testDb);
    expect(reservations.length).toBe(2);
    expect(reservations[0]).toHaveProperty("name", "Alice");
    expect(reservations[1]).toHaveProperty("name", "Bob");
  });

  test("inserts reservation if capacity allows", () => {
    const success = createReservationIfAvailable(
      "Charlie",
      "charlie@example.com",
      "2025-08-01T12:00:00",
      3,
      testDb,
    );
    expect(success).toBe(true);
  });

  test("returns false if capacity exceeded", () => {
    const success = createReservationIfAvailable(
      "Dave",
      "dave@example.com",
      "2025-08-01T12:00:00",
      4,
      testDb,
    );
    expect(success).toBe(false);
  });

  test("allows reservation at different time", () => {
    const success = createReservationIfAvailable(
      "Eve",
      "eve@example.com",
      "2025-08-01T13:00:00",
      8,
      testDb,
    );
    expect(success).toBe(true);
  });

  test("returns false for time outside core hours", () => {
    const success = createReservationIfAvailable(
      "Zoe",
      "zoe@example.com",
      "2025-08-01T19:00:00",
      2,
      testDb,
    );
    expect(success).toBe(false);
  });
});
