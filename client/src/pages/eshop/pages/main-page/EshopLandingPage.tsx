import { JSX } from "react";
import HeroSection from "@components/HeroSection";
import HeroImg from "@assets/e-shop/eshop-hero.jpg";
import ProductCategories from "./ProductCategories";
import StorySection from "./StorySection";
import LatestProducts from "./LatestProducts";
import EshopInfoBoxes from "@eshop-components/EshopInfoBoxes";
import NewsletterSection from "@eshop-components/Newsletter";
import { useTranslation } from "react-i18next";

/**
 * EshopLandingPage
 *
 * Main landing page component for the e-shop section
 * Composes the hero banner, product categories, info boxes,
 * latest product selection, story section, and newsletter signup
 */
const EshopLandingPage = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div data-testid="eshop-landing-page">
      <div className="eshop-hero-section">
        <HeroSection
          imgSrc={HeroImg}
          heading={t("eshop.eshop-head")}
          subheading={t("eshop.eshop-subhead")}
          className="eshop-hero"
        />
      </div>
      <div className="categories">
        <h2 className="eshop-heading">{t("eshop.category-head")}</h2>
        <ProductCategories />
      </div>
      <EshopInfoBoxes />
      <div className="selection">
        <h2 className="eshop-heading mb-15">{t("eshop.new-head")}</h2>
        <div className="selection-new-products">
          <LatestProducts />
        </div>
      </div>
      <StorySection />
      <NewsletterSection />
    </div>
  );
};

export default EshopLandingPage;
