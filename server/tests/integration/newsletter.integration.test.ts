import request from "supertest";
import express from "express";
import { testPool, initializeTestDb, clearTestDb } from "../coffee-app-test-db";
import type { NewsletterSubscriber } from "@db/newsletter-db";
import newsletterRouter from "@routes/subscription.routes";

let app: express.Express;

beforeAll(async () => {
  await initializeTestDb();
});

afterAll(async () => {
  await testPool.end();
});

beforeEach(async () => {
  await clearTestDb();

  app = express();
  app.use(express.json());
  app.use("/api/subscribe", newsletterRouter(testPool));
});

describe("Subscription API integration tests", () => {
  test("successfully inserts subscribe into DB", async () => {
    const res = await request(app)
      .post("/api/subscribe")
      .send({ email: "test@example.com", ip_address: "127.0.0.1" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Subscription successful");

    const queryRes = await testPool.query<NewsletterSubscriber>(
      `SELECT * FROM newsletter_subscribers WHERE email = $1`,
      ["test@example.com"],
    );
    const row = queryRes.rows[0];

    expect(row).toBeDefined();
    expect(row?.email).toBe("test@example.com");
  });

  test("rejects duplicate subscription", async () => {
    await testPool.query(
      `INSERT INTO newsletter_subscribers (email) VALUES ($1)`,
      ["duplicate@example.com"],
    );

    const res = await request(app)
      .post("/api/subscribe")
      .send({ email: "duplicate@example.com" });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch("This email is already subscribed");
  });

  test("rejects invalid email", async () => {
    const res = await request(app)
      .post("/api/subscribe")
      .send({ email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test("returns 500 if DB query fails", async () => {
    const originalQuery = testPool.query;
    testPool.query = jest.fn().mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .post("/api/subscribe")
      .send({ email: "fail@example.com" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Internal server error");

    testPool.query = originalQuery;
  });
});
