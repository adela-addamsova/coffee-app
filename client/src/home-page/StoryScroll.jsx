import React, { useEffect, useRef, useState } from "react";
import "./StoryScroll.css";
import coffeePlant1 from "../assets/main-page/coffee-plant-1.jpg";
import chemex from "../assets/main-page/chemex.png";
import v60 from "../assets/main-page/v60.png";
import coffeePackage from "../assets/main-page/coffee-package.png";
import MainButton from '../components/MainButton';

const StoryScroll = () => {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Added `key` to the outer div of each slide
  const slides = [
    <div className="slide" key="slide1">
      <div className="slide1-text">
        <h2>Our story</h2>
        <p>
          Morning Mist Coffee began as a journey shared by three friends with a deep love for coffee.
          After traveling through South America, exploring local farms and learning the art of roasting firsthand,
          we became inspired to bring that passion home. What started as a small roasting project soon grew into
          a full coffee house, where we could share the rich flavors and traditions we had discovered. Today,
          we continue to craft every roast with the same enthusiasm, bringing high-quality coffee to early risers
          and dedicated coffee lovers alike.
        </p>
      </div>
      <div className="slide1-img">
        <img src={coffeePlant1} alt="Coffee Plant" />
      </div>
    </div>,

    <div className="slide" key="slide2">
      <div className="slide2-text" data-aos="fade-right">
        <p>
          Morning Mist Coffee was founded with a passion for exceptional coffee and expert roasting.
          From our small-batch roastery, we carefully select and roast beans to highlight their natural flavors,
          ensuring a rich and aromatic experience in every cup. Our coffee house was created as a welcoming space
          for early risers, serving freshly brewed blends with the first light of morning.
        </p>
      </div>
      <div className="slide2-img">
        <img src={v60} alt="v60" />
        <img src={chemex} alt="chemex" />
      </div>
    </div>,

    <div className="slide" key="slide3">
      <div className="slide3-text">
        <p>
          Beyond our café, we offer our signature roasted beans through our online store, allowing coffee lovers
          to enjoy premium-quality coffee at home. With a selection of carefully crafted roasts and nationwide delivery,
          Morning Mist Coffee brings the art of coffee roasting straight to your doorstep.
        </p>
        <MainButton text="GO TO ESHOP" href="#" color="white" />
      </div>
      <div className="slide3-img">
        <img src={coffeePackage} alt="package" />
      </div>
    </div>,
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      const totalScrollable = container.offsetHeight - window.innerHeight;
      const scrollInside = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const progress = scrollInside / totalScrollable;

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const maxTranslateX = (slides.length - 1) * 100; // in vw
  const translateX = -Math.min(Math.max(scrollProgress * maxTranslateX, 0), maxTranslateX);

  return (
    <section
      ref={containerRef}
      className="story-scroll-section"
      id="story-section"
      style={{ height: `${slides.length * 100}vh` }}
    >
      <div className="sticky-wrapper">
        <div
          className="slides-wrapper"
          style={{ width: `${slides.length * 100}vw`, transform: `translateX(${translateX}vw)` }}
        >
          {slides.map((slide) => (
            <React.Fragment key={slide.key}>{slide}</React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoryScroll;
