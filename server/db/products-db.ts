import { query } from "./coffee-app-db";
import type { Pool } from "pg";

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
  taste_profile_cs?: string;
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
 * @returns An array of the latest product previews
 */
export async function getLatestProducts(
  limit: number,
  poolInstance?: Pool,
): Promise<ProductPreview[]> {
  return query<ProductPreview>(
    `
    SELECT id, title, category, price, image_url, weight, stock
    FROM products
    WHERE deleted_at IS NULL
      AND stock > 0
    ORDER BY created_at DESC, id DESC
    LIMIT $1
    `,
    [limit],
    poolInstance,
  );
}

/**
 * Retrieves all products that are in stock and not soft-deleted.
 *
 * @returns An array of all product previews
 */
export async function getAllProducts(
  poolInstance?: Pool,
): Promise<ProductPreview[]> {
  return query<ProductPreview>(
    `
    SELECT id, title, category, price, image_url, weight, stock
    FROM products
    WHERE deleted_at IS NULL
      AND stock > 0
    ORDER BY created_at DESC
    `,
    [],
    poolInstance,
  );
}

/**
 * Retrieves all products of a specific category that are in stock and not soft-deleted.
 *
 * @param category - The product category to filter by
 * @returns An array of product previews from the given category
 */
export async function getProductsByCategory(
  category: string,
  poolInstance?: Pool,
): Promise<ProductPreview[]> {
  return query<ProductPreview>(
    `
    SELECT id, title, category, price, image_url, weight, stock
    FROM products
    WHERE deleted_at IS NULL AND stock > 0 AND category = $1
    ORDER BY created_at DESC
    `,
    [category],
    poolInstance,
  );
}

/**
 * Retrieves a single product by ID and category if it's in stock and not soft-deleted.
 *
 * @param id - The product ID
 * @param category - The product category
 * @returns The full product record, or undefined if not found
 */
export async function getProductById(
  id: number,
  category: string,
  poolInstance?: Pool,
): Promise<Product | undefined> {
  const result = await query<Product>(
    `
    SELECT *
    FROM products
    WHERE deleted_at IS NULL AND stock > 0 AND id = $1 AND category = $2
    `,
    [id, category],
    poolInstance,
  );
  return result[0];
}
