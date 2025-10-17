import { JSX } from "react";
import { Link } from "react-router-dom";
import LightRoasted from "@assets/e-shop/light-roasted.png";
import DarkRoasted from "@assets/e-shop/dark-roasted.png";
import Decaf from "@assets/e-shop/decaf.png";
import { eshopNavItems } from "@config/NavItems";
import { useTranslation } from "react-i18next";

interface Category {
  name: string;
  image: string;
  link?: string;
}

const navLight = eshopNavItems.find(
  (item) => item.label === "data.eshop-nav-items.light",
);
const navDark = eshopNavItems.find(
  (item) => item.label === "data.eshop-nav-items.dark",
);
const navDecaf = eshopNavItems.find(
  (item) => item.label === "data.eshop-nav-items.decaf",
);

/**
 * ProductCategories
 *
 * Displays links to coffee product categories with images.
 *
 * @returns {JSX.Element} The rendered categories section with navigation links.
 */
export default function ProductCategories(): JSX.Element {
  const { t } = useTranslation();

  const categories: Category[] = [
    {
      name: t("data.eshop-nav-items.light"),
      image: LightRoasted,
      link: navLight?.to,
    },
    {
      name: t("data.eshop-nav-items.dark"),
      image: DarkRoasted,
      link: navDark?.to,
    },
    {
      name: t("data.eshop-nav-items.decaf"),
      image: Decaf,
      link: navDecaf?.to,
    },
  ];
  return (
    <div
      className="product-categories-section"
      data-testid="product-categories"
    >
      {categories.map((item) => (
        <Link
          key={item.name}
          to={item.link ?? "#"}
          className="product-category group"
        >
          <div className="img-box">
            <img src={item.image} alt={item.name} className="category-img" />
            <div className="img-overlay"></div>
          </div>
          <div className="category-name">
            <h4>{item.name}</h4>
          </div>
        </Link>
      ))}
    </div>
  );
}
