import request from "supertest";
import express from "express";
import { testPool, initializeTestDb, clearTestDb } from "../coffee-app-test-db";
import productRouter from "@routes/products.routes";
import { Product } from "@db/products-db";

let app: express.Express;

beforeAll(async () => {
  await initializeTestDb();
});

afterAll(async () => {
  await testPool.end();
});

beforeEach(async () => {
  await clearTestDb();

  await testPool.query(
    `
    INSERT INTO products (title, image_url, category, price, ingredients, weight, origin, taste_profile, full_description, stock)
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10),
      ($11, $12, $13, $14, $15, $16, $17, $18, $19, $20),
      ($21, $22, $23, $24, $25, $26, $27, $28, $29, $30)
    `,
    [
      "Coffee A",
      "/img/a.png",
      "light",
      10,
      "beans",
      "250g",
      "Brazil",
      "fruity",
      "desc A",
      5,
      "Coffee B",
      "/img/b.png",
      "light",
      15,
      "beans",
      "250g",
      "Brazil",
      "chocolate",
      "desc B",
      0,
      "Coffee C",
      "/img/c.png",
      "dark",
      12,
      "beans",
      "250g",
      "Brazil",
      "strong",
      "desc C",
      10,
    ],
  );

  app = express();
  app.use(express.json());
  app.use("/api/products", productRouter(testPool));
});

function parseProductsResponse(res: request.Response): Product[] {
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  return res.body as Product[];
}

describe("Products API integration tests", () => {
  test("returns all in-stock, non-deleted products - GET /api/products", async () => {
    const res = await request(app).get("/api/products");
    const products = parseProductsResponse(res);

    const titles = products.map((product) => product.title);
    expect(titles).toContain("Coffee A");
    expect(titles).toContain("Coffee C");
    expect(titles).not.toContain("Coffee B");
  });

  test("returns latest 4 in-stock products - GET /api/products/latest", async () => {
    const res = await request(app).get("/api/products/latest");
    const products = parseProductsResponse(res);

    expect(products.length).toBeLessThanOrEqual(4);
    expect(
      products.every(
        (product) => product.stock === undefined || product.stock > 0,
      ),
    ).toBe(true);
  });

  test("returns products by category - GET /api/products/:category", async () => {
    const res = await request(app).get("/api/products/light");
    const products = parseProductsResponse(res);

    expect(products.length).toBe(1);
    expect(products[0]).toHaveProperty("category", "light");
    expect(products[0]).toHaveProperty("title", "Coffee A");
  });

  test("returns single product by id and category - GET /api/products/:category/:id", async () => {
    const result = await testPool.query<{ id: number }>(
      `SELECT id FROM products WHERE title = $1`,
      ["Coffee A"],
    );

    const row = result.rows[0];

    expect(row).toBeDefined();

    const res = await request(app).get(`/api/products/light/${row.id}`);
    expect(res.status).toBe(200);

    const product: Product = res.body;
    expect(product).toHaveProperty("title", "Coffee A");
  });

  test("returns 404 if product not found - GET /api/products/:category/:id", async () => {
    const res = await request(app).get("/api/products/light/999999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Product not found");
  });
});
