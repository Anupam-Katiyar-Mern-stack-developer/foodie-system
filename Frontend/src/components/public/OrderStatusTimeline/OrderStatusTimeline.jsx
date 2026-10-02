import {
  FaCheck,
  FaClock,
  FaMotorcycle,
  FaStore,
  FaTimes,
  FaUtensils,
} from "react-icons/fa";

import {
  ORDER_STATUS,
} from "../../../constants/orderStatus";


const ORDER_FLOW = [
  {
    status:
      ORDER_STATUS.PLACED,

    label:
      "Order Placed",

    description:
      "Your order has been placed successfully.",

    icon:
      FaCheck,
  },

  {
    status:
      ORDER_STATUS.CONFIRMED,

    label:
      "Restaurant Confirmed",

    description:
      "The restaurant accepted your order.",

    icon:
      FaStore,
  },

  {
    status:
      ORDER_STATUS.PREPARING,

    label:
      "Preparing Food",

    description:
      "Your food is being prepared.",

    icon:
      FaUtensils,
  },

  {
    status:
      ORDER_STATUS.READY_FOR_PICKUP,

    label:
      "Ready for Pickup",

    description:
      "Your order is ready for the delivery agent.",

    icon:
      FaCheck,
  },

  {
    status:
      ORDER_STATUS.DELIVERY_ASSIGNED,

    label:
      "Delivery Assigned",

    description:
      "A delivery agent has accepted your order.",

    icon:
      FaMotorcycle,
  },

  {
    status:
      ORDER_STATUS.PICKED_UP,

    label:
      "Order Picked Up",

    description:
      "The delivery agent has collected your food.",

    icon:
      FaMotorcycle,
  },

  {
    status:
      ORDER_STATUS.OUT_FOR_DELIVERY,

    label:
      "Out for Delivery",

    description:
      "Your order is on the way.",

    icon:
      FaMotorcycle,
  },

  {
    status:
      ORDER_STATUS.DELIVERED,

    label:
      "Delivered",

    description:
      "Your order has been delivered.",

    icon:
      FaCheck,
  },
];


const OrderStatusTimeline = ({
  status,
}) => {
  // =========================
  // CANCELLED
  // =========================

  if (
    status ===
    ORDER_STATUS.CANCELLED
  ) {
    return (
      <div
        className="
          rounded-2xl

          border
          border-rose-200

          bg-rose-50

          p-4
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          <span
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center

              rounded-full

              bg-rose-500

              text-white
            "
          >
            <FaTimes />
          </span>


          <div>
            <h3
              className="
                text-sm
                font-black
                text-rose-800
              "
            >
              Order Cancelled
            </h3>

            <p
              className="
                mt-1

                text-xs
                leading-5
                text-rose-600
              "
            >
              This order is no longer
              active.
            </p>
          </div>
        </div>
      </div>
    );
  }


  const currentIndex =
    ORDER_FLOW.findIndex(
      (step) =>
        step.status === status
    );


  return (
    <div
      className="
        space-y-0
      "
    >
      {ORDER_FLOW.map(
        (
          step,
          index
        ) => {
          const Icon =
            step.icon;


          const completed =
            currentIndex >
            index;


          const current =
            currentIndex ===
            index;


          const pending =
            index >
            currentIndex;


          const last =
            index ===
            ORDER_FLOW.length -
              1;


          return (
            <div
              key={
                step.status
              }

              className="
                relative

                flex
                gap-4
              "
            >
              {/* LINE */}

              {!last && (
                <div
                  className={`
                    absolute

                    left-[19px]
                    top-10

                    h-[calc(100%-16px)]
                    w-[2px]

                    ${
                      completed
                        ? "bg-emerald-400"
                        : "bg-slate-200"
                    }
                  `}
                />
              )}


              {/* ICON */}

              <span
                className={`
                  relative
                  z-10

                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  border-2

                  transition

                  ${
                    completed
                      ? `
                        border-emerald-500
                        bg-emerald-500
                        text-white
                      `
                      : current
                        ? `
                          border-orange-500
                          bg-orange-500
                          text-white

                          shadow-lg
                          shadow-orange-500/20
                        `
                        : `
                          border-slate-200
                          bg-white
                          text-slate-300
                        `
                  }
                `}
              >
                {completed ? (
                  <FaCheck
                    className="
                      h-3
                      w-3
                    "
                  />
                ) : current ? (
                  <Icon
                    className="
                      h-3.5
                      w-3.5
                    "
                  />
                ) : (
                  <FaClock
                    className="
                      h-3
                      w-3
                    "
                  />
                )}
              </span>


              {/* CONTENT */}

              <div
                className={`
                  min-w-0
                  flex-1

                  pb-7

                  ${
                    pending
                      ? "opacity-45"
                      : ""
                  }
                `}
              >
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <h3
                    className="
                      text-sm
                      font-black
                      text-slate-950
                    "
                  >
                    {
                      step.label
                    }
                  </h3>


                  {current && (
                    <span
                      className="
                        rounded-full

                        bg-orange-100

                        px-2
                        py-0.5

                        text-[9px]
                        font-black
                        uppercase
                        tracking-wide
                        text-orange-700
                      "
                    >
                      Current
                    </span>
                  )}


                  {completed && (
                    <span
                      className="
                        text-[10px]
                        font-bold
                        text-emerald-600
                      "
                    >
                      Completed
                    </span>
                  )}
                </div>


                <p
                  className="
                    mt-1

                    text-xs
                    leading-5
                    text-slate-500
                  "
                >
                  {
                    step.description
                  }
                </p>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};


export default OrderStatusTimeline;