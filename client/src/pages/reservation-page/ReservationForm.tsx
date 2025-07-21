import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ChangeEvent, JSX } from 'react';
import { useReservationForm } from '../../hooks/useReservationForm';

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
        selectedDate, setSelectedDate,
        availableTimes, selectedTime, setSelectedTime,
        form, errors, setErrors, message, errorMessage, loading,
        remainingSeats, setRemainingSeats,
        handleInputChange, handleSubmit,
        fetchReservations, MAX_CAPACITY
    } = useReservationForm();

    return (
        <div className="reservation-form-container">
            <form className="reservation-form" onSubmit={handleSubmit} noValidate>
                {/* Fullname */}
                <div className='form-group'>
                    <label htmlFor="name">Your Name</label>
                    <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                    />
                    {errors.name && <div className="field-error-message">{errors.name}</div>}
                </div>

                {/* Email */}
                <div className='form-group'>
                    <label htmlFor="email">Your E-mail</label>
                    <input
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                    />
                    {errors.email && <div className="field-error-message">{errors.email}</div>}
                </div>

                {/* Calendar */}
                <Calendar
                    locale="en-US"
                    value={selectedDate}
                    onChange={(value, event) => {
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

                {errors.date && <div className="field-error-message w-[80%]">{errors.date}</div>}

                {/* Time and guests */}
                {availableTimes.length > 0 && (
                    <div className='form-group row-group'>
                        {/* Time select */}
                        <div className="input-column">
                            <select
                                value={selectedTime || ''}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                    setSelectedTime(e.target.value);
                                    setErrors((prev) => ({
                                        ...prev,
                                        time: undefined,
                                        datetime: undefined
                                    }));
                                }}
                                className='time-select'
                            >
                                <option value="">Select time</option>
                                {availableTimes.map((slot) => (
                                    <option key={slot.iso} value={slot.iso}>
                                        {slot.label} ({slot.remaining} seats left)
                                    </option>
                                ))}
                            </select>
                            {errors.time && <div className="field-error-message">{errors.time}</div>}
                            {errors.datetime && <div className="field-error-message">{errors.datetime}</div>}
                        </div>

                        {/* Guest input */}
                        {selectedTime && (
                            <div className="input-column">
                                <label htmlFor='guests'>Number of guests</label>
                                <input
                                    name="guests"
                                    type="number"
                                    min={1}
                                    max={remainingSeats || MAX_CAPACITY}
                                    value={form.guests}
                                    onChange={handleInputChange}
                                />
                                {errors.guests && <div className="field-error-message">{errors.guests}</div>}
                            </div>
                        )}
                    </div>
                )}

                {/* Submit button */}
                <div className='form-group'>
                    <button
                        type="submit"
                        disabled={loading}
                        className='submit-button'
                    >
                        {loading ? 'Submitting...' : 'Make a reservation'}
                    </button>
                </div>

                {/* Success message */}
                {message && (
                    <div className='form-group'>
                        <div className="message">{message}</div>
                    </div>
                )}

                {/* Error message */}
                {errorMessage && (
                    <div className='form-group'>
                        <div className="error-message">{errorMessage}</div>
                    </div>
                )}
            </form>
        </div>
    );
}
