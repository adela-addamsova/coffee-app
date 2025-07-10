import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './pages/home-page/LandingPage'
import ReservationPage from './pages/reservation-page/ReservationPage';
import EshopMainPage from './pages/eshop/pages/main-page/EshopMainPage';

function App() {
  return (
    <>
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/e-shop" element={<EshopMainPage />} /> 
      </Routes>
    </Router>
    </>
  );
}

export default App;
