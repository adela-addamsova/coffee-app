import { useNavigate } from "react-router-dom";
import CartLayout from "./CartLayout";
import { JSX, useState } from "react";
import CartSummary from "./CartSummary";
import { eshopNavItems } from "@config/NavItems";
import MockPaymentForm from "./MockCartPayment";
import { paymentSchema } from "@shared/PaymentFormValidationSchema";
import { useCart } from "@eshop/pages/cart/CartContext";
import { useTranslation } from "react-i18next";

export default function CartStepThree(): JSX.Element {
  const API_URL = import.meta.env.VITE_API_URL as string;

  const {
    paymentMethod,
    setPaymentMethod,
    setPaymentFee,
    cardData,
    setCardData,
    cardErrors,
    setCardErrors,
    cart,
    deliveryData,
    shippingMethod,
    setOrderId,
    clearFormData,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const deliveryUrl = eshopNavItems.find(
    (item) => item.label === "data.eshop-nav-items.delivery",
  )?.to;

  const finnishUrl = eshopNavItems.find(
    (item) => item.label === "data.eshop-nav-items.success",
  )?.to;

  /**
   * Handles changing the payment method and updates associated fees
   * @param method - Selected payment method
   */
  const handlePaymentChange = (method: "bank-transfer" | "card" | "cash") => {
    setPaymentMethod(method);
    setPaymentFee(method === "cash" ? 2 : 0);
  };

  /**
   * Triggered when the "Send Order" button is clicked
   * Validates card data, builds the order payload, submits the order to the backend,
   *  clears form data, and navigates to the success page
   */
  const handleSendOrder = async () => {
    setIsProcessing(true);

    try {
      if (paymentMethod === "card") {
        const result = paymentSchema.safeParse(cardData);
        if (!result.success) {
          const formattedErrors: typeof cardErrors = {};
          result.error.errors.forEach((err) => {
            const key = err.path[0] as keyof typeof cardData;
            formattedErrors[key] = { message: err.message };
          });
          setCardErrors(formattedErrors);
          setIsProcessing(false);
          return;
        }
        setProcessingMessage(t("eshop-cart.payment-proccess"));
      } else {
        setProcessingMessage(t("eshop-cart.order-proccess"));
      }

      const orderPayload = {
        name: deliveryData.name,
        street: deliveryData.street,
        city: deliveryData.city,
        zipCode: deliveryData.zipCode,
        email: deliveryData.email,
        phone: deliveryData.phone,
        shipment_method: shippingMethod,
        payment_method: paymentMethod,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        total_amount: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
        paid: paymentMethod === "card",
      };

      /**
       * Sends the order payload to the backend and stores the resulting order ID
       * in context and localStorage
       */
      const sendOrder = async () => {
        const response = await fetch(`${API_URL}/orders/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to create order");

        setOrderId(data.orderId);
        localStorage.setItem("lastOrderId", data.orderId.toString());
        localStorage.setItem(
          "paymentMethod",
          orderPayload.payment_method.toString(),
        );
      };

      /**
       * Handles asynchronous flow for card vs non-card payments
       * Shows processing messages, submits order, clears form data, and navigates
       * to the Order Success page with slight delays for UX
       */
      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

      if (paymentMethod === "card") {
        setProcessingMessage("Processing your order...");
        await delay(1500);
        await sendOrder();
        clearFormData();
        await delay(1500);
        setIsProcessing(false);
        navigate(finnishUrl!);
      } else {
        await delay(1500);
        await sendOrder();
        clearFormData();
        setIsProcessing(false);
        navigate(finnishUrl!);
      }
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : String(err));
      setIsProcessing(false);
    }
  };

  /* Spinner with message */
  if (isProcessing) {
    return (
      <CartLayout step="payment">
        <div className="spinner-box">
          <div className="spinner" data-testid="spinner"></div>
          <p className="spinner-text">{processingMessage}</p>
        </div>
      </CartLayout>
    );
  }

  /* Payment method selector */
  return (
    <CartLayout step="payment">
      <div className="shopping-cart-content" id="delivery-form">
        <div className="payment-box">
          <h3 className="cart-heading">Payment Method</h3>
          <form className="radio-form" noValidate>
            {/* Bank Transfer */}
            <div className="payment-form-group">
              <div className="radio-form-group">
                <input
                  type="radio"
                  id="bank-transfer"
                  name="paymentMethod"
                  value="bank-transfer"
                  checked={paymentMethod === "bank-transfer"}
                  onChange={() => handlePaymentChange("bank-transfer")}
                />
                <label htmlFor="bank-transfer" data-testid="transfer">
                  <span className="font-semibold">
                    {t("eshop-cart.ship-free")}
                  </span>{" "}
                  {t("eshop-cart.payment-transfer")}
                </label>
              </div>
            </div>

            {/* Card */}
            <div className="payment-form-group">
              <div className="radio-form-group">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => handlePaymentChange("card")}
                />
                <label htmlFor="card" data-testid="card">
                  <span className="font-semibold">
                    {t("eshop-cart.ship-free")}
                  </span>{" "}
                  {t("eshop-cart.payment-card")}
                </label>
              </div>
              {paymentMethod === "card" && (
                <MockPaymentForm
                  cardData={cardData}
                  errors={cardErrors}
                  setErrors={setCardErrors}
                  onDataChange={setCardData}
                />
              )}
            </div>

            {/* Cash */}
            <div className="radio-form-group">
              <input
                type="radio"
                id="cash"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => handlePaymentChange("cash")}
              />
              <label htmlFor="cash" data-testid="cash">
                <span className="font-semibold">$2.00</span>{" "}
                {t("eshop-cart.payment-cash")}
              </label>
            </div>
          </form>
        </div>
      </div>

      <CartSummary
        previousStep={deliveryUrl!}
        nextStep="#"
        previousStepText={t("eshop-cart.btn-back")}
        nextStepText={t("eshop-cart.btn-send")}
        onNext={handleSendOrder}
      />
    </CartLayout>
  );
}
