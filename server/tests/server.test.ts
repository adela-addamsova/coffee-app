import request from "supertest";
import app from "../server";
import { reservationResponseSchema } from "../../shared/ReservationFormValidationSchema";

describe("App Routes", () => {
  test("responds to GET /api/products with JSON array", async () => {
    const response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          category: expect.any(String),
          price: expect.any(Number),
          image_url: expect.any(String),
        }),
      ]),
    );
  });

  test("returns valid reservations - GET /api/reservations", async () => {
    const response = await request(app).get("/api/reservations");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    response.body.forEach((reservation: unknown) => {
      reservationResponseSchema.parse(reservation);
    });
  });

  test("responds 404 for unknown routes", async () => {
    const response = await request(app).get("/nonexistent-route");

    expect(response.status).toBe(404);
  });
});
