import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './pages/home-page/LandingPage';
import ReservationPage from './pages/reservation-page/ReservationPage';
import EshopLayout from './pages/eshop/pages/EshopLayout';
import EshopLandingPage from './pages/eshop/pages/main-page/EshopLandingPage';
import CategoryPageLayout from './pages/eshop/pages/CategoryPageLayout';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/e-shop" element={<EshopLayout />}>
          <Route index element={<EshopLandingPage />} />
          <Route path="products" element={<CategoryPageLayout />} />
          <Route path="products/:category" element={<CategoryPageLayout />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
