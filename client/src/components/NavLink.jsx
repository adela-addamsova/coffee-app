import { useLocation, useNavigate, Link } from 'react-router-dom';

/**
 * NavLink
 * Navigation component that decides whether to render a <Link>
 * or an <a>. Handles scrolling, route changes, and optional cleanup
 */
const NavLink = ({ item, className = '', closeMenu }) => {
  const navigate = useNavigate();         
  const location = useLocation();         

  // Scrolls to top
  const scrollToTop = () => window.scrollTo({ top: 0 });

  // Scrolls to section
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView();
  };

  // Handle scroll or route change
  const handleClick = (e) => {
    if (item.to) return;

    e.preventDefault();

    if (item.scrollTop) {
      scrollToTop();
    } else if (item.sectionId) {
      if (location.pathname === '/') {
        scrollTo(item.sectionId);
      } else {
        navigate('/', { state: { scrollToId: item.sectionId } });
      }
    }

    if (closeMenu) closeMenu();
  };

  const isInternalLink = item.to;

  // Render either <Link> or <a>
  return isInternalLink ? (
    <Link to={item.to} className={className} onClick={closeMenu}>
      {item.label}
    </Link>
  ) : (
    <a
      href={`#${item.sectionId || ''}`}
      className={className}
      onClick={handleClick}
    >
      {item.label}
    </a>
  );
};

export default NavLink;
