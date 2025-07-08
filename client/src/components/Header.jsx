import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import navItems from '../config/NavItems';
import NavLink from './NavLink';
import logoWhite from '../assets/components/coffee-beans-white.png';
import logoBlack from '../assets/components/coffee-beans-black.png';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderNavItems = (className) =>
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
      <div className="nav-logo">
        <Link to="/" onClick={() => scrollToTop(true)}>
          <img src={logoWhite} alt="Logo" />
        </Link>
      </div>

      <nav className="nav-desktop">{renderNavItems('nav-link')}</nav>

      <div className="burger" onClick={() => setShowMenu(true)}>
        <span className="burger-icon">&#9776;</span>
      </div>

      {showMenu && (
        <div className="mobile-nav">
          <div className="mobile-nav-head">
            <img src={logoBlack} alt="Logo" className="nav-logo" />
            <button onClick={() => setShowMenu(false)} className="x-icon">
              &times;
            </button>
          </div>
          <div className="mobile-nav-body">
            {renderNavItems('nav-link-mobile')}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
