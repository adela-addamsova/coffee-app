import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import initializeDatabase from "./db/init-db";

import reservationRouter from "./routes/reservations.routes";
import productRouter from "./routes/products.routes";
import newsletterRouter from "./routes/subscribtion.routes";
import ordersRouter from "./routes/orders.routes";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

async function initDb() {
  try {
    await initializeDatabase();
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
}

initDb();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [process.env.CLIENT_ORIGIN];

      const isVercelPreview =
        typeof origin === "string" &&
        origin.endsWith(".vercel.app") &&
        origin.includes("coffee-app-frontend");

      if (!origin) {
        callback(null, true);
      } else if (allowedOrigins.includes(origin) || isVercelPreview) {
        callback(null, true);
      } else {
        console.warn("Blocked CORS origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/reservations", reservationRouter());
app.use("/api/products", productRouter());
app.use("/api/subscribe", newsletterRouter());
app.use("/api/orders", ordersRouter());

function startServer() {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT);
}

if (require.main === module) {
  startServer();
}

export default app;
