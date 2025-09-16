import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image_url: string;
  category: "light" | "dark" | "decaf";
  weight: string;
  stock: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  categoryLabels: Record<CartItem["category"], string>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const EXPIRATION_TIME = 1000 * 60 * 30;

const CATEGORY_LABELS: Record<CartItem["category"], string> = {
  light: "Light roasted",
  dark: "Dark roasted",
  decaf: "Decaf",
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const rawData = localStorage.getItem("cart");
    if (rawData) {
      try {
        const data = JSON.parse(rawData);
        if (Date.now() < data.expiry && Array.isArray(data.items)) {
          const formatedData = data.items.map((i: CartItem) => ({
            id: i.id,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
            image_url: i.image_url,
            category: i.category,
            weight: i.weight,
            stock: i.stock,
          }));
          setCart(formatedData);
        } else {
          localStorage.removeItem("cart");
        }
      } catch (_err) {
        localStorage.removeItem("cart");
      }
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(
        "cart",
        JSON.stringify({ items: cart, expiry: Date.now() + EXPIRATION_TIME }),
      );
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingData = prev.find((i) => i.id === item.id);
      if (existingData) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        categoryLabels: CATEGORY_LABELS,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
