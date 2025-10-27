import { describe, expect, test, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Header from "@components/Header";
import * as navigationFunctions from "@/utils/navigationFunctions";
import { createTestI18n } from "../test-i18n";
import { CartProvider } from "@/pages/eshop/pages/cart/CartContext";

let i18n: Awaited<ReturnType<typeof createTestI18n>>;

describe("Header - Unit Tests", () => {
  beforeAll(async () => {
    i18n = await createTestI18n();
  });
  beforeEach(() => {
    window.scrollY = 0;

    vi.spyOn(navigationFunctions, "scrollToTop").mockImplementation(() => {});
    vi.spyOn(navigationFunctions, "handleNavigation").mockImplementation(
      () => {},
    );

    render(
      <CartProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </CartProvider>,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders header without 'scrolled' class", () => {
    const header = screen.getByRole("banner");
    expect(header.className).not.toContain("scrolled");
  });

  test("adds 'scrolled' class when window is scrolled", () => {
    const header = screen.getByRole("banner");
    window.scrollY = 100;
    fireEvent(window, new Event("scroll"));
    expect(header.className).toContain("scrolled");
  });

  test("shows mobile menu after burger click", async () => {
    const user = userEvent.setup();
    const burger = screen.getByRole("button", { name: /open menu/i });
    await user.click(burger);

    expect(
      screen.getByRole("button", { name: /close menu/i }),
    ).toBeInTheDocument();

    const links = screen.getAllByText(/menu|reservation|e-shop/i);
    links.forEach((link) => expect(link).toBeInTheDocument());
  });

  test("hides mobile menu when close button is clicked", async () => {
    const user = userEvent.setup();
    const burger = screen.getByRole("button", { name: /open menu/i });
    await user.click(burger);

    const closeBtn = screen.getByRole("button", { name: /close menu/i });
    await user.click(closeBtn);

    expect(
      screen.queryByRole("button", { name: /close menu/i }),
    ).not.toBeInTheDocument();
  });

  test("calls scrollToTop on logo click", async () => {
    const user = userEvent.setup();
    const logoLink = screen.getByRole("link", { name: /logo/i });

    await user.click(logoLink);
    expect(navigationFunctions.scrollToTop).toHaveBeenCalled();
  });

  test("renders section links with correct href attribute", () => {
    const sectionLinks = [
      { name: "Contact", href: "#info-boxes" },
      { name: "Our Story", href: "#story-section" },
      { name: "Menu", href: "#menu-section" },
    ];

    sectionLinks.forEach(({ name, href }) => {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("href", href);
    });
  });

  test("calls handleNavigation when clicking section links", async () => {
    const user = userEvent.setup();

    const sectionLinks = ["Contact", "Our Story", "Menu"];

    for (let i = 0; i < sectionLinks.length; i++) {
      const link = screen.getByRole("link", { name: sectionLinks[i] });
      await user.click(link);
      expect(navigationFunctions.handleNavigation).toHaveBeenCalledTimes(i + 1);
    }
  });

  test.each([
    ["Enter", "{Enter}"],
    ["Space", " "],
  ])("opens burger menu on key", async (_keyName, key) => {
    const user = userEvent.setup();

    const burger = screen.getByRole("button", { name: /open menu/i });

    burger.focus();
    await user.keyboard(key);

    expect(screen.getByTestId("mobile-menu")).toBeVisible();
  });
});

describe("Header - Integration Tests", () => {
  function renderWithRoutes(initialRoute = "/") {
    return render(
      <CartProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Header />
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/reservation" element={<div>Reservation Page</div>} />
            <Route path="/e-shop" element={<div>E-shop Page</div>} />
          </Routes>
        </MemoryRouter>
      </CartProvider>,
    );
  }

  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.spyOn(navigationFunctions, "scrollToTop").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("navigates to /reservation via mobile menu link", async () => {
    renderWithRoutes();

    const burger = screen.getByRole("button", { name: /open menu/i });
    await user.click(burger);

    const mobileNav = screen.getByTestId("mobile-nav");
    const reservationLink = within(mobileNav).getByRole("link", {
      name: "Reservation",
    });
    await user.click(reservationLink);

    expect(screen.getByText("Reservation Page")).toBeInTheDocument();
  });

  test("clicking logo calls scrollToTop and navigates home", async () => {
    renderWithRoutes("/reservation");

    const logo = screen.getByRole("link", { name: /logo/i });
    await user.click(logo);

    expect(navigationFunctions.scrollToTop).toHaveBeenCalledOnce();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  test("navigates to /e-shop via desktop menu link", async () => {
    renderWithRoutes();

    const EshopLink = screen.getByRole("link", { name: "E-shop" });
    await user.click(EshopLink);

    expect(screen.getByText("E-shop Page")).toBeInTheDocument();
  });
});
