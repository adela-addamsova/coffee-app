import { useCart } from "@eshop/pages/cart/CartContext";
import MainButton from "@/components/MainButton";
import { eshopNavItems } from "@config/NavItems";
import deleteIcon from "@assets/e-shop/cart/delete.svg";

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
    (item) => item.label === "Shopping Cart",
  )?.to;

  return (
    <>
      {isCartOpen && (
        <div
          className="cart-side-panel-page"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div
        className={`cart-side-panel ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="cart-side-panel-header">
          <h3 className="cart-heading">Shopping Cart</h3>
          <button
            onClick={() => setIsCartOpen(false)}
            className="cart-side-panel-close"
          >
            ✕
          </button>
        </div>

        <div className="cart-side-panel-content">
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
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
                >
                  <img src={deleteIcon} alt={item.title} className="!w-6" />
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-side-panel-timer">
            <p>
              Products will stay in your cart for {minutes}:{seconds}
            </p>
          </div>
        )}

        <div className="cart-side-panel-btn">
          <MainButton
            text="GO TO CART"
            color="white"
            onClick={() => setIsCartOpen(false)}
            to={eshopUrl}
          />
        </div>
      </div>
    </>
  );
}
