import { Link, useLocation } from 'react-router-dom';
import ShoppingCart from '../../../assets/e-shop/shopping-cart.png';

export default function InlineMenu() {
  const location = useLocation();
  const path = location.pathname;

  if (!path.startsWith('/e-shop')) return null;

  return (
    <div className="inline-menu-section">
      <div className="inline-menu-items">
        <div className='inline-menu-item'>
          <Link to="/e-shop" onClick={() => scrollToTop(true)}>
            Home
          </Link>
        </div>
      </div>
      <div className="shopping-cart-icon">
        <img src={ShoppingCart} alt="Shopping Cart" />
      </div>
    </div>
  );
}