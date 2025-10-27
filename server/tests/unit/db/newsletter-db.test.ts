import {
  testPool,
  initializeTestDb,
  clearTestDb,
} from "../../coffee-app-test-db";
import {
  insertNewsletterSubscriber,
  isEmailSubscribed,
} from "@db/newsletter-db";

beforeAll(async () => {
  await initializeTestDb();
});

afterAll(async () => {
  await testPool.end();
});

beforeEach(async () => {
  await clearTestDb();
});

describe("Newsletter DB operations", () => {
  test("inserts a new subscriber", async () => {
    const result = await insertNewsletterSubscriber(
      "test@example.com",
      "127.0.0.1",
      testPool,
    );

    expect(result.id).toBeGreaterThan(0);
    expect(result.email).toBe("test@example.com");
    expect(result.ip_address).toBe("127.0.0.1");
  });

  test("returns true for existing active email", async () => {
    await insertNewsletterSubscriber(
      "subscribed@example.com",
      "123.456.789.0",
      testPool,
    );

    const result = await isEmailSubscribed("subscribed@example.com", testPool);
    expect(result).toBe(true);
  });

  test("returns false for non-existent email", async () => {
    const result = await isEmailSubscribed("nonexistent@example.com", testPool);
    expect(result).toBe(false);
  });

  test("returns false if email is soft-deleted", async () => {
    await insertNewsletterSubscriber("deleted@example.com", "ip", testPool);

    await testPool.query(
      `UPDATE newsletter_subscribers SET deleted_at = NOW() WHERE email = $1`,
      ["deleted@example.com"],
    );

    const result = await isEmailSubscribed("deleted@example.com", testPool);
    expect(result).toBe(false);
  });
});
