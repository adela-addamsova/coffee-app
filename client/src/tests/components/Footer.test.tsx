import Footer from "@components/Footer";
import { coffeeHouseData } from "@config/CoffeeHouseData";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

describe("Footer integration tests", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
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
    expect(screen.getByText(coffeeHouseData.address.city)).toBeInTheDocument();
    expect(screen.getByText(coffeeHouseData.address.zip)).toBeInTheDocument();
  });

  test("renders social icons", () => {
    expect(screen.getByTestId("social-icons")).toBeInTheDocument();
  });
});
