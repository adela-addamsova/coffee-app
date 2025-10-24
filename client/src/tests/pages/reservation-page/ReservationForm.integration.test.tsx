import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ReservationForm from "@/pages/reservation-page/ReservationForm";
import React, { useState } from "react";
import { I18nextProvider } from "react-i18next";
import { createTestI18n } from "../../test-i18n";

const date = new Date();
date.setDate(date.getDate() + 3);
date.setHours(10, 0, 0, 0);
const FUTURE_DATE_ISO = date.toISOString();

let simulateResponseError = false;
let simulateNetworkError = false;
let i18n: Awaited<ReturnType<typeof createTestI18n>>;

vi.mock("react-calendar", () => ({
  __esModule: true,
  default: (props: { onChange: (value: Date) => void }) => {
    const { onChange } = props;
    return (
      <div data-testid="calendar">
        <button
          data-testid="select-future-date"
          onClick={() => onChange(new Date(FUTURE_DATE_ISO))}
        >
          Select Future Date
        </button>
      </div>
    );
  },
}));

vi.mock("@/hooks/useReservationForm", () => ({
  useReservationForm: () => {
    const [form, setForm] = useState({ name: "", email: "", guests: "1" });
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [remainingSeats, setRemainingSeats] = useState(5);

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      await new Promise((r) => setTimeout(r, 100));

      if (simulateNetworkError) {
        setLoading(false);
        setErrorMessage("Server error.");
      } else if (simulateResponseError) {
        setLoading(false);
        setErrorMessage("Reservation failed.");
      } else {
        setLoading(false);
        setMessage("Reservation has been created successfully. Thank you!");
        setForm({ name: "", email: "", guests: "1" });
        setSelectedDate(null);
        setSelectedTime(null);
        setRemainingSeats(5);
      }
    };

    return {
      selectedDate,
      setSelectedDate,
      availableTimes: [
        { label: "10:00", iso: FUTURE_DATE_ISO, remaining: 5 },
        {
          label: "12:00",
          iso: new Date(new Date(date).setHours(12, 0, 0, 0)).toISOString(),
          remaining: 3,
        },
      ],
      selectedTime,
      setSelectedTime,
      form,
      errors,
      setErrors,
      message,
      errorMessage,
      loading,
      remainingSeats,
      setRemainingSeats,
      handleInputChange,
      handleSubmit,
      fetchReservations: () => {},
      MAX_CAPACITY: 10,
      loadingReservation: false,
    };
  },
}));

describe("ReservationForm - Integration tests", () => {
  beforeAll(async () => {
    i18n = await createTestI18n();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    simulateResponseError = false;
    simulateNetworkError = false;
  });

  async function fillAndPrepareReservationForm(
    user: ReturnType<typeof userEvent.setup>,
  ) {
    render(
      <I18nextProvider i18n={i18n}>
        <ReservationForm />
      </I18nextProvider>,
    );

    await user.type(screen.getByLabelText(/your name/i), "John Doe");
    await user.type(screen.getByLabelText(/your e-mail/i), "john@example.com");

    await user.click(screen.getByTestId("select-future-date"));

    const timeSelect = (await screen.findByRole("combobox", {
      name: /select time/i,
    })) as HTMLSelectElement;

    const firstOptionValue = timeSelect.options[1].value;
    fireEvent.change(timeSelect, { target: { value: firstOptionValue } });

    expect(timeSelect.value).toBe(firstOptionValue);

    await waitFor(() => {
      expect(screen.getByTestId("guests-input")).toBeInTheDocument();
    });

    const guestsInput = screen.getByTestId("guests-input");
    await user.type(guestsInput, "{selectall}{backspace}4");

    const submitButton = await screen.findByRole("button", {
      name: /make a reservation/i,
    });

    return { submitButton };
  }

  test("renders and submits successfully", async () => {
    const user = userEvent.setup();
    const { submitButton } = await fillAndPrepareReservationForm(user);

    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/submitting/i);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/reservation has been created successfully/i),
      ).toBeInTheDocument();
    });
  });

  test("shows response error message when server returns error", async () => {
    simulateResponseError = true;
    const user = userEvent.setup();
    const { submitButton } = await fillAndPrepareReservationForm(user);

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/reservation failed/i)).toBeInTheDocument();
    });
  });

  test("shows server error message when network fails", async () => {
    simulateNetworkError = true;
    const user = userEvent.setup();
    const { submitButton } = await fillAndPrepareReservationForm(user);

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });
});
