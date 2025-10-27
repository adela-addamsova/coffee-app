import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ChangeEvent, JSX } from "react";
import { useReservationForm } from "@/hooks/useReservationForm";
import { useTranslation } from "react-i18next";

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
            {/* Time select */}
            <div className="input-column">
              <select
                aria-label="Select time"
                value={selectedTime || ""}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setSelectedTime(e.target.value);
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
              </select>
              {errors.time && (
                <div className="field-error-message">{errors.time}</div>
              )}
              {errors.datetime && (
                <div className="field-error-message">{errors.datetime}</div>
              )}
            </div>

            {/* Guest input */}
            {selectedTime && (
              <div className="input-column flex items-center gap-2">
                <label htmlFor="guests">{t("reservation.form-seats")}</label>
                <input
                  id="guests"
                  name="guests"
                  type="number"
                  data-testid="guests-input"
                  min={1}
                  max={remainingSeats || MAX_CAPACITY}
                  value={form.guests}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.preventDefault()}
                />
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
