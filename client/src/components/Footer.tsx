import React, { JSX } from "react";
import SocialIcons from "./SocialIcons";
import { navItems, NavItem } from "@config/NavItems";
import NavLink from "./NavLink";
import { coffeeHouseData } from "@config/CoffeeHouseData";

/**
 * Footer component
 *
 * Renders the website footer section including:
 * - Navigation links filtered from `navItems` (E-shop, Reservation, Menu)
 * - Contact information (phone and email) from `coffeeHouseData`
 * - Social media icons via the `SocialIcons` component
 * - Address details from `coffeeHouseData`
 *
 * @returns {JSX.Element} The footer section element
 */
const Footer = (): JSX.Element => {
  const footerItems: NavItem[] = navItems.filter((item): item is NavItem =>
    ["E-shop", "Reservation", "Menu"].includes(item.label),
  );

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-text">
          {footerItems.map((item) => (
            <NavLink key={item.label} item={item} className="footer-link" />
          ))}
        </div>
        <div className="footer-text">
          <p>{coffeeHouseData.contact.phone}</p>
          <a href={`mailto:${coffeeHouseData.contact.email}`}>
            {coffeeHouseData.contact.email}
          </a>
          <div className="social-icon">
            <SocialIcons />
          </div>
        </div>
        <div className="footer-text">
          <p>{coffeeHouseData.address.street}</p>
          <p>{coffeeHouseData.address.city}</p>
          <p>{coffeeHouseData.address.zip}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
