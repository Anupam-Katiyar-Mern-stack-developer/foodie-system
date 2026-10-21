import {
  emitDeliveryOffer,
  emitDeliveryOfferResponse,
} from "../../socket/order.socket.js";
import {
  createRestaurantDeliveryOfferService,
  expireDeliveryOffersService,
} from "../../services/delivery.service.js";
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
    // Resend se pehle expired offers ke DB locks clear karo.
    const expiredOffers = await expireDeliveryOffersService();

    for (const expiredOffer of expiredOffers) {
      try {
        emitDeliveryOfferResponse(expiredOffer);
      } catch (socketError) {
        console.error(
          "Delivery offer expiry socket error:",
          expiredOffer.assignmentId,
          socketError.message,
        );
      }
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
