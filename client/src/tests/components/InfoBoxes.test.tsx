import InfoBoxes from "@components/InfoBoxes";
import { coffeeHouseData } from "@config/CoffeeHouseData";
import { render, screen } from "@testing-library/react";

describe("InfoBoxes - Unit Tests", () => {
  beforeEach(() => {
    render(<InfoBoxes />);
  });

  test("renders all info box titles", () => {
    ["CONTACT", "OPENING HOURS", "LOCATION"].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test("renders contact information", () => {
    const { phone, email } = coffeeHouseData.contact;

    expect(screen.getByText(phone)).toBeInTheDocument();

    const emailLink = screen.getByRole("link", { name: email });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", `mailto:${email}`);
  });

  test("renders opening hours", () => {
    Object.values(coffeeHouseData.openingHours).forEach((data) => {
      expect(screen.getByText(data, { exact: false })).toBeInTheDocument();
    });
  });

  test("renders location", () => {
    Object.values(coffeeHouseData.address).forEach((data) => {
      expect(screen.getByText(data)).toBeInTheDocument();
    });
  });

  test("renders social icons", () => {
    const socialIcons = screen.getByTestId("social-icons");
    expect(socialIcons).toBeInTheDocument();
    expect(socialIcons).toHaveClass("social-icons");
  });
});
