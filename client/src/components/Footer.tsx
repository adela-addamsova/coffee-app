import { JSX } from "react";
import SocialIcons from "./SocialIcons";
import { navItems, NavItem } from "@config/NavItems";
import NavLink from "./NavLink";
import { coffeeHouseData } from "@config/CoffeeHouseData";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

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
    [
      "data.nav-items.eshop",
      "data.nav-items.reservation",
      "data.nav-items.menu",
    ].includes(item.label),
  );

  const { t } = useTranslation();

  return (
    <footer className="footer" data-testid="footer">
      <div className="footer-content">
        <div className="footer-text">
          {footerItems.map((item) => (
            <NavLink
              key={item.label}
              item={{ ...item, label: t(item.label) }}
              className="footer-link"
            />
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
          <span>
            {coffeeHouseData.address.city}, {coffeeHouseData.address.zip}
          </span>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
