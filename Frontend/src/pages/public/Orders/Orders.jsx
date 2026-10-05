import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  FaBox,
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaMotorcycle,
  FaPhoneAlt,
  FaReceipt,
  FaRedo,
  FaStore,
  FaSyncAlt,
  FaTimesCircle,
  FaUtensils,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";

import LiveTrackingMap from "../../../components/public/LiveTrackingMap/LiveTrackingMap";

import {
  getMyOrders,
} from "../../../redux/thunks/public/order.thunk";


// ======================================================
// STATUS
// ======================================================

const STATUS = {
  PLACED: {
    label:
      "Order Placed",

    description:
      "Restaurant has received your order.",
  },

  ACCEPTED: {
    label:
      "Accepted",

    description:
      "Restaurant accepted your order.",
  },

  PREPARING: {
    label:
      "Preparing",

    description:
      "Your food is being prepared.",
  },

  READY: {
    label:
      "Ready",

    description:
      "Your order is ready for pickup.",
  },

  OUT_FOR_DELIVERY: {
    label:
      "Out for delivery",

    description:
      "Your delivery partner is on the way.",
  },

  DELIVERED: {
    label:
      "Delivered",

    description:
      "Your order has been delivered.",
  },

  CANCELLED: {
    label:
      "Cancelled",

    description:
      "This order was cancelled.",
  },
};


const TIMELINE = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];


const ACTIVE_STATUSES =
  [
    "PLACED",
    "ACCEPTED",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
  ];


// ======================================================
// HELPERS
// ======================================================

const normalizeStatus = (
  status
) => {
  return String(
    status || ""
  )
    .trim()
    .toUpperCase()
    .replaceAll(
      " ",
      "_"
    );
};


const formatPrice = (
  amount
) => {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style:
        "currency",

      currency:
        "INR",

      maximumFractionDigits:
        2,
    }
  ).format(
    Number(
      amount || 0
    )
  );
};


const formatDate = (
  value
) => {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    }
  ).format(
    new Date(value)
  );
};


// ======================================================
// STATUS BADGE
// ======================================================

const StatusBadge = ({
  status,
}) => {
  const value =
    normalizeStatus(
      status
    );


  const className =
    value ===
    "DELIVERED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"

      : value ===
          "CANCELLED"
        ? "border-rose-200 bg-rose-50 text-rose-700"

        : "border-orange-200 bg-orange-50 text-orange-700";


  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2

        rounded-full

        border

        px-3
        py-1.5

        text-xs
        font-black

        ${className}
      `}
    >
      {value ===
      "DELIVERED" ? (
        <FaCheckCircle />
      ) : value ===
        "CANCELLED" ? (
        <FaTimesCircle />
      ) : (
        <FaClock />
      )}

      {
        STATUS[value]
          ?.label ||
        status
      }
    </span>
  );
};


// ======================================================
// TIMELINE
// ======================================================

const OrderTimeline = ({
  status,
}) => {
  const currentStatus =
    normalizeStatus(
      status
    );


  if (
    currentStatus ===
    "CANCELLED"
  ) {
    return (
      <div
        className="
          rounded-2xl

          border
          border-rose-200

          bg-rose-50

          p-4

          text-sm
          font-bold
          text-rose-700
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <FaTimesCircle />

          Order cancelled
        </div>
      </div>
    );
  }


  const currentIndex =
    TIMELINE.indexOf(
      currentStatus
    );


  return (
    <div
      className="
        overflow-x-auto
        pb-2

        [scrollbar-width:none]

        [&::-webkit-scrollbar]:hidden
      "
    >
      <div
        className="
          flex
          min-w-[720px]
        "
      >
        {TIMELINE.map(
          (
            step,
            index
          ) => {
            const done =
              index <=
              currentIndex;

            return (
              <div
                key={step}
                className="
                  relative
                  flex
                  flex-1
                  flex-col
                  items-center
                "
              >
                {index !==
                  0 && (
                  <div
                    className={`
                      absolute
                      right-1/2
                      top-[17px]

                      h-0.5
                      w-full

                      ${
                        index <=
                        currentIndex
                          ? "bg-orange-500"
                          : "bg-slate-200"
                      }
                    `}
                  />
                )}


                <div
                  className={`
                    relative
                    z-10

                    flex
                    h-9
                    w-9

                    items-center
                    justify-center

                    rounded-full

                    border-2

                    ${
                      done
                        ? `
                          border-orange-500
                          bg-orange-500
                          text-white
                        `
                        : `
                          border-slate-200
                          bg-white
                          text-slate-400
                        `
                    }
                  `}
                >
                  {done ? (
                    <FaCheck />
                  ) : (
                    index +
                    1
                  )}
                </div>


                <p
                  className={`
                    mt-2

                    text-center
                    text-xs
                    font-bold

                    ${
                      done
                        ? "text-slate-900"
                        : "text-slate-400"
                    }
                  `}
                >
                  {
                    STATUS[
                      step
                    ].label
                  }
                </p>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};


// ======================================================
// PRICE ROW
// ======================================================

const PriceRow = ({
  label,
  value,
  strong = false,
}) => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
      "
    >
      <span
        className={
          strong
            ? "font-black text-slate-900"
            : "text-slate-500"
        }
      >
        {label}
      </span>

      <span
        className={
          strong
            ? "text-lg font-black text-slate-950"
            : "font-bold text-slate-900"
        }
      >
        {formatPrice(
          value
        )}
      </span>
    </div>
  );
};


// ======================================================
// ACTIVE ORDER
// ======================================================

const ActiveOrderDetails = ({
  order,
}) => {
  if (!order) {
    return null;
  }


  const status =
    normalizeStatus(
      order.status
    );


  const items =
    Array.isArray(
      order.items
    )
      ? order.items
      : [];


  const address =
    order.deliveryAddress ||
    {
      addressLine:
        order.addressLine,

      city:
        order.city,

      state:
        order.state,

      pincode:
        order.pincode,
    };


  const deliveryAgent =
    order.deliveryAgent ||
    null;


  return (
    <div
      className="
        space-y-6
      "
    >
      {/* =====================================
          ORDER HERO
      ====================================== */}

      <section
        className="
          overflow-hidden

          rounded-[2rem]

          bg-slate-950

          p-5

          text-white

          shadow-xl
          shadow-slate-950/10

          sm:p-7
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5

            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div>
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <span
                className="
                  rounded-full

                  bg-white/10

                  px-3
                  py-1.5

                  text-xs
                  font-bold
                  text-white
                "
              >
                #
                {
                  order.orderNumber
                }
              </span>

              <span
                className="
                  rounded-full

                  bg-orange-500/20

                  px-3
                  py-1.5

                  text-xs
                  font-black
                  text-orange-300
                "
              >
                {
                  STATUS[
                    status
                  ]?.label
                }
              </span>
            </div>


            <h1
              className="
                mt-5

                text-2xl
                font-black
                tracking-tight

                sm:text-3xl
              "
            >
              {
                order.restaurantName
              }
            </h1>


            <p
              className="
                mt-2
                text-sm
                text-slate-300
              "
            >
              {
                STATUS[
                  status
                ]?.description
              }
            </p>


            {order.createdAt && (
              <div
                className="
                  mt-4

                  flex
                  items-center
                  gap-2

                  text-xs
                  text-slate-400
                "
              >
                <FaClock />

                {formatDate(
                  order.createdAt
                )}
              </div>
            )}
          </div>


          {order.tracking
            ?.etaMinutes && (
            <div
              className="
                rounded-2xl

                bg-white/10

                px-5
                py-4

                backdrop-blur
              "
            >
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Estimated
                arrival
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-black
                  text-orange-400
                "
              >
                {
                  order
                    .tracking
                    .etaMinutes
                }{" "}
                min
              </p>
            </div>
          )}
        </div>
      </section>


      {/* =====================================
          MAP
      ====================================== */}

      <section>
        <div
          className="
            mb-4

            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.13em]
                text-orange-500
              "
            >
              Live delivery
            </p>

            <h2
              className="
                mt-1
                text-xl
                font-black
                text-slate-950

                sm:text-2xl
              "
            >
              Track your order
            </h2>
          </div>


          {status ===
            "OUT_FOR_DELIVERY" && (
            <span
              className="
                inline-flex
                items-center
                gap-2

                rounded-full

                bg-emerald-50

                px-3
                py-1.5

                text-xs
                font-black
                text-emerald-700
              "
            >
              <span
                className="
                  h-2
                  w-2

                  animate-pulse

                  rounded-full

                  bg-emerald-500
                "
              />

              LIVE
            </span>
          )}
        </div>


        <LiveTrackingMap
          tracking={
            order.tracking
          }
        />
      </section>


      {/* =====================================
          TIMELINE
      ====================================== */}

      <section
        className="
          rounded-[1.75rem]

          border
          border-slate-200

          bg-white

          p-5

          shadow-sm

          sm:p-6
        "
      >
        <h2
          className="
            text-lg
            font-black
            text-slate-950
          "
        >
          Order progress
        </h2>

        <p
          className="
            mt-1
            text-xs
            text-slate-500
          "
        >
          Your order status
          updates appear here.
        </p>


        <div
          className="
            mt-6
          "
        >
          <OrderTimeline
            status={
              status
            }
          />
        </div>
      </section>


      <div
        className="
          grid
          gap-6

          lg:grid-cols-[minmax(0,1fr)_360px]
          lg:items-start
        "
      >
        {/* =================================
            LEFT
        ================================== */}

        <div
          className="
            space-y-6
          "
        >
          {/* DELIVERY AGENT */}

          <section
            className="
              rounded-[1.75rem]

              border
              border-slate-200

              bg-white

              p-5

              shadow-sm

              sm:p-6
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center

                  rounded-xl

                  bg-orange-100

                  text-orange-600
                "
              >
                <FaMotorcycle />
              </span>


              <div>
                <h2
                  className="
                    font-black
                    text-slate-950
                  "
                >
                  Delivery
                  partner
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-500
                  "
                >
                  Assigned
                  delivery person
                </p>
              </div>
            </div>


            {deliveryAgent ? (
              <div
                className="
                  mt-5

                  flex
                  flex-col
                  gap-4

                  rounded-2xl

                  bg-slate-50

                  p-4

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  <p
                    className="
                      font-black
                      text-slate-950
                    "
                  >
                    {
                      deliveryAgent.name
                    }
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                    "
                  >
                    {
                      deliveryAgent.vehicleType
                    }

                    {deliveryAgent.vehicleNumber &&
                      ` • ${deliveryAgent.vehicleNumber}`}
                  </p>
                </div>


                {deliveryAgent.phone && (
                  <a
                    href={`tel:${deliveryAgent.phone}`}
                    className="
                      inline-flex
                      min-h-10
                      items-center
                      justify-center
                      gap-2

                      rounded-xl

                      bg-slate-950

                      px-4

                      text-xs
                      font-bold
                      text-white
                    "
                  >
                    <FaPhoneAlt />

                    Call
                  </a>
                )}
              </div>
            ) : (
              <div
                className="
                  mt-5

                  rounded-2xl

                  bg-slate-50

                  p-4

                  text-sm
                  text-slate-500
                "
              >
                Delivery partner
                has not been
                assigned yet.
              </div>
            )}
          </section>


          {/* ITEMS */}

          <section
            className="
              rounded-[1.75rem]

              border
              border-slate-200

              bg-white

              p-5

              shadow-sm

              sm:p-6
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <FaUtensils
                className="
                  text-orange-500
                "
              />

              <h2
                className="
                  text-lg
                  font-black
                  text-slate-950
                "
              >
                Order items
              </h2>
            </div>


            {items.length >
            0 ? (
              <div
                className="
                  mt-5
                  divide-y
                  divide-slate-100
                "
              >
                {items.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.foodSlug ||
                        item.slug ||
                        index
                      }
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4

                        py-4

                        first:pt-0
                        last:pb-0
                      "
                    >
                      <div
                        className="
                          min-w-0
                        "
                      >
                        <p
                          className="
                            truncate
                            text-sm
                            font-black
                            text-slate-900
                          "
                        >
                          {item.foodName ||
                            item.name}
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-500
                          "
                        >
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>
                      </div>


                      <p
                        className="
                          shrink-0
                          font-black
                          text-slate-950
                        "
                      >
                        {formatPrice(
                          item.itemTotal ??
                            Number(
                              item.price ||
                                0
                            ) *
                              Number(
                                item.quantity ||
                                  0
                              )
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p
                className="
                  mt-5

                  rounded-xl

                  bg-slate-50

                  p-4

                  text-sm
                  text-slate-500
                "
              >
                Food item details
                are not available
                in the order API
                yet.
              </p>
            )}
          </section>


          {/* ADDRESS */}

          <section
            className="
              rounded-[1.75rem]

              border
              border-slate-200

              bg-white

              p-5

              shadow-sm

              sm:p-6
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
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  bg-orange-100

                  text-orange-600
                "
              >
                <FaMapMarkerAlt />
              </span>


              <div>
                <h2
                  className="
                    font-black
                    text-slate-950
                  "
                >
                  Delivery address
                </h2>


                {address
                  ?.addressLine ? (
                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-slate-600
                    "
                  >
                    {
                      address.addressLine
                    }

                    {address.city &&
                      `, ${address.city}`}

                    {address.state &&
                      `, ${address.state}`}

                    {address.pincode &&
                      ` - ${address.pincode}`}
                  </p>
                ) : (
                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >
                    Address details
                    are not
                    available in
                    the order API
                    yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>


        {/* =================================
            RIGHT SUMMARY
        ================================== */}

        <aside
          className="
            space-y-6

            lg:sticky
            lg:top-28
          "
        >
          {/* PAYMENT */}

          <section
            className="
              rounded-[1.75rem]

              border
              border-slate-200

              bg-white

              p-5

              shadow-sm
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <FaMoneyBillWave
                className="
                  text-emerald-600
                "
              />

              <h2
                className="
                  font-black
                  text-slate-950
                "
              >
                Payment
              </h2>
            </div>


            <div
              className="
                mt-5
                space-y-4
                text-sm
              "
            >
              <div
                className="
                  flex
                  justify-between
                  gap-4
                "
              >
                <span
                  className="
                    text-slate-500
                  "
                >
                  Method
                </span>

                <span
                  className="
                    font-bold
                  "
                >
                  {
                    order.paymentMethod
                  }
                </span>
              </div>


              <div
                className="
                  flex
                  justify-between
                  gap-4
                "
              >
                <span
                  className="
                    text-slate-500
                  "
                >
                  Status
                </span>

                <span
                  className="
                    font-bold
                    text-orange-600
                  "
                >
                  {
                    order.paymentStatus
                  }
                </span>
              </div>


              {order.checkoutNumber && (
                <div
                  className="
                    border-t
                    border-slate-100
                    pt-4
                  "
                >
                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Checkout ID
                  </p>

                  <p
                    className="
                      mt-1
                      break-all

                      text-xs
                      font-bold
                      text-slate-700
                    "
                  >
                    {
                      order.checkoutNumber
                    }
                  </p>
                </div>
              )}
            </div>
          </section>


          {/* BILL */}

          <section
            className="
              rounded-[1.75rem]

              border
              border-slate-200

              bg-white

              p-5

              shadow-sm
            "
          >
            <h2
              className="
                font-black
                text-slate-950
              "
            >
              Bill details
            </h2>


            <div
              className="
                mt-5
                space-y-3
                text-sm
              "
            >
              <PriceRow
                label="Item total"
                value={
                  order.subtotal
                }
              />

              <PriceRow
                label="Delivery fee"
                value={
                  order.deliveryFee
                }
              />

              <PriceRow
                label="Taxes"
                value={
                  order.taxAmount
                }
              />


              <div
                className="
                  my-4
                  h-px
                  bg-slate-100
                "
              />


              <PriceRow
                label="Grand Total"
                value={
                  order.totalAmount
                }
                strong
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};


// ======================================================
// PREVIOUS ORDER CARD
// ======================================================

const PreviousOrderCard = ({
  order,
}) => {
  return (
    <article
      className="
        rounded-[1.5rem]

        border
        border-slate-200

        bg-white

        p-5

        shadow-sm
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center

              overflow-hidden
              rounded-xl

              bg-orange-50

              text-orange-500
            "
          >
            {order.restaurantLogo ? (
              <img
                src={
                  order.restaurantLogo
                }
                alt=""
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              <FaStore />
            )}
          </div>


          <div
            className="
              min-w-0
            "
          >
            <h3
              className="
                truncate
                font-black
                text-slate-950
              "
            >
              {
                order.restaurantName
              }
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              #
              {
                order.orderNumber
              }
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              {formatDate(
                order.createdAt
              )}
            </p>
          </div>
        </div>


        <div
          className="
            flex
            items-center
            justify-between
            gap-4

            sm:flex-col
            sm:items-end
          "
        >
          <StatusBadge
            status={
              order.status
            }
          />

          <p
            className="
              font-black
              text-slate-950
            "
          >
            {formatPrice(
              order.totalAmount
            )}
          </p>
        </div>
      </div>


      {order.restaurantSlug && (
        <div
          className="
            mt-4
            border-t
            border-slate-100
            pt-4
          "
        >
          <Link
            to={`/restaurants/${order.restaurantSlug}`}
            className="
              inline-flex
              items-center
              gap-2

              text-xs
              font-black
              text-orange-600
            "
          >
            <FaRedo />

            Order from this
            restaurant again
          </Link>
        </div>
      )}
    </article>
  );
};


// ======================================================
// PAGE
// ======================================================

const Orders = () => {
  const dispatch =
    useDispatch();


  const {
    orders = [],

    fetchLoading,

    error,
  } = useSelector(
    (state) =>
      state.publicOrder
  );


  const [
    selectedOrderNumber,
    setSelectedOrderNumber,
  ] = useState(null);


  // =========================
  // LOAD
  // =========================

  useEffect(() => {
    dispatch(
      getMyOrders()
    );
  }, [
    dispatch,
  ]);


  // =========================
  // SPLIT ORDERS
  // =========================

  const {
    activeOrders,
    previousOrders,
  } = useMemo(() => {
    const active = [];

    const previous =
      [];


    orders.forEach(
      (order) => {
        const status =
          normalizeStatus(
            order.status
          );


        if (
          ACTIVE_STATUSES.includes(
            status
          )
        ) {
          active.push(
            order
          );
        } else {
          previous.push(
            order
          );
        }
      }
    );


    active.sort(
      (a, b) =>
        new Date(
          b.createdAt
        ) -
        new Date(
          a.createdAt
        )
    );


    previous.sort(
      (a, b) =>
        new Date(
          b.createdAt
        ) -
        new Date(
          a.createdAt
        )
    );


    return {
      activeOrders:
        active,

      previousOrders:
        previous,
    };
  }, [
    orders,
  ]);


  // =========================
  // DEFAULT SELECTED ORDER
  // =========================

  useEffect(() => {
    if (
      activeOrders.length ===
      0
    ) {
      setSelectedOrderNumber(
        null
      );

      return;
    }


    const exists =
      activeOrders.some(
        (order) =>
          order.orderNumber ===
          selectedOrderNumber
      );


    if (!exists) {
      setSelectedOrderNumber(
        activeOrders[0]
          .orderNumber
      );
    }
  }, [
    activeOrders,
    selectedOrderNumber,
  ]);


  const selectedOrder =
    activeOrders.find(
      (order) =>
        order.orderNumber ===
        selectedOrderNumber
    ) ||
    activeOrders[0] ||
    null;


  // =========================
  // LOADING
  // =========================

  if (fetchLoading) {
    return (
      <main
        className="
          min-h-screen
          bg-[#fffaf5]
          py-10
        "
      >
        <Container>
          <Skeleton
            width="w-64"
            height="h-10"
          />

          <div
            className="
              mt-8
              space-y-6
            "
          >
            <Skeleton
              width="w-full"
              height="h-[220px]"
              rounded="rounded-[2rem]"
            />

            <Skeleton
              width="w-full"
              height="h-[430px]"
              rounded="rounded-[2rem]"
            />

            <Skeleton
              width="w-full"
              height="h-[300px]"
              rounded="rounded-[2rem]"
            />
          </div>
        </Container>
      </main>
    );
  }


  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <main
        className="
          min-h-[70vh]
          bg-[#fffaf5]
          py-14
        "
      >
        <Container>
          <ErrorState
            title="Unable to load orders"

            description={
              typeof error ===
              "string"
                ? error
                : "Something went wrong while loading your orders."
            }
          />
        </Container>
      </main>
    );
  }


  // =========================
  // PAGE
  // =========================

  return (
    <main
      className="
        min-h-screen
        bg-[#fffaf5]

        pb-16
      "
    >
      {/* =================================
          HEADER
      ================================== */}

      <section
        className="
          border-b
          border-orange-100

          bg-white
        "
      >
        <Container>
          <div
            className="
              flex
              flex-col
              gap-5

              py-8

              sm:flex-row
              sm:items-end
              sm:justify-between

              sm:py-10
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2

                  text-xs
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-orange-500
                "
              >
                <FaReceipt />

                My orders
              </div>


              <h1
                className="
                  mt-2

                  text-3xl
                  font-black
                  tracking-tight
                  text-slate-950

                  sm:text-4xl
                "
              >
                Orders &
                delivery
              </h1>


              <p
                className="
                  mt-2
                  max-w-xl

                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Track active
                deliveries in
                real time and
                access your
                previous orders.
              </p>
            </div>


            <button
              type="button"

              onClick={() =>
                dispatch(
                  getMyOrders()
                )
              }

              className="
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2

                rounded-xl

                border
                border-slate-200

                bg-white

                px-4

                text-sm
                font-bold
                text-slate-700

                hover:border-orange-200
                hover:text-orange-600
              "
            >
              <FaSyncAlt />

              Refresh
            </button>
          </div>
        </Container>
      </section>


      <Container>
        <div
          className="
            pt-8
            sm:pt-10
          "
        >
          {/* ============================
              ACTIVE ORDERS
          ============================= */}

          {activeOrders.length >
            0 && (
            <>
              <div
                className="
                  mb-5
                "
              >
                <h2
                  className="
                    text-xl
                    font-black
                    text-slate-950
                  "
                >
                  Active orders
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Select an order
                  to view live
                  delivery
                  progress.
                </p>
              </div>


              {/* ACTIVE ORDER TABS */}

              <div
                className="
                  mb-7

                  flex
                  gap-3

                  overflow-x-auto
                  pb-2

                  [scrollbar-width:none]

                  [&::-webkit-scrollbar]:hidden
                "
              >
                {activeOrders.map(
                  (
                    order
                  ) => {
                    const selected =
                      selectedOrderNumber ===
                      order.orderNumber;


                    return (
                      <button
                        key={
                          order.orderNumber
                        }

                        type="button"

                        onClick={() =>
                          setSelectedOrderNumber(
                            order.orderNumber
                          )
                        }

                        className={`
                          min-w-[230px]

                          rounded-2xl

                          border

                          p-4

                          text-left

                          transition

                          ${
                            selected
                              ? `
                                border-orange-400
                                bg-orange-50
                                shadow-sm
                              `
                              : `
                                border-slate-200
                                bg-white

                                hover:border-orange-200
                              `
                          }
                        `}
                      >
                        <p
                          className="
                            truncate

                            text-sm
                            font-black
                            text-slate-950
                          "
                        >
                          {
                            order.restaurantName
                          }
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-400
                          "
                        >
                          #
                          {
                            order.orderNumber
                          }
                        </p>

                        <div
                          className="
                            mt-3
                          "
                        >
                          <StatusBadge
                            status={
                              order.status
                            }
                          />
                        </div>
                      </button>
                    );
                  }
                )}
              </div>


              <ActiveOrderDetails
                order={
                  selectedOrder
                }
              />
            </>
          )}


          {/* ============================
              NO ACTIVE ORDER
          ============================= */}

          {activeOrders.length ===
            0 &&
            previousOrders.length >
              0 && (
              <div
                className="
                  rounded-[1.75rem]

                  border
                  border-slate-200

                  bg-white

                  p-7

                  text-center

                  shadow-sm
                "
              >
                <FaCheckCircle
                  className="
                    mx-auto

                    text-3xl
                    text-emerald-500
                  "
                />

                <h2
                  className="
                    mt-4

                    text-xl
                    font-black
                    text-slate-950
                  "
                >
                  No active
                  delivery
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                  "
                >
                  Your current
                  orders are all
                  completed.
                </p>
              </div>
            )}


          {/* ============================
              PREVIOUS ORDERS
          ============================= */}

          {previousOrders.length >
            0 && (
            <section
              className="
                mt-12
              "
            >
              <div
                className="
                  mb-5
                "
              >
                <h2
                  className="
                    text-2xl
                    font-black
                    text-slate-950
                  "
                >
                  Previous
                  orders
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Your completed
                  and cancelled
                  orders.
                </p>
              </div>


              <div
                className="
                  grid
                  gap-4

                  lg:grid-cols-2
                "
              >
                {previousOrders.map(
                  (
                    order
                  ) => (
                    <PreviousOrderCard
                      key={
                        order.orderNumber
                      }
                      order={
                        order
                      }
                    />
                  )
                )}
              </div>
            </section>
          )}


          {/* ============================
              NO ORDERS AT ALL
          ============================= */}

          {orders.length ===
            0 && (
            <EmptyState
              icon={
                FaBox
              }

              title="No orders yet"

              description="Place your first food order and it will appear here with live delivery tracking."

              action={
                <Link
                  to="/restaurants"

                  className="
                    inline-flex
                    min-h-11
                    items-center
                    justify-center

                    rounded-xl

                    bg-orange-500

                    px-5

                    text-sm
                    font-bold
                    text-white
                  "
                >
                  Explore
                  Restaurants
                </Link>
              }
            />
          )}
        </div>
      </Container>
    </main>
  );
};


export default Orders;