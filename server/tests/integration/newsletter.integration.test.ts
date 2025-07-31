import request from "supertest";
import express from "express";
import Database from "better-sqlite3";
import type { Database as DBType } from "better-sqlite3";
import type { NewsletterSubscriber } from "@db/newsletter-db";
import newsletterRouter from "@routes/subscribtion.routes";
import { initializeSubscribers } from "@db/init-db";

let testDb: DBType;
let app: express.Express;

beforeEach(() => {
  testDb = new Database(":memory:");
  initializeSubscribers(testDb);

  app = express();
  app.use(express.json());
  app.use("/api/subscribe", newsletterRouter(testDb));
});

afterEach(() => {
  try {
    testDb.close();
  } catch {
    // Ignore
  }
});

describe("Subscription API integration tests", () => {
  test("successfully inserts subscribe into DB", async () => {
    const res = await request(app)
      .post("/api/subscribe")
      .send({ email: "test@example.com", ip_address: "127.0.0.1" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Subscription successful");

    const row = testDb
      .prepare(`SELECT * FROM newsletter_subscribers WHERE email = ?`)
      .get("test@example.com") as NewsletterSubscriber | undefined;

    expect(row).toBeDefined();
    expect(row?.email).toBe("test@example.com");
  });

  test("rejects duplicate subscription", async () => {
    testDb
      .prepare(`INSERT INTO newsletter_subscribers (email) VALUES (?)`)
      .run("duplicate@example.com");

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

  test("returns 500 if DB is closed", async () => {
    testDb.close();

    const res = await request(app)
      .post("/api/subscribe")
      .send({ email: "fail@example.com" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Internal server error");
  });
});
