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
import express from "express";
import productRouter from "@routes/products.routes";
import { testPool } from "@server/tests/coffee-app-test-db";

describe("Product Routes", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/products", productRouter(testPool));
  });

  afterAll(async () => {
    await testPool.end();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Successful responses", () => {
    test("returns array of products - GET /api/products", async () => {
      const mockProductArray = [{ id: 1, title: "Coffee A" }];
      (getAllProducts as jest.Mock).mockResolvedValue(mockProductArray);

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
      (getLatestProducts as jest.Mock).mockResolvedValue(
        mockLatestProductArray,
      );

      const res = await request(app).get("/api/products/latest");

      expect(res.status).toBe(200);
      expect(getLatestProducts).toHaveBeenCalledWith(4, testPool);
      expect(res.body).toEqual(mockLatestProductArray);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(4);
    });

    test("returns products by category - GET /api/products/:category", async () => {
      const mockCategory = [{ category: "light", title: "Coffee A" }];
      (getProductsByCategory as jest.Mock).mockResolvedValue(mockCategory);

      const res = await request(app).get("/api/products/light");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCategory);
      expect(getProductsByCategory).toHaveBeenCalledWith("light", testPool);
    });

    test("returns product by id - GET /api/products/:category/:id", async () => {
      const mockProduct = {
        id: 4,
        title: "Coffee A",
        category: "light",
        taste_profile: "fruity",
        taste_profile_cs: "ovocný",
      };
      (getProductById as jest.Mock).mockResolvedValue(mockProduct);

      const resEn = await request(app).get("/api/products/light/4");
      expect(resEn.status).toBe(200);
      expect(resEn.body.taste_profile).toBe("fruity");

      const resCs = await request(app).get("/api/products/light/4?lang=cs");
      expect(resCs.status).toBe(200);
      expect(resCs.body.taste_profile).toBe("ovocný");

      expect(getProductById).toHaveBeenCalledWith(4, "light", testPool);
    });

    test("returns 404 if product not found - GET /api/products/:category/:id", async () => {
      (getProductById as jest.Mock).mockResolvedValue(null);

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
        (mockFn as jest.Mock).mockRejectedValue(new Error("DB error"));

        const res = await request(app).get(route);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: errorMessage });
      });
    });
  });

  describe("Correct translation", () => {
    test("returns taste_profile in English by default", async () => {
      const mockProduct = {
        id: 4,
        title: "Coffee A",
        category: "light",
        taste_profile: "fruity",
        taste_profile_cs: "ovocný",
      };
      (getProductById as jest.Mock).mockResolvedValue(mockProduct);

      const res = await request(app).get("/api/products/light/4");

      expect(res.status).toBe(200);
      expect(res.body.taste_profile).toBe("fruity");
    });

    test("returns taste_profile in Czech when lang=cs", async () => {
      const mockProduct = {
        id: 4,
        title: "Coffee A",
        category: "light",
        taste_profile: "fruity",
        taste_profile_cs: "ovocný",
      };
      (getProductById as jest.Mock).mockResolvedValue(mockProduct);

      const res = await request(app).get("/api/products/light/4?lang=cs");

      expect(res.status).toBe(200);
      expect(res.body.taste_profile).toBe("ovocný");
    });

    test("falls back to English if Czech translation is missing", async () => {
      const mockProduct = {
        id: 4,
        title: "Coffee A",
        category: "light",
        taste_profile: "fruity",
        taste_profile_cs: null,
      };
      (getProductById as jest.Mock).mockResolvedValue(mockProduct);

      const res = await request(app).get("/api/products/light/4?lang=cs");

      expect(res.status).toBe(200);
      expect(res.body.taste_profile).toBe("fruity");
    });
  });
});
