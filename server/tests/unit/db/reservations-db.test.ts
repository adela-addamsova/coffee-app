import {
  testPool,
  initializeTestDb,
  clearTestDb,
} from "../../coffee-app-test-db";
import {
  getAllReservations,
  createReservationIfAvailable,
  Reservation,
} from "@db/reservations-db";

beforeAll(async () => {
  await initializeTestDb();
});

afterAll(async () => {
  await testPool.end();
});

beforeEach(async () => {
  await clearTestDb();

  await testPool.query(`
    INSERT INTO reservations (name, email, datetime, guests)
    VALUES 
      ('Alice', 'alice@example.com', '2025-08-01T12:00:00', 4),
      ('Bob', 'bob@example.com', '2025-08-01T12:00:00', 3);
  `);

  await testPool.query("SELECT * FROM reservations");
});

describe("Reservations DB operations", () => {
  test("returns all reservations", async () => {
    const reservations: Reservation[] = await getAllReservations(testPool);
    expect(reservations.length).toBe(2);
    expect(reservations[0]).toHaveProperty("name", "Alice");
    expect(reservations[1]).toHaveProperty("name", "Bob");
  });

  test("inserts reservation if capacity allows", async () => {
    const success = await createReservationIfAvailable(
      "Charlie",
      "charlie@example.com",
      "2025-08-01T12:00:00",
      1,
      testPool,
    );
    expect(success).toBe(true);
  });

  test("returns false if capacity exceeded", async () => {
    const success = await createReservationIfAvailable(
      "Dave",
      "dave@example.com",
      "2025-08-01T12:00:00",
      4,
      testPool,
    );
    expect(success).toBe(false);
  });

  test("allows reservation at different time", async () => {
    const success = await createReservationIfAvailable(
      "Eve",
      "eve@example.com",
      "2025-08-01T13:00:00",
      8,
      testPool,
    );
    expect(success).toBe(true);
  });

  test("returns false for time outside core hours", async () => {
    const success = await createReservationIfAvailable(
      "Zoe",
      "zoe@example.com",
      "2025-08-01T19:00:00",
      2,
      testPool,
    );
    expect(success).toBe(false);
  });
});
