import React, { useState } from "react";
import CartLayout from "./CartLayout";
import CartSummary from "./CartSummary";
import { eshopNavItems } from "@config/NavItems";
import { useCart } from "@eshop/pages/cart/CartContext";
import { addressSchema } from "@shared/AddressFormValidationSchema";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type AddressData = z.infer<typeof addressSchema>;

export default function CartStepTwo() {
  const {
    deliveryData,
    setDeliveryData,
    deliveryErrors,
    setDeliveryErrors,
    setShippingFee,
    setShippingMethod,
  } = useCart();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const cartUrl = eshopNavItems.find(
    (item) => item.label === "data.eshop-nav-items.cart",
  )?.to;

  const paymentUrl = eshopNavItems.find(
    (item) => item.label === "data.eshop-nav-items.payment",
  )?.to;

  const [triedSubmit, setTriedSubmit] = useState(false);

  /**
   * Handles typing into delivery form inputs
   * Updates the corresponding field in `deliveryData`
   * and clears any existing error message for that field
   */
  const handleInputChange = (field: keyof AddressData, value: string) => {
    setDeliveryData((prev) => ({ ...prev, [field]: value }));
    setDeliveryErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleShipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const method = e.target.value as "standard" | "express";
    setShippingMethod(method);
    setShippingFee(method === "express" ? 5 : 0);
  };

  /**
   * Triggered when the "Next" button is clicked
   * Runs address validation (via Zod schema) and either:
   * - Displays validation errors and scrolls to form, or
   * - Clears errors and navigates to the payment step
   */
  const handleNextClick = () => {
    setTriedSubmit(true);

    const result = addressSchema.safeParse(deliveryData);
    if (!result.success) {
      const formattedErrors: typeof deliveryErrors = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as keyof AddressData;
        formattedErrors[key] = { message: t(err.message) };
      });
      setDeliveryErrors(formattedErrors);

      document
        .getElementById("delivery-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setDeliveryErrors({});
    navigate(paymentUrl!);
  };

  const renderInput = (id: keyof AddressData, label: string) => {
    const isNumericField = id === "phone" || id === "zipCode";

    return (
      <div className="delivery-form-group">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={isNumericField ? "tel" : "text"}
          inputMode={isNumericField ? "numeric" : "text"}
          pattern={isNumericField ? "\\d*" : undefined}
          value={deliveryData[id]}
          onChange={(e) => {
            const value = isNumericField
              ? e.target.value.replace(/\D/g, "")
              : e.target.value;
            handleInputChange(id, value);
          }}
        />
        {triedSubmit && deliveryErrors[id] && (
          <p className="field-error-message">{deliveryErrors[id]?.message}</p>
        )}
      </div>
    );
  };

  return (
    <CartLayout step="delivery">
      <div className="shopping-cart-content" id="delivery-form">
        {/* Delivery address form */}
        <div className="delivery-address-box">
          <h3 className="cart-heading">{t("eshop-cart.adr-head")}</h3>
          <form noValidate className="delivery-form">
            <div className="delivery-form-inner">
              {renderInput("name", t("eshop-cart.adr-name"))}
              {renderInput("email", t("eshop-cart.adr-email"))}
              {renderInput("phone", t("eshop-cart.adr-phone"))}
            </div>

            <div className="delivery-form-inner">
              {renderInput("street", t("eshop-cart.adr-street"))}
              {renderInput("city", t("eshop-cart.adr-city"))}
              {renderInput("zipCode", t("eshop-cart.adr-zip"))}
            </div>
          </form>
        </div>

        {/* Shipment method selector */}
        <div className="delivery-shipment-box">
          <h3 className="cart-heading">{t("eshop-cart.ship-head")}</h3>
          <form className="radio-form">
            <div className="radio-form-group">
              <input
                type="radio"
                id="standard"
                name="shipment"
                value="standard"
                defaultChecked
                onChange={handleShipmentChange}
              />
              <label htmlFor="standard">
                <span className="font-semibold">
                  {t("eshop-cart.ship-free")}
                </span>{" "}
                {t("eshop-cart.ship-standard")}
              </label>
            </div>

            <div className="radio-form-group">
              <input
                type="radio"
                id="express"
                name="shipment"
                value="express"
                onChange={handleShipmentChange}
              />
              <label htmlFor="express">
                <span className="font-semibold">$5.00</span>{" "}
                {t("eshop-cart.ship-express")}
              </label>
            </div>
          </form>
        </div>
      </div>

      <CartSummary
        previousStep={cartUrl!}
        nextStep={paymentUrl!}
        previousStepText={t("eshop-cart.btn-back")}
        nextStepText={t("eshop-cart.btn-next")}
        onNext={handleNextClick}
      />
    </CartLayout>
  );
}
