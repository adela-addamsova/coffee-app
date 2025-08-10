import { JSX, useEffect, useState } from "react";
import ProductMiniature from "@eshop-components/ProductMiniature";

interface Product {
  id: string | number;
  title: string;
  category: "light" | "dark" | "decaf";
  price: number;
  image_url: string;
}

/**
 * LatestProducts
 *
 * Fetches and displays the latest products as ProductMiniature components
 *
 * @returns {JSX.Element} The rendered section containing the latest products
 */
export default function LatestProducts(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/latest`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }
        setProducts(data);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to load products");
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p data-testid="loading">Loading latest products...</p>;
  }

  if (error) {
    return (
      <section className="latest-products" data-testid="latest-products-error">
        <p className="error-message">{error}</p>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="latest-products" data-testid="latest-products-empty">
        <p>No latest products found.</p>
      </section>
    );
  }

  return (
    <section className="latest-products" data-testid="latest-products">
      {products.map((product) => (
        <ProductMiniature
          key={product.id}
          id={product.id}
          title={product.title}
          category={product.category}
          price={product.price}
          image_url={product.image_url}
        />
      ))}
    </section>
  );
}
