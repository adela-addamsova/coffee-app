import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import initializeDatabase from "@db/init-db";

import reservationRouter from "@routes/reservations.routes";
import productRoutes from "@routes/products.routes";
import newsletterRouter from "@routes/subscribtion.routes";
import ordersRouter from "@routes/orders.routes";

dotenv.config();

async function initDb() {
  try {
    await initializeDatabase();
  } catch (_err) {
    // Handle silently
  }
}

initDb();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/reservations", reservationRouter());
app.use("/api/products", productRoutes());
app.use("/api/subscribe", newsletterRouter());
app.use("/api/orders", ordersRouter());

function startServer() {
  const PORT = process.env.PORT || 5000;
}

if (require.main === module) {
  startServer();
}

export default app;
