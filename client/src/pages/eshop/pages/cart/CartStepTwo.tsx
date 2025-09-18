import CartLayout from "./CartLayout";
import { JSX } from "react";
import CartSummary from "./CartSummary";
import { eshopNavItems } from "@config/NavItems";

const cartUrl = eshopNavItems.find(
  (item) => item.label === "Shopping Cart",
)?.to;
const paymentUrl = eshopNavItems.find(
  (item) => item.label === "Shopping Cart Payment",
)?.to;

export default function CartStepTwo(): JSX.Element {
  return (
    <CartLayout step="delivery">
      <div className="shopping-cart-content">
        <h2>Delivery Information</h2>
      </div>

      <CartSummary
        previousStep={cartUrl!}
        nextStep={paymentUrl!}
        previousStepText="BACK"
        nextStepText="NEXT"
      />
    </CartLayout>
  );
}
