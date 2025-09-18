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
import { CartProvider } from "@/pages/eshop/pages/cart/CartContext";
import CartSidePanel from "@/pages/eshop/pages/cart/CartSidePanel";
import CartStepOne from "@/pages/eshop/pages/cart/CartStepOne";
import CartStepTwo from "@/pages/eshop/pages/cart/CartStepTwo";
import CartStepThree from "@/pages/eshop/pages/cart/CartStepThree";

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
        <CartSidePanel />
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
            <Route path="cart" element={<CartStepOne />} />
            <Route path="cart/delivery" element={<CartStepTwo />} />
            <Route path="cart/payment" element={<CartStepThree />} />
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
