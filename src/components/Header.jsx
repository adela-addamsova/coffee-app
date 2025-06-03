import { useState, useEffect } from 'react';
import { Navbar, Nav, Offcanvas } from 'react-bootstrap';
import logoWhite from '../assets/components/coffee-beans-white.png';
import logoBlack from '../assets/components/coffee-beans-black.png';
import './Header.css';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setShowMenu(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar expand="lg" className={`sticky-top my-header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <div className="nav-logo">
        <Navbar.Brand>
          <img src={logoWhite} alt="Logo" className='main-logo' />
        </Navbar.Brand>
      </div>

      <div className="nav-wrapper">
        <Nav className="nav-desktop">
          <Nav.Link onClick={() => scrollTo('menu-section')} className="my-nav-link">Menu</Nav.Link>
          <Nav.Link onClick={() => scrollTo('contact-section')} className="my-nav-link">Contact</Nav.Link>
          <Nav.Link onClick={() => scrollTo('story-section')} className="my-nav-link">Our Story</Nav.Link>
          <Nav.Link onClick={() => scrollTo('#')} className="my-nav-link">Reservation</Nav.Link>
          <Nav.Link onClick={() => scrollTo('#')} className="my-nav-link">E-shop</Nav.Link>
        </Nav>

        <div className="burger" onClick={() => setShowMenu(true)}>
          <span className="burger-icon">&#9776;</span>
        </div>
      </div>

      {/* Offcanvas Menu */}
      <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="end">
        <Offcanvas.Header closeButton>
          <img src={logoBlack} alt="Logo" className='main-logo' />
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link onClick={() => scrollTo('menu-section')} className="my-nav-link-mobile">Menu</Nav.Link>
            <Nav.Link onClick={() => scrollTo('contact-section')} className="my-nav-link-mobile">Contact</Nav.Link>
            <Nav.Link onClick={() => scrollTo('story-section')} className="my-nav-link-mobile">Our Story</Nav.Link>
            <Nav.Link onClick={() => scrollTo('#')} className="my-nav-link-mobile">Reservation</Nav.Link>
            <Nav.Link onClick={() => scrollTo('#')} className="my-nav-link-mobile">E-shop</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </Navbar>
  );
};

export default Header;
