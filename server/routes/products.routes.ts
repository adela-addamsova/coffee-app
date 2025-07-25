import { Router, Request, Response } from "express";
import {
  getLatestProducts,
  getAllProducts,
  getProductsByCategory,
  getProductById,
} from "@db/products-db";

const router = Router();

/**
 * GET /api/products
 * Returns all products from the database
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns JSON array of all products
 */
router.get("/", (req: Request, res: Response) => {
  try {
    const products = getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/**
 * GET /api/products/latest
 * Returns the latest 4 products from the database
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns JSON array of latest products
 */
router.get("/latest", (req: Request, res: Response) => {
  try {
    const products = getLatestProducts(4);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/**
 * GET /api/products/:category
 * Returns products for a specific category
 *
 * @param req - Express Request object with `category` param
 * @param res - Express Response object
 * @returns JSON array of products in the category
 */
router.get(
  "/:category",
  (req: Request<{ category: string }>, res: Response) => {
    const { category } = req.params;

    try {
      const products = getProductsByCategory(category);
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch category products" });
    }
  },
);

/**
 * GET /api/products/:category/:id
 * Returns product with a specific id from a category
 *
 * @param req - Express Request object with `category` and `id` params
 * @param res - Express Response object
 * @returns JSON object of the product or 404 if not found
 */
router.get(
  "/:category/:id",
  (req: Request<{ category: string; id: number }>, res: Response) => {
    const { category, id } = req.params;

    try {
      const product = getProductById(id, category);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (_err) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  },
);

export default router;
