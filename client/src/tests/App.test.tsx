import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import App from "@/App";

type RouteTest = {
  path: string;
  expectedTestId: string;
};

const routeTests: RouteTest[] = [
  { path: "/", expectedTestId: "landing-page" },
  { path: "/reservation", expectedTestId: "reservation-page" },
  { path: "/e-shop", expectedTestId: "eshop-landing-page" },
  { path: "/e-shop/products", expectedTestId: "category-page" },
  { path: "/e-shop/products/light", expectedTestId: "category-page" },
  { path: "/e-shop/products/light/1", expectedTestId: "product-page" },
];

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        id: "1",
        title: "Mock Product",
        price: 10,
        image_url: "/mock.jpg",
        stock: 5,
      }),
  }) as unknown as typeof fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("App routing", () => {
  test.each(routeTests)(
    "navigates to routes and renders element with testId",
    async ({ path, expectedTestId }) => {
      window.history.pushState({}, "Test page", path);
      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
      });
    },
  );
});
