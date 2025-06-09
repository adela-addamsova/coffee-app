import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from 'react';
import {
    format,
    setHours,
    setMinutes,
    getDay,
    isToday,
    isBefore,
    addHours,
} from 'date-fns';
import './ReservationForm.css';

const MAX_CAPACITY = 10;
const API_URL = 'http://localhost:5000/api';

export default function ReservationForm() {
    /*
     * State hooks to manage selected date, time, form inputs,
     * available slots, loading status, and user feedback messages.
     */
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', guests: 1 });
    const [remainingSeats, setRemainingSeats] = useState(null);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    /*
     * Handle user input changes for the reservation form.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    /*
     * Get the opening hours based on the selected day of the week.
     * Weekends open at 7 AM, weekdays at 6 AM. All close at 5 PM.
     */
    const getOpeningHours = (date) => {
        const day = getDay(date);
        return day === 0 || day === 6 ? { start: 7, end: 17 } : { start: 6, end: 17 };
    };

    /*
     * Filter reservations that overlap with a given time slot.
     * Includes current and previous hour due to 2-hour blocks.
     */
    const getOverlappingReservations = (slotTime, reservations) => {
        return reservations.filter((r) => {
            const rTime = new Date(r.datetime);
            const rHour = format(rTime, 'yyyy-MM-dd HH:00');
            const slotHour = format(slotTime, 'yyyy-MM-dd HH:00');
            const previousHour = format(addHours(slotTime, -1), 'yyyy-MM-dd HH:00');
            return rHour === slotHour || rHour === previousHour;
        });
    };

    /*
     * Generate time slots available for reservation based on capacity,
     * overlapping reservations, and business hours.
     */
    const generateTimeSlots = (date, reservations) => {
        const { start, end } = getOpeningHours(date);
        const now = new Date();
        const slots = [];

        for (let hour = start; hour <= end - 2; hour++) {
            const slotTime = setMinutes(setHours(date, hour), 0);
            if (isToday(date) && isBefore(slotTime, now)) continue;

            const overlapping = getOverlappingReservations(slotTime, reservations);
            const totalGuests = overlapping.reduce((acc, r) => acc + r.guests, 0);

            if (totalGuests < MAX_CAPACITY) {
                slots.push({
                    label: format(slotTime, 'HH:00'),
                    iso: slotTime.toISOString(),
                    remaining: MAX_CAPACITY - totalGuests,
                });
            }
        }
        return slots;
    };

    /*
     * Fetch reservations from the API for the selected date
     * and generate available time slots.
     */
    const fetchReservations = async (date) => {
        try {
            const res = await fetch(`${API_URL}/reservations`);
            const data = await res.json();

            const filtered = data.filter(
                (r) => format(new Date(r.datetime), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
            );

            const slots = generateTimeSlots(date, filtered);
            setAvailableTimes(slots);
        } catch (err) {
            console.error('Error fetching reservations:', err);
        }
    };

    /*
     * When selected time or slots update, get the remaining seat count.
     */
    useEffect(() => {
        if (!selectedTime || !availableTimes.length) return;
        const slot = availableTimes.find((s) => s.iso === selectedTime);
        setRemainingSeats(slot?.remaining || null);
    }, [selectedTime, availableTimes]);

    /*
     * Basic email format validation using regex.
     */
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    /*
     * Handle form submission with validation and API call.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!selectedDate || !selectedTime) {
            return setErrorMessage('Select a date and time.');
        }

        if (!form.name.trim() || !form.email.trim()) {
            return setErrorMessage('Fill in all fields.');
        }

        if (!isValidEmail(form.email.trim())) {
            return setErrorMessage('Enter a valid email address.');
        }

        if (form.guests < 1 || form.guests > remainingSeats) {
            return setErrorMessage(`Guest count must be between 1 and ${remainingSeats}.`);
        }

        const payload = {
            name: form.name.trim(),
            email: form.email.trim(),
            datetime: selectedTime,
            guests: Number(form.guests),
        };

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/reserve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage('Reservation has been created successfully. Thank you!');
                setForm({ name: '', email: '', guests: 1 });
                setSelectedDate(null);
                setSelectedTime(null);
                setAvailableTimes([]);
                setRemainingSeats(null);
            } else {
                setErrorMessage(result.errorMessage || 'Reservation failed.');
            }
        } catch (err) {
            console.error('Error submitting reservation:', err);
            setErrorMessage('Server error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reservation-form-container">
            <form onSubmit={handleSubmit}>
                {/* Name Input */}
                <div className='form-group'>
                    <label htmlFor="name">Your Name</label>
                    <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Email Input */}
                <div className='form-group'>
                    <label htmlFor="email">Your E-mail</label>
                    <input
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Calendar Component */}
                <Calendar
                    locale="en-US"
                    value={selectedDate}
                    onChange={(date) => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                        setRemainingSeats(null);
                        fetchReservations(date);
                    }}
                    minDate={new Date()}
                />

                {/* Time & Guest Selection */}
                {availableTimes.length > 0 && (
                    <div className='form-group row-group'>
                        <select
                            value={selectedTime || ''}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            required
                            className='time-select'
                        >
                            <option value="">Select time</option>
                            {availableTimes.map((slot) => (
                                <option key={slot.iso} value={slot.iso}>
                                    {slot.label} ({slot.remaining} seats left)
                                </option>
                            ))}
                        </select>

                        {selectedTime && (
                            <div className='guest-input'>
                                <label htmlFor='guests'>Number of guests</label>
                                <input
                                    name="guests"
                                    type="number"
                                    min={1}
                                    max={remainingSeats || MAX_CAPACITY}
                                    value={form.guests}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <div className='form-group'>
                    <button
                        type="submit"
                        disabled={loading}
                        className='submit-button'
                    >
                        {loading ? 'Submitting...' : 'Make a reservation'}
                    </button>
                </div>

                {/* Success Message */}
                {message && (
                    <div className='form-group'>
                        <div className="message">{message}</div>
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className='form-group'>
                        <div className="error-message">{errorMessage}</div>
                    </div>
                )}
            </form>
        </div>
    );
}
