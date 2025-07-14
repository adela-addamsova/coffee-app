import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import ShoppingCart from '../../../assets/e-shop/shopping-cart.png';
import MenuArrowGray from '../../../assets/e-shop/eshop-components/menu-arrow-gray.svg';
import { eshopNavItems, navItems } from '../../../config/NavItems';

export default function InlineMenu() {
  const location = useLocation();
  const path = location.pathname;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const homeNavItem = navItems.find(item => item.label === 'E-shop');
  const allProductsNavItem = eshopNavItems.find(item => item.label === 'All Products');
  const navLight = eshopNavItems.find(item => item.label === 'Light Roasted');
  const navDark = eshopNavItems.find(item => item.label === 'Dark Roasted');
  const navDecaf = eshopNavItems.find(item => item.label === 'Decaf');

  const currentCategoryItem = [navLight, navDark, navDecaf].find(
    item => item && location.pathname === item.to
  );

  if (!path.startsWith(homeNavItem.to)) return null;

  const segments = path.split('/').filter(Boolean);
  const isCategoryPage = segments.includes('products') && segments.length > 2;

  const scrollToTop = (instant = false) => {
    window.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' });
  };

  const closeDropdown = () => setDropdownOpen(false);

  return (
    <div className="inline-menu-section">
      <div className="inline-menu-items">

        {/* E-shop Home */}
        {homeNavItem && (
          <div className="inline-menu-item">
            <Link to={homeNavItem.to} onClick={() => scrollToTop(true)} className="text-gray-400">
              {homeNavItem.label}
            </Link>
          </div>
        )}

        {/* > Products + Dropdown */}
        <div
          className="inline-menu-item "
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <span className="arrow">
            <img src={MenuArrowGray} />
          </span>

          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className={`relative ${isCategoryPage ? 'text-gray-400' : ''}`}
          >
            Products
          </button>

          {/* Dropdown */}
          <div
            className={`dropdown-menu ${dropdownOpen ? 'visible opacity-100' : 'invisible opacity-0'}
            `}
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
                        {navItem.label}
                      </Link>
                    </li>
                  )
              )}
            </ul>
          </div>
        </div>

        {/* > Category */}
        {isCategoryPage && (
          <div className="inline-menu-item">
            <span className="arrow">
              <img src={MenuArrowGray} />
            </span>

            <span>{currentCategoryItem.label}</span>
          </div>
        )}
      </div>

      <div className="shopping-cart-icon">
        <img src={ShoppingCart} alt="Shopping Cart" />
      </div>
    </div>
  );
}
