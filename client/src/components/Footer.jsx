import SocialIcons from './SocialIcons';
import { Link } from 'react-router-dom';


const Footer = () => {
    return (
        <footer className='footer'>
            <div className='footer-content'>
                <div className='footer-text'>
                    <a href='#'>Eshop</a>
                    <Link to="/reservation">
                        Reservation
                    </Link>
                    <a href='#menu-section'>Menu</a>
                </div>
                <div className='footer-text'>
                    <p>+420 777 777 777</p>
                    <a href="mailto:morningmistcoffee@gmail.com">morningmistcoffee@gmail.com</a>
                    <div className='social-icon'>
                        <SocialIcons />
                    </div>
                </div>
                <div className='footer-text'>
                    <p>Kolumbijská 1720/17</p>
                    <p>Praha 5</p>
                    <p>15000</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer