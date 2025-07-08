import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

/**
 * SocialIcons
 * Renders a set of social media icons (Facebook, Instagram, YouTube)
 * Each icon opens link in a new tab
 */
const SocialIcons = () => {
  return (
    <div className="social-icons">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <FaFacebookF />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <FaInstagram />
      </a>
      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
        <FaYoutube />
      </a>
    </div>
  );
};

export default SocialIcons;