import {
  format,
  setHours,
  setMinutes,
  getDay,
  isToday,
  isBefore,
  addHours,
} from 'date-fns';

// Reservation type
type Reservation = {
  datetime: string;
  guests: number;
};

// Time slot type
type TimeSlot = {
  label: string;
  iso: string;
  remaining: number;
};

/**
 * Returns opening hours based on the day of the week.
 * 
 * @param {Date} date - Date to determine opening hours for
 * @returns {Object} Object with `start` and `end` hours
 *   - Weekdays: 6:00–17:00
 *   - Weekends: 7:00–17:00
 */
export const getOpeningHours = (date: Date): { start: number; end: number } => {
  const day = getDay(date);
  return day === 0 || day === 6 ? { start: 7, end: 17 } : { start: 6, end: 17 };
};

/**
 * Filters reservations that overlap with a 2-hour block:
 * the target hour and the previous one.
 * 
 * @param {Date} slotTime - The time slot being checked
 * @param {Array} reservations - All reservations for the selected date
 * @returns {Array} Reservations that fall into the 2-hour window
 */
export const getOverlappingReservations = (
  slotTime: Date,
  reservations: Reservation[]
): Reservation[] => {
  return reservations.filter((r) => {
    const rTime = new Date(r.datetime);
    const rHour = format(rTime, 'yyyy-MM-dd HH:00');
    const slotHour = format(slotTime, 'yyyy-MM-dd HH:00');
    const previousHour = format(addHours(slotTime, -1), 'yyyy-MM-dd HH:00');
    return rHour === slotHour || rHour === previousHour;
  });
};

/**
 * Generates all valid time slots for a given date
 * Each slot is 2 hours long and skipped if already fully booked
 * 
 * @param {Date} date - The day to generate slots for
 * @param {Array} reservations - Existing reservations for that day
 * @param {number} maxCapacity - Max number of guests per slot (default 10)
 * @returns {Array} Array of available slot objects with:
 *   - `label`: formatted hour (e.g. "09:00")
 *   - `iso`: ISO string for internal comparison/submission
 *   - `remaining`: number of remaining seats
 */
export const generateTimeSlots = (
  date: Date,
  reservations: Reservation[],
  maxCapacity: number = 10
): TimeSlot[] => {
  const { start, end } = getOpeningHours(date);
  const now = new Date();
  const slots: TimeSlot[] = [];

  for (let hour = start; hour <= end - 2; hour++) {
    const slotTime = setMinutes(setHours(date, hour), 0);
    if (isToday(date) && isBefore(slotTime, now)) continue;

    const overlapping = getOverlappingReservations(slotTime, reservations);
    const totalGuests = overlapping.reduce((acc, r) => acc + r.guests, 0);

    if (totalGuests < maxCapacity) {
      slots.push({
        label: format(slotTime, 'HH:00'),
        iso: slotTime.toISOString(),
        remaining: maxCapacity - totalGuests,
      });
    }
  }
  return slots;
};
