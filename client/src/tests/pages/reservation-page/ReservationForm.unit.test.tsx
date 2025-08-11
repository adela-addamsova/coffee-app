import {
  getOpeningHours,
  generateTimeSlots,
} from "@/utils/reservationFormLogic";
import { render, screen, fireEvent } from "@testing-library/react";
import ReservationForm from "@/pages/reservation-page/ReservationForm";
import { useReservationForm } from "@/hooks/useReservationForm";
import { vi } from "vitest";

vi.mock("@/hooks/useReservationForm");

const mockedUseReservationForm = useReservationForm as unknown as jest.Mock;

const baseMockReturnValue = {
  selectedDate: new Date(),
  setSelectedDate: vi.fn(),
  availableTimes: [] as { iso: string; label: string; remaining: number }[],
  selectedTime: null as string | null,
  setSelectedTime: vi.fn(),
  form: {
    name: "",
    email: "",
    phone: "",
    guests: 1,
  },
  errors: {} as Record<string, string>,
  setErrors: vi.fn(),
  message: "",
  errorMessage: "",
  loading: false,
  remainingSeats: null as number | null,
  setRemainingSeats: vi.fn(),
  handleInputChange: vi.fn(),
  handleSubmit: vi.fn((e) => e.preventDefault()),
  fetchReservations: vi.fn(),
  MAX_CAPACITY: 10,
};

beforeEach(() => {
  mockedUseReservationForm.mockReturnValue({ ...baseMockReturnValue });
});

describe("getOpeningHours - Unit Tests", () => {
  test("returns 6–17 for weekdays", () => {
    const date = new Date("2025-08-06"); // Wednesday
    expect(getOpeningHours(date)).toEqual({ start: 6, end: 17 });
  });

  test("returns 7–17 for weekends", () => {
    const date = new Date("2025-08-03"); // Sunday
    expect(getOpeningHours(date)).toEqual({ start: 7, end: 17 });
  });
});

describe("generateTimeSlots - Unit Tests", () => {
  test("returns correct slots with no reservations", () => {
    const date = new Date("2025-08-06T00:00:00");
    const result = generateTimeSlots(date, [], 10);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("label");
    expect(result[0]).toHaveProperty("iso");
    expect(result[0]).toHaveProperty("remaining");
  });

  test("excludes fully booked slots", () => {
    const date = new Date("2025-08-06T00:00:00");
    const reservations = [
      { datetime: new Date("2025-08-06T09:00:00").toISOString(), guests: 10 },
    ];
    const result = generateTimeSlots(date, reservations, 10);
    expect(result.find((slot) => slot.label === "09:00")).toBeUndefined();
  });
});

describe("ReservationForm - Unit Tests", () => {
  test("renders all fields", () => {
    render(<ReservationForm />);
    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your E-mail/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /make a reservation/i }),
    ).toBeInTheDocument();
  });

  test("submits the form when clicked", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());

    mockedUseReservationForm.mockReturnValueOnce({
      ...baseMockReturnValue,
      handleSubmit,
    });

    render(<ReservationForm />);
    const button = screen.getByRole("button", { name: /make a reservation/i });
    fireEvent.click(button);
    expect(handleSubmit).toHaveBeenCalled();
  });

  test("shows validation error if provided by hook", () => {
    mockedUseReservationForm.mockReturnValueOnce({
      ...baseMockReturnValue,
      errors: { name: "Name is required" },
    });

    render(<ReservationForm />);
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });

  test("shows email error when passed in", () => {
    mockedUseReservationForm.mockReturnValueOnce({
      ...baseMockReturnValue,
      errors: { email: "Invalid email address" },
    });

    render(<ReservationForm />);
    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
  });

  test("shows date error when passed in", () => {
    mockedUseReservationForm.mockReturnValueOnce({
      ...baseMockReturnValue,
      errors: { date: "Please select a date" },
    });

    render(<ReservationForm />);
    expect(screen.getByText(/please select a date/i)).toBeInTheDocument();
  });

  test("renders calendar", () => {
    render(<ReservationForm />);
    const calendarElement = document.querySelector(".react-calendar");
    expect(calendarElement).toBeInTheDocument();
  });

  test("renders time select when availableTimes are provided", () => {
    mockedUseReservationForm.mockReturnValueOnce({
      ...baseMockReturnValue,
      availableTimes: [
        { iso: "2025-08-07T18:00:00", label: "6:00 PM", remaining: 3 },
      ],
    });

    render(<ReservationForm />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText(/6:00 PM \(3 seats left\)/i)).toBeInTheDocument();
  });

  test("shows time error when passed in", () => {
    mockedUseReservationForm.mockReturnValueOnce({
      ...baseMockReturnValue,
      errors: { time: "Please select a time" },
      availableTimes: [
        { iso: "2025-08-07T18:00:00", label: "6:00 PM", remaining: 3 },
      ],
    });

    render(<ReservationForm />);
    expect(screen.getByText(/please select a time/i)).toBeInTheDocument();
  });

  test("shows datetime error when passed in", () => {
    mockedUseReservationForm.mockReturnValueOnce({
      ...baseMockReturnValue,
      errors: { datetime: "Please select date and time" },
      availableTimes: [
        { iso: "2025-08-07T18:00:00", label: "6:00 PM", remaining: 3 },
      ],
    });

    render(<ReservationForm />);
    expect(
      screen.getByText(/please select date and time/i),
    ).toBeInTheDocument();
  });

  test("renders guest input only when selectedTime is set", () => {
    mockedUseReservationForm.mockReturnValueOnce({
      ...baseMockReturnValue,
      availableTimes: [
        { iso: "2025-08-07T18:00:00", label: "6:00 PM", remaining: 3 },
      ],
      selectedTime: "2025-08-07T18:00:00",
      form: { ...baseMockReturnValue.form, guests: 2 },
    });

    render(<ReservationForm />);
    expect(screen.getByLabelText(/guests/i)).toBeInTheDocument();
  });

  test("does not render guest input when selectedTime is null", () => {
    mockedUseReservationForm.mockReturnValueOnce({
      ...baseMockReturnValue,
      selectedTime: null,
    });

    render(<ReservationForm />);
    expect(screen.queryByLabelText(/guests/i)).not.toBeInTheDocument();
  });

  test("shows guest input error if provided", () => {
    mockedUseReservationForm.mockReturnValueOnce({
      ...baseMockReturnValue,
      errors: { guests: "Guest count is required" },
      availableTimes: [
        { iso: "2025-08-07T18:00:00", label: "6:00 PM", remaining: 3 },
      ],
      selectedTime: "2025-08-07T18:00:00",
    });

    render(<ReservationForm />);
    expect(screen.getByText(/guest count is required/i)).toBeInTheDocument();
  });

  test("shows success message when reservation is completed", () => {
    mockedUseReservationForm.mockReturnValueOnce({
      ...baseMockReturnValue,
      message: "Reservation has been created successfully. Thank you!",
    });

    render(<ReservationForm />);
    expect(
      screen.getByText(/reservation has been created successfully/i),
    ).toBeInTheDocument();
  });

  test("shows error message when reservation fails", () => {
    mockedUseReservationForm.mockReturnValueOnce({
      ...baseMockReturnValue,
      errorMessage: "Server error",
    });

    render(<ReservationForm />);
    expect(screen.getByText(/server error/i)).toBeInTheDocument();
  });

  test("disables submit button and shows loading text when loading is true", () => {
    mockedUseReservationForm.mockReturnValueOnce({
      ...baseMockReturnValue,
      loading: true,
    });

    render(<ReservationForm />);
    const button = screen.getByRole("button", { name: /submitting/i });
    expect(button).toBeDisabled();
  });
});
