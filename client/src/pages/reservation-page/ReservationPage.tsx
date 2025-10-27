import { JSX } from "react";
import Header from "@components/Header";
import Footer from "@components/Footer";
import ReservationForm from "./ReservationForm";
import HeroSection from "@components/HeroSection";
import HeroImg from "@assets/reservation-page/reservation-hero.jpg";
import BeansBackground from "@assets/reservation-page/beans-bck.png";
import { useTranslation } from "react-i18next";

/**
 * ReservationPage
 * Page component for the reservation section
 * Displays a hero section, the reservation form, and an image
 * Wraps content with site Header and Footer
 * @returns {JSX.Element}
 */

const ReservationPage = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div data-testid="reservation-page">
      <Header />
      <div
        className="reservation-page-hero"
        data-testid="reservation-page-hero"
      >
        <HeroSection
          imgSrc={HeroImg}
          heading={t("reservation.reservation-head")}
        />
      </div>
      <div
        className="reservation-page-container"
        data-testid="reservation-page-container"
      >
        <div className="main-content-reservation">
          <div className="reservation-form-box">
            <ReservationForm />
          </div>
          <div className="reservation-img">
            <img src={BeansBackground} alt="Beans Background" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReservationPage;
