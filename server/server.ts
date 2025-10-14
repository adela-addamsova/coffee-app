import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "@db/coffee-app-db";
import reservationRouter from "@routes/reservations.routes";
import productRoutes from "@routes/products.routes";
import newsletterRouter from "@routes/subscribtion.routes";
import ordersRouter from "@routes/orders.routes";
import initializeDatabase from "@db/init-db";

initializeDatabase(db);

const app = express();

dotenv.config();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/reservations", reservationRouter(db));
app.use("/api/products", productRoutes(db));
app.use("/api/subscribe", newsletterRouter(db));
app.use("/api/orders", ordersRouter(db));

function startServer() {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT);
}

if (require.main === module) {
  startServer();
}

export default app;
