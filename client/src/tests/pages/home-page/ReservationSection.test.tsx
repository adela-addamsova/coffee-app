import ReservationSection from "@/pages/home-page/ReservationSection";
import { screen, render, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("ReservationSection Component - Unit Tests", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <ReservationSection />
      </MemoryRouter>,
    );
  });

  test("renders section with image, test, and button", () => {
    const reservationSection = screen.getByTestId("reservation-section");
    expect(reservationSection).toBeInTheDocument();
    expect(reservationSection).toHaveClass("reservation-section");

    const image = within(reservationSection).getByRole("img", {
      name: /reservation phone/i,
    });
    expect(image).toBeInTheDocument();
    const text = within(reservationSection).getByTestId("reservation-text");
    expect(text).toBeInTheDocument();
    const button = within(text).getByRole("link", { name: /reservation/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/reservation");
    expect(button).toHaveClass("main-button black");
  });
});

describe("ReservationSection Component - Integration Tests", () => {
  test("navigates to reservation page on button click", async () => {
    const user = userEvent.setup();
    const ReservationPage = () => (
      <div data-testid="reservation-page">Reservation Page</div>
    );

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<ReservationSection />} />
          <Route path="/reservation" element={<ReservationPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const button = screen.getByRole("link", { name: /reservation/i });
    await user.click(button);
    expect(screen.getByTestId("reservation-page")).toBeInTheDocument();
  });
});
