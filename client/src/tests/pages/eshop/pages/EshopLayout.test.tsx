import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EshopLayout from "@/pages/eshop/pages/EshopLayout";

describe("EshopLayout - Unit Tests", () => {
  test("renders Header, Footer and Outlet", () => {
    render(
      <MemoryRouter>
        <EshopLayout />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(
      document.querySelector("main.eshop-main-wrapper"),
    ).toBeInTheDocument();
  });
});
