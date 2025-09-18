import { useCart } from "@eshop/pages/cart/CartContext";
import MainButton from "@/components/MainButton";

type CartSummaryProps = {
  nextStep: string;
  previousStep: string;
  previousStepText: string;
  nextStepText: string;
};

export default function CartSummary({
  nextStep,
  previousStep,
  previousStepText,
  nextStepText,
}: CartSummaryProps) {
  const { cart } = useCart();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const DPH_RATE = 0.21;
  const totalPriceWithoutDPH = totalPrice / (1 + DPH_RATE);

  return (
    <>
      <div className="total-price">
        <h3>Order Summary</h3>
        <div className="total-inner">
          <h4>Total</h4>
          <h4>${totalPrice.toFixed(2)}</h4>
        </div>
        <div className="total-inner">
          <h5>Price without DPH</h5>
          <h5>${totalPriceWithoutDPH.toFixed(2)}</h5>
        </div>
      </div>
      <div className="total-buttons">
        <MainButton text={previousStepText} to={previousStep} color="black" />
        <MainButton text={nextStepText} to={nextStep} color="white" />
      </div>
    </>
  );
}
