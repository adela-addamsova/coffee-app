import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Header from './components/Header';
import HeroSection from './home-page/HeroSection';
import InfoBoxes from './home-page/InfoBoxes';



function App() {
  return (
    <>
      <Header />
      <HeroSection />
      <InfoBoxes />
    </>
  );
}

export default App;