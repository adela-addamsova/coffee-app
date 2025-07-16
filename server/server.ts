import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import initializeDatabase from './db/init-db';
initializeDatabase();

import reservationRoutes from './routes/reservations.routes';
import productRoutes from './routes/products.routes';
import subscriptionRoutes from './routes/subscribtion.routes';

const app = express();

dotenv.config();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));
app.use(express.json());

app.use('/api/reservations', reservationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/subscribe', subscriptionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
