import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import reservationRouter from "./routes/reservations.routes";
import productRouter from "./routes/products.routes";
import newsletterRouter from "./routes/subscription.routes";
import ordersRouter from "./routes/orders.routes";
import emailRouter from "./routes/email.routes";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

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
app.use("/auth", emailRouter);

function startServer() {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT);
}

if (require.main === module) {
  startServer();
}

export default app;
