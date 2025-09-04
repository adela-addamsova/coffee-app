import { JSX } from "react";
import { Link } from "react-router-dom";
import ShoppingCart from "@assets/e-shop/shopping-cart.svg";

export type ProductMiniatureProps = {
  id: string | number;
  title: string;
  price: number;
  image_url: string;
  category: "light" | "dark" | "decaf";
};

/**
 * ProductMiniature component
 *
 * Displays a clickable product preview with image, title, category label, price, and a shopping cart icon
 *
 * @param {Object} props - Component props
 * @param {string | number} props.id - Unique product identifier
 * @param {string} props.title - Product title
 * @param {number} props.price - Product price
 * @param {string} props.image_url - URL of the product image
 * @param {'light' | 'dark' | 'decaf'} props.category - Product category
 * @returns {JSX.Element} The product miniature link element
 */

export default function ProductMiniature({
  id,
  title,
  price,
  image_url,
  category,
}: ProductMiniatureProps): JSX.Element {
  const categoryLabels: Record<string, string> = {
    light: "Light roasted",
    dark: "Dark roasted",
    decaf: "Decaf",
  };

  return (
    <Link
      to={`/e-shop/products/${category}/${id}`}
      className="eshop-product-miniature"
    >
      <div className="product-image">
        <img src={image_url} alt={title} />
      </div>
      <div className="product-info">
        <div className="product-miniature-info-title">
          <h3 className="product-miniature-title">{title}</h3>
        </div>
        <div className="product-miniature-info-inner">
          <div className="flex flex-col gap-2">
            <p className="product-miniature-description font-light text-nowrap">
              {categoryLabels[category] || category}
            </p>
            <p className="product-miniature-price">${price.toFixed(2)}</p>
          </div>

          <div className="product-info-button">
            <img src={ShoppingCart} alt="Shopping Cart" />
            {/* <h6 className='font-montserrat text-[10px] mt-2 font-semibold'>ADD TO CART</h6> */}
          </div>
        </div>
      </div>
    </Link>
  );
}
