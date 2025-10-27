import {
  getOpeningHours,
  generateTimeSlots,
} from "@/utils/reservationFormLogic";
import { render, screen, fireEvent } from "@testing-library/react";
import ReservationForm from "@/pages/reservation-page/ReservationForm";
import { useReservationForm } from "@/hooks/useReservationForm";
import { vi, type Mock } from "vitest";
import { I18nextProvider } from "react-i18next";
import { createTestI18n } from "../../test-i18n";

let i18n: Awaited<ReturnType<typeof createTestI18n>>;

vi.mock("@/hooks/useReservationForm");
const mockedUseReservationForm = useReservationForm as unknown as jest.Mock;

const baseMockReturnValue = {
  selectedDate: new Date(),
  setSelectedDate: vi.fn(),
  availableTimes: [],
  selectedTime: null,
  setSelectedTime: vi.fn(),
  form: { name: "", email: "", phone: "", guests: 1 },
  errors: {},
  setErrors: vi.fn(),
  message: "",
  errorMessage: "",
  loading: false,
  remainingSeats: null,
  setRemainingSeats: vi.fn(),
  handleInputChange: vi.fn(),
  handleSubmit: vi.fn((e) => e.preventDefault()),
  fetchReservations: vi.fn(),
  MAX_CAPACITY: 10,
};

const renderForm = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <ReservationForm />
    </I18nextProvider>,
  );

const withMockedForm = (overrides = {}) =>
  mockedUseReservationForm.mockReturnValueOnce({
    ...baseMockReturnValue,
    ...overrides,
  });

beforeEach(async () => {
  global.fetch = vi.fn() as Mock;
  i18n = await createTestI18n();
  mockedUseReservationForm.mockReturnValue({ ...baseMockReturnValue });
});

describe("getOpeningHours", () => {
  test("returns 6–17 for weekdays", () => {
    expect(getOpeningHours(new Date("2025-08-06"))).toEqual({
      start: 6,
      end: 17,
    });
  });

  test("returns 7–17 for weekends", () => {
    expect(getOpeningHours(new Date("2025-08-03"))).toEqual({
      start: 7,
      end: 17,
    });
  });
});

describe("generateTimeSlots", () => {
  test("returns correct slots with no reservations", () => {
    const result = generateTimeSlots(new Date("2025-08-06"), [], 10);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toMatchObject({
      label: expect.any(String),
      iso: expect.any(String),
      remaining: expect.any(Number),
    });
  });

  test("excludes fully booked slots", () => {
    const reservations = [
      { datetime: new Date("2025-08-06T09:00:00").toISOString(), guests: 10 },
    ];
    const result = generateTimeSlots(new Date("2025-08-06"), reservations, 10);
    expect(result.find((slot) => slot.label === "09:00")).toBeUndefined();
  });
});

describe("ReservationForm", () => {
  test("renders all fields", () => {
    renderForm();
    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your E-mail/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /make a reservation/i }),
    ).toBeInTheDocument();
  });

  test("submits the form when clicked", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    withMockedForm({ handleSubmit });
    renderForm();
    fireEvent.click(
      screen.getByRole("button", { name: /make a reservation/i }),
    );
    expect(handleSubmit).toHaveBeenCalled();
  });

  test.each([
    ["name", /name is required/i],
    ["email", /invalid email address/i],
    ["date", /please select a date/i],
    ["time", /please select a time/i],
    ["datetime", /please select date and time/i],
    ["guests", /guest count is required/i],
  ])("shows %s error when passed in", (field, message) => {
    withMockedForm({
      errors: { [field]: message.source },
      availableTimes: [
        { iso: "2025-08-07T18:00:00", label: "6:00 PM", remaining: 3 },
      ],
      selectedTime: "2025-08-07T18:00:00",
    });
    renderForm();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test("renders calendar", () => {
    renderForm();
    expect(document.querySelector(".react-calendar")).toBeInTheDocument();
  });

  test("renders time select when availableTimes are provided", () => {
    withMockedForm({
      availableTimes: [
        { iso: "2025-08-07T18:00:00", label: "6:00 PM", remaining: 3 },
      ],
    });
    renderForm();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText(/6:00 PM \(3 seats left\)/i)).toBeInTheDocument();
  });

  test("renders guest input only when selectedTime is set", () => {
    withMockedForm({
      selectedTime: "2025-08-07T18:00:00",
      availableTimes: [
        { iso: "2025-08-07T18:00:00", label: "6:00 PM", remaining: 3 },
      ],
    });
    renderForm();
    expect(screen.getByLabelText(/guests/i)).toBeInTheDocument();
  });

  test("does not render guest input when selectedTime is null", () => {
    withMockedForm({ selectedTime: null });
    renderForm();
    expect(screen.queryByLabelText(/guests/i)).not.toBeInTheDocument();
  });

  test("shows success message when reservation is completed", () => {
    withMockedForm({
      message: "Reservation has been created successfully. Thank you!",
    });
    renderForm();
    expect(
      screen.getByText(/reservation has been created successfully/i),
    ).toBeInTheDocument();
  });

  test("shows error message when reservation fails", () => {
    withMockedForm({ errorMessage: "Server error" });
    renderForm();
    expect(screen.getByText(/server error/i)).toBeInTheDocument();
  });

  test("disables submit button and shows loading text when loading is true", () => {
    withMockedForm({ loading: true });
    renderForm();
    const button = screen.getByRole("button", { name: /submitting/i });
    expect(button).toBeDisabled();
  });
});
