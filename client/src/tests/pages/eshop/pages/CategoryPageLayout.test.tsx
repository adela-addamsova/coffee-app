import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, type Mock } from "vitest";
import CategoryPageLayout from "@/pages/eshop/pages/CategoryPageLayout";

function renderCategoryPageLayout(route = "/category/light") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/category/:category" element={<CategoryPageLayout />} />
        <Route path="/category" element={<CategoryPageLayout />} />
      </Routes>
    </MemoryRouter>,
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
    renderCategoryPageLayout("/category/light");

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();

    for (const product of mockProducts) {
      await waitFor(() => {
        expect(screen.getByText(product.title)).toBeInTheDocument();
      });
    }

    expect(
      screen.getByRole("heading", { name: /Light Roasted Coffee/i }),
    ).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/^http.*\/products\/light$/),
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

    renderCategoryPageLayout("/category");

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();

    for (const product of allProductsMock) {
      await waitFor(() => {
        expect(screen.getByText(product.title)).toBeInTheDocument();
      });
    }

    expect(
      screen.getByRole("heading", { name: /all products/i }),
    ).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/^http.*\/products/),
    );
  });

  test("shows error for invalid category param", () => {
    renderCategoryPageLayout("/category/invalid");

    expect(screen.getByText(/category not found/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });

  test("shows error message on fetch failure", async () => {
    (fetch as Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("fail")),
    );

    renderCategoryPageLayout("/category/light");

    await waitFor(() => {
      expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
    });
  });

  test("shows no products message if empty list returned", async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    );

    renderCategoryPageLayout("/category/light");

    await waitFor(() => {
      expect(screen.getByText(/no products found/i)).toBeInTheDocument();
    });
  });

  test("shows error message when fetch fails", async () => {
    (fetch as Mock).mockImplementationOnce(() =>
      Promise.resolve({ ok: false }),
    );

    renderCategoryPageLayout("/category");

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
    });
  });
});
