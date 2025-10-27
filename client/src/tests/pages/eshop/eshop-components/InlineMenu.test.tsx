import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import InlineMenu from "@/pages/eshop/eshop-components/InlineMenu";

vi.mock("@config/NavItems", () => ({
  navItems: [{ label: "data.nav-items.eshop", to: "/eshop" }],
  eshopNavItems: [
    { label: "data.eshop-nav-items.all", to: "/eshop/products" },
    {
      label: "data.eshop-nav-items.light",
      to: "/eshop/products/light-roasted",
    },
    { label: "data.eshop-nav-items.dark", to: "/eshop/products/dark-roasted" },
    { label: "data.eshop-nav-items.decaf", to: "/eshop/products/decaf" },
  ],
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "data.nav-items.eshop": "E-shop",
        "eshop.inline-menu-btn": "Products",
        "data.eshop-nav-items.all": "All Products",
        "data.eshop-nav-items.light": "Light Roasted",
        "data.eshop-nav-items.dark": "Dark Roasted",
        "data.eshop-nav-items.decaf": "Decaf",
      };
      return map[key] || key;
    },
  }),
}));

global.fetch = vi.fn(
  (): Promise<Response> =>
    Promise.resolve({
      json: () => Promise.resolve({ title: "Test Product Title" }),
    } as Response),
);

function renderWithRouter(initialEntries: string[], routePath: string) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path={routePath} element={<InlineMenu />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("InlineMenu Component", () => {
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

    const matches = screen.getAllByText("Light Roasted");
    expect(matches[1]).toBeInTheDocument();
  });

  test("fetches and displays product name on product page", async () => {
    renderWithRouter(
      ["/eshop/products/light-roasted/123"],
      "/eshop/products/:category/:id",
    );

    const product = await screen.findByText("Test Product Title");
    expect(product).toBeInTheDocument();
  });

  test("dropdown opens on hover and on click", async () => {
    renderWithRouter(["/eshop/products"], "/eshop/products");

    const productsBtn = screen.getByText("Products");
    const dropdown =
      productsBtn.parentElement!.querySelector(".dropdown-menu")!;

    fireEvent.mouseEnter(productsBtn.parentElement!);
    await waitFor(() => expect(dropdown).toHaveClass("visible opacity-100"));

    fireEvent.mouseLeave(productsBtn.parentElement!);
    await waitFor(() => expect(dropdown).toHaveClass("invisible opacity-0"));

    fireEvent.click(productsBtn);
    await waitFor(() => expect(dropdown).toHaveClass("visible opacity-100"));
  });

  test("clicking home link scrolls to top", () => {
    window.scrollTo = vi.fn();
    renderWithRouter(["/eshop/products"], "/eshop/products");

    const homeLink = screen.getByText("E-shop");
    fireEvent.click(homeLink);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });
});
