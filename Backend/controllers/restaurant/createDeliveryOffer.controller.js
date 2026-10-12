import { createRestaurantDeliveryOfferService } from "../../services/delivery.service.js";

export const createDeliveryOffer = async (req, res) => {
  try {
    const restaurantId = req.restaurant.restaurantId;

    const { orderNumber } = req.params;

    const { deliveryAgentPublicId } = req.body;

    if (!deliveryAgentPublicId) {
      return res.status(400).json({
        success: false,
        message: "Delivery agent is required",
      });
    }

    const data = await createRestaurantDeliveryOfferService({
      restaurantId,
      orderNumber,
      deliveryAgentPublicId,
    });

    return res.status(201).json({
      success: true,
      message: "Delivery offer sent successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to send delivery offer",
    });
  }
};
