import { JSX } from "react";
import MainButton from "@components/MainButton";
import { navItems } from "@config/NavItems";
import StoryImg from "@assets/e-shop/story-img.png";
import { useTranslation } from "react-i18next";

/**
 * StorySection
 *
 * Displays the "Our Story" section with a description,
 * an image, and a button linking to the story page/section.
 *
 * @returns {JSX.Element} The rendered story section.
 */
export default function StorySection(): JSX.Element {
  const storyLink = navItems.find((item) =>
    ["data.nav-items.ourStory"].includes(item.label),
  );
  const linkTarget = `/#${storyLink?.sectionId ?? ""}`;
  const { t } = useTranslation();

  return (
    <section className="eshop-story-section" data-testid="eshop-story-section">
      <div className="eshop-story-text-content">
        <h2 className="eshop-heading">{t("eshop.story-head")}</h2>
        <p data-testid="story-text">{t("eshop.story-text")} </p>
        <MainButton text={t("eshop.story-btn")} to={linkTarget} color="black" />
      </div>
      <div className="eshop-story-image-content">
        <img src={StoryImg} alt="Story Img" />
      </div>
    </section>
  );
}
