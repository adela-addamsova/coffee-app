import { JSX } from "react";
import "@/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import LandingPage from "@/pages/home-page/LandingPage";
import ReservationPage from "@/pages/reservation-page/ReservationPage";
import EshopLayout from "@/pages/eshop/pages/EshopLayout";
import EshopLandingPage from "@/pages/eshop/pages/main-page/EshopLandingPage";
import CategoryPageLayout from "@/pages/eshop/pages/CategoryPageLayout";
import ProductPageLayout from "@/pages/eshop/pages/ProductPageLayout";
import CartLayout from "@/pages/eshop/pages/cart/CartLayout";
import { CartProvider } from "@/pages/eshop/pages/cart/CartContext";

/**
 * App
 *
 * Main application component that sets up routing using React Router
 * It defines all top-level routes including landing, reservation, and e-shop subroutes
 * Also includes scroll-to-top behavior on route change
 *
 * @returns {JSX.Element} The rendered router with all routes
 */
export default function App(): JSX.Element {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/e-shop" element={<EshopLayout />}>
            <Route index element={<EshopLandingPage />} />
            <Route path="products" element={<CategoryPageLayout />} />
            <Route path="products/:category" element={<CategoryPageLayout />} />
            <Route
              path="products/:category/:id"
              element={<ProductPageLayout />}
            />
            <Route path="cart" element={<CartLayout />} />
          </Route>
          <Route
            path="*"
            // element={<PageNotFound />}
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}
