import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { JSX } from "react";
import { useReservationForm } from "@/hooks/useReservationForm";
import { useTranslation } from "react-i18next";
import { Select } from "@headlessui/react";

/**
 * ReservationForm
 *
 * Form for creating a reservation, including name, email, date, time, and number of guests
 * Uses `useReservationForm` hook for state, validation, and submission
 *
 * @returns {JSX.Element}
 */
export default function ReservationForm(): JSX.Element {
  const {
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
    loadingReservation,
    setGuests,
  } = useReservationForm();

  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const localeMap: Record<string, string> = {
    en: "en-US",
    cs: "cs-CZ",
  };

  return (
    <div className="reservation-form-container">
      <form
        className="reservation-form"
        data-testid="reservation-form"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Fullname */}
        <div className="form-group">
          <label htmlFor="name">{t("reservation.form-name")}</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
          />
          {errors.name && (
            <div className="field-error-message">{errors.name}</div>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">{t("reservation.form-email")}</label>
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
          />
          {errors.email && (
            <div className="field-error-message">{errors.email}</div>
          )}
        </div>

        {/* Calendar */}
        <Calendar
          locale={localeMap[i18n.language]}
          value={selectedDate}
          onChange={(value) => {
            if (value instanceof Date) {
              setSelectedDate(value);
              setSelectedTime(null);
              setRemainingSeats(null);
              fetchReservations(value);
              setErrors((prev) => ({ ...prev, date: undefined }));
            }
          }}
          minDate={new Date()}
          selectRange={false}
        />

        {loadingReservation && (
          <div className="form-group">
            <div className="loading-message">
              <p>{t("reservation.form-loading-reservations")}</p>
            </div>
          </div>
        )}

        {errors.date && (
          <div className="form-group">
            <div className="field-error-message w-[80%]">{errors.date}</div>
          </div>
        )}

        {/* Time and guests */}
        {availableTimes.length > 0 && (
          <div className="form-group row-group">
            <div className="w-[50%]">
              <Select
                name="time"
                id="time-select"
                value={selectedTime ?? ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSelectedTime(e.target.value || null);
                  setErrors((prev) => ({
                    ...prev,
                    time: undefined,
                    datetime: undefined,
                  }));
                }}
                className="time-select"
              >
                <option value="">{t("reservation.form-time")}</option>
                {availableTimes.map((slot) => (
                  <option key={slot.iso} value={slot.iso}>
                    {slot.label} ({slot.remaining}{" "}
                    {t("reservation.form-seats-left")})
                  </option>
                ))}
              </Select>

              {errors.time && (
                <div className="field-error-message">{errors.time}</div>
              )}
              {errors.datetime && (
                <div className="field-error-message">{errors.datetime}</div>
              )}
            </div>

            {/* Guests Popover */}
            {selectedTime && (
              <div className="guests-container">
                <label htmlFor="guests-select">
                  {t("reservation.form-seats")}
                </label>
                <Select
                  name="guests"
                  id="guests-select"
                  value={form.guests}
                  onChange={(value) => setGuests(Number(value))}
                  className="w-full p-2 border-2 border-[#867A6E] font-slab text-left"
                >
                  {Array.from(
                    { length: remainingSeats || MAX_CAPACITY },
                    (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ),
                  )}
                </Select>

                {errors.guests && (
                  <div className="field-error-message">{errors.guests}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Submit button */}
        <div className="form-group">
          <button type="submit" disabled={loading} className="submit-button">
            {loading
              ? t("reservation.form-btn-loading")
              : t("reservation.form-btn")}
          </button>
        </div>

        {/* Success message */}
        {message && (
          <div className="form-group">
            <div className="message" data-testid="reservation-success">
              {message}
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="form-group">
            <div className="error-message" data-testid="reservation-error">
              {errorMessage}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
