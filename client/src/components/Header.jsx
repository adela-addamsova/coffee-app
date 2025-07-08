import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import logoWhite from '../assets/components/coffee-beans-white.png';
import logoBlack from '../assets/components/coffee-beans-black.png';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setShowMenu(false);
    }
  };

  const scrollToTop = (smooth = false) => {
    window.scrollTo(0, 0);
  };

  const handleNavClick = (item) => {
    if (item.scrollTop) {
      scrollToTop(true);
    } else if (item.sectionId) {
      if (location.pathname === '/') {
        scrollTo(item.sectionId);
      } else {
        navigate('/', { state: { scrollToId: item.sectionId } });
      }
    } else if (item.to) {
      navigate(item.to);
    }
    setShowMenu(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Menu', sectionId: 'menu-section' },
    { label: 'Contact', sectionId: 'info-boxes' },
    { label: 'Our Story', sectionId: 'story-section' },
    { label: 'Reservation', to: '/reservation' },
    { label: 'E-shop', sectionId: '' },
  ];

  const renderNavItems = (className) =>
    navItems.map((item) =>
      item.to ? (
        <Link
          key={item.label}
          to={item.to}
          className={className}
        >
          {item.label}
        </Link>
      ) : (
        <button
          key={item.label}
          onClick={() => handleNavClick(item)}
          className={className}
        >
          {item.label}
        </button>
      )
    );

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
