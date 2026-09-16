import dotenv from "dotenv";
import app from "./app.js";

import { connectDatabase } from "./config/database.js";

const PORT = process.env.PORT || 5000;
dotenv.config();

const startServer = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Foodie server running on port ${PORT}`);
  });
};

startServer();
