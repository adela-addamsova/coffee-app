import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartLayout from "./CartLayout";
import { useCart } from "@eshop/pages/cart/CartContext";
import MainButton from "@/components/MainButton";
import { navItems, eshopNavItems } from "@config/NavItems";

export default function OrderSuccess() {
  const { paymentMethod, orderId } = useCart();
  const navigate = useNavigate();

  const cartUrl = eshopNavItems.find(
    (item) => item.label === "Shopping Cart",
  )?.to;

  const eshopUrl = navItems.find((item) => item.label === "E-shop")?.to;

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
          {paymentMethod === "card" &&
            `Thank you for your purchase! Your order with ID ${orderId} has been successfully paid and is now being processed. We’ve sent you a confirmation email with the details. You will be notified once your order has been dispatched.`}

          {paymentMethod === "bank-transfer" &&
            `Thank you for your purchase! Your order with ID ${orderId} is now being processed. We’ve sent you a confirmation email with the details. Please make the payment to our bank account (000000/0000) using your Order ID as the reference. You will be notified once your order has been dispatched.`}

          {paymentMethod === "cash" &&
            `Thank you for your purchase! Your order with ID ${orderId} is now being processed. We’ve sent you a confirmation email with the details. Please have the cash ready upon delivery. You will be notified once your order has been dispatched.`}
        </p>

        <MainButton text="BACK TO ESHOP" to={eshopUrl} color="white" />
      </div>
    </CartLayout>
  );
}
