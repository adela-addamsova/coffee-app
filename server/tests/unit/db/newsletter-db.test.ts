import Database from "better-sqlite3";
import type { Database as DBType } from "better-sqlite3";
import {
  isEmailSubscribed,
  insertNewsletterSubscriber,
  NewsletterSubscriber,
} from "@db/newsletter-db";
import { initializeSubscribers } from "@db/init-db";

let testDb: DBType;

beforeEach(() => {
  testDb = new Database(":memory:");
  initializeSubscribers(testDb);
});

afterEach(() => {
  testDb.close();
});

describe("Newsletter DB operations", () => {
  test("inserts a new subscriber", () => {
    const result = insertNewsletterSubscriber(
      "test@example.com",
      "127.0.0.1",
      testDb,
    );

    expect(result.lastInsertRowid).toBeGreaterThan(0);

    const row = testDb
      .prepare(`SELECT * FROM newsletter_subscribers WHERE email = ?`)
      .get("test@example.com") as NewsletterSubscriber;

    expect(row).toBeDefined();
    expect(row.email).toBe("test@example.com");
    expect(row.ip_address).toBe("127.0.0.1");
  });

  test("returns true for existing active email", () => {
    insertNewsletterSubscriber(
      "subscribed@example.com",
      "123.456.789.0",
      testDb,
    );

    const result = isEmailSubscribed("subscribed@example.com", testDb);
    expect(result).toBe(true);
  });

  test("returns false for non-existent email", () => {
    const result = isEmailSubscribed("nonexistent@example.com", testDb);
    expect(result).toBe(false);
  });

  test("returns false if email is soft-deleted", () => {
    insertNewsletterSubscriber("deleted@example.com", "ip", testDb);

    testDb
      .prepare(
        `
      UPDATE newsletter_subscribers
      SET deleted_at = datetime('now')
      WHERE email = ?
    `,
      )
      .run("deleted@example.com");

    const result = isEmailSubscribed("deleted@example.com", testDb);
    expect(result).toBe(false);
  });
});
