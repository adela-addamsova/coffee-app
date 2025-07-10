import { Link } from 'react-router-dom';
import LightRoasted from '../../../../assets/e-shop/light-roasted.png';
import DarkRoasted from '../../../../assets/e-shop/dark-roasted.png';
import Decaf from '../../../../assets/e-shop/decaf.png';

const categories = [
  {
    name: 'LIGHT ROASTED',
    image: LightRoasted,
    link: '#',
  },
  {
    name: 'DARK ROASTED',
    image: DarkRoasted,
    link: '#',
  },
  {
    name: 'DECAF',
    image: Decaf,
    link: '#',
  },
];

export default function ProductCategories() {
  return (
    <div className="product-categories-section">
  {categories.map((item) => (
    <Link key={item.name} to={item.link} className="product-category group">
      <div className="img-box">
        <img
          src={item.image}
          alt={item.name}
          className="category-img"
        />
        <div className="img-overlay"></div>
      </div>
      <div className="category-name">
        {item.name}
      </div>
    </Link>
  ))}
</div>
  );
}
