import EshopLandingPage from "@/pages/eshop/pages/main-page/EshopLandingPage";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

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

describe("EshopLandingPage - Unit Tests", () => {
  test("renders all sections", async () => {
    render(
      <MemoryRouter>
        <EshopLandingPage />
      </MemoryRouter>,
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
  });
});
