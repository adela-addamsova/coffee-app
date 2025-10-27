import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartStepOne from "@eshop/pages/cart/CartStepOne";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { createTestI18n } from "@/tests/test-i18n";

const mockUseCart = vi.fn();
vi.mock("@eshop/pages/cart/CartContext", () => ({
  useCart: () => mockUseCart(),
}));

vi.mock("@eshop-components/ProductCounter", () => ({
  default: ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (val: number) => void;
  }) => <button onClick={() => onChange(value + 1)}>Qty: {value}</button>,
}));

vi.mock("@config/NavItems", () => ({
  navItems: [{ label: "data.nav-items.eshop", to: "/eshop" }],
  eshopNavItems: [{ label: "data.eshop-nav-items.delivery", to: "/delivery" }],
}));

describe("CartStepOne - Unit tests", () => {
  let i18n: Awaited<ReturnType<typeof createTestI18n>>;

  beforeAll(async () => {
    i18n = await createTestI18n();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <CartStepOne />
        </I18nextProvider>
      </MemoryRouter>,
    );
  };

  test("renders empty cart message", () => {
    mockUseCart.mockReturnValue({
      cart: [],
      categoryLabels: {},
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
    });

    renderWithProviders();
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  test("renders cart items with correct details", () => {
    mockUseCart.mockReturnValue({
      cart: [
        {
          id: 1,
          title: "Coffee A",
          price: 10,
          quantity: 2,
          image_url: "a.jpg",
          category: "light",
          weight: "250g",
          stock: 5,
        },
      ],
      categoryLabels: { light: "Light roasted" },
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
    });

    renderWithProviders();
    expect(
      screen.getByText("Coffee A – Light roasted 250g"),
    ).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Coffee A" })).toBeInTheDocument();
  });

  test("calls updateQuantity when ProductCounter is clicked", async () => {
    const updateQuantity = vi.fn();
    mockUseCart.mockReturnValue({
      cart: [
        {
          id: 1,
          title: "Coffee A",
          price: 10,
          quantity: 2,
          image_url: "a.jpg",
          category: "light",
          weight: "250g",
          stock: 5,
        },
      ],
      categoryLabels: { light: "Light roasted" },
      updateQuantity,
      removeFromCart: vi.fn(),
    });

    renderWithProviders();
    await userEvent.click(screen.getByText("Qty: 2"));
    expect(updateQuantity).toHaveBeenCalledWith(1, 3);
  });

  test("calls removeFromCart when delete icon is clicked", async () => {
    const removeFromCart = vi.fn();
    mockUseCart.mockReturnValue({
      cart: [
        {
          id: 1,
          title: "Coffee A",
          price: 10,
          quantity: 2,
          image_url: "a.jpg",
          category: "light",
          weight: "250g",
          stock: 5,
        },
      ],
      categoryLabels: { light: "Light roasted" },
      updateQuantity: vi.fn(),
      removeFromCart,
    });

    renderWithProviders();
    await userEvent.click(screen.getByTestId("remove-btn-1"));
    expect(removeFromCart).toHaveBeenCalledWith(1);
  });

  test("renders CartSummary with translated buttons", () => {
    mockUseCart.mockReturnValue({
      cart: [
        {
          id: 1,
          title: "Coffee A",
          price: 10,
          quantity: 1,
          image_url: "a.jpg",
          category: "light",
          weight: "250g",
          stock: 5,
        },
      ],
      categoryLabels: { light: "Light roasted" },
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
    });

    renderWithProviders();

    expect(screen.getByText("Back to eshop")).toBeInTheDocument();
    expect(screen.getByText("NEXT")).toBeInTheDocument();
  });
});
