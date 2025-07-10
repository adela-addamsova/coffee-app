import { react } from 'react';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import HeroSection from '../../../../components/HeroSection';
import HeroImg from '../../../../assets/e-shop/eshop-hero.jpg';
import InlineMenu from '../../eshop-components/InlineMenu';
import ProductCategories from './ProductCategories';
import EshopInfoBoxes from '../../eshop-components/EshopInfoBoxes';

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
      <Footer />
    </>
  );
}

export default EshopLandingPage;
