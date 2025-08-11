import ReservationPage from "@/pages/reservation-page/ReservationPage";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

describe("ReservationPage - Unit Tests", () => {
  test("renders all sections", () => {
    render(
      <MemoryRouter>
        <ReservationPage />
      </MemoryRouter>,
    );

    const sectionsByTestID = [
      "header",
      "footer",
      "reservation-page-hero",
      "reservation-page-container",
      "reservation-form",
    ];

    sectionsByTestID.forEach((testId) => {
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    const heroSection = screen.getByTestId("hero-section");
    expect(within(heroSection).getByText("Reservation")).toBeInTheDocument();
    expect(
      within(heroSection).getByRole("img", { name: /reservation/i }),
    ).toBeInTheDocument();
  });
});
