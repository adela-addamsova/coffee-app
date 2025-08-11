import SocialIcons from "@components/SocialIcons";
import { render, screen } from "@testing-library/react";

describe("Social Icons - Unit Tests", () => {
  test("renders social icons with correct hrefs and attributes", () => {
    render(<SocialIcons />);

    const socialIconsContainer = screen.getByTestId("social-icons");
    expect(socialIconsContainer).toBeInTheDocument();

    const socialLinks = screen.getAllByRole("link");
    expect(socialLinks).toHaveLength(3);

    expect(socialLinks[0]).toHaveAttribute("href", "https://facebook.com");
    expect(socialLinks[1]).toHaveAttribute("href", "https://instagram.com");
    expect(socialLinks[2]).toHaveAttribute("href", "https://youtube.com");

    socialLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
