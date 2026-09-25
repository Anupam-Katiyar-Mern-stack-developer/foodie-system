import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import addressRoutes from "./routes/address.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import categoryRoutes from "./routes/category.routes.js";

import publicRestaurantRoutes from "./routes/publicRestaurant.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

app.use("/images", express.static(path.join(process.cwd(), "images")));

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

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user/addresses", addressRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/restaurants", publicRestaurantRoutes);
app.use("/api/user/cart", cartRoutes);
app.use("/api", orderRoutes);
//Error handler

app.use((error, req, res, next) => {
  console.log(error);

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

export default app;
