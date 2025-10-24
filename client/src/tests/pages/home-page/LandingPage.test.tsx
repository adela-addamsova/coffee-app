import LandingPage from "@/pages/home-page/LandingPage";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";
import { I18nextProvider } from "react-i18next";
import { createTestI18n } from "../../test-i18n";
import { CartProvider } from "@/pages/eshop/pages/cart/CartContext";

let i18n: Awaited<ReturnType<typeof createTestI18n>>;

describe("LandingPage - Unit Tests", () => {
  beforeAll(async () => {
    i18n = await createTestI18n();
  });

  test("renders layout with section components", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <CartProvider>
          <MemoryRouter>
            <LandingPage />
          </MemoryRouter>
        </CartProvider>
      </I18nextProvider>,
    );

    const sectionsByTestID = [
      "header",
      "homepage-hero",
      "info-boxes",
      "hero-text-section",
      "story-scroll-section",
      "menu-section",
      "gallery-section",
      "reservation-section",
      "footer",
    ];

    sectionsByTestID.forEach((testId) => {
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  test("scrolls to section", () => {
    vi.useFakeTimers();
    const scrollTarget = document.createElement("div");
    scrollTarget.id = "hero-text-section";
    scrollTarget.scrollIntoView = vi.fn();
    document.body.appendChild(scrollTarget);

    vi.spyOn(window.history, "replaceState").mockImplementation(() => {});

    render(
      <I18nextProvider i18n={i18n}>
        <CartProvider>
          <MemoryRouter
            initialEntries={[
              { pathname: "/", state: { scrollToId: "hero-text-section" } },
            ]}
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
            </Routes>
          </MemoryRouter>
        </CartProvider>
      </I18nextProvider>,
    );

    vi.runAllTimers();

    const target = document.getElementById("hero-text-section");
    expect(target?.scrollIntoView).toHaveBeenCalled();
    expect(window.history.replaceState).toHaveBeenCalledWith(
      {},
      document.title,
    );
  });
});
