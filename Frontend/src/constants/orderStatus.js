export const ORDER_STATUS = {
  PLACED: "PLACED",

  CONFIRMED: "CONFIRMED",

  PREPARING: "PREPARING",

  READY_FOR_PICKUP: "READY_FOR_PICKUP",

  DELIVERY_ASSIGNED: "DELIVERY_ASSIGNED",

  PICKED_UP: "PICKED_UP",

  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",

  DELIVERED: "DELIVERED",

  CANCELLED: "CANCELLED",
};

export const ACTIVE_ORDER_STATUSES = [
  ORDER_STATUS.PLACED,

  ORDER_STATUS.CONFIRMED,

  ORDER_STATUS.PREPARING,

  ORDER_STATUS.READY_FOR_PICKUP,

  ORDER_STATUS.DELIVERY_ASSIGNED,

  ORDER_STATUS.PICKED_UP,

  ORDER_STATUS.OUT_FOR_DELIVERY,
];

export const ORDER_STATUS_CONFIG = {
  PLACED: {
    label: "Placed",

    className: "bg-blue-50 text-blue-700 border-blue-200",
  },

  CONFIRMED: {
    label: "Confirmed",

    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },

  PREPARING: {
    label: "Preparing",

    className: "bg-amber-50 text-amber-700 border-amber-200",
  },

  READY_FOR_PICKUP: {
    label: "Ready for Pickup",

    className: "bg-orange-50 text-orange-700 border-orange-200",
  },

  DELIVERY_ASSIGNED: {
    label: "Delivery Assigned",

    className: "bg-purple-50 text-purple-700 border-purple-200",
  },

  PICKED_UP: {
    label: "Picked Up",

    className: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },

  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",

    className: "bg-orange-50 text-orange-700 border-orange-200",
  },

  DELIVERED: {
    label: "Delivered",

    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },

  CANCELLED: {
    label: "Cancelled",

    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export const getOrderStatusConfig = (status) => {
  return (
    ORDER_STATUS_CONFIG[status] || {
      label: status || "Unknown",

      className: "bg-slate-50 text-slate-600 border-slate-200",
    }
  );
};
