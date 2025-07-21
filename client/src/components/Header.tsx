import { useState, useEffect, JSX } from 'react';
import { Link } from 'react-router-dom';
import { navItems } from '../config/NavItems';
import NavLink from './NavLink';
import logoWhite from '../assets/components/coffee-beans-white.svg';
import logoBlack from '../assets/components/coffee-beans-black.svg';
import { scrollToTop } from '../utils/navigationFunctions';

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

  // Change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Map navigation items
  const renderNavItems = (className: string) =>
    navItems.map((item) => (
      <NavLink
        key={item.label}
        item={item}
        className={className}
        closeMenu={() => setShowMenu(false)}
      />
    ));

  return (
    <header className={`page-header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Logo with link */}
      <div className="nav-logo">
        <Link to="/" onClick={scrollToTop}>
          <img src={logoWhite} alt="Logo" />
        </Link>
      </div>

      {/* Desktop nav */}
      <nav className="nav-desktop">{renderNavItems('nav-link')}</nav>

      {/* Burger for mobile */}
      <div
        className="burger"
        onClick={() => setShowMenu(true)}
        role="button"
        tabIndex={0}
        aria-label="Open menu"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setShowMenu(true);
          }
        }}
      >
        <span className="burger-icon">&#9776;</span>
      </div>

      {/* Mobile nav */}
      {showMenu && (
        <div className="mobile-nav">
          <div className="mobile-nav-head">
            <img src={logoBlack} alt="Logo" className="nav-logo" />
            <button onClick={() => setShowMenu(false)} className="x-icon" aria-label="Close menu">
              &times;
            </button>
          </div>
          <div className="mobile-nav-body">{renderNavItems('nav-link-mobile')}</div>
        </div>
      )}
    </header>
  );
};

export default Header;
