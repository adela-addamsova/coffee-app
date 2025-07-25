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
 * Fetches and displays the latest products as ProductMiniature components.
 *
 * @returns {JSX.Element} The rendered section containing the latest products.
 */
export default function LatestProducts(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/latest`)
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch((err) => console.error("Error fetching latest products:", err));
  }, []);

  return (
    <section className="latest-products">
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
