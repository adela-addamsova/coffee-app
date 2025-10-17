import { JSX } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
// import ShoppingCart from "@assets/e-shop/cart/shopping-cart.svg";
import MenuArrowGray from "@assets/e-shop/eshop-components/menu-arrow-gray.svg";
import { eshopNavItems, navItems } from "@config/NavItems";
import { useTranslation } from "react-i18next";

type NavItem = {
  label: string;
  to: string;
};

type ProductResponse = {
  title: string;
};

/**
 * InlineMenu component
 *
 * Renders a breadcrumb-style inline navigation menu for the e-shop section
 * Displays links to the main e-shop page, product categories, and individual product names,
 * based on the current URL path and route parameters
 *
 * Includes a dropdown menu for product categories and a shopping cart icon
 * Fetches product details dynamically to display the current product's title
 *
 * @returns {JSX.Element | null} The inline menu element or null if not on the e-shop path
 */

export default function InlineMenu(): JSX.Element | null {
  const { t } = useTranslation();
  const location = useLocation();
  const path = location.pathname;
  const { category } = useParams<{ category?: string }>();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [productName, setProductName] = useState<string | null>(null);

  const homeNavItem = navItems.find(
    (item): item is NavItem =>
      !!item.to && item.label === "data.nav-items.eshop",
  );
  const allProductsNavItem = eshopNavItems.find(
    (item): item is NavItem =>
      !!item.to && item.label === "data.eshop-nav-items.all",
  );
  const navLight = eshopNavItems.find(
    (item): item is NavItem =>
      !!item.to && item.label === "data.eshop-nav-items.light",
  );
  const navDark = eshopNavItems.find(
    (item): item is NavItem =>
      !!item.to && item.label === "data.eshop-nav-items.dark",
  );
  const navDecaf = eshopNavItems.find(
    (item): item is NavItem =>
      !!item.to && item.label === "data.eshop-nav-items.decaf",
  );
  // const shoppingCart = eshopNavItems.find(
  //   (item): item is NavItem => !!item.to && item.label === "Shopping Cart",
  // );

  const currentCategoryItem = [navLight, navDark, navDecaf]
    .filter((item): item is NavItem => !!item)
    .find((item) => location.pathname.startsWith(item.to));

  const segments = path.split("/").filter(Boolean);
  const isCategoryPage = segments.includes("products") && segments.length === 3;
  const isProductPage = segments.includes("products") && segments.length === 4;
  const id = isProductPage ? segments[3] : null;

  useEffect(() => {
    if (id && category) {
      fetch(`${import.meta.env.VITE_API_URL}/products/${category}/${id}`)
        .then((res) => res.json())
        .then((data: ProductResponse) => setProductName(data.title))
        .catch(() => setProductName(null));
    } else {
      setProductName(null);
    }
  }, [id, category]);

  const scrollToTop = (instant = false): void => {
    window.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
  };

  const closeDropdown = (): void => setDropdownOpen(false);

  if (!homeNavItem || !path.startsWith(homeNavItem.to)) return null;

  return (
    <div className="inline-menu-section">
      <div className="inline-menu-items">
        {/* E-shop Home */}
        {homeNavItem && (
          <div className="inline-menu-item">
            <Link
              to={homeNavItem.to}
              onClick={() => scrollToTop(true)}
              className="text-gray-400"
            >
              {t(homeNavItem.label)}
            </Link>
          </div>
        )}

        {/* > Products + Dropdown */}
        <div
          className="inline-menu-item"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <span className="arrow">
            <img src={MenuArrowGray} alt="Arrow" />
          </span>

          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={`relative ${isCategoryPage || isProductPage ? "text-gray-400" : ""}`}
          >
            Products
          </button>

          <div
            className={`dropdown-menu ${dropdownOpen ? "visible opacity-100" : "invisible opacity-0"}`}
          >
            <ul className="dropdown-menu-list">
              {[navLight, navDark, navDecaf, allProductsNavItem].map(
                (navItem) =>
                  navItem && (
                    <li key={navItem.label}>
                      <Link
                        to={navItem.to}
                        onClick={() => {
                          scrollToTop(true);
                          closeDropdown();
                        }}
                        className="dropdown-link"
                      >
                        {t(navItem.label)}
                      </Link>
                    </li>
                  ),
              )}
            </ul>
          </div>
        </div>

        {/* > Category */}
        {isCategoryPage && currentCategoryItem && (
          <div className="inline-menu-item">
            <span className="arrow">
              <img src={MenuArrowGray} alt="Arrow" />
            </span>
            <span>{t(currentCategoryItem.label)}</span>
          </div>
        )}

        {/* > Product Name */}
        {isProductPage && productName && (
          <>
            {currentCategoryItem && (
              <div className="inline-menu-item">
                <span className="arrow">
                  <img src={MenuArrowGray} alt="Arrow" />
                </span>
                <Link
                  to={currentCategoryItem.to}
                  onClick={() => scrollToTop(true)}
                  className="text-gray-400"
                >
                  {t(currentCategoryItem.label)}
                </Link>
              </div>
            )}
            <div className="inline-menu-item">
              <span className="arrow">
                <img src={MenuArrowGray} alt="Arrow" />
              </span>
              <span>{productName}</span>
            </div>
          </>
        )}
      </div>
      {/* {shoppingCart && (
        <div className="shopping-cart-icon">
          <Link
            to={shoppingCart.to}
            onClick={() => scrollToTop(true)}
          >
            <img src={ShoppingCart} alt="Shopping Cart" />
          </Link>
        </div>
      )} */}
    </div>
  );
}
