import { useCart } from "@eshop/pages/cart/CartContext";
import MainButton from "@/components/MainButton";
import { eshopNavItems } from "@config/NavItems";
import deleteIcon from "@assets/e-shop/cart/delete.svg";
import { useTranslation } from "react-i18next";

export default function CartSidePanel() {
  const {
    cart,
    categoryLabels,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    remainingTime,
  } = useCart();

  const safeTime = remainingTime ?? 0;
  const minutes = Math.floor(safeTime / 1000 / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((safeTime / 1000) % 60)
    .toString()
    .padStart(2, "0");

  const eshopUrl = eshopNavItems.find(
    (item) => item.label === "data.eshop-nav-items.cart",
  )?.to;

  const { t } = useTranslation();

  return (
    <>
      {isCartOpen && (
        <div
          className="cart-side-panel-page"
          data-testid="cart-bg"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div
        className={`cart-side-panel ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="cart-side-panel-header">
          <h3 className="cart-heading">{t("eshop-cart.cart-head")}</h3>
          <button
            onClick={() => setIsCartOpen(false)}
            className="cart-side-panel-close"
          >
            ✕
          </button>
        </div>

        <div className="cart-side-panel-content">
          {cart.length === 0 ? (
            <p>{t("eshop-cart.cart-empty")}</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-side-panel-item">
                <div className="cart-side-panel-item-inner-content">
                  <img src={item.image_url} alt={item.title} className="h-20" />
                  <div className="cart-side-panel-item-inner">
                    <p className="cart-side-panel-title">{item.title}</p>
                    <p className="cart-side-panel-category">
                      {categoryLabels[item.category]} {item.weight}
                    </p>
                    <p className="cart-side-panel-quantity">
                      {item.quantity} × ${item.price}
                    </p>
                  </div>
                </div>

                <div
                  className="product-info-button"
                  onClick={() => removeFromCart(item.id)}
                  data-testid={`remove-btn-${item.id}`}
                >
                  <img
                    src={deleteIcon}
                    alt={`Remove ${item.title}`}
                    className="!w-6"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-side-panel-timer">
            <p>
              {t("eshop-cart.cart-counter")} {minutes}:{seconds}
            </p>
          </div>
        )}

        <div className="cart-side-panel-btn">
          <MainButton
            text={t("eshop-cart.cart-btn")}
            color="white"
            onClick={() => setIsCartOpen(false)}
            to={eshopUrl}
          />
        </div>
      </div>
    </>
  );
}
