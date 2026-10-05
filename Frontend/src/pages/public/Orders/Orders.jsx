import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    FaBox,
    FaCheckCircle,
    FaClock,
    FaMapMarkerAlt,
    FaMotorcycle,
    FaReceipt,
    FaStore,
    FaUtensils,
    FaTimesCircle,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";

import {
    getMyOrders,
} from "../../../redux/thunks/public/order.thunk";


// =========================
// ORDER STATUS CONFIG
// =========================

const statusConfig = {
    PLACED: {
        label: "Order Placed",
        icon: FaReceipt,
        className:
            "bg-blue-50 text-blue-700 border-blue-200",
    },

    ACCEPTED: {
        label: "Accepted",
        icon: FaCheckCircle,
        className:
            "bg-indigo-50 text-indigo-700 border-indigo-200",
    },

    PREPARING: {
        label: "Preparing",
        icon: FaUtensils,
        className:
            "bg-amber-50 text-amber-700 border-amber-200",
    },

    READY: {
        label: "Ready",
        icon: FaBox,
        className:
            "bg-purple-50 text-purple-700 border-purple-200",
    },

    OUT_FOR_DELIVERY: {
        label: "Out For Delivery",
        icon: FaMotorcycle,
        className:
            "bg-orange-50 text-orange-700 border-orange-200",
    },

    DELIVERED: {
        label: "Delivered",
        icon: FaCheckCircle,
        className:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
    },

    CANCELLED: {
        label: "Cancelled",
        icon: FaTimesCircle,
        className:
            "bg-rose-50 text-rose-700 border-rose-200",
    },
};


const orderStatusSteps = [
    "Placed",
    "Accepted",
    "Preparing",
    "Ready",
    "OutForDelivery",
    "Delivered",
];


// =========================
// STATUS BADGE
// =========================

const OrderStatusBadge = ({
    status,
}) => {
    const config =
        statusConfig[status] ||
        statusConfig.Placed;

    const Icon =
        config.icon;

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
        font-bold
        ${config.className}
      `}
        >
            <Icon />

            {config.label}
        </span>
    );
};


// =========================
// ORDER TIMELINE
// =========================

const OrderTimeline = ({
    status,
}) => {
    if (
        status === "Cancelled"
    ) {
        return (
            <div
                className="
          mt-5
          rounded-xl
          border
          border-rose-100
          bg-rose-50
          px-4
          py-3
          text-sm
          font-semibold
          text-rose-600
        "
            >
                This order has been
                cancelled.
            </div>
        );
    }


    const currentIndex =
        orderStatusSteps.indexOf(
            status
        );


    return (
        <div
            className="
        mt-6
        overflow-x-auto
        pb-2
      "
        >
            <div
                className="
          flex
          min-w-[650px]
          items-start
        "
            >
                {orderStatusSteps.map(
                    (
                        step,
                        index
                    ) => {
                        const completed =
                            index <=
                            currentIndex;

                        const current =
                            index ===
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
                                {index !== 0 && (
                                    <div
                                        className={`
                      absolute
                      right-1/2
                      top-4
                      h-[2px]
                      w-full

                      ${index <=
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
                    h-8
                    w-8

                    items-center
                    justify-center

                    rounded-full

                    border-2

                    text-xs
                    font-black

                    ${completed
                                            ? "border-orange-500 bg-orange-500 text-white"
                                            : "border-slate-200 bg-white text-slate-400"
                                        }

                    ${current
                                            ? "ring-4 ring-orange-100"
                                            : ""
                                        }
                  `}
                                >
                                    {completed ? (
                                        <FaCheckCircle />
                                    ) : (
                                        index + 1
                                    )}
                                </div>


                                <span
                                    className={`
                    mt-2
                    text-center
                    text-xs
                    font-bold

                    ${completed
                                            ? "text-slate-900"
                                            : "text-slate-400"
                                        }
                  `}
                                >
                                    {
                                        statusConfig[
                                            step
                                        ]?.label
                                    }
                                </span>
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
};


// =========================
// ORDER CARD
// =========================

const OrderCard = ({
    order,
}) => {
    const items =
        order.items || [];

    return (
        <article
            className="
        overflow-hidden
        rounded-[1.75rem]

        border
        border-slate-200

        bg-white

        shadow-sm
      "
        >
            {/* HEADER */}

            <div
                className="
          flex
          flex-col
          gap-4

          border-b
          border-slate-100

          p-5

          sm:flex-row
          sm:items-center
          sm:justify-between

          lg:p-6
        "
            >
                <div>
                    <p
                        className="
              text-xs
              font-bold
              uppercase
              tracking-[0.12em]
              text-slate-400
            "
                    >
                        Order
                    </p>

                    <h2
                        className="
              mt-1
              text-lg
              font-black
              text-slate-950
            "
                    >
                        #
                        {
                            order.orderNumber
                        }
                    </h2>

                    {order.createdAt && (
                        <div
                            className="
                mt-2
                flex
                items-center
                gap-2
                text-xs
                text-slate-500
              "
                        >
                            <FaClock />

                            {new Date(
                                order.createdAt
                            ).toLocaleString()}
                        </div>
                    )}
                </div>


                <OrderStatusBadge
                    status={
                        order.status
                    }
                />
            </div>


            <div
                className="
          p-5
          lg:p-6
        "
            >
                {/* RESTAURANT */}

                <div
                    className="
            flex
            items-center
            gap-3
          "
                >
                    <div
                        className="
              flex
              h-11
              w-11
              items-center
              justify-center

              rounded-xl

              bg-orange-50

              text-orange-500
            "
                    >
                        <FaStore />
                    </div>


                    <div>
                        <p
                            className="
                text-xs
                font-semibold
                text-slate-400
              "
                        >
                            Restaurant
                        </p>

                        <h3
                            className="
                font-black
                text-slate-900
              "
                        >
                            {
                                order.restaurantName
                            }
                        </h3>
                    </div>
                </div>


                {/* TIMELINE */}

                <OrderTimeline
                    status={
                        order.status
                    }
                />


                {/* ITEMS */}

                <div
                    className="
            mt-6
            space-y-3
          "
                >
                    {items.map(
                        (
                            item,
                            index
                        ) => (
                            <div
                                key={
                                    item.slug ||
                                    item.foodSlug ||
                                    index
                                }
                                className="
                  flex
                  items-center
                  justify-between
                  gap-4

                  rounded-xl

                  bg-slate-50

                  px-4
                  py-3
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
                      font-bold
                      text-slate-900
                    "
                                    >
                                        {item.name ||
                                            item.foodName}
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
                    text-sm
                    font-black
                    text-slate-950
                  "
                                >
                                    ₹
                                    {Number(
                                        item.itemTotal ??
                                        item.total ??
                                        item.price *
                                        item.quantity
                                    ).toFixed(2)}
                                </p>
                            </div>
                        )
                    )}
                </div>


                {/* ADDRESS */}

                {(order.addressLine ||
                    order.city) && (
                        <div
                            className="
              mt-6

              flex
              gap-3

              rounded-xl

              border
              border-slate-100

              bg-white

              p-4
            "
                        >
                            <FaMapMarkerAlt
                                className="
                mt-1
                shrink-0
                text-orange-500
              "
                            />

                            <div>
                                <p
                                    className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
                                >
                                    Delivery Address
                                </p>

                                <p
                                    className="
                  mt-1
                  text-sm
                  font-semibold
                  leading-6
                  text-slate-700
                "
                                >
                                    {
                                        order.addressLine
                                    }

                                    {order.addressLine &&
                                        order.city &&
                                        ", "}

                                    {order.city}

                                    {order.state &&
                                        `, ${order.state}`}

                                    {order.pincode &&
                                        ` - ${order.pincode}`}
                                </p>
                            </div>
                        </div>
                    )}


                <div
                    className="
    mt-6
    grid
    grid-cols-2
    gap-3
    sm:grid-cols-4
  "
                >
                    <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">
                            Subtotal
                        </p>

                        <p className="mt-1 text-sm font-black text-slate-900">
                            ₹{Number(order.subtotal || 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">
                            Delivery Fee
                        </p>

                        <p className="mt-1 text-sm font-black text-slate-900">
                            ₹{Number(order.deliveryFee || 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">
                            Payment
                        </p>

                        <p className="mt-1 text-sm font-black text-slate-900">
                            {order.paymentMethod}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">
                            Payment Status
                        </p>

                        <p className="mt-1 text-sm font-black text-slate-900">
                            {order.paymentStatus}
                        </p>
                    </div>
                </div>

                {/* TOTAL */}

                <div
                    className="
            mt-6

            flex
            items-center
            justify-between

            border-t
            border-slate-100

            pt-5
          "
                >
                    <span
                        className="
              text-sm
              font-bold
              text-slate-500
            "
                    >
                        Order Total
                    </span>

                    <span
                        className="
              text-xl
              font-black
              text-slate-950
            "
                    >
                        ₹
                        {Number(
                            order.totalAmount || 0
                        ).toFixed(2)}
                    </span>
                </div>


            </div>
        </article>
    );
};


// =========================
// ORDERS PAGE
// =========================

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


    useEffect(() => {
        dispatch(getMyOrders())
            .unwrap()
            .then((data) => {
                console.log(
                    "MY ORDERS RESPONSE:",
                    data
                );
            })
            .catch((error) => {
                console.log(error);
            });
    }, [dispatch]);


    // Active orders first
    const sortedOrders =
        useMemo(() => {
            const activeStatuses =
                [
                    "Placed",
                    "Accepted",
                    "Preparing",
                    "Ready",
                    "OutForDelivery",
                ];

            return [
                ...orders,
            ].sort(
                (
                    a,
                    b
                ) => {
                    const aActive =
                        activeStatuses.includes(
                            a.status
                        );

                    const bActive =
                        activeStatuses.includes(
                            b.status
                        );

                    if (
                        aActive &&
                        !bActive
                    ) {
                        return -1;
                    }

                    if (
                        !aActive &&
                        bActive
                    ) {
                        return 1;
                    }

                    return (
                        new Date(
                            b.createdAt || 0
                        ) -
                        new Date(
                            a.createdAt || 0
                        )
                    );
                }
            );
        }, [orders]);


    return (
        <main
            className="
        min-h-screen
        bg-[#fffaf5]
        py-8

        sm:py-10

        lg:py-14
      "
        >
            <Container>
                {/* PAGE HEADER */}

                <div
                    className="
            mb-8
          "
                >
                    <div
                        className="
              inline-flex
              items-center
              gap-2

              rounded-full

              bg-orange-50

              px-3
              py-1.5

              text-xs
              font-black
              uppercase
              tracking-[0.12em]
              text-orange-600
            "
                    >
                        <FaReceipt />

                        My Orders
                    </div>


                    <h1
                        className="
              mt-3
              text-3xl
              font-black
              tracking-tight
              text-slate-950

              sm:text-4xl
            "
                    >
                        Your food orders
                    </h1>


                    <p
                        className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-slate-500

              sm:text-base
            "
                    >
                        Track active
                        deliveries and view
                        your previous orders
                        in one place.
                    </p>
                </div>


                {/* LOADING */}

                {fetchLoading && (
                    <div
                        className="
              space-y-5
            "
                    >
                        {Array.from({
                            length: 3,
                        }).map(
                            (
                                _,
                                index
                            ) => (
                                <Skeleton
                                    key={
                                        index
                                    }
                                    width="w-full"
                                    height="h-[420px]"
                                    rounded="rounded-[1.75rem]"
                                />
                            )
                        )}
                    </div>
                )}


                {/* ERROR */}

                {!fetchLoading &&
                    error && (
                        <ErrorState
                            title="Unable to load orders"
                            description={
                                typeof error ===
                                    "string"
                                    ? error
                                    : "Something went wrong while loading your orders."
                            }
                        />
                    )}


                {/* EMPTY */}

                {!fetchLoading &&
                    !error &&
                    sortedOrders.length ===
                    0 && (
                        <EmptyState
                            icon={
                                FaReceipt
                            }
                            title="No orders yet"
                            description="Your orders will appear here after you place your first order."
                        />
                    )}


                {/* ORDERS */}

                {!fetchLoading &&
                    !error &&
                    sortedOrders.length >
                    0 && (
                        <div
                            className="
                space-y-6
              "
                        >
                            {sortedOrders.map(
                                (
                                    order
                                ) => (
                                    <OrderCard
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
                    )}
            </Container>
        </main>
    );
};


export default Orders;