import { render, screen } from "@testing-library/react";
import HeroTextSection from "@/pages/home-page/HeroTextSection";

describe("HeroTextSection - Unit Tests", () => {
  test("renders hero text section with heading, text, and image", () => {
    render(<HeroTextSection />);

    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByTestId("hero-text-description")).toBeInTheDocument();
    expect(screen.getByAltText("Coffee Sack")).toBeInTheDocument();
  });
});
