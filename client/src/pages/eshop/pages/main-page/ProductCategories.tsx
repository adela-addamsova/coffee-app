import React, { JSX } from "react";
import { Link } from "react-router-dom";
import LightRoasted from "@assets/e-shop/light-roasted.png";
import DarkRoasted from "@assets/e-shop/dark-roasted.png";
import Decaf from "@assets/e-shop/decaf.png";
import { eshopNavItems } from "@config/NavItems";

interface Category {
  name: string;
  image: string;
  link?: string;
}

const navLight = eshopNavItems.find((item) => item.label === "Light Roasted");
const navDark = eshopNavItems.find((item) => item.label === "Dark Roasted");
const navDecaf = eshopNavItems.find((item) => item.label === "Decaf");

const categories: Category[] = [
  {
    name: "LIGHT ROASTED",
    image: LightRoasted,
    link: navLight?.to,
  },
  {
    name: "DARK ROASTED",
    image: DarkRoasted,
    link: navDark?.to,
  },
  {
    name: "DECAF",
    image: Decaf,
    link: navDecaf?.to,
  },
];

/**
 * ProductCategories
 *
 * Displays links to coffee product categories with images.
 *
 * @returns {JSX.Element} The rendered categories section with navigation links.
 */
export default function ProductCategories(): JSX.Element {
  return (
    <div className="product-categories-section">
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
          <div className="category-name">{item.name}</div>
        </Link>
      ))}
    </div>
  );
}
