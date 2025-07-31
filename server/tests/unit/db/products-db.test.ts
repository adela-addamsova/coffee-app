import Database from "better-sqlite3";
import type { Database as DBType } from "better-sqlite3";
import {
  getAllProducts,
  getLatestProducts,
  getProductsByCategory,
  getProductById,
  ProductPreview,
  Product,
} from "@db/products-db";
import { initializeProducts } from "@db/init-db";

let testDb: DBType;

beforeEach(() => {
  testDb = new Database(":memory:");
  initializeProducts(testDb);

  const insert = testDb.prepare(`
    INSERT INTO products (title, image_url, category, price, ingredients, weight, origin, taste_profile, full_description, stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insert.run(
    "Coffee A",
    "url1.jpg",
    "light",
    10.5,
    "100% arabica",
    "250g",
    "Brazil",
    "fruity",
    "Full desc",
    5,
  );
  insert.run(
    "Coffee B",
    "url2.jpg",
    "dark",
    12.0,
    "100% arabica",
    "250g",
    "Colombia",
    "chocolate",
    "Full desc",
    0,
  );
  insert.run(
    "Coffee C",
    "url3.jpg",
    "light",
    11.0,
    "100% arabica",
    "250g",
    "Ethiopia",
    "floral",
    "Full desc",
    10,
  );
});

afterEach(() => {
  testDb.close();
});

describe("Products DB operations", () => {
  test("returns only in-stock and non-deleted products", () => {
    const products: ProductPreview[] = getAllProducts(testDb);
    expect(products.length).toBe(2);
    expect(
      products.find((product) => product.title === "Coffee B"),
    ).not.toBeDefined();
  });

  test("returns limited number sorted by created_at", () => {
    const latest: ProductPreview[] = getLatestProducts(4, testDb);
    expect(latest.length).toBeLessThanOrEqual(4);
    expect(latest[0].title).toBe("Coffee C");
  });

  test("returns only matching category and in-stock", () => {
    const lightProducts: ProductPreview[] = getProductsByCategory(
      "light",
      testDb,
    );
    expect(lightProducts.length).toBe(2);
    expect(lightProducts.every((product) => product.category === "light")).toBe(
      true,
    );
  });

  test("returns product if exists and in stock", () => {
    const product: Product | undefined = getProductById(1, "light", testDb);
    expect(product).toBeDefined();
    expect(product?.title).toBe("Coffee A");
  });

  test("returns undefined if product out of stock or deleted", () => {
    const product: Product | undefined = getProductById(2, "dark", testDb);
    expect(product).toBeUndefined();
  });
});
