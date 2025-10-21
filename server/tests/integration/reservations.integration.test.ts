import request from "supertest";
import express from "express";
import { testPool, initializeTestDb, clearTestDb } from "../coffee-app-test-db";
import reservationRouter from "@routes/reservations.routes";
import { Reservation } from "@db/reservations-db";

let app: express.Express;

beforeAll(async () => {
  await initializeTestDb();
});

afterAll(async () => {
  await testPool.end();
});

beforeEach(async () => {
  await clearTestDb();

  await testPool.query(
    `
    INSERT INTO reservations (name, email, datetime, guests)
    VALUES 
    ($1, $2, $3, $4),
    ($5, $6, $7, $8),
    ($9, $10, $11, $12)
  `,
    [
      "John Doe",
      "test1@example.com",
      "2025-07-26T08:00:00.000Z",
      2,
      "Jane Doe",
      "test2@example.com",
      "2025-07-26T08:00:00.000Z",
      2,
      "John Smith",
      "test3@example.com",
      "2025-07-26T08:00:00.000Z",
      2,
    ],
  );

  app = express();
  app.use(express.json());

  app.use("/api/reservations", reservationRouter(testPool));
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
    const originalQuery = testPool.query;
    testPool.query = jest.fn().mockRejectedValue(new Error("DB error"));
    const res = await request(app)
      .post("/api/reservations/reserve")
      .send(validReservation);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Server error");

    testPool.query = originalQuery;
  });
});
