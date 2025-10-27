import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartSidePanel from "@eshop/pages/cart/CartSidePanel";
import { CartItem } from "@eshop/pages/cart/CartContext";
import { vi } from "vitest";

vi.mock("@/components/MainButton", () => ({
  default: ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button onClick={onClick}>{text}</button>
  ),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => `translated:${key}` }),
}));

const mockUseCart = vi.fn();
vi.mock("@eshop/pages/cart/CartContext", () => ({
  useCart: () => mockUseCart(),
}));

const cartItemA: CartItem = {
  id: 1,
  title: "Coffee A",
  price: 10,
  quantity: 1,
  image_url: "a.jpg",
  category: "light",
  weight: "250g",
  stock: 5,
};

const cartItemB: CartItem = {
  id: 2,
  title: "Coffee B",
  price: 20,
  quantity: 2,
  image_url: "b.jpg",
  category: "dark",
  weight: "500g",
  stock: 3,
};

describe("CartSidePanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when cart is open", () => {
    test("closes panel when clicking overlay, close button, or MainButton", async () => {
      const user = userEvent.setup();
      const setIsCartOpen = vi.fn();

      mockUseCart.mockReturnValue({
        cart: [],
        categoryLabels: {},
        isCartOpen: true,
        setIsCartOpen,
        removeFromCart: vi.fn(),
        remainingTime: 0,
      });

      render(<CartSidePanel />);

      await user.click(screen.getByTestId("cart-bg"));
      await user.click(screen.getByText("✕"));
      await user.click(
        screen.getByRole("button", { name: "translated:eshop-cart.cart-btn" }),
      );

      expect(setIsCartOpen).toHaveBeenCalledTimes(3);
      expect(setIsCartOpen).toHaveBeenCalledWith(false);
    });

    test("renders empty cart message and hides timer/remove buttons", () => {
      mockUseCart.mockReturnValue({
        cart: [],
        categoryLabels: {},
        isCartOpen: true,
        setIsCartOpen: vi.fn(),
        removeFromCart: vi.fn(),
        remainingTime: 0,
      });

      render(<CartSidePanel />);
      expect(
        screen.getByText("translated:eshop-cart.cart-empty"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/translated:eshop-cart.cart-counter/),
      ).toBeNull();
      expect(screen.queryByTestId("remove-btn-1")).toBeNull();
    });

    test("displays timer correctly with padStart", () => {
      mockUseCart.mockReturnValue({
        cart: [cartItemA],
        categoryLabels: { light: "Light roasted" },
        isCartOpen: true,
        setIsCartOpen: vi.fn(),
        removeFromCart: vi.fn(),
        remainingTime: 60_000,
      });

      render(<CartSidePanel />);
      expect(
        screen.getByText("translated:eshop-cart.cart-counter 01:00"),
      ).toBeInTheDocument();
    });

    test("displays 00:00 timer when remainingTime is 0", () => {
      mockUseCart.mockReturnValue({
        cart: [cartItemA],
        categoryLabels: { light: "Light roasted" },
        isCartOpen: true,
        setIsCartOpen: vi.fn(),
        removeFromCart: vi.fn(),
        remainingTime: 0,
      });

      render(<CartSidePanel />);
      expect(
        screen.getByText("translated:eshop-cart.cart-counter 00:00"),
      ).toBeInTheDocument();
    });

    test("renders multiple cart items and remove buttons work", async () => {
      const user = userEvent.setup();
      const removeMock = vi.fn();

      mockUseCart.mockReturnValue({
        cart: [cartItemA, cartItemB],
        categoryLabels: { light: "Light roasted", dark: "Dark roasted" },
        isCartOpen: true,
        setIsCartOpen: vi.fn(),
        removeFromCart: removeMock,
        remainingTime: 120_000,
      });

      render(<CartSidePanel />);

      expect(screen.getByText("Coffee A")).toBeInTheDocument();
      expect(screen.getByText("Coffee B")).toBeInTheDocument();
      expect(screen.getByText("Light roasted 250g")).toBeInTheDocument();
      expect(screen.getByText("Dark roasted 500g")).toBeInTheDocument();
      expect(screen.getByText(/1\s*×\s*\$\s*10/)).toBeInTheDocument();
      expect(screen.getByText(/2\s*×\s*\$\s*20/)).toBeInTheDocument();

      await user.click(screen.getByTestId("remove-btn-1"));
      await user.click(screen.getByTestId("remove-btn-2"));

      expect(removeMock).toHaveBeenCalledWith(1);
      expect(removeMock).toHaveBeenCalledWith(2);
    });

    test("renders correct translation keys", () => {
      mockUseCart.mockReturnValue({
        cart: [cartItemA],
        categoryLabels: { light: "Light roasted" },
        isCartOpen: true,
        setIsCartOpen: vi.fn(),
        removeFromCart: vi.fn(),
        remainingTime: 60_000,
      });

      render(<CartSidePanel />);
      expect(
        screen.getByText("translated:eshop-cart.cart-head"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "translated:eshop-cart.cart-btn" }),
      ).toBeInTheDocument();
    });
  });

  describe("when cart is closed", () => {
    test("panel is off-screen and overlay is not rendered", () => {
      mockUseCart.mockReturnValue({
        cart: [],
        categoryLabels: {},
        isCartOpen: false,
        setIsCartOpen: vi.fn(),
        removeFromCart: vi.fn(),
        remainingTime: 0,
      });

      render(<CartSidePanel />);
      const panel = screen
        .getByText("translated:eshop-cart.cart-btn")
        .closest(".cart-side-panel");
      expect(panel).toHaveClass("translate-x-full");
      expect(screen.queryByTestId("cart-bg")).toBeNull();
    });
  });
});
