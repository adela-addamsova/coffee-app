import React from "react";

// Scroll to top
export const scrollToTop = (): void => {
  window.scrollTo({ top: 0 });
};

// Scroll to section by element ID
export const scrollTo = (id: string): void => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView();
};

// Navigation item type
export type NavItem = {
  to?: string;
  scrollTop?: boolean;
  sectionId?: string;
};

// Navigation handler
export const handleNavigation = (
  e: React.MouseEvent<HTMLAnchorElement>,
  item: NavItem,
  location: { pathname: string },
  navigate: (
    path: string,
    options?: { state?: Record<string, unknown> },
  ) => void,
  closeMenu?: () => void,
): void => {
  if (item.to) return;

  e.preventDefault();

  if (item.scrollTop) {
    scrollToTop();
    closeMenu?.();
    return;
  }

  if (item.sectionId) {
    const isHome = location.pathname === "/";

    if (isHome) {
      scrollTo(item.sectionId);
    } else {
      navigate("/", { state: { scrollToId: item.sectionId } });
    }

    closeMenu?.();
    return;
  }

  closeMenu?.();
};
