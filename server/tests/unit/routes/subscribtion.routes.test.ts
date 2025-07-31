jest.mock("@db/newsletter-db", () => ({
  isEmailSubscribed: jest.fn(),
  insertNewsletterSubscriber: jest.fn(),
}));

import request from "supertest";
import app from "@server/server";

import subscribtionRoutes from "@routes/subscribtion.routes";
import {
  insertNewsletterSubscriber,
  isEmailSubscribed,
} from "@db/newsletter-db";

app.use("/api/subscribe", subscribtionRoutes);

describe("POST /api/subscribe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should subscribe successfully", async () => {
    (isEmailSubscribed as jest.Mock).mockReturnValue(false);
    (insertNewsletterSubscriber as jest.Mock).mockReturnValue({
      lastInsertRowid: 123,
    });

    const response = await request(app)
      .post("/api/subscribe")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Subscription successful",
      id: 123,
    });
  });

  test("should reject already subscribed email", async () => {
    (isEmailSubscribed as jest.Mock).mockReturnValue(true);

    const response = await request(app)
      .post("/api/subscribe")
      .send({ email: "existing@example.com" });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error: "This email is already subscribed",
    });
  });

  test("should return 400 for invalid email", async () => {
    const response = await request(app)
      .post("/api/subscribe")
      .send({ email: "invalid" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Please enter a valid email address",
    });
  });

  test("should return 500 if DB insert fails", async () => {
    (isEmailSubscribed as jest.Mock).mockReturnValue(false);
    (insertNewsletterSubscriber as jest.Mock).mockImplementation(() => {
      throw new Error("DB error");
    });

    const response = await request(app)
      .post("/api/subscribe")
      .send({ email: "fail@example.com" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });
});
