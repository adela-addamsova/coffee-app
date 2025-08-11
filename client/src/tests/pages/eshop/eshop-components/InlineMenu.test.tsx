import { vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import InlineMenu from "@eshop-components/InlineMenu";

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ title: "Test Product Title" }),
  } as Response),
);

vi.mock("@config/NavItems", () => ({
  navItems: [{ label: "E-shop", to: "/eshop" }],
  eshopNavItems: [
    { label: "All Products", to: "/eshop/products" },
    { label: "Light Roasted", to: "/eshop/products/light-roasted" },
    { label: "Dark Roasted", to: "/eshop/products/dark-roasted" },
    { label: "Decaf", to: "/eshop/products/decaf" },
  ],
}));

function renderWithRouter(initialEntries: string[], routePath: string) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path={routePath} element={<InlineMenu />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("InlineMenu Component - Unit Tests", () => {
  test("renders nothing outside e-shop path", () => {
    renderWithRouter(["/other-path"], "*");
    expect(screen.queryByText("E-shop")).toBeNull();
  });

  test("renders home link and products dropdown on /eshop/products path", () => {
    renderWithRouter(["/eshop/products"], "/eshop/products");
    expect(screen.getByText("E-shop")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  test("renders category name on category page", () => {
    renderWithRouter(
      ["/eshop/products/light-roasted"],
      "/eshop/products/:category",
    );
    const categoryLabels = screen.getAllByText("Light Roasted");
    expect(categoryLabels.length).toBeGreaterThan(1);
  });

  test("fetches and displays product name on product page", async () => {
    renderWithRouter(
      ["/eshop/products/light-roasted/123"],
      "/eshop/products/:category/:id",
    );

    expect(screen.getByText("Light Roasted")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("Test Product Title")).toBeInTheDocument(),
    );
  });

  test("dropdown opens on hover and on click; clicking link triggers scroll and closes menu", async () => {
    window.scrollTo = vi.fn();

    renderWithRouter(["/eshop/products"], "/eshop/products");

    const productsButton = screen.getByText("Products");
    const dropdownWrapper = productsButton.parentElement!;
    const dropdownMenu = dropdownWrapper.querySelector(".dropdown-menu")!;

    fireEvent.mouseEnter(dropdownWrapper);

    await waitFor(() => {
      expect(dropdownMenu).not.toHaveClass("invisible opacity-0");
    });

    fireEvent.mouseLeave(dropdownWrapper);

    await waitFor(() => {
      expect(dropdownMenu).toHaveClass("invisible opacity-0");
    });

    fireEvent.click(productsButton);

    await waitFor(() => {
      expect(dropdownMenu).not.toHaveClass("invisible opacity-0");
    });

    const dropdownLink = await screen.findByText("Light Roasted");
    fireEvent.click(dropdownLink);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });

    await waitFor(() => {
      expect(dropdownMenu).toHaveClass("invisible opacity-0");
    });
  });

  test("clicking navigation links calls scrollToTop with correct behavior", () => {
    window.scrollTo = vi.fn();

    renderWithRouter(["/eshop/products"], "/eshop/products");

    const homeLink = screen.getByText("E-shop");
    homeLink.click();

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });
});
