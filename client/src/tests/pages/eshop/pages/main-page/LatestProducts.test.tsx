import { render, screen, waitFor } from "@testing-library/react";
import LatestProducts from "@/pages/eshop/pages/main-page/LatestProducts";
import { MemoryRouter } from "react-router-dom";
import { vi, type Mock } from "vitest";

vi.stubEnv("VITE_API_URL", "http://mock-api.com");

vi.mock("@eshop-components/ProductMiniature", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

const mockProducts = [
  {
    id: 1,
    title: "Light Roast",
    category: "light",
    price: 10.5,
    image_url: "/img/light.jpg",
  },
  {
    id: 2,
    title: "Dark Roast",
    category: "dark",
    price: 12.0,
    image_url: "/img/dark.jpg",
  },
];

const renderLatestProducts = () =>
  render(
    <MemoryRouter>
      <LatestProducts />
    </MemoryRouter>,
  );

describe("LatestProducts - Unit Tests", () => {
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

  test("shows loading initially", () => {
    renderLatestProducts();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("fetches and displays products", async () => {
    renderLatestProducts();

    await waitFor(() => {
      expect(screen.getByTestId("latest-products")).toBeInTheDocument();
    });

    for (const product of mockProducts) {
      expect(screen.getByText(product.title)).toBeInTheDocument();
    }
  });

  test("shows empty message when no products", async () => {
    (fetch as Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    );

    renderLatestProducts();

    await waitFor(() => {
      expect(screen.getByTestId("latest-products-empty")).toBeInTheDocument();
      expect(screen.getByText(/no latest products found/i)).toBeInTheDocument();
    });
  });

  test("shows error message when fetch fails", async () => {
    (fetch as Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Fetch failed")),
    );

    renderLatestProducts();

    await waitFor(() => {
      expect(screen.getByTestId("latest-products-error")).toBeInTheDocument();
      expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
    });
  });

  test("shows error message when data format invalid", async () => {
    (fetch as Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ invalid: "data" }),
      }),
    );

    renderLatestProducts();

    await waitFor(() => {
      expect(screen.getByTestId("latest-products-error")).toBeInTheDocument();
      expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
    });
  });
});
