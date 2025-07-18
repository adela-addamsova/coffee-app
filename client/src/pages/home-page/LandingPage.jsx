import { react, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import HeroSection from '../../components/HeroSection';
import HeroImg from '../../assets/main-page/hero-1.jpg';
import InfoBoxes from '../../components/InfoBoxes';
import HeroTextSection from './HeroTextSection';
import ScrollStory from './StoryScroll';
import Menu from './MenuSection';
import GallerySection from './GallerySection';
import ReservationSection from './ReservationSection';
import Footer from '../../components/Footer';

/**
* LandingPage
* 
* Main landing page component
* Handles scrolling to specific page sections
*/
function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    const scrollToId = location.state?.scrollToId;
    if (scrollToId) {
      setTimeout(() => {
        const el = document.getElementById(scrollToId);
        if (el) {
          el.scrollIntoView();
        }
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location.state?.scrollToId]);

  return (
    <>
      <Header />
      <div className='homepage-hero'>
        <HeroSection
          imgSrc={HeroImg}
          heading="Morning Mist Coffee"
          subheading="Fresh filter coffee, ready with the first light of morning."
          buttonText="EXPLORE MORE"
          buttonHref="#hero-text-section"
          buttonColor="white"
          className="home-hero"
        />
      </div>
      <div className='landing-page-info'>
        <InfoBoxes />
      </div>
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
