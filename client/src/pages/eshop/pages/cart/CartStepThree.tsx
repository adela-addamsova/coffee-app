import CartLayout from "./CartLayout";
import { JSX } from "react";
import CartSummary from "./CartSummary";
import { eshopNavItems } from "@config/NavItems";

const deliveryUrl = eshopNavItems.find(
  (item) => item.label === "Shopping Cart Delivery",
)?.to;
const paymentUrl = eshopNavItems.find(
  (item) => item.label === "Shopping Cart Payment",
)?.to;

export default function CartStepThree(): JSX.Element {
  return (
    <CartLayout step="payment">
      <div className="shopping-cart-content">
        <h2>Payment Information</h2>
      </div>

      <CartSummary
        previousStep={deliveryUrl!}
        nextStep={paymentUrl!}
        previousStepText="BACK"
        nextStepText="SEND ORDER"
      />
    </CartLayout>
  );
}
