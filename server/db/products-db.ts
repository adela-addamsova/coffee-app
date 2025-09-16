import type { Database as DBType } from "better-sqlite3";

/**
 * Full product record from the database
 */
export interface Product {
  id: number;
  title: string;
  image_url?: string;
  category: string;
  price?: number;
  ingredients?: string;
  weight?: string;
  origin?: string;
  taste_profile?: string;
  full_description?: string;
  stock?: number;
  deleted_at?: string | null;
  created_at?: string;
}

/**
 * Lightweight product preview for listings
 */
export type ProductPreview = Pick<
  Product,
  "id" | "title" | "category" | "price" | "image_url"
>;

/**
 * Retrieves the most recently added products (in stock and not deleted).
 *
 * @param limit - Maximum number of products to return
 * @param dbInstance - The SQLite database instance
 * @returns An array of the latest product previews
 */
function getLatestProducts(
  limit: number,
  dbInstance: DBType,
): ProductPreview[] {
  return dbInstance
    .prepare(
      `
    SELECT id, title, category, price, image_url, weight, stock
    FROM products
    WHERE deleted_at IS NULL
    AND stock > 0
    ORDER BY datetime(created_at) DESC, id DESC
    LIMIT ?;
  `,
    )
    .all(limit) as ProductPreview[];
}

/**
 * Retrieves all products that are in stock and not soft-deleted.
 *
 * @param dbInstance - The SQLite database instance
 * @returns An array of all product previews
 */
function getAllProducts(dbInstance: DBType): ProductPreview[] {
  return dbInstance
    .prepare(
      `
    SELECT id, title, category, price, image_url, weight, stock
    FROM products
    WHERE deleted_at IS NULL
    AND stock > 0
    ORDER BY datetime(created_at) DESC;
  `,
    )
    .all() as ProductPreview[];
}

/**
 * Retrieves all products of a specific category that are in stock and not soft-deleted.
 *
 * @param category - The product category to filter by
 * @param dbInstance - The SQLite database instance
 * @returns An array of product previews from the given category
 */
function getProductsByCategory(
  category: string,
  dbInstance: DBType,
): ProductPreview[] {
  return dbInstance
    .prepare(
      `
    SELECT id, title, category, price, image_url, weight, stock
    FROM products
    WHERE deleted_at IS NULL AND stock > 0 AND category = ?
    ORDER BY datetime(created_at) DESC;
  `,
    )
    .all(category) as ProductPreview[];
}

/**
 * Retrieves a single product by ID and category if it's in stock and not soft-deleted.
 *
 * @param id - The product ID
 * @param category - The product category
 * @param dbInstance - The SQLite database instance
 * @returns The full product record, or undefined if not found
 */
function getProductById(
  id: number,
  category: string,
  dbInstance: DBType,
): Product | undefined {
  return dbInstance
    .prepare(
      `
    SELECT *
    FROM products
    WHERE deleted_at IS NULL AND stock > 0 AND id = ? AND category = ?;
  `,
    )
    .get(id, category) as Product | undefined;
}

export {
  getLatestProducts,
  getAllProducts,
  getProductsByCategory,
  getProductById,
};
