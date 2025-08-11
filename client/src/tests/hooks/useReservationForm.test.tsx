import { vi, Mock } from "vitest";
vi.stubEnv("VITE_API_URL", "http://mock-api.com");

import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useReservationForm } from "@/hooks/useReservationForm";
import * as reservationLogic from "@/utils/reservationFormLogic";
import * as validationSchema from "@shared/ReservationFormValidationSchema";

vi.mock("@/utils/reservationFormLogic", () => ({
  generateTimeSlots: vi.fn(),
}));

vi.mock("@shared/ReservationFormValidationSchema", () => ({
  reservationSchema: {
    safeParse: vi.fn(),
  },
  MAX_CAPACITY: 10,
}));

describe("useReservationForm - Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  test("updates form state on input change", () => {
    const { result } = renderHook(() => useReservationForm());

    act(() => {
      result.current.handleInputChange({
        target: { name: "name", value: "Alice" },
      } as Partial<
        React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      > as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
    });

    expect(result.current.form.name).toBe("Alice");
  });

  test("validates and sets errors on submit with empty fields", async () => {
    (
      validationSchema.reservationSchema.safeParse as unknown as Mock
    ).mockReturnValueOnce({
      success: false,
      error: {
        format: () => ({
          name: { _errors: ["Name required"] },
          email: { _errors: ["Email invalid"] },
          guests: { _errors: ["Guests invalid"] },
        }),
      },
    });

    const { result } = renderHook(() => useReservationForm());

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: () => {},
      } as Partial<
        React.FormEvent<HTMLFormElement>
      > as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errors.name).toBe("Name required");
    expect(result.current.errors.email).toBe("Email invalid");
    expect(result.current.errors.guests).toBe("Guests invalid");
    expect(result.current.errors.date).toBe("Please select a date");
    expect(result.current.errors.time).toBe("Please select a time");
  });

  test("fetchReservations fetches data and sets availableTimes", async () => {
    const mockReservations = [
      { datetime: "2025-08-10T10:00:00Z", guests: 2 },
      { datetime: "2025-08-10T12:00:00Z", guests: 1 },
    ];
    (global.fetch as unknown as Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockReservations),
    });

    (reservationLogic.generateTimeSlots as unknown as Mock).mockReturnValue([
      { iso: "2025-08-10T10:00:00Z", label: "10:00", remaining: 3 },
      { iso: "2025-08-10T12:00:00Z", label: "12:00", remaining: 5 },
    ]);

    const { result } = renderHook(() => useReservationForm());

    await act(async () => {
      await result.current.fetchReservations(new Date("2025-08-10"));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://mock-api.com/reservations",
    );
    expect(result.current.availableTimes).toHaveLength(2);
  });

  test("updates remainingSeats when selectedTime or availableTimes change", async () => {
    const mockReservations = [{ datetime: "2025-08-10T10:00:00Z", guests: 2 }];
    (global.fetch as unknown as Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockReservations),
    });

    (reservationLogic.generateTimeSlots as unknown as Mock).mockReturnValue([
      { iso: "2025-08-10T10:00:00Z", label: "10:00", remaining: 3 },
    ]);

    const { result } = renderHook(() => useReservationForm());

    await act(async () => {
      await result.current.fetchReservations(new Date("2025-08-10"));
    });

    act(() => {
      result.current.setSelectedTime("2025-08-10T10:00:00Z");
    });

    expect(result.current.remainingSeats).toBe(3);
  });

  test("handleSubmit submits successfully and resets form", async () => {
    (
      validationSchema.reservationSchema.safeParse as unknown as Mock
    ).mockReturnValueOnce({
      success: true,
      data: {},
    });

    (global.fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const { result } = renderHook(() => useReservationForm());

    act(() => {
      result.current.setSelectedDate(new Date("2025-08-10"));
      result.current.setSelectedTime("2025-08-10T10:00:00Z");

      result.current.handleInputChange({
        target: { name: "name", value: "John" },
      } as Partial<
        React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      > as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);

      result.current.handleInputChange({
        target: { name: "email", value: "john@example.com" },
      } as Partial<
        React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      > as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);

      result.current.handleInputChange({
        target: { name: "guests", value: "2" },
      } as Partial<
        React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      > as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: () => {},
      } as Partial<
        React.FormEvent<HTMLFormElement>
      > as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.message).toBe(
      "Reservation has been created successfully. Thank you!",
    );
    expect(result.current.errorMessage).toBe("");
    expect(result.current.loading).toBe(false);
    expect(result.current.form.name).toBe("");
    expect(result.current.form.email).toBe("");
    expect(result.current.form.guests).toBe(1);
    expect(result.current.selectedDate).toBeNull();
    expect(result.current.selectedTime).toBeNull();
    expect(result.current.availableTimes).toEqual([]);
    expect(result.current.remainingSeats).toBeNull();
  });

  test("handleSubmit sets errorMessage on API error response", async () => {
    (
      validationSchema.reservationSchema.safeParse as unknown as Mock
    ).mockReturnValueOnce({
      success: true,
      data: {},
    });

    (global.fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ errorMessage: "Reservation failed" }),
    });

    const { result } = renderHook(() => useReservationForm());

    act(() => {
      result.current.setSelectedDate(new Date("2025-08-10"));
      result.current.setSelectedTime("2025-08-10T10:00:00Z");

      result.current.handleInputChange({
        target: { name: "name", value: "John" },
      } as Partial<
        React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      > as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);

      result.current.handleInputChange({
        target: { name: "email", value: "john@example.com" },
      } as Partial<
        React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      > as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);

      result.current.handleInputChange({
        target: { name: "guests", value: "2" },
      } as Partial<
        React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      > as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: () => {},
      } as Partial<
        React.FormEvent<HTMLFormElement>
      > as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errorMessage).toBe("Reservation failed");
    expect(result.current.message).toBe("");
    expect(result.current.loading).toBe(false);
  });

  test("handleSubmit sets server error on fetch failure", async () => {
    (
      validationSchema.reservationSchema.safeParse as unknown as Mock
    ).mockReturnValueOnce({
      success: true,
      data: {},
    });

    (global.fetch as unknown as Mock).mockRejectedValueOnce(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useReservationForm());

    act(() => {
      result.current.setSelectedDate(new Date("2025-08-10"));
      result.current.setSelectedTime("2025-08-10T10:00:00Z");

      result.current.handleInputChange({
        target: { name: "name", value: "John" },
      } as Partial<
        React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      > as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);

      result.current.handleInputChange({
        target: { name: "email", value: "john@example.com" },
      } as Partial<
        React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      > as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);

      result.current.handleInputChange({
        target: { name: "guests", value: "2" },
      } as Partial<
        React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      > as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: () => {},
      } as Partial<
        React.FormEvent<HTMLFormElement>
      > as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errorMessage).toBe("Server error.");
    expect(result.current.message).toBe("");
    expect(result.current.loading).toBe(false);
  });
});
