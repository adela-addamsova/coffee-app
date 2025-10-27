import { render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { createTestI18n } from "../../../../test-i18n";
import { describe, vi } from "vitest";
import { CartProvider } from "@/pages/eshop/pages/cart/CartContext";
import { MemoryRouter } from "react-router-dom";
import OrderSuccess from "@/pages/eshop/pages/cart/OrderSuccess";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

let i18n: Awaited<ReturnType<typeof createTestI18n>>;

const renderPage = async () => {
  i18n = await createTestI18n();
  render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <CartProvider>
          <OrderSuccess />
        </CartProvider>
      </I18nextProvider>
    </MemoryRouter>,
  );
};

describe("OrderSuccess - Unit tests", () => {
  test("renders page and redirects to cart if not order in localStorage", async () => {
    await renderPage();

    const stored = localStorage.getItem("lastOrderId");
    expect(stored).toBe(null);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/e-shop/cart");
    });
  });

  test("shows correct message according to selected paymentMethod", async () => {
    localStorage.setItem("lastOrderId", "111");
    localStorage.setItem("paymentMethod", "cash");

    await renderPage();

    expect(screen.getByText(/order has been created/i)).toBeInTheDocument();
    expect(screen.getByText(/eshop-cart.success-cash/i)).toBeInTheDocument();

    localStorage.setItem("paymentMethod", "card");

    await renderPage();

    expect(screen.getByText(/eshop-cart.success-card/i)).toBeInTheDocument();
    localStorage.setItem("paymentMethod", "bank-transfer");

    await renderPage();

    expect(
      screen.getByText(/eshop-cart.success-transfer/i),
    ).toBeInTheDocument();
  });
});
