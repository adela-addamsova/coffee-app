import React, { JSX } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { handleNavigation, type NavItem } from '../utils/navigationFunctions';

interface MainButtonProps {
  text: string;
  href?: string;
  to?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;
  item?: NavItem;
  color?: string;
}

/**
 * MainButton component
 * 
 * Renders a button that behaves as:
 * - a React Router <Link> when `to` prop is provided,
 * - an anchor link with scroll navigation when `item` prop is provided,
 * - or a regular anchor <a> tag otherwise.
 * 
 * @param {string} text - The button text
 * @param {string} [href] - The URL for a regular anchor link
 * @param {string} [to] - The path for React Router navigation
 * @param {React.MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>} [onClick] - Click event handler
 * @param {NavItem} [item] - Navigation item for scroll/section navigation
 * @param {string} [color] - Additional color CSS class for styling
 * 
 * @returns {JSX.Element} The main button element
 */

const MainButton = ({
  text,
  href,
  to,
  onClick,
  item,
  color = '',
}: MainButtonProps): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const className = `main-button ${color}`;

  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {text}
      </Link>
    );
  }

  if (item) {
    return (
      <a
        href={`#${item.sectionId || ''}`}
        className={className}
        onClick={(e) => handleNavigation(e, item, location, navigate)}
      >
        {text}
      </a>
    );
  }

  return (
    <a href={href} className={className} onClick={onClick}>
      {text}
    </a>
  );
};

export default MainButton;
