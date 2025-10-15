import { z } from "zod";
import { paymentSchema } from "@shared/PaymentFormValidationSchema";
import creditCard from "@assets/e-shop/cart/credit-card.png";

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function MockPaymentForm({
  cardData,
  onDataChange,
  errors,
  setErrors,
}: {
  cardData: z.infer<typeof paymentSchema>;
  onDataChange: (data: z.infer<typeof paymentSchema>) => void;
  errors: Partial<
    Record<keyof z.infer<typeof paymentSchema>, { message?: string }>
  >;
  setErrors: (
    errors: Partial<Record<keyof PaymentFormData, { message?: string }>>,
  ) => void;
}) {
  const handleChange = (
    field: keyof z.infer<typeof paymentSchema>,
    value: string,
  ) => {
    onDataChange({
      ...cardData,
      [field]: value,
    });
    setErrors({ ...errors, [field]: undefined });
  };

  return (
    <div className="payment-form">
      <div className="payment-form-img">
        <img src={creditCard} alt="Credit card" />
      </div>

      <div className="payment-form-data">
        {/* Card number */}
        <div>
          <div className="payment-form-group">
            <input
              placeholder="1234 1234 1234 1234"
              maxLength={19}
              inputMode="numeric"
              pattern="\d*"
              value={cardData.cardNumber}
              onInput={(e) => {
                let v = e.currentTarget.value.replace(/\D/g, "");
                v = v.replace(/(\d{4})(?=\d)/g, "$1 ");
                handleChange("cardNumber", v);
                e.currentTarget.value = v;
              }}
            />
          </div>
        </div>

        {errors.cardNumber && (
          <p className="field-error-message mb-4">
            {errors.cardNumber.message}
          </p>
        )}

        {/* Expiry + CVV */}
        <div className="cart-info-50">
          <div className="cart-info-50-inner">
            <div className="payment-form-group">
              <input
                placeholder="MM/YY"
                maxLength={5}
                inputMode="numeric"
                value={cardData.expiry}
                onInput={(e) => {
                  let v = e.currentTarget.value.replace(/\D/g, "");
                  if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                  handleChange("expiry", v);
                  e.currentTarget.value = v;
                }}
              />
            </div>
            {errors.expiry && (
              <p className="field-error-message">{errors.expiry.message}</p>
            )}
          </div>

          <div className="cart-info-50-inner">
            <div className="payment-form-group">
              <input
                placeholder="CVV"
                maxLength={3}
                inputMode="numeric"
                pattern="\d*"
                value={cardData.cvv}
                onInput={(e) => {
                  const v = e.currentTarget.value.replace(/\D/g, "");
                  handleChange("cvv", v);
                  e.currentTarget.value = v;
                }}
              />
            </div>
            {errors.cvv && (
              <p className="field-error-message">{errors.cvv.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
