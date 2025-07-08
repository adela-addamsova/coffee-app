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

  const handleNavClick = (sectionId) => {
    if (location.pathname === '/') {
      scrollTo(sectionId);
    } else {
      navigate('/', { state: { scrollToId: sectionId } });
    }
    setShowMenu(false);
  };

  const scrollToTop = (smooth = false) => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`page-header ${isScrolled ? 'scrolled' : ''}`}
    >
      <div className="nav-logo">
        <Link to="/" onClick={() => scrollToTop(true)}>
          <img src={logoWhite} alt="Logo" />
        </Link>
      </div>

      <nav className="nav-desktop">
        <button onClick={() => handleNavClick('menu-section')} className="nav-link">
          Menu
        </button>
        <button onClick={() => handleNavClick('contact-section')} className="nav-link">
          Contact
        </button>
        <button onClick={() => handleNavClick('story-section')} className="nav-link">
          Our Story
        </button>
        <Link to="/reservation" className="nav-link" onClick={() => scrollToTop(true)}>
          Reservation
        </Link>
        <button onClick={() => handleNavClick('')} className="nav-link">
          E-shop
        </button>
      </nav>

      <div
        className="burger"
        onClick={() => setShowMenu(true)}
      >
        <span className="burger-icon text-[32px] cursor-pointer pl-3 text-white">&#9776;</span>
      </div>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="mobile-nav">
          <div className="mobile-nav-head">
            <img src={logoBlack} alt="Logo" className="nav-logo" />
            <button onClick={() => setShowMenu(false)} className="x-icon">&times;</button>
          </div>
          <div className="mobile-nav-body">
    
            <button onClick={() => handleNavClick('menu-section')} className="nav-link-mobile">Menu</button>
            <button onClick={() => handleNavClick('contact-section')} className="nav-link-mobile">Contact</button>
            <button onClick={() => handleNavClick('story-section')} className="nav-link-mobile">Our Story</button>
            <Link to="/reservation" className="nav-link-mobile">Reservation</Link>
            <button onClick={() => handleNavClick('')} className="nav-link-mobile">E-shop</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
