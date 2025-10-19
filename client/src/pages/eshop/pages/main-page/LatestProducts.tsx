import { JSX, useEffect, useState } from "react";
import ProductMiniature from "@eshop-components/ProductMiniature";
import { useTranslation } from "react-i18next";

interface Product {
  id: string | number;
  title: string;
  category: "light" | "dark" | "decaf";
  price: number;
  image_url: string;
  weight: string;
  stock: number;
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
  const { t } = useTranslation();

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
    return <p data-testid="loading">{t("eshop.loading-msg-2")}</p>;
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
          weight={product.weight}
          stock={product.stock}
        />
      ))}
    </section>
  );
}
