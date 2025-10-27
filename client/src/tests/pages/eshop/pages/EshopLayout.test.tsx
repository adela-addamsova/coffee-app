import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EshopLayout from "@/pages/eshop/pages/EshopLayout";
import { CartProvider } from "@/pages/eshop/pages/cart/CartContext";

describe("EshopLayout - Unit Tests", () => {
  test("renders Header, Footer and Outlet", () => {
    render(
      <CartProvider>
        <MemoryRouter>
          <EshopLayout />
        </MemoryRouter>
      </CartProvider>,
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(
      document.querySelector("main.eshop-main-wrapper"),
    ).toBeInTheDocument();
  });
});
