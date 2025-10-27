import React, { createContext, useContext, useState, useEffect } from "react";
import { paymentSchema } from "@shared/PaymentFormValidationSchema";
import { addressSchema } from "@shared/AddressFormValidationSchema";
import { z } from "zod";

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

export type AddressData = z.infer<typeof addressSchema>;

export type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  categoryLabels: Record<CartItem["category"], string>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  deliveryData: AddressData;
  deliveryErrors: Partial<Record<keyof AddressData, { message?: string }>>;
  setDeliveryData: React.Dispatch<React.SetStateAction<AddressData>>;
  setDeliveryErrors: React.Dispatch<
    React.SetStateAction<
      Partial<Record<keyof AddressData, { message?: string }>>
    >
  >;
  shippingFee: number;
  setShippingFee: (fee: number) => void;
  paymentFee: number;
  setPaymentFee: (fee: number) => void;
  shippingMethod: "standard" | "express";
  setShippingMethod: (method: "standard" | "express") => void;
  paymentMethod: "bank-transfer" | "card" | "cash";
  setPaymentMethod: (method: "bank-transfer" | "card" | "cash") => void;
  cardData: z.infer<typeof paymentSchema>;
  setCardData: (data: z.infer<typeof paymentSchema>) => void;
  cardErrors: Partial<
    Record<keyof z.infer<typeof paymentSchema>, { message?: string }>
  >;
  setCardErrors: (
    errors: Partial<
      Record<keyof z.infer<typeof paymentSchema>, { message?: string }>
    >,
  ) => void;
  orderId: number | null;
  setOrderId: React.Dispatch<React.SetStateAction<number | null>>;
  clearFormData: () => void;
  remainingTime: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CATEGORY_LABELS: Record<CartItem["category"], string> = {
  light: "Light roasted",
  dark: "Dark roasted",
  decaf: "Decaf",
};

const EXPIRATION_TIME = 1000 * 60 * 30;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ------------------------------
  // SHOPPING CART
  // ------------------------------
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartExpiry, setCartExpiry] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Restore cart from localStorage on page load
  useEffect(() => {
    const rawData = localStorage.getItem("cart");
    if (rawData) {
      try {
        const data = JSON.parse(rawData);
        if (Array.isArray(data.items) && Date.now() < data.expiry) {
          setCart(data.items);
          setCartExpiry(data.expiry);
          setRemainingTime(data.expiry - Date.now());
        } else {
          localStorage.removeItem("cart");
          localStorage.removeItem("cartExpiry");
        }
      } catch {
        localStorage.removeItem("cart");
        localStorage.removeItem("cartExpiry");
      }
    }
  }, []);

  // Timer: updates remaining time every second and clears cart when expired
  useEffect(() => {
    if (!cartExpiry) return;

    const interval = setInterval(() => {
      const timeLeft = cartExpiry - Date.now();
      if (timeLeft <= 0) {
        setRemainingTime(0);
        setCart([]);
        setCartExpiry(null);
        localStorage.removeItem("cart");
        localStorage.removeItem("cartExpiry");
        clearInterval(interval);
      } else {
        setRemainingTime(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cartExpiry]);

  /**
   * Add a product to the cart
   * - Updates quantity if item exists
   * - Resets timer whenever a new product is added
   */
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const updatedCart = existing
        ? prev.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          )
        : [...prev, item];

      const newExpiry = Date.now() + EXPIRATION_TIME;
      setCartExpiry(newExpiry);
      setRemainingTime(EXPIRATION_TIME);

      return updatedCart;
    });

    setIsCartOpen(true);
  };

  // Persist cart and expiry to localStorage whenever cart changes
  useEffect(() => {
    if (cart.length === 0) {
      localStorage.removeItem("cart");
      localStorage.removeItem("cartExpiry");
    } else {
      const expiry = cartExpiry ?? Date.now() + EXPIRATION_TIME;
      localStorage.setItem("cart", JSON.stringify({ items: cart, expiry }));
      localStorage.setItem("cartExpiry", String(expiry));
    }
  }, [cart, cartExpiry]);

  /**
   * Remove an item from the cart by ID
   */
  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  /**
   * Update the quantity of a specific item in the cart
   */
  const updateQuantity = (id: number, quantity: number) =>
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );

  // ------------------------------
  // DELIVERY
  // ------------------------------
  const [deliveryData, setDeliveryData] = useState<AddressData>({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
  });
  const [deliveryErrors, setDeliveryErrors] = useState<
    Partial<Record<keyof AddressData, { message?: string }>>
  >({});

  // Load delivery data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("deliveryData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.name && parsed?.email && parsed?.phone)
          setDeliveryData(parsed);
        else localStorage.removeItem("deliveryData");
      } catch {
        localStorage.removeItem("deliveryData");
      }
    }
  }, []);

  // Persist delivery data to localStorage whenever it changes
  useEffect(() => {
    const empty = Object.values(deliveryData).every((v) => v === "");
    if (!empty)
      localStorage.setItem("deliveryData", JSON.stringify(deliveryData));
    else localStorage.removeItem("deliveryData");
  }, [deliveryData]);

  // ------------------------------
  // SHIPPING & PAYMENT
  // ------------------------------
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentFee, setPaymentFee] = useState(0);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard",
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "bank-transfer" | "card" | "cash"
  >(
    () =>
      localStorage.getItem("paymentMethod") as
        | "bank-transfer"
        | "card"
        | "cash",
  );

  // ------------------------------
  // CARD
  // ------------------------------
  const [cardData, setCardData] = useState<z.infer<typeof paymentSchema>>({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState<
    Partial<Record<keyof z.infer<typeof paymentSchema>, { message?: string }>>
  >({});

  // ------------------------------
  // ORDER
  // ------------------------------
  const [orderId, setOrderId] = useState<number | null>(() => {
    const saved = localStorage.getItem("lastOrderId");
    return saved ? Number(saved) : null;
  });

  // Persist last order ID to localStorage
  useEffect(() => {
    if (orderId !== null) localStorage.setItem("lastOrderId", String(orderId));
    else localStorage.removeItem("lastOrderId");
  }, [orderId]);

  /**
   * Clears cart, delivery data, card info, fees, and timer
   * Removes all relevant localStorage entries
   */
  const clearFormData = () => {
    setCart([]);
    setCartExpiry(null);
    setRemainingTime(0);
    setDeliveryData({
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      zipCode: "",
    });
    setCardData({ cardNumber: "", expiry: "", cvv: "" });
    setCardErrors({});
    setShippingFee(0);
    setPaymentFee(0);

    localStorage.removeItem("cart");
    localStorage.removeItem("cartExpiry");
    localStorage.removeItem("deliveryData");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        categoryLabels: CATEGORY_LABELS,
        isCartOpen,
        setIsCartOpen,
        deliveryData,
        setDeliveryData,
        deliveryErrors,
        setDeliveryErrors,
        shippingFee,
        setShippingFee,
        paymentFee,
        setPaymentFee,
        shippingMethod,
        setShippingMethod,
        paymentMethod,
        setPaymentMethod,
        cardData,
        setCardData,
        cardErrors,
        setCardErrors,
        orderId,
        setOrderId,
        clearFormData,
        remainingTime,
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
