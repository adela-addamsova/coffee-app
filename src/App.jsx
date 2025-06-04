import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import HeroSection from './home-page/HeroSection';
import InfoBoxes from './home-page/InfoBoxes';
import HeroTextSection from './home-page/HeroTextSection';
import ScrollStory from './home-page/StoryScroll';
import Menu from './home-page/MenuSection';
import GallerySection from './home-page/GallerySection';

function App() {
  return (
    <>
      <Header />
      <HeroSection />
      <InfoBoxes />
      <HeroTextSection />
      <ScrollStory />
      <Menu />
      <GallerySection /> 
    </>
  );
}

export default App;