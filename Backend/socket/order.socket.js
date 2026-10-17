import { getIO } from "./socket.js";

export const emitOrderStatusUpdate = ({ orderNumber, status, data = {} }) => {
  const io = getIO();

  io.to(`order:${orderNumber}`).emit("order:status-updated", {
    orderNumber,
    status,
    updatedAt: new Date().toISOString(),
    ...data,
  });
};

export const emitNewRestaurantOrder = ({ restaurantId, order }) => {
  const io = getIO();

  io.to(`restaurant:${restaurantId}`).emit("restaurant:new-order", order);
};

export const emitPlacedOrdersToRestaurants = (orders = []) => {
  for (const order of orders) {
    const {
      restaurantId,
      ...publicOrder
    } = order;

    if (!restaurantId) {
      console.error(
        "Restaurant socket skipped: restaurantId missing",
        order.orderNumber,
      );

      continue;
    }

    emitNewRestaurantOrder({
      restaurantId,
      order: {
        ...publicOrder,
        message: "You have received a new order",
      },
    });
  }
};

export const emitDeliveryOffer = ({ deliveryAgentPublicId, offer }) => {
  const io = getIO();

  io.to(`delivery-public:${deliveryAgentPublicId}`).emit(
    "delivery:new-offer",
    offer,
  );
};

export const emitDeliveryAssigned = ({ orderNumber, deliveryAgent }) => {
  const io = getIO();

  io.to(`order:${orderNumber}`).emit("delivery:assigned", {
    orderNumber,
    status: "DELIVERY_ASSIGNED",
    deliveryAgent,
    assignedAt: new Date().toISOString(),
  });
};

export const emitDeliveryLocation = ({
  orderNumber,
  latitude,
  longitude,
  updatedAt,
}) => {
  const io = getIO();

  io.to(`order:${orderNumber}`).emit("delivery:location-updated", {
    orderNumber,
    latitude: Number(latitude),
    longitude: Number(longitude),
    updatedAt: updatedAt || new Date().toISOString(),
  });
};

export const emitPaymentUpdate = ({
  orderNumber,
  paymentMethod,
  paymentStatus,
  paidAt = null,
}) => {
  const io = getIO();

  io.to(`order:${orderNumber}`).emit("payment:updated", {
    orderNumber,
    paymentMethod,
    paymentStatus,
    paidAt,
  });
};
