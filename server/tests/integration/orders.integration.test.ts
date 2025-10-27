import request from "supertest";
import express from "express";
import { testPool, initializeTestDb, clearTestDb } from "../coffee-app-test-db";
import ordersRouter from "@routes/orders.routes"; // your router

let app: express.Express;

beforeAll(async () => {
  await initializeTestDb();
});

afterAll(async () => {
  await testPool.end();
});

beforeEach(async () => {
  await clearTestDb();

  await testPool.query(`
     INSERT INTO products 
      (title, image_url, category, price, ingredients, weight, origin, taste_profile, full_description, stock, created_at)
    VALUES
      ('Coffee A', 'url1.jpg', 'light', 10.5, '100% arabica', '250g', 'Brazil', 'fruity', 'Full desc', 5, NOW()),
      ('Coffee B', 'url2.jpg', 'dark', 12.0, '100% arabica', '250g', 'Colombia', 'chocolate', 'Full desc', 1, NOW()),
      ('Coffee C', 'url3.jpg', 'light', 11.0, '100% arabica', '250g', 'Ethiopia', 'floral', 'Full desc', 10, NOW());
  `);

  app = express();
  app.use(express.json());
  app.use("/api/orders", ordersRouter(testPool));
});

describe("Orders API integration tests - POST /api/orders/order", () => {
  const validOrder = {
    name: "Alice Doe",
    street: "Main 12",
    city: "Berlin",
    zipCode: "55550",
    email: "alice@gmail.com",
    phone: "987654321",
    shipment_method: "standard",
    payment_method: "card",
    total_amount: 20,
    paid: true,
    items: [{ product_id: 1, quantity: 2, price: 10 }],
  };

  test("creates a new order and deducts stock", async () => {
    const res = await request(app).post("/api/orders/order").send(validOrder);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("orderId");

    const { rows: product1 } = await testPool.query(
      "SELECT stock FROM products WHERE id = 1",
    );
    expect(product1[0].stock).toBe(3);
  });

  test("fails if stock is insufficient", async () => {
    const res = await request(app)
      .post("/api/orders/order")
      .send({
        ...validOrder,
        items: [{ product_id: 2, quantity: 5, price: 12 }],
      });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message");
  });

  test("fails validation for invalid email", async () => {
    const res = await request(app)
      .post("/api/orders/order")
      .send({
        ...validOrder,
        email: "invalid-email",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Validation failed");
    expect(res.body.errors).toHaveProperty("email");
  });

  test("rolls back if multiple items include insufficient stock", async () => {
    const res = await request(app)
      .post("/api/orders/order")
      .send({
        ...validOrder,
        items: [
          { product_id: 1, quantity: 2, price: 10 },
          { product_id: 2, quantity: 5, price: 12 },
        ],
      });

    expect(res.status).toBe(500);

    const { rows: orders } = await testPool.query("SELECT * FROM orders");
    expect(orders.length).toBe(0);
  });
});
