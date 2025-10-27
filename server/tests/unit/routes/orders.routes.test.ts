jest.mock("@db/orders-db", () => ({
  createOrder: jest.fn(),
}));

import { createOrder } from "@db/orders-db";
import request from "supertest";
import express from "express";
import ordersRouter from "@routes/orders.routes";
import { testPool } from "@server/tests/coffee-app-test-db";

let app: express.Express;

beforeEach(() => {
  app = express();
  app.use(express.json());
  app.use("/api/orders", ordersRouter(testPool));
});

afterAll(async () => {
  await testPool.end();
});

describe("GET /api/orders/order", () => {
  test("creates a new order", async () => {
    (createOrder as jest.Mock).mockResolvedValue(42);

    const res = await request(app)
      .post("/api/orders/order")
      .send({
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
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: true, orderId: 42 });
    expect(createOrder).toHaveBeenCalledTimes(1);
    expect(createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_name: "Alice Doe",
        customer_email: "alice@gmail.com",
        items: [{ product_id: 1, quantity: 2, price: 10 }],
      }),
      testPool,
    );
  });

  test("that order fails on invalid email", async () => {
    const res = await request(app)
      .post("/api/orders/order")
      .send({
        name: "Alice Doe",
        street: "Main 12",
        city: "Berlin",
        zipCode: "55550",
        email: "invalid-email",
        phone: "987654321",
        shipment_method: "standard",
        payment_method: "card",
        total_amount: 20,
        paid: true,
        items: [{ product_id: 1, quantity: 2, price: 10 }],
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Validation failed");
    expect(res.body.errors).toHaveProperty("email");
  });

  test("handles DB error", async () => {
    (createOrder as jest.Mock).mockRejectedValue(new Error("Server error"));

    const res = await request(app)
      .post("/api/orders/order")
      .send({
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
      });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ success: false, message: "Server error" });
  });
});
