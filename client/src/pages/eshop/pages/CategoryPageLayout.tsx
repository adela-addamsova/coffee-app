import React, { JSX } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductMiniature from '../eshop-components/ProductMiniature';
import HeroSection from '../../../components/HeroSection';
import HeroImg from '../../../assets/e-shop/category-hero.jpg';
import InlineMenu from '../eshop-components/InlineMenu';

const categoryLabels: Record<string, string> = {
  light: 'Light Roasted Coffee',
  dark: 'Dark Roasted Coffee',
  decaf: 'Decaf Coffee',
};

type Product = {
  id: string | number;
  title: string;
  price: number;
  image_url: string;
  category: 'light' | 'dark' | 'decaf';
};

/**
 * CategoryPageLayout component
 *
 * Displays a category-specific page for the e-shop.
 * 
 * Features:
 * - Reads the category param from the URL via React Router.
 * - Validates the category against known categories.
 * - Fetches products for the category or all products if no category is specified.
 * - Handles loading and error states.
 * - Renders a HeroSection with a category-specific heading.
 * - Displays an InlineMenu for navigation within the e-shop.
 * - Shows products using ProductMiniature components or an appropriate fallback message.
 *
 * State:
 * - products: Array of products fetched from API.
 * - loading: Indicates whether the products are being loaded.
 * - error: Stores any error message during fetching.
 *
 * Notes:
 * - Uses environment variable VITE_API_URL as the base API endpoint.
 * - Assumes products returned from API conform to the Product type.
 * 
 * @returns {JSX.Element} The rendered category page layout
 */
export default function CategoryPageLayout(): JSX.Element {
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validCategory = !category || categoryLabels.hasOwnProperty(category);

  const heading = validCategory
    ? (category ? categoryLabels[category] : 'All Products')
    : undefined;

  useEffect(() => {
    if (!validCategory) {
      setError('Category not found');
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const url = category
      ? `${import.meta.env.VITE_API_URL}/products/${category}`
      : `${import.meta.env.VITE_API_URL}/products`;

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to load products');
        }
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading products:', err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, [category, validCategory]);

  if (!validCategory) {
    return (
      <div className="subpage-error pt-[100px]">
        <p className="font-bold">Category not found</p>
        <p>The category "{category}" does not exist.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero section */}
      <div className="category-page-hero">
        <HeroSection
          imgSrc={HeroImg}
          heading={heading}
        />
      </div>

      <InlineMenu />

      {/* Loading / error states */}
      <div className="subpage-error">
        {loading && <p>Loading products...</p>}
        {error && <p className="error">{error}</p>}
      </div>

      {/* Products grid or fallback */}
      {!loading && !error && (
        products.length > 0 ? (
          <section className="products-grid">
            {products.map(product => (
              <ProductMiniature key={product.id} {...product} />
            ))}
          </section>
        ) : (
          <div className="subpage-error">
            <p>No products found in this category.</p>
          </div>
        )
      )}
    </div>
  );
}
