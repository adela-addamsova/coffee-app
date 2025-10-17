export interface NavItem {
  label: string;
  to?: string;
  sectionId?: string;
}

export const navItems: NavItem[] = [
  { label: "data.nav-items.reservation", to: "/reservation" },
  { label: "data.nav-items.eshop", to: "/e-shop" },
  { label: "data.nav-items.contact", sectionId: "info-boxes" },
  { label: "data.nav-items.ourStory", sectionId: "story-section" },
  { label: "data.nav-items.menu", sectionId: "menu-section" },
];

export const eshopNavItems: NavItem[] = [
  { label: "data.eshop-nav-items.all", to: "/e-shop/products" },
  { label: "data.eshop-nav-items.light", to: "/e-shop/products/light" },
  { label: "data.eshop-nav-items.dark", to: "/e-shop/products/dark" },
  { label: "data.eshop-nav-items.decaf", to: "/e-shop/products/decaf" },
  { label: "data.eshop-nav-items.cart", to: "/e-shop/cart" },
  { label: "data.eshop-nav-items.delivery", to: "/e-shop/cart/delivery" },
  { label: "data.eshop-nav-items.payment", to: "/e-shop/cart/payment" },
  { label: "data.eshop-nav-items.success", to: "/e-shop/cart/order-success" },
];
