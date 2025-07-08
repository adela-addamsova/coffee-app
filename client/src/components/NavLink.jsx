import { useLocation, useNavigate, Link } from 'react-router-dom';
import { handleNavigation } from '../utils/navigationFunctions';

/**
 * NavLink Component
 * Reusable navigation link that conditionally renders:
 * - A React Router <Link>
 * - A regular <a> tag that either scrolls to a section or navigates home and scrolls
 *
 * Props:
 * - item: An object describing the link behavior (to, sectionId, scrollTop, etc.)
 * - className: Optional CSS classes
 * - closeMenu: Optional callback to close mobile nav
 */
const NavLink = ({ item, className = '', closeMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isInternalLink = item.to;

  return isInternalLink ? (
    <Link to={item.to} className={className} onClick={closeMenu}>
      {item.label}
    </Link>
  ) : (
    <a
      href={`#${item.sectionId || ''}`}
      className={className}
      onClick={(e) =>

        handleNavigation(e, item, location, navigate, closeMenu)
      }
    >
      {item.label}
    </a>
  );
};

export default NavLink;
