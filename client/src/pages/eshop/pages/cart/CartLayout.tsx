import { JSX } from "react";
import HeroSection from "@components/HeroSection";
import HeroImg from "@assets/e-shop/category-hero.jpg";
import Newsletter from "@eshop-components/Newsletter";
import cartIcon from "@assets/e-shop/cart/shopping-cart.svg";
import delivery from "@assets/e-shop/cart/delivery-gray.svg";
import payment from "@assets/e-shop/cart/payment-gray.svg";
import deleteIcon from "@assets/e-shop/cart/delete.svg";
import { useCart } from "@eshop/pages/cart/CartContext";
import ProductCounter from "@eshop-components/ProductCounter";
import MainButton from "@/components/MainButton";
import { navItems } from "@config/NavItems";

export default function CartLayout(): JSX.Element {
  const { cart, categoryLabels, updateQuantity, removeFromCart } = useCart();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const DPH_RATE = 0.21;

  const totalPriceWithoutDPH = totalPrice / (1 + DPH_RATE);

  const eshopUrl = navItems.find((item) => item.label === "E-shop")?.to;

  return (
    <div className="cart-page">
      <section className="shopping-cart-page">
        <div className="product-page-hero">
          <HeroSection imgSrc={HeroImg} />
        </div>
        <div className="shopping-cart-container">
          <div className="cart-menu">
            <div>
              <div className="icon-item">
                <img
                  src={cartIcon}
                  alt="Shopping Cart"
                  className="cart-menu-icon active"
                />
              </div>
            </div>
            <div className="icon-item">
              <img src={delivery} alt="Delivery" className="cart-menu-icon" />
            </div>
            <div className="icon-item">
              <img src={payment} alt="Payment" className="cart-menu-icon" />
            </div>
          </div>
        </div>

        <div className="shopping-cart-content">
          {cart.length === 0 ? (
            <h2 className="empty-cart">Cart is empty</h2>
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
                      {item.title} – {categoryLabels[item.category]}{" "}
                      {item.weight}
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
                      onClick={() => removeFromCart(item.id)}
                    >
                      <img src={deleteIcon} alt={item.title} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
          <div className="total-buttons">
            <MainButton text="BACK TO ESHOP" to={eshopUrl} color="black" />
            <MainButton text="NEXT" to={eshopUrl} color="white" />
          </div>
        </div>
      </section>
      <Newsletter />
    </div>
  );
}
