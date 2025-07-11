import { react } from 'react';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import HeroSection from '../../../../components/HeroSection';
import HeroImg from '../../../../assets/e-shop/eshop-hero.jpg';
import InlineMenu from '../../eshop-components/InlineMenu';
import ProductCategories from './ProductCategories';
import StorySection from './StorySection';
import EshopInfoBoxes from '../../eshop-components/EshopInfoBoxes';
import NewsletterSection from '../../eshop-components/Newsletter';
import ProductMiniature from '../../eshop-components/ProductMiniature';

const EshopLandingPage = () => {
  return (
    <>
      <Header />
      <div className='eshop-hero-section'>
        <HeroSection
          imgSrc={HeroImg}
          heading="Freshly roasted coffee from our roastery"
          subheading="Discover the diverse flavors of coffee from unique locations and regions"
          className="eshop-hero"
        />
      </div>
      {/* < InlineMenu /> */}
      <div className='categories'>
        <h2 className='eshop-heading'>Browse categories</h2>
        < ProductCategories />
      </div>
      <EshopInfoBoxes />
      <div className='selection'>
        <h2 className='eshop-heading mb-15'>New selection coffee</h2>
        <div className='selection-new-products'>
        <ProductMiniature />
        <ProductMiniature />
        <ProductMiniature />
        <ProductMiniature />
        </div>
      </div>
      <StorySection />
      <NewsletterSection />
      <Footer />
    </>
  );
}

export default EshopLandingPage;
