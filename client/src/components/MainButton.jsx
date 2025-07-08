import { useLocation, useNavigate, Link } from 'react-router-dom';
import { handleNavigation } from '../utils/navigationFunctions';

/**
 * MainButton
 * A button component that can:
 * - Act as a <Link> to a route
 * - Scroll to a section=
 * - Use a traditional <a> with `href`
 */
const MainButton = ({ text, href, to, onClick, item, color = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const className = `main-button ${color}`;

  // Render Link
  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {text}
      </Link>
    );
  }

  // Render a scrollable <a>
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

  // Render regular <a> by default
  return (
    <a href={href} className={className} onClick={onClick}>
      {text}
    </a>
  );
};

export default MainButton;
