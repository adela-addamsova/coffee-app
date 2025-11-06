jest.mock("@db/newsletter-db", () => ({
  isEmailSubscribed: jest.fn(),
  insertNewsletterSubscriber: jest.fn(),
}));

import request from "supertest";
import express from "express";

import newsletterRouter from "@routes/subscription.routes";
import {
  insertNewsletterSubscriber,
  isEmailSubscribed,
} from "@db/newsletter-db";
import { testPool } from "@server/tests/coffee-app-test-db";

describe("POST /api/subscribe", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/subscribe", newsletterRouter(testPool));
  });

  afterAll(async () => {
    await testPool.end();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should subscribe successfully", async () => {
    (isEmailSubscribed as jest.Mock).mockResolvedValue(false);
    (insertNewsletterSubscriber as jest.Mock).mockResolvedValue({ id: 123 });

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
      error: "errors.invalid-email",
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
