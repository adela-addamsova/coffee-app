import { JSX } from "react";
import CoffeeSack from "@assets/main-page/coffee-sack.png";
import { useTranslation } from "react-i18next";

/**
 * HeroTextSection component
 * Displays an informational section on the homepage
 * Styled as a two-column layout (text + image).
 * @returns {JSX.Element} A JSX section element containing descriptive text and an image
 */

const HeroTextSection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <section
      className="hero-text-section"
      id="hero-text-section"
      data-testid="hero-text-section"
    >
      <div className="hero-text-content">
        <h2>{t("home.hero-story-head")}</h2>
        <p data-testid="hero-text-description">{t("home.hero-story-text")}</p>
      </div>
      <div className="hero-image-content">
        <img src={CoffeeSack} alt="Coffee Sack" />
      </div>
    </section>
  );
};

export default HeroTextSection;
