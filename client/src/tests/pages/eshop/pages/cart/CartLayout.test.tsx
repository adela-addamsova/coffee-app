import { render, screen } from "@testing-library/react";
import CartLayout from "@eshop/pages/cart/CartLayout";
import { vi } from "vitest";

vi.mock("@assets/e-shop/category-hero.jpg", () => ({ default: "hero.jpg" }));
vi.mock("@assets/e-shop/cart/shopping-cart.svg", () => ({
  default: "cart.svg",
}));
vi.mock("@assets/e-shop/cart/delivery-gray.svg", () => ({
  default: "delivery-gray.svg",
}));
vi.mock("@assets/e-shop/cart/delivery.svg", () => ({
  default: "delivery.svg",
}));
vi.mock("@assets/e-shop/cart/payment-gray.svg", () => ({
  default: "payment-gray.svg",
}));
vi.mock("@assets/e-shop/cart/payment.svg", () => ({ default: "payment.svg" }));

vi.mock("@components/HeroSection", () => ({
  default: ({ imgSrc }: { imgSrc: string }) => (
    <div data-testid="hero">{imgSrc}</div>
  ),
}));

vi.mock("@eshop-components/Newsletter", () => ({
  default: () => <div data-testid="newsletter" />,
}));

describe("CartLayout - Unit tests", () => {
  test("renders HeroSection and Newsletter", () => {
    render(<CartLayout step="cart">Content</CartLayout>);

    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("newsletter")).toBeInTheDocument();
  });

  test("renders children", () => {
    render(
      <CartLayout step="cart">
        <div>Step content</div>
      </CartLayout>,
    );
    expect(screen.getByText("Step content")).toBeInTheDocument();
  });

  test("renders cart menu with correct active step for 'cart'", () => {
    render(<CartLayout step="cart">Content</CartLayout>);

    const icons = screen.getAllByRole("img");
    expect(icons).toHaveLength(3);
    expect(icons[0]).toHaveClass("active");
    expect(icons[0]).toHaveAttribute("src", "cart.svg");
    expect(icons[1]).not.toHaveClass("active");
    expect(icons[1]).toHaveAttribute("src", "delivery-gray.svg");
    expect(icons[2]).not.toHaveClass("active");
    expect(icons[2]).toHaveAttribute("src", "payment-gray.svg");

    const progress = screen.getByTestId("cart-progress");
    expect(progress).toHaveAttribute("data-step", "cart");
  });

  test("renders correct active icons for 'delivery'", () => {
    render(<CartLayout step="delivery">Content</CartLayout>);

    const icons = screen.getAllByRole("img");
    expect(icons[0]).toHaveClass("active");
    expect(icons[0]).toHaveAttribute("src", "cart.svg");
    expect(icons[1]).toHaveClass("active");
    expect(icons[1]).toHaveAttribute("src", "delivery.svg");
    expect(icons[2]).not.toHaveClass("active");
    expect(icons[2]).toHaveAttribute("src", "payment-gray.svg");

    const progress = screen.getByTestId("cart-progress");
    expect(progress).toHaveAttribute("data-step", "delivery");
  });

  test("renders correct active icons for 'payment'", () => {
    render(<CartLayout step="payment">Content</CartLayout>);

    const icons = screen.getAllByRole("img");
    expect(icons[0]).toHaveClass("active");
    expect(icons[0]).toHaveAttribute("src", "cart.svg");
    expect(icons[1]).toHaveClass("active");
    expect(icons[1]).toHaveAttribute("src", "delivery.svg");
    expect(icons[2]).toHaveClass("active");
    expect(icons[2]).toHaveAttribute("src", "payment.svg");

    const progress = screen.getByTestId("cart-progress");
    expect(progress).toHaveAttribute("data-step", "payment");
  });

  test("hides step menu for 'summary'", () => {
    render(<CartLayout step="summary">Content</CartLayout>);
    expect(screen.queryByTestId("cart-menu")).toBeNull();
  });
});
