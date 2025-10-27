import EshopLandingPage from "@/pages/eshop/pages/main-page/EshopLandingPage";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { CartProvider } from "@/pages/eshop/pages/cart/CartContext";

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      {
        id: "1",
        title: "Mock Product",
        category: "light",
        price: 10,
        image_url: "/mock.jpg",
      },
    ],
  }) as unknown as typeof fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("EshopLandingPage - Unit Tests", () => {
  test("renders all sections and fetches latest products", async () => {
    render(
      <CartProvider>
        <MemoryRouter>
          <EshopLandingPage />
        </MemoryRouter>
      </CartProvider>,
    );

    const staticSections = [
      "hero-section",
      "product-categories",
      "eshop-info-boxes",
      "eshop-story-section",
      "newsletter-section",
    ];

    staticSections.forEach((testId) => {
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("latest-products")).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/products/latest",
    );
  });
});
