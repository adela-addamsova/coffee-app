import {
  testPool,
  initializeTestDb,
  clearTestDb,
} from "../../coffee-app-test-db";
import {
  getAllProducts,
  getLatestProducts,
  getProductsByCategory,
  getProductById,
  ProductPreview,
  Product,
} from "@db/products-db";

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
      ('Coffee B', 'url2.jpg', 'dark', 12.0, '100% arabica', '250g', 'Colombia', 'chocolate', 'Full desc', 0, NOW()),
      ('Coffee C', 'url3.jpg', 'light', 11.0, '100% arabica', '250g', 'Ethiopia', 'floral', 'Full desc', 10, NOW());
  `);
});

describe("Products DB operations", () => {
  test("returns only in-stock and non-deleted products", async () => {
    const products: ProductPreview[] = await getAllProducts(testPool);
    expect(products.length).toBe(2);
    expect(
      products.find((product) => product.title === "Coffee B"),
    ).not.toBeDefined();
  });

  test("returns limited number sorted by created_at", async () => {
    const latest: ProductPreview[] = await getLatestProducts(4, testPool);
    expect(latest.length).toBeLessThanOrEqual(4);
    expect(latest[0].title).toBe("Coffee C");
  });

  test("returns only matching category and in-stock", async () => {
    const lightProducts: ProductPreview[] = await getProductsByCategory(
      "light",
      testPool,
    );
    expect(lightProducts.length).toBe(2);
    expect(lightProducts.every((product) => product.category === "light")).toBe(
      true,
    );
  });

  test("returns product if exists and in stock", async () => {
    const product: Product | undefined = await getProductById(
      1,
      "light",
      testPool,
    );
    expect(product).toBeDefined();
    expect(product?.title).toBe("Coffee A");
  });

  test("returns undefined if product out of stock or deleted", async () => {
    const product: Product | undefined = await getProductById(
      2,
      "dark",
      testPool,
    );
    expect(product).toBeUndefined();
  });
});
