import { JSX, useEffect, useRef } from "react";
import { navItems, NavItem } from "@config/NavItems";
import coffeePlant1 from "@assets/main-page/coffee-plant-1.jpg";
import chemex from "@assets/main-page/chemex.png";
import v60 from "@assets/main-page/v60.png";
import coffeePackage from "@assets/main-page/coffee-package.png";
import MainButton from "@components/MainButton";
import { useTranslation } from "react-i18next";

const eshopPageLink: NavItem | undefined = navItems.find(
  (item) => item.label === "data.nav-items.eshop",
);

/**
 * StoryScroll
 * Horizontally scrolling "Our story" section with scroll-based animations.
 * @returns {JSX.Element}
 */
const StoryScroll = (): JSX.Element => {
  const { t } = useTranslation();

  // Reference for the whole section container
  const sectionRef = useRef<HTMLElement | null>(null);
  // Ref for the track that holds all slides and will be translated horizontally
  const trackRef = useRef<HTMLDivElement | null>(null);

  const slides = 3;
  const slideHeightVh = 70;
  const extraScrollVh = 30;

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      // Distance from top of page to top of this section
      const sectionTop = section.offsetTop;

      // Convert vh to pixels
      const vh = window.innerHeight / 100;
      const slideHeightPx = slideHeightVh * vh;
      const extraScrollPx = extraScrollVh * vh;

      // Total height needed for full scroll of all slides plus extra space
      const totalHeightPx = slides * slideHeightPx + extraScrollPx;
      // Amount of scroll actually usable for sliding, subtract viewport height
      const totalScroll = totalHeightPx - window.innerHeight;

      // Calculate scroll relative to this section
      const scrollY = window.scrollY - sectionTop;

      // Clamp scroll position between 0 and total scroll height
      const clamped = Math.max(0, Math.min(scrollY, totalScroll));
      // Calculate progress from 0 to 1
      const progress = clamped / totalScroll;

      // Calculate horizontal translate in vw to slide the track
      const translate = -progress * (slides - 1) * 100;
      // Apply horizontal transform to slides track
      track.style.transform = `translateX(${translate}vw)`;
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [slides]);

  return (
    <section
      className="scroll-section"
      id="story-section"
      data-testid="story-scroll-section"
      ref={sectionRef}
      style={{
        height: `calc(${slides} * ${slideHeightVh}vh + ${extraScrollVh}vh)`,
      }}
    >
      <div className="sticky-container">
        <div
          className="slides-track"
          ref={trackRef}
          data-testid="story-scroll-track"
        >
          {/* Slide 1 */}
          <div className="slide slide-1" data-testid="slide-1">
            <div className="slide1-text">
              <h2>{t("home.story-head")}</h2>
              <p>{t("home.story-text1")}</p>
            </div>
            <div className="slide1-img">
              <img src={coffeePlant1} alt="Coffee Plant" />
            </div>
          </div>

          {/* Slide 2 */}
          <div className="slide slide-2" data-testid="slide-2">
            <div className="slide2-text">
              <p>{t("home.story-text2")}</p>
            </div>
            <div className="slide2-img">
              <img src={v60} alt="v60" />
              <img src={chemex} alt="chemex" />
            </div>
          </div>

          {/* Slide 3 */}
          <div className="slide slide-3" data-testid="slide-3">
            <div className="slide3-text">
              <p>{t("home.story-text3")}</p>
              {eshopPageLink?.to && (
                <MainButton
                  text={t("home.story-btn")}
                  to={eshopPageLink.to}
                  color="white"
                />
              )}
            </div>
            <div className="slide3-img">
              <img src={coffeePackage} alt="package" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryScroll;
