import { test, expect } from "@playwright/test";
import { Pool } from "pg";

const testPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

test.beforeEach(async () => {
  await testPool.query("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE;");
});

test.afterAll(async () => {
  await testPool.end();
});

test("creates the reservation", async ({ page }) => {
  await page.goto("http://localhost:5173/reservation");

  await expect(page.getByTestId("reservation-form")).toBeVisible();
  await page.getByRole("textbox", { name: "Your Name" }).click();
  await page
    .getByRole("textbox", { name: "Your Name" })
    .fill("Pernicek Pernicek");
  await page.getByRole("textbox", { name: "Your Email" }).click();
  await page
    .getByRole("textbox", { name: "Your Email" })
    .fill("pernicek@gmail.com");
  await page.locator("button.react-calendar__navigation__label").click();
  await page.getByRole("button", { name: "»" }).click();
  await page.getByRole("button", { name: "August" }).click();
  await page.getByRole("button", { name: "August 29," }).click();
  await page.locator(".custom-select__indicator").click();
  await page.getByRole("option", { name: /10:00/i }).click();
  await page.getByRole("button", { name: "Make a reservation" }).click();

  await expect(
    page.getByText(/reservation has been created successfully/i),
  ).toBeVisible();

  const result = await testPool.query(
    "SELECT * FROM reservations WHERE email = $1",
    ["pernicek@gmail.com"],
  );

  expect(result.rows.length).toBe(1);
  expect(result.rows[0].name).toBe("Pernicek Pernicek");
});
