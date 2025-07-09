const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { getAllReservations, createReservationIfAvailable } = require('./reservation-db');
const { reservationSchema } = require('../shared/ReservationFormValidationSchema');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));
app.use(express.json());

/**
 * GET /api/reservations
 * Returns all reservations from the database.
 */
app.get('/api/reservations', (req, res) => {
  try {
    const reservations = getAllReservations();
    res.json(reservations);
  } catch (err) {
    console.error('GET /api/reservations error:', err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

/**
 * POST /api/reserve
 * Validates input with Zod and creates reservation if possible.
 */
app.post('/api/reserve', (req, res) => {
  const result = reservationSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.format();
    return res.status(400).json({
      message: 'Validation failed',
      errors,
    });
  }

  const { name, email, datetime, guests } = result.data;

  try {
    const success = createReservationIfAvailable(name, email, datetime, guests);
    if (!success) {
      return res.status(400).json({ message: 'Time slot already booked out' });
    }
    res.json({ message: 'Reservation successful' });
  } catch (err) {
    console.error('POST /api/reserve error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(process.env.PORT);
