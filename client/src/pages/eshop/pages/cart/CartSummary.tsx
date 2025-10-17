import { useCart } from "@eshop/pages/cart/CartContext";
import MainButton from "@/components/MainButton";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type CartSummaryProps = {
  nextStep: string;
  previousStep: string;
  previousStepText: string;
  nextStepText: string;
  onNext?: () => void;
};

export default function CartSummary({
  nextStep,
  previousStep,
  previousStepText,
  nextStepText,
  onNext,
}: CartSummaryProps) {
  const { cart, shippingFee, paymentFee } = useCart();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalPrice = subtotal + shippingFee + paymentFee;
  const DPH_RATE = 0.21;
  const totalPriceWithoutDPH = totalPrice / (1 + DPH_RATE);

  const handleNextClick = () => {
    if (onNext) {
      onNext();
    } else {
      navigate(nextStep);
    }
  };

  return (
    <>
      <div className="total-price">
        <h3>{t("eshop-cart.summary-head")}</h3>
        <div className="total-inner">
          <h4>{t("eshop-cart.summary-total")}</h4>
          <h4>${totalPrice.toFixed(2)}</h4>
        </div>
        <div className="total-inner">
          <h5>{t("eshop-cart.summary-dph")}</h5>
          <h5>${totalPriceWithoutDPH.toFixed(2)}</h5>
        </div>
      </div>
      <div className="total-buttons">
        <MainButton text={previousStepText} to={previousStep} color="black" />
        {cart.length > 0 && (
          <MainButton
            text={nextStepText}
            color="white"
            onClick={handleNextClick}
          />
        )}
      </div>
    </>
  );
}
