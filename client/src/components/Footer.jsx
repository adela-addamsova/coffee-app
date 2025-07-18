import SocialIcons from './SocialIcons';
import { navItems } from '../config/NavItems';
import NavLink from './NavLink';
import { contactInfo, addressInfo } from '../config/CoffeeHouseData';

/**
 * Footer component
 * Displays part of the navigation and contact info
*/
const Footer = () => {
    const footerItems = navItems.filter(item =>
        ['E-shop', 'Reservation', 'Menu'].includes(item.label)
    );

    return (
        <footer className='footer'>
            <div className='footer-content'>
                <div className="footer-text">
                    {footerItems.map(item => (
                        <NavLink key={item.label} item={item} className="footer-link" />
                    ))}
                </div>
                <div className='footer-text'>
                    <p>{contactInfo.phone}</p>
                    <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                    <div className='social-icon'>
                        <SocialIcons />
                    </div>
                </div>
                <div className='footer-text'>
                    <p>{addressInfo.street}</p>
                    <p>{addressInfo.city}</p>
                    <p>{addressInfo.zip}</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
