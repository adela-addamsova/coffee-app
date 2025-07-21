import React, { JSX } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { handleNavigation, type NavItem } from '../utils/navigationFunctions';

interface NavLinkProps {
  item: NavItem & { label: string };
  className?: string;
  closeMenu?: () => void;
}

/**
 * NavLink component
 *
 * Renders a navigation link that conditionally acts as:
 * - a React Router <Link> if the `item.to` prop is present,
 * - or a regular <a> tag that triggers custom scroll/navigation logic
 *
 * @param {NavItem & { label: string }} item - Navigation item containing link info
 * @param {string} [className] - Optional CSS class names
 * @param {() => void} [closeMenu] - Optional callback to close mobile navigation menu
 * 
 * @returns {JSX.Element} The rendered navigation link element
 */

function NavLink({ item, className = '', closeMenu }: NavLinkProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const isInternalLink = Boolean(item.to);

  return isInternalLink ? (
    <Link to={item.to!} className={className} onClick={closeMenu}>
      {item.label}
    </Link>
  ) : (
    <a
      href={`#${item.sectionId || ''}`}
      className={className}
      onClick={(e) => handleNavigation(e, item, location, navigate, closeMenu)}
    >
      {item.label}
    </a>
  );
};

export default NavLink;
