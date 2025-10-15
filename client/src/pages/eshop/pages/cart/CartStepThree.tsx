import { useNavigate } from "react-router-dom";
import CartLayout from "./CartLayout";
import { JSX, useState } from "react";
import CartSummary from "./CartSummary";
import { eshopNavItems } from "@config/NavItems";
import MockPaymentForm from "./MockCartPayment";
import { paymentSchema } from "@shared/PaymentFormValidationSchema";
import { useCart } from "@eshop/pages/cart/CartContext";

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

  const deliveryUrl = eshopNavItems.find(
    (item) => item.label === "Shopping Cart Delivery",
  )?.to;

  const finnishUrl = eshopNavItems.find(
    (item) => item.label === "Order Success",
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
        setProcessingMessage("Processing your payment...");
      } else {
        setProcessingMessage("Processing your order...");
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
          price: item.price,
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
      };

      /**
       * Handles asynchronous flow for card vs non-card payments
       * Shows processing messages, submits order, clears form data, and navigates
       * to the Order Success page with slight delays for UX
       */
      if (paymentMethod === "card") {
        setTimeout(async () => {
          setProcessingMessage("Processing your order...");
          await sendOrder();
          clearFormData();
          setTimeout(() => {
            setIsProcessing(false);
            navigate(finnishUrl!);
          }, 1500);
        }, 1500);
      } else {
        setTimeout(async () => {
          await sendOrder();
          clearFormData();
          setIsProcessing(false);
          navigate(finnishUrl!);
        }, 1500);
      }
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : String(err));
      setIsProcessing(false);
    }
  };

  {
    /* Spinner with message */
  }
  if (isProcessing) {
    return (
      <CartLayout step="payment">
        <div className="spinner-box">
          <div className="spinner"></div>
          <p className="spinner-text">{processingMessage}</p>
        </div>
      </CartLayout>
    );
  }

  {
    /* Payment method selector */
  }
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
                <label htmlFor="bank-transfer">
                  <span className="font-semibold">Free</span> Direct Bank
                  Transfer
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
                <label htmlFor="card">
                  <span className="font-semibold">Free</span> Card Payment
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
              <label htmlFor="cash">
                <span className="font-semibold">$2.00</span> Cash On Delivery
              </label>
            </div>
          </form>
        </div>
      </div>

      <CartSummary
        previousStep={deliveryUrl!}
        nextStep="#"
        previousStepText="BACK"
        nextStepText="SEND ORDER"
        onNext={handleSendOrder}
      />
    </CartLayout>
  );
}
