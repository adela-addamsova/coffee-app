import { render, screen, fireEvent } from "@testing-library/react";
import NavLink from "@components/NavLink";
import * as navigationFunctions from "@/utils/navigationFunctions";
import type { NavLinkItem, NavLinkProps } from "@components/NavLink";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

describe("NavLink - Unit Tests", () => {
  const renderNavLink = (props: NavLinkProps) => {
    return render(
      <MemoryRouter>
        <NavLink {...props} />
      </MemoryRouter>,
    );
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders React Router Link when 'to' prop is present", () => {
    const item: NavLinkItem = { to: "/test", label: "React Link" };
    renderNavLink({
      item,
      className: "class",
    });
    const link = screen.getByRole("link", { name: /react link/i });
    expect(link).toHaveAttribute("href", "/test");
    expect(link).toHaveClass("class");
  });

  test("renders <a> and calls handleNavigation on click", () => {
    const item: NavLinkItem = { sectionId: "section", label: "Section Link" };
    const handleNavigationSpy = vi
      .spyOn(navigationFunctions, "handleNavigation")
      .mockImplementation(() => {});

    renderNavLink({ item });

    const anchor = screen.getByRole("link", { name: /section link/i });
    fireEvent.click(anchor);
    expect(handleNavigationSpy).toHaveBeenCalledTimes(1);
  });

  test("calls closeMenu on click if provided", () => {
    const item: NavLinkItem = { to: "/test-close", label: "Close Link" };
    const closeMenuMock = vi.fn();

    renderNavLink({ item, closeMenu: closeMenuMock });

    const link = screen.getByRole("link", { name: /close link/i });
    fireEvent.click(link);
    expect(closeMenuMock).toHaveBeenCalledTimes(1);
  });
});
