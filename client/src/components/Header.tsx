import { useState, useEffect, JSX } from "react";
import { Link } from "react-router-dom";
import { navItems, eshopNavItems } from "@config/NavItems";
import NavLink from "./NavLink";
import logoWhite from "@assets/components/coffee-beans-white.svg";
import logoBlack from "@assets/components/coffee-beans-black.svg";
import ShoppingCart from "@assets/e-shop/cart/shopping-cart-white.svg";
import { scrollToTop } from "@/utils/navigationFunctions";
import { useCart } from "@eshop/pages/cart/CartContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * Header component
 *
 * Displays the site header including:
 * - Logo linking to home page
 * - Desktop navigation links rendered via NavLink component
 * - Responsive burger menu for mobile navigation with open/close functionality
 * - Changes header style based on scroll position (adds 'scrolled' class)
 *
 * @returns {JSX.Element} The site header element
 */

const Header = (): JSX.Element => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { setIsCartOpen } = useCart();
  const { t } = useTranslation();

  // Change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderNavItems = (className: string) =>
    navItems.map((item) => (
      <NavLink
        key={item.label}
        item={{ ...item, label: t(item.label) }}
        className={className}
        closeMenu={() => setShowMenu(false)}
        data-testid="nav-link"
      />
    ));

  const shoppingCartLink = eshopNavItems.find(
    (item) => !!item.to && item.label === "data.eshop-nav-items.cart",
  );

  return (
    <header
      className={`page-header ${isScrolled ? "scrolled" : ""}`}
      data-testid="header"
    >
      {/* Logo with link */}
      <div className="nav-logo">
        <Link to="/" onClick={scrollToTop}>
          <img src={logoWhite} alt="Logo" />
        </Link>
      </div>

      {/* Desktop nav */}
      <nav className="nav-desktop flex items-center gap-4">
        {renderNavItems("nav-link")}

        <div className="item-center gap-4 flex">
          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="cursor-pointer"
            aria-label="Open cart"
          >
            <img src={ShoppingCart} alt="Shopping Cart" className="w-7" />
          </button>
        </div>
      </nav>

      {/* Burger for mobile */}
      <div
        className="burger"
        onClick={() => setShowMenu(true)}
        role="button"
        tabIndex={0}
        aria-label="Open menu"
        data-testid="mobile-menu"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setShowMenu(true);
          }
        }}
      >
        <Link
          to={shoppingCartLink?.to || "/e-shop/cart"}
          onClick={(e) => {
            e.stopPropagation();
            scrollToTop();
          }}
          className="burger-cart"
        >
          <img src={ShoppingCart} alt="Shopping Cart" className="w-7" />
        </Link>
        <span className="burger-icon">&#9776;</span>
      </div>

      {/* Mobile nav */}
      {showMenu && (
        <div className="mobile-nav" data-testid="mobile-nav">
          <div className="mobile-nav-head">
            <Link to="/" onClick={scrollToTop}>
              <img src={logoBlack} alt="Logo" />
            </Link>

            <button
              onClick={() => setShowMenu(false)}
              className="x-icon"
              aria-label="Close menu"
            >
              &times;
            </button>
          </div>
          <div className="mobile-nav-body">
            {renderNavItems("nav-link-mobile")}
          </div>

          <LanguageSwitcher />
        </div>
      )}
    </header>
  );
};

export default Header;
