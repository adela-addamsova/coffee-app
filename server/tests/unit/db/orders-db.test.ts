import {
  testPool,
  initializeTestDb,
  clearTestDb,
} from "../../coffee-app-test-db";
import { createOrder } from "@db/orders-db";

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
});

describe("Orders DB operations", () => {
  test("creates order and deducts stock", async () => {
    const orderId = await createOrder(
      {
        customer_name: "Alice Doe",
        customer_address: "Main 12",
        customer_city: "Berlin",
        customer_postalcode: "55550",
        customer_email: "alice@gmail.com",
        customer_phone: "987654321",
        shipment_method: "standard",
        payment_method: "card",
        total_amount: 20,
        paid: true,
        items: [{ product_id: 1, quantity: 2, price: 10 }],
      },
      testPool,
    );

    const { rows: orders } = await testPool.query(
      "SELECT * FROM orders WHERE id = $1",
      [orderId],
    );
    const { rows: products } = await testPool.query(
      "SELECT stock FROM products WHERE id = 1",
    );

    expect(orders).toHaveLength(1);
    expect(products[0].stock).toBe(3);
  });

  test("throws error and rolls back when stock is insufficient", async () => {
    try {
      await createOrder(
        {
          customer_name: "Bob Doe",
          customer_address: "Side 5",
          customer_city: "Vienna",
          customer_postalcode: "11111",
          customer_email: "bob@gmail.com",
          customer_phone: "123456789",
          shipment_method: "express",
          payment_method: "cash",
          total_amount: 24,
          paid: false,
          items: [{ product_id: 2, quantity: 5, price: 12.0 }],
        },
        testPool,
      );
      throw new Error("Should have failed but didn't");
    } catch (err) {
      const orders = await testPool.query("SELECT * FROM orders");
      if (orders.rows.length !== 0)
        throw new Error("Order should have been rolled back");
    }
  });

  test("creates oreder with multiple items", async () => {
    const orderId = await createOrder(
      {
        customer_name: "Alice Doe",
        customer_address: "Main 12",
        customer_city: "Berlin",
        customer_postalcode: "55550",
        customer_email: "alice@gmail.com",
        customer_phone: "987654321",
        shipment_method: "standard",
        payment_method: "card",
        total_amount: 20,
        paid: true,
        items: [
          { product_id: 1, quantity: 2, price: 10 },
          { product_id: 2, quantity: 1, price: 12 },
        ],
      },
      testPool,
    );

    const { rows: orders } = await testPool.query(
      "SELECT * FROM orders WHERE id = $1",
      [orderId],
    );
    const { rows: orderItems } = await testPool.query(
      "SELECT * FROM order_items",
    );

    expect(orders).toHaveLength(1);
    expect(orderItems).toHaveLength(2);

    const { rows: products } = await testPool.query(
      "SELECT id, stock FROM products",
    );
    expect(products.find((p) => p.id === 1)?.stock).toBe(3);
    expect(products.find((p) => p.id === 2)?.stock).toBe(0);
  });

  test("rolls back if order_items insert fails", async () => {
    await expect(
      createOrder(
        {
          customer_name: "Error Test",
          customer_address: "Nowhere 1",
          customer_city: "Berlin",
          customer_postalcode: "12345",
          customer_email: "error@test.com",
          customer_phone: "000000000",
          shipment_method: "standard",
          payment_method: "card",
          total_amount: 10,
          paid: false,
          items: [{ product_id: 999, quantity: 1, price: 10 }],
        },
        testPool,
      ),
    ).rejects.toThrow();

    const { rows: orders } = await testPool.query("SELECT * FROM orders");
    expect(orders).toHaveLength(0);
  });
});
