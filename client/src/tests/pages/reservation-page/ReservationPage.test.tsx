import ReservationPage from "@/pages/reservation-page/ReservationPage";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "@/pages/eshop/pages/cart/CartContext";
import { I18nextProvider } from "react-i18next";
import { createTestI18n } from "../../test-i18n";

let i18n: Awaited<ReturnType<typeof createTestI18n>>;

describe("ReservationPage - Unit Tests", () => {
  test("renders all sections", async () => {
    i18n = await createTestI18n();

    render(
      <I18nextProvider i18n={i18n}>
        <CartProvider>
          <MemoryRouter>
            <ReservationPage />
          </MemoryRouter>
        </CartProvider>
      </I18nextProvider>,
    );

    const sectionsByTestID = [
      "header",
      "footer",
      "reservation-page-hero",
      "reservation-page-container",
      "reservation-form",
    ];

    sectionsByTestID.forEach((testId) => {
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    const heroSection = screen.getByTestId("hero-section");
    expect(within(heroSection).getByText("Reservation")).toBeInTheDocument();
    expect(
      within(heroSection).getByRole("img", { name: /reservation/i }),
    ).toBeInTheDocument();
  });
});
