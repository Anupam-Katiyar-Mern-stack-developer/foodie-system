// ==========================================================
// socket/deliveryTracking.socket.js
// ==========================================================

import pool from "../config/database.js";
import { updateDeliveryLocationService } from "../services/delivery.service.js";
import { emitDeliveryLocation } from "./order.socket.js";

export const registerDeliveryTrackingSocket = (socket) => {
  socket.on(
    "delivery:location:update",
    async ({ orderNumber, latitude, longitude }, callback) => {
      try {
        const deliveryAgentId = socket.user?.deliveryAgentId;

        if (socket.user?.role !== "deliveryAgent" || !deliveryAgentId) {
          return callback?.({
            success: false,
            message: "Only delivery agent can update location",
          });
        }

        if (!orderNumber) {
          return callback?.({
            success: false,
            message: "Order number is required",
          });
        }

        const lat = Number(latitude);
        const lng = Number(longitude);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          return callback?.({
            success: false,
            message: "Invalid latitude or longitude",
          });
        }

        const orderResult = await pool.query(
          `
            SELECT
              id,
              status
            FROM orders
            WHERE order_number = $1
              AND assigned_delivery_agent_id = $2
              AND status IN (
                'DELIVERY_ASSIGNED',
                'PICKED_UP',
                'OUT_FOR_DELIVERY'
              )
            LIMIT 1
          `,
          [orderNumber, deliveryAgentId],
        );

        if (orderResult.rows.length === 0) {
          return callback?.({
            success: false,
            message: "No active delivery found",
          });
        }

        const location = await updateDeliveryLocationService({
          deliveryAgentId,
          latitude: lat,
          longitude: lng,
        });

        emitDeliveryLocation({
          orderNumber,
          latitude: location.latitude,
          longitude: location.longitude,
          updatedAt: location.locationUpdatedAt,
        });

        return callback?.({
          success: true,
          message: "Location updated successfully",
          data: {
            orderNumber,
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
            updatedAt: location.locationUpdatedAt,
          },
        });
      } catch (error) {
        console.error("Delivery tracking socket error:", error.message);

        return callback?.({
          success: false,
          message: error.message || "Failed to update delivery location",
        });
      }
    },
  );
};
