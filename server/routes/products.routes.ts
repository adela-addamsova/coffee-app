import { Router, Request, Response } from "express";
import type { Database as DBType } from "better-sqlite3";
import {
  getLatestProducts,
  getAllProducts,
  getProductsByCategory,
  getProductById,
} from "@db/products-db";

/**
 * Creates and returns a router that handles product-related API endpoints
 * @param dbInstance - An instance of the SQLite database
 * @returns Express Router with product endpoints
 */
export default function productRouter(dbInstance: DBType) {
  const router = Router();

  /**
   * GET /api/products
   * Returns all products from the database
   * Response: Array of all products
   */
  router.get("/", (req: Request, res: Response) => {
    try {
      const products = getAllProducts(dbInstance);
      res.json(products);
    } catch (_err) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  /**
   * GET /api/products/latest
   * Returns the latest 4 products
   * Useful for homepage previews or "New arrivals" sections
   * Response: Array of latest 4 products
   */
  router.get("/latest", (req: Request, res: Response) => {
    try {
      const products = getLatestProducts(4, dbInstance);
      res.json(products);
    } catch (_err) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  /**
   * GET /api/products/:category
   * Returns all products belonging to a specific category
   * @param category - Category name (e.g., "coffee", "tea")
   * Response: Array of products in the given category
   */
  router.get(
    "/:category",
    (req: Request<{ category: string }>, res: Response) => {
      try {
        const products = getProductsByCategory(req.params.category, dbInstance);
        res.json(products);
      } catch (_err) {
        res.status(500).json({ error: "Failed to fetch category products" });
      }
    },
  );

  /**
   * GET /api/products/:category/:id
   * Returns a specific product by ID and category
   * @param category - Category name
   * @param id - Product ID
   * Response: Single product object, or 404 if not found
   */
  router.get(
    "/:category/:id",
    (req: Request<{ category: string; id: string }>, res: Response) => {
      try {
        const { category, id } = req.params;
        const product = getProductById(Number(id), category, dbInstance);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
      } catch (_err) {
        res.status(500).json({ error: "Failed to fetch product" });
      }
    },
  );

  return router;
}
