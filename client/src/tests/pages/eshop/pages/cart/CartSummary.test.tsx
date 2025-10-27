import CartSummary from "@/pages/eshop/pages/cart/CartSummary";
import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { createTestI18n } from "../../../../test-i18n";
import { vi } from "vitest";
import { CartProvider } from "@/pages/eshop/pages/cart/CartContext";
import { MemoryRouter } from "react-router-dom";

const mockUseCart = vi.fn();
vi.mock(import("@eshop/pages/cart/CartContext"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    addToCart: () => mockUseCart(),
  };
});
let i18n: Awaited<ReturnType<typeof createTestI18n>>;
const onNext = vi.fn();

describe("Cart Summary - Unit Tests", () => {
  beforeAll(async () => {
    i18n = await createTestI18n();
  });

  beforeEach(() => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <CartProvider>
            <CartSummary
              previousStep={"#"}
              nextStep="#"
              previousStepText={"Previous"}
              nextStepText={"Next"}
              onNext={onNext}
            />
          </CartProvider>
        </MemoryRouter>
      </I18nextProvider>,
    );
  });

  test("checks rendered values", () => {
    expect(screen.getByText(/summary/i)).toBeInTheDocument();
    expect(screen.getByText(/tax/i)).toBeInTheDocument();
    expect(screen.getByText(/total/i)).toBeInTheDocument();
    expect(screen.queryByText(/next/i)).not.toBeInTheDocument();
    expect(screen.queryByText("$0")).not.toBeInTheDocument();
  });
});
