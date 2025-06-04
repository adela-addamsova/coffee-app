import Header from '../components/Header';
import HeroSection from '../home-page/HeroSection';
import InfoBoxes from '../home-page/InfoBoxes';
import HeroTextSection from '../home-page/HeroTextSection';
import ScrollStory from '../home-page/StoryScroll';
import Menu from '../home-page/MenuSection';
import GallerySection from '../home-page/GallerySection';
import ReservationSection from '../home-page/ReservationSection';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <>
      <Header />
      <HeroSection />
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