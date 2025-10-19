import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import initializeDatabase from "./db/init-db";

import reservationRouter from "./routes/reservations.routes";
import productRouter from "./routes/products.routes";
import newsletterRouter from "./routes/subscribtion.routes";
import ordersRouter from "./routes/orders.routes";

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
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_ORIGIN,
        "http://localhost:5173",
      ];

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

app.use((req, res, next) => {
  console.log("Request origin:", req.headers.origin);
  next();
});

app.use(express.json());

app.use("/api/reservations", reservationRouter());
app.use("/api/products", productRouter());
app.use("/api/subscribe", newsletterRouter());
app.use("/api/orders", ordersRouter());

function startServer() {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

export default app;
