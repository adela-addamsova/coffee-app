import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, Mock } from "vitest";
import ProductPageLayout from "@/pages/eshop/pages/ProductPageLayout";
import { CartProvider } from "@/pages/eshop/pages/cart/CartContext";

function renderProductPageLayout(route = "/product/light/1") {
  return render(
    <CartProvider>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route
            path="/product/:category/:id"
            element={<ProductPageLayout />}
          />
        </Routes>
      </MemoryRouter>
    </CartProvider>,
  );
}

const mockProduct = {
  id: "1",
  title: "Test Coffee",
  price: 9.99,
  image_url: "/test.jpg",
  stock: 10,
  ingredients: "Coffee beans",
  weight: "250g",
  origin: "Colombia",
  taste_profile: "Fruity",
};

describe("ProductPageLayout - Unit Tests", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      }),
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders loading and then product details", async () => {
    renderProductPageLayout();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    });

    expect(screen.getByText(`$ ${mockProduct.price}`)).toBeInTheDocument();

    expect(screen.getByText(mockProduct.ingredients!)).toBeInTheDocument();

    expect(
      screen.getByText(new RegExp(mockProduct.origin)),
    ).toBeInTheDocument();
  });

  test("shows error message when no category or id", () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={["/product"]}>
          <Routes>
            <Route
              path="/product/:category/:id"
              element={<ProductPageLayout />}
            />
            <Route path="/product" element={<ProductPageLayout />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>,
    );

    expect(screen.getByText(/product not found/i)).toBeInTheDocument();
  });

  test("shows error message when fetch fails", async () => {
    (fetch as Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Fail")),
    );

    renderProductPageLayout();

    await waitFor(() => {
      expect(screen.getByText(/product not found/i)).toBeInTheDocument();
    });
  });

  test("shows error message when response.ok is false", async () => {
    (fetch as Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: "Not found" }),
      }),
    );

    renderProductPageLayout();

    await waitFor(() => {
      expect(screen.getByText(/product not found/i)).toBeInTheDocument();
    });
  });
});
