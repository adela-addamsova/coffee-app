const express = require('express');
const cors = require('cors');
const { getAllReservations, createReservationIfAvailable } = require('./reservation-db');

const app = express();
const port = 5000;

app.use(cors());
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
 * Tries to create a new reservation if capacity allows.
 */
app.post('/api/reserve', (req, res) => {
  const { name, email, datetime, guests } = req.body;

  if (!name || !email || !datetime || !guests) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const success = createReservationIfAvailable(name, email, datetime, guests);
    if (!success) {
      return res.status(400).json({ message: '⚠️ Time slot already booked out' });
    }
    res.json({ message: 'Reservation successful' });
  } catch (err) {
    console.error('POST /api/reserve error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port);