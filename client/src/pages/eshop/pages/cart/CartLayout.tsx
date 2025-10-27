import { JSX, ReactNode } from "react";
import HeroSection from "@components/HeroSection";
import HeroImg from "@assets/e-shop/category-hero.jpg";
import Newsletter from "@eshop-components/Newsletter";
import cartIcon from "@assets/e-shop/cart/shopping-cart.svg";
import delivery from "@assets/e-shop/cart/delivery-gray.svg";
import deliveryActive from "@assets/e-shop/cart/delivery.svg";
import payment from "@assets/e-shop/cart/payment-gray.svg";
import paymentActive from "@assets/e-shop/cart/payment.svg";

type CartLayoutProps = {
  step: "cart" | "delivery" | "payment" | "summary";
  children: ReactNode;
};

export default function CartLayout({
  step,
  children,
}: CartLayoutProps): JSX.Element {
  const steps = [
    { label: "cart", icon: cartIcon, activeIcon: cartIcon },
    { label: "delivery", icon: delivery, activeIcon: deliveryActive },
    { label: "payment", icon: payment, activeIcon: paymentActive },
  ];

  return (
    <div className="cart-page">
      <section className="shopping-cart-page">
        <div className="product-page-hero">
          <HeroSection imgSrc={HeroImg} />
        </div>

        <div className="shopping-cart-container">
          {step !== "summary" && (
            <div className="cart-menu-container">
              <div className="cart-menu-line"></div>
              <div
                className="cart-menu-line-progress"
                data-step={step}
                data-testid="cart-progress"
              ></div>
              <div className="cart-menu">
                {steps.map((s, index) => {
                  const isActive =
                    ["cart", "delivery", "payment", "summary"].indexOf(step) >=
                    index;
                  return (
                    <div key={s.label} className="icon-item">
                      <img
                        src={isActive ? s.activeIcon : s.icon}
                        alt={s.label}
                        className={`cart-menu-icon ${isActive ? "active" : ""}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Variable inner content */}
        {children}
      </section>

      <Newsletter />
    </div>
  );
}
