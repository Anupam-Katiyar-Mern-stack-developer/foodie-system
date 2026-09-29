import "dotenv/config";

import http from "http";

import app from "./app.js";

import { connectDatabase } from "./config/database.js";

import { intializeSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

// Express app ko HTTP server me wrap
const httpServer = http.createServer(app);

// Socket.IO initialize
intializeSocket(httpServer);

const startServer = async () => {
  try {
    await connectDatabase();

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server start error:", error.message);

    process.exit(1);
  }
};

startServer();
