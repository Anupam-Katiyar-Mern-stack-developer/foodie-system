import { updateDeliveryLocationService } from "../../services/delivery.service.js";

export const updateDeliveryLocation = async (req, res, next) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    const { latitude, longitude } = req.body;

    const parsedLatitude = Number(latitude);

    const parsedLongitude = Number(longitude);

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

    return res.status(200).json({
      success: true,

      message: "Delivery location updated successfully",

      data: location,
    });
  } catch (error) {
    next(error);
  }
};
