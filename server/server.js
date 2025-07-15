const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { getAllReservations, createReservationIfAvailable, getLatestProducts, getAllProducts,
  getProductsByCategory, getProductById, insertNewsletterSubscriber, isEmailSubscribed } = require('./coffee-app-db');
const { reservationSchema } = require('../shared/ReservationFormValidationSchema');
const { newsletterSchema } = require('../shared/NewsletterValidationSchema');

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

/**
 * GET /api/products/latest
 * Returns the latest products from the database.
 */
app.get('/api/products/latest', (req, res) => {
  try {
    const products = getLatestProducts(4);
    res.json(products);
  } catch (err) {
    console.error('GET /api/products/latest error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products
 * Returns all products from the database.
 */
app.get('/api/products', (req, res) => {
  try {
    const products = getAllProducts();
    res.json(products);
  } catch (err) {
    console.error('GET /api/products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products/:category
 * Returns products for a specific category.
 */
app.get('/api/products/:category', (req, res) => {
  const { category } = req.params;

  try {
    const products = getProductsByCategory(category);
    res.json(products);
  } catch (err) {
    console.error(`GET /api/products/${category} error:`, err);
    res.status(500).json({ error: 'Failed to fetch category products' });
  }
});

/**
 * GET /api/products/:category/:id
 * Returns product with specific id
 */
app.get('/api/products/:category/:id', (req, res) => {
  const { category, id } = req.params;

  try {
    const product = getProductById(id, category);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(`GET /api/products/${category}/${id} error:`, err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

/**
 * POST /api/subscribe
 * Validates input with Zod and inserts a subscriber.
 */
app.post('/api/subscribe', (req, res) => {
  const parseResult = newsletterSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors[0].message });
  }

  const { email } = parseResult.data;
  const ip_address = req.ip;

  try {
    if (isEmailSubscribed(email)) {
      return res.status(409).json({ error: 'This email is already subscribed' });
    }

    const result = insertNewsletterSubscriber(email, ip_address);
    return res.status(201).json({ message: 'Subscription successful', id: result.lastInsertRowid });

  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(process.env.PORT);
