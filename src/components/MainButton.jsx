import './MainButton.css';

const MainButton = ({ text, href, onClick, color = "" }) => {
  return (
    <a
      href={href}
      className={`main-button ${color}`} 
      onClick={onClick}
    >
      {text}
    </a>
  );
};

export default MainButton;