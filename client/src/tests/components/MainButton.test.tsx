import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import MainButton from "@components/MainButton";
import * as navigationFunctions from "@/utils/navigationFunctions";
import { describe, expect, test, vi } from "vitest";

describe("MainButton - Unit Tests", () => {
  test("renders btn link as React Router Link when `to` prop is provided", () => {
    render(
      <MemoryRouter>
        <MainButton text="Home" to="/home" />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/home");
  });

  test("renders btn link as anchor <a> with href when `href` is provided", () => {
    render(
      <MemoryRouter>
        <MainButton text="External Link" href="https://test.com" />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /external link/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://test.com");
  });

  test("renders btn link as anchor <a> with section item and calls handleNavigation on click", async () => {
    const user = userEvent.setup();
    const mockHandleNavigation = vi
      .spyOn(navigationFunctions, "handleNavigation")
      .mockImplementation(() => {});

    const section = { sectionId: "section" };

    render(
      <MemoryRouter>
        <MainButton text="Scroll Link" item={section} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /scroll link/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#section");

    await user.click(link);
    expect(mockHandleNavigation).toHaveBeenCalled();

    mockHandleNavigation.mockRestore();
  });

  test("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <MemoryRouter>
        <MainButton text="Click Me" href="/something" onClick={onClick} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /click me/i });
    await user.click(link);
    expect(onClick).toHaveBeenCalled();
  });

  test("applies default className without color", () => {
    render(
      <MemoryRouter>
        <MainButton text="Button" href="/some" />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /button/i });
    expect(link).toHaveClass("main-button");
  });

  test("renders btn fallback anchor when no `to`, `href`, or `item` is provided", () => {
    render(
      <MemoryRouter>
        <MainButton text="Button" />
      </MemoryRouter>,
    );

    const link = screen.getByText(/button/i);
    expect(link).toBeInTheDocument();
    expect(link.tagName.toLowerCase()).toBe("a");
  });
});
