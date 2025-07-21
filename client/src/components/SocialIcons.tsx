import React, { JSX } from 'react';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

/**
 * SocialIcons component
 *
 * Renders a set of social media icons (Facebook, Instagram, YouTube).
 * Each icon links to the respective social media page and opens in a new tab.
 *
 * @returns {JSX.Element} The social icons container element
 */
const SocialIcons = (): JSX.Element => {
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
