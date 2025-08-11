import StorySection from "@/pages/eshop/pages/main-page/StorySection";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { navItems } from "@config/NavItems";

describe("StorySection - Unit Tests", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <StorySection />
      </MemoryRouter>,
    );
  });

  test("renders story section with heading, paragraph, and image", () => {
    expect(
      screen.getByRole("heading", { name: /our story/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("story-text")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Story Img");
  });

  test("renders button with correct text and link", () => {
    const storyLink = navItems.find((item) =>
      ["Our Story"].includes(item.label),
    );
    const linkTarget = `/#${storyLink?.sectionId ?? ""}`;
    const button = screen.getByRole("link", { name: /explore more/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", linkTarget);
  });
});
