import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ReservationForm from "@/pages/reservation-page/ReservationForm";
import React, { useState } from "react";

const date = new Date();
date.setDate(date.getDate() + 3);
date.setHours(10, 0, 0, 0);
const FUTURE_DATE_ISO = date.toISOString();

let simulateResponseError = false;
let simulateNetworkError = false;

vi.mock("react-calendar", () => {
  return {
    __esModule: true,
    default: (props: { onChange: (value: Date) => void }) => {
      const onChange = props.onChange;

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
  };
});

vi.mock("@/hooks/useReservationForm", () => {
  return {
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
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      };

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
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
        }, 100);
      };

      const fetchReservations = () => {};

      return {
        selectedDate,
        setSelectedDate,
        availableTimes: [
          {
            label: "10:00",
            iso: FUTURE_DATE_ISO,
            remaining: 5,
          },
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
        fetchReservations,
        MAX_CAPACITY: 10,
      };
    },
  };
});

describe("ReservationForm - Integration tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    simulateResponseError = false;
    simulateNetworkError = false;
  });

  async function fillAndPrepareReservationForm(
    user: ReturnType<typeof userEvent.setup>,
  ) {
    render(<ReservationForm />);

    const nameInput = screen.getByLabelText(/your name/i) as HTMLInputElement;
    await user.type(nameInput, "John Doe");
    expect(nameInput.value).toBe("John Doe");

    const emailInput = screen.getByLabelText(
      /your e-mail/i,
    ) as HTMLInputElement;
    await user.type(emailInput, "john@example.com");
    expect(emailInput.value).toBe("john@example.com");

    const selectDateBtn = screen.getByTestId("select-future-date");
    await user.click(selectDateBtn);

    const timeSelect = (await screen.findByRole("combobox", {
      name: /select time/i,
    })) as HTMLSelectElement;
    expect(timeSelect).toBeInTheDocument();

    await user.selectOptions(timeSelect, "2025-08-14T08:00:00.000Z");
    await user.selectOptions(timeSelect, "2025-08-14T08:00:00.000Z");

    const guestsInput = (await screen.findByLabelText(
      /guests/i,
    )) as HTMLInputElement;
    expect(guestsInput.value).toBe("1");

    await user.clear(guestsInput);
    await user.type(guestsInput, "4");
    expect(guestsInput.value).toBe("4");

    const submitButton = await screen.findByRole("button", {
      name: /make a reservation/i,
    });
    return { submitButton };
  }

  test("renders and submits successfully", async () => {
    const user = userEvent.setup();

    const { submitButton } = await fillAndPrepareReservationForm(user);
    expect(submitButton).not.toBeDisabled();

    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/submitting.../i);

    await waitFor(() => {
      const successMessage = screen.getByTestId("reservation-success");

      expect(successMessage).toBeInTheDocument();

      expect(successMessage).toHaveTextContent(
        "Reservation has been created successfully. Thank you!",
      );
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

    await fillAndPrepareReservationForm(user);

    const submitButton = screen.getByRole("button", {
      name: /make a reservation/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });
});
