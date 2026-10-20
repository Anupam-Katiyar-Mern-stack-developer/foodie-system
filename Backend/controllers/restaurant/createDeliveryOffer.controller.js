import { createRestaurantDeliveryOfferService } from "../../services/delivery.service.js";
import { emitDeliveryOffer } from "../../socket/order.socket.js";

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

    try {
      emitDeliveryOffer({
        deliveryAgentPublicId: data.deliveryAgent.publicId,
        offer: {
          orderNumber: data.orderNumber,
          ...data.offer,
        },
      });
    } catch (socketError) {
      // Offer database mein save ho chuka hai.
      console.error("Delivery offer socket error:", socketError.message);
    }

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
