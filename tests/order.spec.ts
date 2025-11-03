import { test, expect } from "@playwright/test";
import { Pool } from "pg";

const testPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

test.beforeEach(async () => {
  await testPool.query(
    "TRUNCATE TABLE orders, order_items, products RESTART IDENTITY CASCADE;",
  );
  await testPool.query(`INSERT INTO products (title, image_url, category, price, ingredients, weight, origin, taste_profile, full_description, stock, deleted_at, created_at) VALUES ('Ethiopian Yirgacheffe', '#', 'light', 12.00, 'Arabica beans', '250g', 'Ethiopia', 'Floral, citrus, tea-like', 'Premium single-origin coffee with a delicate floral aroma and bright acidity.', 100, NULL, NOW());
`);
});

test.afterAll(async () => {
  await testPool.end();
});

test("creates the order", async ({ page }) => {
  await page.goto("http://localhost:5173/e-shop");
  await page.getByRole("link", { name: "Light Roasted Light Roasted" }).click();

  await page.goto("http://localhost:5173/e-shop/products/light");
  await page.getByRole("link", { name: "Ethiopian Yirgacheffe" }).click();

  await page.goto("http://localhost:5173/e-shop/products/light/1");
  await page.getByText("ADD TO CART").click();

  await expect(page.locator(".cart-side-panel-page")).toBeVisible();
  await page.getByRole("link", { name: "GO TO CART" }).click();

  await page.goto("http://localhost:5173/e-shop/cart");
  await page.getByText("NEXT").click();

  await page.goto("http://localhost:5173/e-shop/cart/delivery");
  await page.getByRole("textbox", { name: "Name" }).click();
  await page.getByRole("textbox", { name: "Name" }).fill("Pernicek Pernicek");
  await page.getByRole("textbox", { name: "Name" }).press("Tab");
  await page.getByRole("textbox", { name: "Street and Number" }).click();
  await page
    .getByRole("textbox", { name: "Street and Number" })
    .fill("Main 123");
  await page.getByRole("textbox", { name: "Email", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("pernicek@gmail.com");
  await page.getByRole("textbox", { name: "City" }).click();
  await page.getByRole("textbox", { name: "City" }).fill("London");
  await page.getByRole("textbox", { name: "Phone" }).click();
  await page.getByRole("textbox", { name: "Phone" }).fill("606444555");
  await page.getByRole("textbox", { name: "Postal Code" }).click();
  await page.getByRole("textbox", { name: "Postal Code" }).fill("1000");
  await page.getByText("$5.00 Express Delivery (1–2").click();
  await expect(page.getByText("$17.00")).toBeVisible();
  await page.getByText("NEXT").click();

  await page.goto("http://localhost:5173/e-shop/cart/payment");
  await page.getByTestId("card").click();
  await page.getByRole("textbox", { name: "1234 1234 1234" }).click();
  await page
    .getByRole("textbox", { name: "1234 1234 1234" })
    .fill("1111 1111 1111 1111");
  await page.getByRole("textbox", { name: "MM/YY" }).click();
  await page.getByRole("textbox", { name: "MM/YY" }).fill("01/30");
  await page.getByRole("textbox", { name: "CVV" }).click();
  await page.getByRole("textbox", { name: "CVV" }).fill("000");
  await page.getByText("SEND ORDER").click();

  await page.waitForURL("http://localhost:5173/e-shop/cart/order-success");
  await expect(
    page.getByText(/Your order with ID 1 has been successfully paid/i),
  ).toBeVisible();

  await page.waitForFunction(() => localStorage.getItem("cart") === null);

  const result = await testPool.query(
    "SELECT * FROM orders WHERE customer_email = $1",
    ["pernicek@gmail.com"],
  );
  expect(result.rows.length).toBe(1);
  expect(result.rows[0].customer_name).toBe("Pernicek Pernicek");

  const itemsResult = await testPool.query(
    "SELECT * FROM order_items WHERE order_id = $1",
    [result.rows[0].id],
  );
  expect(itemsResult.rows.length).toBe(1);
  expect(itemsResult.rows[0].product_id).toBe(1);

  const quantityResult = await testPool.query(
    "SELECT * FROM products WHERE id = $1",
    ["1"],
  );
  expect(quantityResult.rows[0].stock).toBe(99);
});
