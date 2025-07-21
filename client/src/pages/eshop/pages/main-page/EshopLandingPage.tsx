import React, { JSX } from 'react';
import HeroSection from '../../../../components/HeroSection';
import HeroImg from '../../../../assets/e-shop/eshop-hero.jpg';
import ProductCategories from './ProductCategories';
import StorySection from './StorySection';
import LatestProducts from './LatestProducts';
import EshopInfoBoxes from '../../eshop-components/EshopInfoBoxes';
import NewsletterSection from '../../eshop-components/Newsletter';

/**
 * EshopLandingPage
 * 
 * Main landing page component for the e-shop section
 * Composes the hero banner, product categories, info boxes,
 * latest product selection, story section, and newsletter signup
 */
const EshopLandingPage = (): JSX.Element => {
  return (
    <>
      <div className="eshop-hero-section">
        <HeroSection
          imgSrc={HeroImg}
          heading="Freshly roasted coffee from our roastery"
          subheading="Discover the diverse flavors of coffee from unique locations and regions"
          className="eshop-hero"
        />
      </div>
      <div className="categories">
        <h2 className="eshop-heading">Browse categories</h2>
        <ProductCategories />
      </div>
      <EshopInfoBoxes />
      <div className="selection">
        <h2 className="eshop-heading mb-15">New selection coffee</h2>
        <div className="selection-new-products">
          <LatestProducts />
        </div>
      </div>
      <StorySection />
      <NewsletterSection />
    </>
  );
};

export default EshopLandingPage;
