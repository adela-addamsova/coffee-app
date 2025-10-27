import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, type Mock } from "vitest";
import CategoryPageLayout from "@/pages/eshop/pages/CategoryPageLayout";
import { CartProvider } from "@/pages/eshop/pages/cart/CartContext";
import { I18nextProvider } from "react-i18next";
import { createTestI18n } from "../../../test-i18n";

async function renderCategoryPageLayout(route = "/category/light") {
  const i18n = await createTestI18n();

  return render(
    <I18nextProvider i18n={i18n}>
      <CartProvider>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route
              path="/category/:category"
              element={<CategoryPageLayout />}
            />
            <Route path="/category" element={<CategoryPageLayout />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    </I18nextProvider>,
  );
}

const mockProducts = [
  {
    id: "1",
    title: "Light Coffee 1",
    price: 9.99,
    image_url: "/light1.jpg",
    category: "light",
  },
  {
    id: "2",
    title: "Light Coffee 2",
    price: 12.99,
    image_url: "/light2.jpg",
    category: "light",
  },
];

describe("CategoryPageLayout - Unit Tests", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      }),
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders loading, then products for valid category", async () => {
    await renderCategoryPageLayout("/category/light");

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    for (const product of mockProducts) {
      await waitFor(() => {
        expect(screen.getByText(product.title)).toBeInTheDocument();
      });
    }

    expect(
      screen.getByRole("heading", { name: /Light Roasted Coffee/i }),
    ).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/products/light",
    );
  });

  test("renders all products when no category param", async () => {
    const allProductsMock = [
      ...mockProducts,
      {
        id: "3",
        title: "Dark Coffee 1",
        price: 14.99,
        image_url: "/dark1.jpg",
        category: "dark",
      },
    ];

    (fetch as Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(allProductsMock),
      }),
    );

    await renderCategoryPageLayout("/category");

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();

    for (const product of allProductsMock) {
      await waitFor(() => {
        expect(screen.getByText(product.title)).toBeInTheDocument();
      });
    }

    expect(
      screen.getByRole("heading", { name: /all products/i }),
    ).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/products");
  });

  test("shows error for invalid category param", async () => {
    await renderCategoryPageLayout("/category/invalid");

    expect(screen.getByText(/category not found/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });

  test("shows error message on fetch failure", async () => {
    (fetch as Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("fail")),
    );

    await renderCategoryPageLayout("/category/light");

    await waitFor(() => {
      expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
    });
  });

  test("shows no products message if empty list returned", async () => {
    (fetch as Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    );

    await renderCategoryPageLayout("/category/light");

    await waitFor(() => {
      expect(screen.getByText(/no products found/i)).toBeInTheDocument();
    });
  });

  test("shows error message when fetch fails", async () => {
    (fetch as Mock).mockImplementationOnce(() =>
      Promise.resolve({ ok: false }),
    );

    await renderCategoryPageLayout("/category");

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
    });
  });
});
