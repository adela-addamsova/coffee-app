import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import HeroImg from '../assets/main-page/hero-1.jpg';
import InfoBoxes from '../home-page/InfoBoxes';
import HeroTextSection from '../home-page/HeroTextSection';
import ScrollStory from '../home-page/StoryScroll';
import Menu from '../home-page/MenuSection';
import GallerySection from '../home-page/GallerySection';
import ReservationSection from '../home-page/ReservationSection';
import Footer from '../components/Footer';

import './LandingPage.css';

function LandingPage() {
  // Scroll to section
  const location = useLocation();

  useEffect(() => {
    const scrollToId = location.state?.scrollToId;

    if (scrollToId) {
      setTimeout(() => {
        const el = document.getElementById(scrollToId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      <Header />
      <HeroSection
        imgSrc={HeroImg}
        heading="Morning Mist Coffee"
        subheading="Fresh filter coffee, ready with the first light of morning."
        buttonText="EXPLORE MORE"
        buttonHref="#hero-text-section"
        buttonColor="white"
        height="100%"
        className="home-hero"
      />
      <InfoBoxes />
      <HeroTextSection />
      <ScrollStory />
      <Menu />
      <GallerySection />
      <ReservationSection />
      <Footer />
    </>
  );
}

export default LandingPage;
