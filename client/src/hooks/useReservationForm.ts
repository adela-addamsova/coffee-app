import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { format } from "date-fns";
import {
  reservationSchema,
  MAX_CAPACITY,
} from "@shared/ReservationFormValidationSchema";
import { generateTimeSlots } from "@/utils/reservationFormLogic";

const API_URL = import.meta.env.VITE_API_URL as string;

interface ApiReservation {
  datetime: string;
  guests?: number;
}

type FormState = {
  name: string;
  email: string;
  guests: number;
};

type Errors = {
  name?: string;
  email?: string;
  guests?: string;
  date?: string;
  time?: string;
  datetime?: string;
};

type TimeSlot = {
  iso: string;
  label: string;
  remaining: number;
};

/**
 * React hook to manage reservation form state, validation, and submission.
 *
 * Handles date and time selection, form input changes, error tracking,
 * fetching existing reservations, generating available time slots, and submitting
 * new reservations to the backend.
 *
 * @returns {{
 *   selectedDate: Date | null,
 *   setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>,
 *   availableTimes: TimeSlot[],
 *   selectedTime: string | null,
 *   setSelectedTime: React.Dispatch<React.SetStateAction<string | null>>,
 *   form: FormState,
 *   errors: Errors,
 *   setErrors: React.Dispatch<React.SetStateAction<Errors>>,
 *   message: string,
 *   errorMessage: string,
 *   loading: boolean,
 *   remainingSeats: number | null,
 *   setRemainingSeats: React.Dispatch<React.SetStateAction<number | null>>,
 *   handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
 *   handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>,
 *   fetchReservations: (date: Date) => Promise<void>,
 *   MAX_CAPACITY: number,
 * }}
 */

export function useReservationForm(): {
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  availableTimes: TimeSlot[];
  selectedTime: string | null;
  setSelectedTime: React.Dispatch<React.SetStateAction<string | null>>;
  form: FormState;
  errors: Errors;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
  message: string;
  errorMessage: string;
  loading: boolean;
  remainingSeats: number | null;
  setRemainingSeats: React.Dispatch<React.SetStateAction<number | null>>;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  fetchReservations: (date: Date) => Promise<void>;
  MAX_CAPACITY: number;
} {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    guests: 1,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [remainingSeats, setRemainingSeats] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const fetchReservations = async (date: Date) => {
    try {
      const res = await fetch(`${API_URL}/reservations`);
      const data: ApiReservation[] = await res.json();

      const filtered = data.filter(
        (r) =>
          format(new Date(r.datetime), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd"),
      );

      const normalized = filtered.map((r) => ({
        ...r,
        guests: r.guests ?? 0,
      }));

      const slots = generateTimeSlots(date, normalized);
      setAvailableTimes(slots);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
  };

  useEffect(() => {
    if (!selectedTime || availableTimes.length === 0) return;
    const slot = availableTimes.find((s) => s.iso === selectedTime);
    setRemainingSeats(slot?.remaining ?? null);
  }, [selectedTime, availableTimes]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setErrors({});

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      guests: Number(form.guests),
      ...(selectedTime ? { datetime: selectedTime } : {}),
      remainingSeats,
    };

    const result = reservationSchema.safeParse(payload);

    if (!result.success) {
      const formatted = result.error.format();
      const newErrors: Errors = {
        name: formatted.name?._errors?.[0],
        email: formatted.email?._errors?.[0],
        guests: formatted.guests?._errors?.[0],
      };
      if (!selectedDate) newErrors.date = "Please select a date";
      if (!selectedTime) newErrors.time = "Please select a time";
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/reservations/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Reservation has been created successfully. Thank you!");
        setForm({ name: "", email: "", guests: 1 });
        setSelectedDate(null);
        setSelectedTime(null);
        setAvailableTimes([]);
        setRemainingSeats(null);
      } else {
        setErrorMessage(result.errorMessage || "Reservation failed.");
      }
    } catch (err) {
      console.error("Error submitting reservation:", err);
      setErrorMessage("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    availableTimes,
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
    MAX_CAPACITY,
  };
}
