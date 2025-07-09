import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { reservationSchema, MAX_CAPACITY } from '../../../shared/ReservationFormValidationSchema';
import { generateTimeSlots } from '../utils/reservationFormLogic';

const API_URL = 'http://localhost:5000/api';

/**
 * Custom hook: useReservationForm
 * 
 * Encapsulates the complete logic for handling a reservation form
 * Manages input states, performs validation, fetches and filters reservations, 
 * handles form submission, error messaging, and available time slots
 * 
 * @returns {object} An object containing:
 *   - form states and setters
 *   - available time slots
 *   - loading and error messaging
 *   - handlers for input change, form submission, and reservations fetching
 */
export function useReservationForm() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', guests: 1 });
    const [errors, setErrors] = useState({});
    const [remainingSeats, setRemainingSeats] = useState(null);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Handle input change event
     * Updates form state and clears any existing error for the changed field
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    /**
     * Fetch reservations from backend for given date
     * Filters results to match the selected day, then generates valid time slots
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

    /**
     * Updates remainingSeats whenever a new time slot is selected,
     * based on the availableTimes array
     */
    useEffect(() => {
        if (!selectedTime || !availableTimes.length) return;
        const slot = availableTimes.find((s) => s.iso === selectedTime);
        setRemainingSeats(slot?.remaining || null);
    }, [selectedTime, availableTimes]);

    /**
     * Handles form submission logic:
     * - Validates form using Zod schema
     * - Sends POST request to backend
     * - Displays success or error messages
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setErrors({});

        // Construct form payload
        const payload = {
            name: form.name.trim(),
            email: form.email.trim(),
            guests: Number(form.guests),
            guests: Number(form.guests),
            ...(selectedTime ? { datetime: selectedTime } : {}),
            remainingSeats,
        };

        // Validate with Zod
        const result = reservationSchema.safeParse(payload);

        if (!result.success) {
            const formatted = result.error.format();
            const newErrors = {
                name: formatted.name?._errors?.[0],
                email: formatted.email?._errors?.[0],
                guests: formatted.guests?._errors?.[0]
            };
            if (!selectedDate) newErrors.date = 'Please select a date';
            if (!selectedTime) newErrors.time = 'Please select a time';
            setErrors(newErrors);
            return;
        }
        
        // Prepare sanitized payload
        const sanitized = { ...payload };
        delete sanitized.remainingSeats;

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/reserve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sanitized),
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

    // All state and handlers used in the component
    return {
        selectedDate, setSelectedDate,
        availableTimes, selectedTime, setSelectedTime,
        form, errors, setErrors, message, errorMessage, loading,
        remainingSeats, setRemainingSeats,
        handleInputChange, handleSubmit,
        fetchReservations, MAX_CAPACITY
    };
}
