import LandingPage from "@/pages/home-page/LandingPage";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";

describe("LandingPage - Unit Tests", () => {
  test("renders layout with section components", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    const sectionsByTestID = [
      "header",
      "homepage-hero",
      "info-boxes",
      "hero-text-section",
      "story-scroll-section",
      "menu-section",
      "gallery-section",
      "reservation-section",
      "footer",
    ];

    sectionsByTestID.forEach((testId) => {
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  test("scrolls to section", () => {
    vi.useFakeTimers();
    const scrollTarget = document.createElement("div");
    scrollTarget.id = "hero-text-section";
    scrollTarget.scrollIntoView = vi.fn();
    document.body.appendChild(scrollTarget);

    vi.spyOn(window.history, "replaceState").mockImplementation(() => {});

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/", state: { scrollToId: "hero-text-section" } },
        ]}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>,
    );

    vi.runAllTimers();

    const target = document.getElementById("hero-text-section");
    expect(target?.scrollIntoView).toHaveBeenCalled();
    expect(window.history.replaceState).toHaveBeenCalledWith(
      {},
      document.title,
    );
  });
});
