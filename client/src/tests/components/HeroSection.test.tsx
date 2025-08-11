import HeroSection, { type HeroSectionProps } from "@components/HeroSection";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

describe("HeroSection - Unit Tests", () => {
  const renderHero = (props: HeroSectionProps) => {
    return render(
      <MemoryRouter>
        <HeroSection {...props} />
      </MemoryRouter>,
    );
  };

  test("renders img element, headings and button with all props", () => {
    renderHero({
      imgSrc: "test-src",
      heading: "Test Heading",
      subheading: "Test Subheading",
      buttonText: "Hero Button",
      buttonHref: "/link",
      buttonColor: "black",
      className: "hero",
    });

    const heroSection = screen.getByTestId("hero-section");
    expect(heroSection).toHaveClass("hero-section hero");
    const heading = screen.getByRole("heading", { name: /test heading/i });
    const subheading = screen.getByText(/test subheading/i);
    const button = screen.getByText(/hero button/i);

    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "test-src");
    expect(img).toHaveAttribute("alt", heading.textContent);

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("hero-heading");

    expect(subheading).toBeInTheDocument();
    expect(subheading).toHaveClass("hero-subheading");

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/link");
    expect(button).toHaveClass("main-button black");
  });

  test("renders hero section without headings and button", () => {
    renderHero({ imgSrc: "test-src" });

    expect(screen.getByRole("img")).toHaveAttribute("alt", "Hero image");
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByText(/test subheading/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /hero button/i }),
    ).not.toBeInTheDocument();
  });

  test("renders hero section with headings and button but showTest false", () => {
    renderHero({
      imgSrc: "test-src",
      heading: "Test Heading",
      subheading: "Test Subheading",
      buttonText: "Hero Button",
      buttonHref: "/link",
      showText: false,
    });

    expect(screen.getByRole("img")).toHaveAttribute("alt", "Test Heading");
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByText(/test subheading/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /hero button/i }),
    ).not.toBeInTheDocument();
  });

  test("renders hero section with default button color", () => {
    renderHero({
      imgSrc: "test-src",
      buttonText: "Test Button",
      buttonHref: "/default",
    });

    const button = screen.getByRole("link", { name: /test button/i });
    expect(button).toHaveClass("main-button white");
    expect(button).toHaveAttribute("href", "/default");
  });
});
