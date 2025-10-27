import CartLayout from "./CartLayout";
import deleteIcon from "@assets/e-shop/cart/delete.svg";
import { useCart } from "@eshop/pages/cart/CartContext";
import ProductCounter from "@eshop-components/ProductCounter";
import { navItems, eshopNavItems } from "@config/NavItems";
import { JSX } from "react";
import CartSummary from "./CartSummary";
import { useTranslation } from "react-i18next";

export default function CartStepOne(): JSX.Element {
  const { cart, categoryLabels, updateQuantity, removeFromCart } = useCart();
  const { t } = useTranslation();

  const eshopUrl = navItems.find(
    (item) => item.label === "data.nav-items.eshop",
  )?.to;
  const deliveryUrl = eshopNavItems.find(
    (item) => item.label === "data.eshop-nav-items.delivery",
  )?.to;

  return (
    <CartLayout step="cart">
      <div className="shopping-cart-content">
        {cart.length === 0 ? (
          <h2 className="empty-cart">{t("eshop-cart.cart-empty")}</h2>
        ) : (
          <div className="cart-summary">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="flex flex-row items-center">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="product-img"
                  />
                  <h4 className="product-desc">
                    {item.title} – {categoryLabels[item.category]} {item.weight}
                  </h4>
                </div>
                <div className="flex flex-row items-center gap-8">
                  <ProductCounter
                    min={1}
                    max={item.stock}
                    value={item.quantity}
                    onChange={(newQty) => updateQuantity(item.id, newQty)}
                  />
                  <h4 className="product-desc">
                    ${(item.price * item.quantity).toFixed(2)}
                  </h4>
                  <div
                    className="product-info-button"
                    data-testid={`remove-btn-${item.id}`}
                    onClick={() => removeFromCart(item.id)}
                  >
                    <img src={deleteIcon} alt={`Remove ${item.title}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CartSummary
        previousStep={eshopUrl!}
        nextStep={deliveryUrl!}
        previousStepText={t("eshop-cart.btn-back-eshop")}
        nextStepText={t("eshop-cart.btn-next")}
      />
    </CartLayout>
  );
}
