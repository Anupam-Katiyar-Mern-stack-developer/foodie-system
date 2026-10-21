import "dotenv/config";
import http from "http";
import app from "./app.js";

import { connectDatabase } from "./config/database.js";
import { initializeSocket } from "./socket/socket.js";
import { expireDeliveryOffersService } from "./services/delivery.service.js";
import { emitDeliveryOfferResponse } from "./socket/order.socket.js";
import { processOrderEmails } from "./services/notification.service.js";

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

initializeSocket(httpServer);

let expiryTimer;
let expiryStopped = false;

const checkExpiredOffers = async () => {
  try {
    const expiredOffers = await expireDeliveryOffersService();
    await processOrderEmails();

    for (const offer of expiredOffers) {
      try {
        emitDeliveryOfferResponse(offer);
      } catch (error) {
        console.error(
          "Delivery offer expiry socket error:",
          offer.assignmentId,
          error.message,
        );
      }
    }
  } catch (error) {
    console.error("Delivery offer expiry error:", error.message);
  } finally {
    if (!expiryStopped) {
      expiryTimer = setTimeout(checkExpiredOffers, 5000);
      expiryTimer.unref();
    }
  }
};

httpServer.on("close", () => {
  expiryStopped = true;
  clearTimeout(expiryTimer);
});

const startServer = async () => {
  try {
    await connectDatabase();

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      void checkExpiredOffers();
    });
  } catch (error) {
    console.error("Server start error:", error.message);
    process.exit(1);
  }
};

startServer();
