export interface NavItem {
  label: string;
  to?: string;
  sectionId?: string;
}

export const navItems: NavItem[] = [
  { label: 'Reservation', to: '/reservation' },
  { label: 'E-shop', to: '/e-shop' },
  { label: 'Contact', sectionId: 'info-boxes' },
  { label: 'Our Story', sectionId: 'story-section' },
  { label: 'Menu', sectionId: 'menu-section' },
];

export const eshopNavItems: NavItem[] = [
  { label: 'All Products', to: '/e-shop/products' },
  { label: 'Light Roasted', to: '/e-shop/products/light' },
  { label: 'Dark Roasted', to: '/e-shop/products/dark' },
  { label: 'Decaf', to: '/e-shop/products/decaf' },
];
