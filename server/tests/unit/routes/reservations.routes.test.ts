jest.mock("@db/reservations-db", () => ({
  getAllReservations: jest.fn(),
  createReservationIfAvailable: jest.fn(),
}));

import {
  getAllReservations,
  createReservationIfAvailable,
} from "@db/reservations-db";

import request from "supertest";
import app from "@server/server";

describe("Reservations API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/reservations", () => {
    test("should return all reservations", async () => {
      const mockReservations = [
        {
          id: 1,
          name: "John Doe",
          email: "test@example.com",
          datetime: "2025-07-26T08:00:00.000Z",
          guests: 2,
        },
      ];
      (getAllReservations as jest.Mock).mockReturnValue(mockReservations);

      const res = await request(app).get("/api/reservations");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockReservations);
    });

    test("should handle internal error", async () => {
      (getAllReservations as jest.Mock).mockImplementation(() => {
        throw new Error("DB failure");
      });

      const res = await request(app).get("/api/reservations");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Failed to fetch reservations" });
    });
  });

  describe("POST /api/reservations/reserve", () => {
    const validResevation = {
      name: "John Doe",
      email: "test@gmail.com",
      datetime: "2025-07-26T08:00:00.000Z",
      guests: 2,
      remainingSeats: 10,
    };

    test("should create a reservation if slot is available", async () => {
      (createReservationIfAvailable as jest.Mock).mockReturnValue(true);

      const res = await request(app)
        .post("/api/reservations/reserve")
        .send(validResevation);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Reservation successful" });
    });

    test("should return 400 if slot is already booked", async () => {
      (createReservationIfAvailable as jest.Mock).mockReturnValue(false);

      const res = await request(app)
        .post("/api/reservations/reserve")
        .send(validResevation);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Time slot already booked out" });
    });

    test("should return 400 for invalid input", async () => {
      const invalidReservation = { ...validResevation, email: "invalid-email" };

      const res = await request(app)
        .post("/api/reservations/reserve")
        .send(invalidReservation);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Validation failed");
      expect(res.body).toHaveProperty("errors");
    });

    test("should handle server error", async () => {
      (createReservationIfAvailable as jest.Mock).mockImplementation(() => {
        throw new Error("DB error");
      });

      const res = await request(app)
        .post("/api/reservations/reserve")
        .send(validResevation);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Server error" });
    });
  });
});
