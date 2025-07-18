import db from './coffee-app-db';

/**
 * Full product entry from the database
 */
export interface Product {
  id: number;
  title: string;
  image_url: string;
  category: string;
  price: number;
  ingredients: string;
  weight: string;
  origin: string;
  taste_profile: string;
  full_description: string;
  stock: number;
  created_at?: string | null;
}

/**
 * Simplified version of a product used for listings or previews
 */
export type ProductPreview = Pick<Product, 'id' | 'title' | 'category' | 'price' | 'image_url'>;

/**
 * Retrieves the latest available products, sorted by creation date
 * 
 * @param limit - Maximum number of products to return
 * @returns An array of product previews
 */
function getLatestProducts(limit = 4): ProductPreview[] {
  return db.prepare(`
    SELECT id, title, category, price, image_url
    FROM products
    WHERE deleted_at IS NULL
    AND stock > 0
    ORDER BY datetime(created_at) DESC
    LIMIT ?;
  `).all(limit) as ProductPreview[];
}

/**
 * Retrieves all available products from the database
 * 
 * @returns An array of product previews
 */
function getAllProducts(): ProductPreview[] {
  return db.prepare(`
    SELECT id, title, category, price, image_url
    FROM products
    WHERE deleted_at IS NULL
    AND stock > 0
    ORDER BY datetime(created_at) DESC;
  `).all() as ProductPreview[];
}

/**
 * Retrieves all available products from a given category
 * 
 * @param category - The product category to filter by
 * @returns An array of products in the specified category
 */
function getProductsByCategory(category: string): ProductPreview[] {
  return db.prepare(`
    SELECT id, title, category, price, image_url
    FROM products
    WHERE deleted_at IS NULL AND stock > 0 AND category = ?
    ORDER BY datetime(created_at) DESC;
  `).all(category) as ProductPreview[];
}

/**
 * Retrieves a specific product by its ID and category
 * 
 * @param id - The ID of the product
 * @param category - The category the product belongs to
 * @returns The product object if found, otherwise undefined
 */
function getProductById(id: number, category: string): Product | undefined {
  return db.prepare(`
    SELECT *
    FROM products
    WHERE deleted_at IS NULL AND stock > 0 AND id = ? AND category = ?;
  `).get(id, category) as Product | undefined;
}

export {
  getLatestProducts,
  getAllProducts,
  getProductsByCategory,
  getProductById
};
