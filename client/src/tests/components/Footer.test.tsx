import Footer from "@components/Footer";
import { coffeeHouseData } from "@config/CoffeeHouseData";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { createTestI18n } from "../test-i18n";

let i18n: Awaited<ReturnType<typeof createTestI18n>>;

describe("Footer integration tests", () => {
  beforeAll(async () => {
    i18n = await createTestI18n();
  });

  beforeEach(() => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      </I18nextProvider>,
    );
  });

  test("renders footer navigation links", () => {
    expect(screen.getByText("E-shop")).toBeInTheDocument();
    expect(screen.getByText("Reservation")).toBeInTheDocument();
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  test("renders contact information", () => {
    expect(screen.getByText(coffeeHouseData.contact.phone)).toBeInTheDocument();
    expect(screen.getByText(coffeeHouseData.contact.email)).toBeInTheDocument();
  });

  test("renders address", () => {
    expect(
      screen.getByText(coffeeHouseData.address.street),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${coffeeHouseData.address.city}, ${coffeeHouseData.address.zip}`,
      ),
    ).toBeInTheDocument();
  });

  test("renders social icons", () => {
    expect(screen.getByTestId("social-icons")).toBeInTheDocument();
  });
});
