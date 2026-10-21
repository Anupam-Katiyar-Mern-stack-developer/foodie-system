import { updateDeliveryLocationService } from "../../services/delivery.service.js";
import pool from "../../config/database.js";
import { emitDeliveryLocation } from "../../socket/order.socket.js";

export const updateDeliveryLocation = async (req, res, next) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    const { latitude, longitude } = req.body;

    const parsedLatitude = Number(latitude);

    const parsedLongitude = Number(longitude);

    if (
      latitude == null ||
      longitude == null ||
      String(latitude).trim() === "" ||
      String(longitude).trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    if (
      !Number.isFinite(parsedLatitude) ||
      parsedLatitude < -90 ||
      parsedLatitude > 90
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude is required",
      });
    }

    if (
      !Number.isFinite(parsedLongitude) ||
      parsedLongitude < -180 ||
      parsedLongitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid longitude is required",
      });
    }

    const location = await updateDeliveryLocationService({
      deliveryAgentId,

      latitude: parsedLatitude,

      longitude: parsedLongitude,
    });

    // Broadcast only to orders assigned to this authenticated agent.
    try {
      const { rows } = await pool.query(
        `
      SELECT order_number AS "orderNumber"
      FROM orders
      WHERE assigned_delivery_agent_id = $1
        AND status IN (
          'DELIVERY_ASSIGNED',
          'PICKED_UP',
          'OUT_FOR_DELIVERY'
        )
    `,
        [deliveryAgentId],
      );

      for (const order of rows) {
        emitDeliveryLocation({
          orderNumber: order.orderNumber,
          latitude: location.latitude,
          longitude: location.longitude,
          updatedAt: location.locationUpdatedAt,
        });
      }
    } catch (error) {
      console.error("Delivery location broadcast failed:", error.message);
    }

    return res.status(200).json({
      success: true,

      message: "Delivery location updated successfully",

      data: location,
    });
  } catch (error) {
    next(error);
  }
};
