import InfoBoxes from "@components/InfoBoxes";
import { coffeeHouseData } from "@config/CoffeeHouseData";
import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { createTestI18n } from "../test-i18n";

let i18n: Awaited<ReturnType<typeof createTestI18n>>;

describe("InfoBoxes - Unit Tests", () => {
  beforeAll(async () => {
    i18n = await createTestI18n();
  });

  beforeEach(() => {
    render(
      <I18nextProvider i18n={i18n}>
        <InfoBoxes />
      </I18nextProvider>,
    );
  });

  test("renders all info box titles", () => {
    ["info-boxes.title-1", "info-boxes.title-2", "info-boxes.title-3"].forEach(
      (title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      },
    );
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
