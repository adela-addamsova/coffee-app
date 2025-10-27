import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CartStepThree from "@/pages/eshop/pages/cart/CartStepThree";
import { CartProvider, useCart, CartItem } from "@eshop/pages/cart/CartContext";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { createTestI18n } from "@/tests/test-i18n";
import userEvent from "@testing-library/user-event";

global.fetch = vi.fn((): Promise<Response> => {
  const body = JSON.stringify({ orderId: 12345 });
  const response = new Response(body, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
  return Promise.resolve(response);
});

const mockCartItem: CartItem = {
  id: 1,
  title: "Ethiopian Light Roast",
  price: 15,
  quantity: 2,
  image_url: "https://example.com/image.jpg",
  category: "light",
  weight: "250g",
  stock: 10,
};

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

vi.mock("@config/NavItems", () => ({
  eshopNavItems: [
    { label: "data.eshop-nav-items.success", to: "/order-success" },
  ],
}));

const TestWrapper: React.FC = () => {
  const { addToCart, setDeliveryData, paymentFee, paymentMethod } = useCart();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    addToCart(mockCartItem);
    setDeliveryData({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "123456789",
      street: "Main St 1",
      city: "Praha",
      zipCode: "11000",
    });
    setReady(true);
  }, []);

  return ready ? (
    <>
      <CartStepThree />
      <div data-testid="context-values">
        Payment: {paymentMethod || "none"} | Fee: {paymentFee ?? 0}
      </div>
    </>
  ) : null;
};

let i18n: Awaited<ReturnType<typeof createTestI18n>>;

beforeEach(async () => {
  i18n = await createTestI18n();

  render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <CartProvider>
          <TestWrapper />
        </CartProvider>
      </I18nextProvider>
    </MemoryRouter>,
  );
});

describe("CartStepThree - Unit tests", () => {
  test("renders all expected elements", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("transfer")).toBeInTheDocument();
    });
    expect(screen.getByText("$30.00")).toBeInTheDocument();
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByTestId("cash")).toBeInTheDocument();
    expect(screen.getByText("Send Order")).toBeInTheDocument();
  });

  test("changes payment method and sets fee correctly", async () => {
    const contextValues = await screen.findByTestId("context-values");

    await userEvent.click(screen.getByTestId("cash"));
    expect(contextValues).toHaveTextContent("Payment: cash");
    expect(contextValues).toHaveTextContent("Fee: 2");

    await userEvent.click(screen.getByTestId("card"));
    expect(contextValues).toHaveTextContent("Payment: card");
    expect(contextValues).toHaveTextContent("Fee: 0");

    await userEvent.click(screen.getByTestId("transfer"));
    expect(contextValues).toHaveTextContent("Payment: bank-transfer");
    expect(contextValues).toHaveTextContent("Fee: 0");
  });

  test("shows spinner when order is submitted", async () => {
    await userEvent.click(screen.getByTestId("cash"));
    await userEvent.click(screen.getByText("Send Order"));
    expect(await screen.findByTestId("spinner")).toBeInTheDocument();
  });

  test("prevents submission with invalid cart", async () => {
    await userEvent.click(screen.getByTestId("card"));
    await userEvent.click(screen.getByText("Send Order"));

    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    expect(
      screen.getByText(/Card number must be exactly 16 digits/i),
    ).toBeInTheDocument();
  });
});

describe("CartStepThree - Integration test", () => {
  test("submits order and stores orderId", async () => {
    await waitFor(() => {
      expect(screen.getByText("$30.00")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("transfer"));
    fireEvent.click(screen.getByText("Send Order"));

    expect(await screen.findByTestId("spinner")).toBeInTheDocument();

    await waitFor(
      () => {
        const stored = localStorage.getItem("lastOrderId");
        expect(stored).toBe("12345");
      },
      { timeout: 5000 },
    );

    await waitFor(() => {
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/order-success");
    });
  });
});
