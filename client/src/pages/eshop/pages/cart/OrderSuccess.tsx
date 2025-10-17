import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartLayout from "./CartLayout";
import { useCart } from "@eshop/pages/cart/CartContext";
import MainButton from "@/components/MainButton";
import { navItems, eshopNavItems } from "@config/NavItems";
import { useTranslation } from "react-i18next";

export default function OrderSuccess() {
  const { paymentMethod, orderId } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cartUrl = eshopNavItems.find(
    (item) => item.label === "data.eshop-nav-items.cart",
  )?.to;

  const eshopUrl = navItems.find(
    (item) => item.label === "data.nav-items.eshop",
  )?.to;

  /**
   * Redirects the user back to the shopping cart if there is no order ID
   */
  useEffect(() => {
    if (!orderId) {
      navigate(cartUrl!);
    }
  }, [orderId, navigate, cartUrl]);

  /**
   * Sets a timeout to clear the last order ID and payment method from localStorage
   * Keeps the order information available for 10 minutes after reaching page
   */
  useEffect(() => {
    const timeout = setTimeout(
      () => {
        localStorage.removeItem("lastOrderId");
        localStorage.removeItem("lastOrderPaymentMethod");
      },
      10 * 60 * 1000,
    );

    return () => clearTimeout(timeout);
  }, []);

  return (
    <CartLayout step="summary">
      <div className="thank-you-container">
        <h2 className="order-success-title">Your order has been created!</h2>
        <p className="order-success-message">
          {t("eshop-cart.success-start")} <strong>{orderId}</strong>{" "}
          {paymentMethod === "card" && t("eshop-cart.success-card")}
          {paymentMethod === "bank-transfer" &&
            t("eshop-cart.success-transfer")}
          {paymentMethod === "cash" && t("eshop-cart.success-cash")}
        </p>

        <MainButton
          text={t("eshop-cart.btn-back-eshop")}
          to={eshopUrl}
          color="white"
        />
      </div>
    </CartLayout>
  );
}
