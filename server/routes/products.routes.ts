import { Router, Request, Response } from "express";
import {
  getLatestProducts,
  getAllProducts,
  getProductsByCategory,
  getProductById,
} from "../db/products-db";

/**
 * Creates and returns a router that handles product-related API endpoints
 */
export default function productRouter() {
  const router = Router();

  /**
   * GET /api/products
   * Returns all products from the database
   */
  router.get("/", async (req: Request, res: Response) => {
    try {
      const products = await getAllProducts();
      res.json(products);
    } catch (_err) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  /**
   * GET /api/products/latest
   * Returns the latest 4 products
   */
  router.get("/latest", async (req: Request, res: Response) => {
    try {
      const products = await getLatestProducts(4);
      res.json(products);
    } catch (_err) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  /**
   * GET /api/products/:category
   * Returns all products belonging to a specific category
   */
  router.get(
    "/:category",
    async (req: Request<{ category: string }>, res: Response) => {
      try {
        const products = await getProductsByCategory(req.params.category);
        res.json(products);
      } catch (_err) {
        res.status(500).json({ error: "Failed to fetch category products" });
      }
    },
  );

  /**
   * GET /api/products/:category/:id
   * Returns a specific product by ID and category
   */
  router.get(
    "/:category/:id",
    async (req: Request<{ category: string; id: string }>, res: Response) => {
      try {
        const { category, id } = req.params;
        const product = await getProductById(Number(id), category);
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
