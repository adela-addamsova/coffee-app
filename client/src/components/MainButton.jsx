import './css/MainButton.css';
import { Link } from 'react-router-dom';

const MainButton = ({ text, href, to, onClick, color = "" }) => {
  const className = `main-button ${color}`;

  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {text}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={onClick}>
      {text}
    </a>
  );
};

export default MainButton;
