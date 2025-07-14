import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductMiniature from '../eshop-components/ProductMiniature';
import HeroSection from '../../../components/HeroSection';
import HeroImg from '/category-hero.png';
import InlineMenu from '../eshop-components/InlineMenu'

const categoryLabels = {
  light: 'Light Roasted Coffee',
  dark: 'Dark Roasted Coffee',
  decaf: 'Decaf Coffee',
};

export default function CategoryPageLayout() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  const heading = category ? categoryLabels[category] || 'Coffee' : 'All Products';

  useEffect(() => {
    const url = category
      ? `http://localhost:5000/api/products/${category}`
      : 'http://localhost:5000/api/products';

    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error loading products:', err));
  }, [category]);

  return (
    <div>
      {/* Hero section */}
      <div className='reservation-page-hero'>
        <HeroSection
          imgSrc={HeroImg}
          heading={heading}
          subheading={false}
          buttonText={false}
          buttonHref={false}
        />
      </div>

      < InlineMenu />

      {/* Products grid */}
      <section className="products-grid">
        {products.map(product => (
          <ProductMiniature key={product.id} {...product} />
        ))}
      </section>
    </div>
  );
}
