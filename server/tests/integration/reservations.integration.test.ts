import request from "supertest";
import express from "express";
import Database from "better-sqlite3";
import type { Database as DBType } from "better-sqlite3";
import reservationRouter from "@routes/reservations.routes";
import { Reservation } from "@db/reservations-db";
import { initializeReservations } from "@db/init-db";

let testDb: DBType;
let app: express.Express;

beforeEach(() => {
  testDb = new Database(":memory:");
  initializeReservations(testDb);

  const insert = testDb.prepare(`
    INSERT INTO reservations (name, email, datetime, guests)
    VALUES (?, ?, ?, ?);
  `);

  insert.run("John Doe", "test1@example.com", "2025-07-26T08:00:00.000Z", 2);
  insert.run("Jane Doe", "test2@example.com", "2025-07-26T08:00:00.000Z", 2);
  insert.run("John Smith", "test3@example.com", "2025-07-26T08:00:00.000Z", 2);

  app = express();
  app.use(express.json());

  app.use("/api/reservations", reservationRouter(testDb));
});

afterEach(() => {
  try {
    testDb.close();
  } catch {
    // Ignore
  }
});

describe("Reservations API integration tests - GET /api/reservations", () => {
  test("returns all reservations that are not deleted", async () => {
    const res = await request(app).get("/api/reservations");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const reservations = res.body as Reservation[];
    expect(reservations.length).toBe(3);
    const emails = reservations.map((reservation) => reservation.email);
    expect(emails).toContain("test1@example.com");
    expect(emails).toContain("test2@example.com");
  });
});

describe("Reservations API integration tests - POST /api/reservations/reserve", () => {
  const validReservation = {
    name: "Zoe Doe",
    email: "test500@gmail.com",
    datetime: "2025-07-26T08:00:00.000Z",
    guests: 4,
    remainingSeats: 8,
  };

  test("creates a reservation when slot capacity allows", async () => {
    const res = await request(app)
      .post("/api/reservations/reserve")
      .send(validReservation);
    expect(res.status).toBe(200);
  });

  test("returns 400 if input is invalid", async () => {
    const res = await request(app)
      .post("/api/reservations/reserve")
      .send({
        ...validReservation,
        name: "Zoe",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Validation failed");
  });

  test("returns 400 if slot is booked", async () => {
    const res = await request(app)
      .post("/api/reservations/reserve")
      .send({
        ...validReservation,
        remainingSeats: 2,
      });

    expect(res.status).toBe(400);
  });

  test("returns 500 if db is closed", async () => {
    testDb.close();

    const res = await request(app)
      .post("/api/reservations/reserve")
      .send(validReservation);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Server error");
  });
});
