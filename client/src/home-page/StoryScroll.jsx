import React, { useEffect, useRef, useState } from "react";
import coffeePlant1 from "../assets/main-page/coffee-plant-1.jpg";
import chemex from "../assets/main-page/chemex.png";
import v60 from "../assets/main-page/v60.png";
import coffeePackage from "../assets/main-page/coffee-package.png";
import MainButton from '../components/MainButton';

/**
 * StoryScroll
 * 
 * A horizontally scrolling section that scrolls slides using scrolljacking
 * Uses refs and scroll event listener to calculate scroll progress and
 * translates slides horizontally based on scroll position.
 */
const StoryScroll = () => {
  // Reference for the whole section container
  const sectionRef = useRef(null);
  // Ref for the track that holds all slides and will be translated horizontally
  const trackRef = useRef(null);

  const slides = 3;
  const slideHeightVh = 70; 
  const extraScrollVh = 30; // Additional scroll space to allow for finishing the last slide

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
      ref={sectionRef}
      style={{
        height: `calc(${slides} * ${slideHeightVh}vh + ${extraScrollVh}vh)`,
      }}
    >
      <div className="sticky-container">
        <div className="slides-track" ref={trackRef}>

          {/* Slide 1 */}
          <div className="slide slide-1">
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
          </div>

          {/* Slide 2 */}
          <div className="slide slide-2">
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
          </div>

          {/* Slide 3 */}
          <div className="slide slide-3">
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
          </div>

        </div>
      </div>
    </section>
  );
};

export default StoryScroll;
