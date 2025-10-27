import StorySection from "@/pages/eshop/pages/main-page/StorySection";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { navItems } from "@config/NavItems";
import { CartProvider } from "@/pages/eshop/pages/cart/CartContext";
import { I18nextProvider } from "react-i18next";
import { createTestI18n } from "../../../../test-i18n";

describe("StorySection - Unit Tests", () => {
  beforeEach(async () => {
    const i18n = await createTestI18n();

    render(
      <I18nextProvider i18n={i18n}>
        <CartProvider>
          <MemoryRouter>
            <StorySection />
          </MemoryRouter>
        </CartProvider>
      </I18nextProvider>,
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
      ["data.nav-items.ourStory"].includes(item.label),
    );
    const linkTarget = `/#${storyLink?.sectionId ?? ""}`;
    const button = screen.getByRole("link", { name: /explore more/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", linkTarget);
  });
});
