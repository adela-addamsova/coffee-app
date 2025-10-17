import { JSX } from "react";
import phoneBackground from "@assets/main-page/phone.png";
import MainButton from "@components/MainButton";
import { navItems, NavItem } from "@config/NavItems";
import { useTranslation } from "react-i18next";

/**
 * ReservationSection component
 * Displays a call-to-action section for reservation
 * @returns {JSX.Element} The reservation call-to-action section of the homepage
 */

const ReservationSection = (): JSX.Element => {
  const { t } = useTranslation();

  const reservationPageLink: NavItem | undefined = navItems.find(
    (item) => item.label === "data.nav-items.reservation",
  );

  return (
    <section
      className="reservation-section"
      id="reservation-section"
      data-testid="reservation-section"
    >
      <div className="reservation-content reservation-image">
        <img src={phoneBackground} alt="Reservation Phone" />
      </div>
      <div
        className="reservation-content reservation-text"
        data-testid="reservation-text"
      >
        <p>{t("home.reservation-text")}</p>

        {reservationPageLink?.to && (
          <MainButton
            text={t("home.reservation-btn")}
            to={reservationPageLink.to}
            color="black"
          />
        )}
      </div>
    </section>
  );
};

export default ReservationSection;
