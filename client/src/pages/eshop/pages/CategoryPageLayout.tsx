import { JSX } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductMiniature from "@eshop-components/ProductMiniature";
import HeroSection from "@components/HeroSection";
import HeroImg from "@assets/e-shop/category-hero.jpg";
import InlineMenu from "@/pages/eshop/eshop-components/InlineMenu";
import { useTranslation } from "react-i18next";

type Product = {
  id: string | number;
  title: string;
  price: number;
  image_url: string;
  category: "light" | "dark" | "decaf";
  weight: string;
  stock: number;
};

/**
 * CategoryPageLayout component
 *
 * Displays a category-specific page for the e-shop.
 *
 * @returns {JSX.Element} The rendered category page layout
 */
export default function CategoryPageLayout(): JSX.Element {
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const categoryLabels: Record<string, string> = {
    light: t("eshop.cat-head-1"),
    dark: t("eshop.cat-head-2"),
    decaf: t("eshop.cat-head-3"),
  };

  const validCategory =
    !category || Object.prototype.hasOwnProperty.call(categoryLabels, category);

  const heading = validCategory
    ? category
      ? categoryLabels[category]
      : "All Products"
    : undefined;

  useEffect(() => {
    if (!validCategory) {
      setError("Category not found");
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
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load products");
        }
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, [category, validCategory]);

  if (!validCategory) {
    return (
      <div className="subpage-error pt-[100px]">
        <p className="font-bold">{t("eshop.no-category-msg")}</p>
      </div>
    );
  }

  return (
    <div data-testid="category-page">
      {/* Hero section */}
      <div className="category-page-hero">
        <HeroSection imgSrc={HeroImg} heading={heading} />
      </div>

      <InlineMenu />

      {/* Loading / error states */}
      {(loading || error) && (
        <div className="subpage-error">
          {loading && <p>{t("eshop.loading-products-msg")}</p>}
          {error && <p className="error">{error}</p>}
        </div>
      )}

      {/* Products grid or fallback */}
      {!loading &&
        !error &&
        (products.length > 0 ? (
          <section className="products-grid">
            {products.map((product) => (
              <ProductMiniature key={product.id} {...product} />
            ))}
          </section>
        ) : (
          <div className="subpage-error">
            <p>{t("eshop.no-products-msg")}</p>
          </div>
        ))}
    </div>
  );
}
