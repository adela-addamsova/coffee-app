jest.mock("@db/products-db", () => ({
  getAllProducts: jest.fn(),
  getLatestProducts: jest.fn(),
  getProductsByCategory: jest.fn(),
  getProductById: jest.fn(),
}));

import {
  getAllProducts,
  getLatestProducts,
  getProductsByCategory,
  getProductById,
} from "@db/products-db";

import request from "supertest";
import app from "@server/server";

describe("Product Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Successful responses", () => {
    test("returns array of products - GET /api/products", async () => {
      const mockProductArray = [{ id: 1, title: "Coffee A" }];
      (getAllProducts as jest.Mock).mockReturnValue(mockProductArray);

      const res = await request(app).get("/api/products");

      expect(res.status).toBe(200);
      expect(getAllProducts).toHaveBeenCalled();
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toEqual(mockProductArray);
    });

    test("returns 4 latest products - GET /api/products/latest", async () => {
      const mockLatestProductArray = [
        { id: 1, title: "Coffee A" },
        { id: 2, title: "Coffee B" },
        { id: 3, title: "Coffee C" },
        { id: 4, title: "Coffee D" },
      ];
      (getLatestProducts as jest.Mock).mockReturnValue(mockLatestProductArray);

      const res = await request(app).get("/api/products/latest");

      expect(res.status).toBe(200);
      expect(getLatestProducts).toHaveBeenCalled();
      expect(res.body).toEqual(mockLatestProductArray);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(4);
    });

    test("returns products category - GET /api/products/:category", async () => {
      const mockCategory = [{ category: "light" }];
      (getProductsByCategory as jest.Mock).mockReturnValue(mockCategory);

      const res = await request(app).get("/api/products/light");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCategory);
      expect(getProductsByCategory).toHaveBeenCalledWith(
        "light",
        expect.anything(),
      );
    });

    test("returns product by id - GET /api/products/:category/:id", async () => {
      const mockProduct = { id: 4, title: "Coffee A", category: "light" };
      (getProductById as jest.Mock).mockReturnValue(mockProduct);

      const res = await request(app).get("/api/products/light/4");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProduct);
      expect(res.body).toHaveProperty("category", "light");
      expect(getProductById).toHaveBeenCalledWith(
        4,
        "light",
        expect.anything(),
      );
    });

    test("returns 404 if not found - GET /api/products/:category/:id", async () => {
      (getProductById as jest.Mock).mockReturnValue(null);

      const res = await request(app).get("/api/products/light/999");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Product not found" });
    });
  });

  describe("Error handling", () => {
    const errorCases = [
      {
        route: "/api/products",
        mockFn: getAllProducts,
        errorMessage: "Failed to fetch products",
      },
      {
        route: "/api/products/latest",
        mockFn: getLatestProducts,
        errorMessage: "Failed to fetch products",
      },
      {
        route: "/api/products/somecategory",
        mockFn: getProductsByCategory,
        errorMessage: "Failed to fetch category products",
      },
      {
        route: "/api/products/somecategory/123",
        mockFn: getProductById,
        errorMessage: "Failed to fetch product",
      },
    ];

    errorCases.forEach(({ route, mockFn, errorMessage }) => {
      test(`responds with 500 on internal error for ${route}`, async () => {
        (mockFn as jest.Mock).mockImplementation(() => {
          throw new Error("DB error");
        });

        const res = await request(app).get(route);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: errorMessage });
      });
    });
  });
});
