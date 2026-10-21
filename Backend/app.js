import express from "express";
import { emailVerificationRoutes } from "./routes/emailVerification.routes.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import settingRoutes from "./routes/setting.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { paymentWebhook } from "./controllers/order/payment.controller.js";
import { IMAGE_ROOT } from "./utils/storage/imageStorage.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import addressRoutes from "./routes/address.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import categoryRoutes from "./routes/category.routes.js";

import publicRestaurantRoutes from "./routes/publicRestaurant.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";

import foodRoutes from "./routes/food.routes.js";
// app.js me import add karo

import passwordResetRoutes from "./routes/passwordReset.routes.js";
const app = express();

app.use("/images", cors(), express.static(IMAGE_ROOT));

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json", limit: "1mb" }),
  paymentWebhook
);
app.use(express.json());

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Foodie API is running",
  });
});

for (const [path, kind] of [
  ["user", "user"],
  ["restaurant", "restaurant"],
  ["delivery", "delivery"],
  ["admin", "admin"],
])
  app.use(`/api/${path}/email-verification`, emailVerificationRoutes(kind));

app.use("/api/user", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user/addresses", addressRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/restaurants", publicRestaurantRoutes);
app.use("/api/user/cart", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/foods", foodRoutes);

// app.js me routes mount karo

app.use("/api/auth", passwordResetRoutes);

//Error handler

app.use((error, req, res, next) => {
  console.log(error);

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

export default app;
