import {
    useMemo,
} from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    useSelector,
} from "react-redux";

import {
    FaArrowLeft,
    FaBoxOpen,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaMotorcycle,
    FaPhoneAlt,
    FaReceipt,
    FaRoute,
    FaStore,
    FaUser,
    FaUtensils,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";

import OrderStatusTimeline from "../../../components/public/OrderStatusTimeline/OrderStatusTimeline";

import {
    getOrderStatusConfig,
    ORDER_STATUS,
} from "../../../constants/orderStatus";


const LIVE_TRACKING_STATUSES = [
    ORDER_STATUS.DELIVERY_ASSIGNED,

    ORDER_STATUS.PICKED_UP,

    ORDER_STATUS.OUT_FOR_DELIVERY,
];


const OrderDetails = () => {
    const {
        orderNumber,
    } = useParams();


    const navigate =
        useNavigate();


    // =========================
    // REDUX
    // =========================

    const {
        orders,
        detailLoading,
        detailError,
    } = useSelector(
        (state) =>
            state.publicOrder
    );


    // =========================
    // CURRENT ORDER
    // =========================

    const order =
        useMemo(
            () =>
                orders.find(
                    (item) =>
                        item.orderNumber ===
                        orderNumber
                ),

            [
                orders,
                orderNumber,
            ]
        );


    // =========================
    // HELPERS
    // =========================

    const formatPrice = (
        amount
    ) => {
        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(amount || 0);
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
                day: "2-digit",

                month: "short",

                year: "numeric",

                hour: "2-digit",

                minute: "2-digit",
            }
        ).format(
            new Date(value)
        );
    };


    // =========================
    // LOADING
    // =========================

    if (detailLoading) {
        return (
            <div
                className="
          min-h-screen
          bg-[#fffaf5]
          py-10
        "
            >
                <Container>
                    <Skeleton
                        width="w-full"
                        height="h-[210px]"
                        rounded="rounded-[2rem]"
                    />


                    <div
                        className="
              mt-6

              grid
              gap-6

              lg:grid-cols-[minmax(0,1fr)_360px]
            "
                    >
                        <div
                            className="
                space-y-5
              "
                        >
                            <Skeleton
                                width="w-full"
                                height="h-[480px]"
                                rounded="rounded-[1.75rem]"
                            />

                            <Skeleton
                                width="w-full"
                                height="h-[300px]"
                                rounded="rounded-[1.75rem]"
                            />
                        </div>


                        <Skeleton
                            width="w-full"
                            height="h-[440px]"
                            rounded="rounded-[1.75rem]"
                        />
                    </div>
                </Container>
            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (detailError) {
        return (
            <div
                className="
          min-h-[60vh]

          bg-[#fffaf5]

          py-14
        "
            >
                <Container>
                    <ErrorState
                        title="Unable to load order"

                        description={
                            typeof detailError ===
                                "string"
                                ? detailError
                                : "Something went wrong while loading this order."
                        }
                    />
                </Container>
            </div>
        );
    }


    // =========================
    // NOT FOUND
    // =========================

    if (!order) {
        return (
            <div
                className="
          min-h-[70vh]

          bg-[#fffaf5]

          py-14
        "
            >
                <Container>
                    <EmptyState
                        icon={
                            FaBoxOpen
                        }

                        title="Order not found"

                        description="The order you are looking for does not exist or is unavailable."

                        action={
                            <button
                                type="button"

                                onClick={() =>
                                    navigate(
                                        "/orders"
                                    )
                                }

                                className="
                  min-h-11

                  rounded-xl

                  bg-orange-500

                  px-5

                  text-sm
                  font-bold
                  text-white
                "
                            >
                                View My Orders
                            </button>
                        }
                    />
                </Container>
            </div>
        );
    }


    const statusConfig =
        getOrderStatusConfig(
            order.status
        );


    const showLiveTracking =
        LIVE_TRACKING_STATUSES.includes(
            order.status
        );


    const itemCount =
        order.items?.reduce(
            (
                total,
                item
            ) =>
                total +
                Number(
                    item.quantity || 0
                ),

            0
        ) || 0;


    return (
        <div
            className="
        min-h-screen
        bg-[#fffaf5]
      "
        >
            {/* =========================
          HEADER
      ========================== */}

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
              py-8

              sm:py-10
            "
                    >
                        <button
                            type="button"

                            onClick={() =>
                                navigate(
                                    "/orders"
                                )
                            }

                            className="
                inline-flex
                items-center
                gap-2

                text-sm
                font-bold
                text-slate-500

                transition

                hover:text-orange-600
              "
                        >
                            <FaArrowLeft
                                className="
                  h-3
                  w-3
                "
                            />

                            Back to orders
                        </button>


                        <div
                            className="
                mt-5

                flex
                flex-col
                gap-5

                sm:flex-row
                sm:items-end
                sm:justify-between
              "
                        >
                            <div>
                                <p
                                    className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-orange-500
                  "
                                >
                                    Order details
                                </p>


                                <h1
                                    className="
                    mt-2

                    break-all

                    text-2xl
                    font-black
                    tracking-tight
                    text-slate-950

                    sm:text-3xl
                    lg:text-4xl
                  "
                                >
                                    {
                                        order.orderNumber
                                    }
                                </h1>


                                <div
                                    className="
                    mt-3

                    flex
                    flex-wrap
                    items-center
                    gap-3

                    text-xs
                    text-slate-500
                  "
                                >
                                    <span
                                        className="
                      inline-flex
                      items-center
                      gap-2
                    "
                                    >
                                        <FaCalendarAlt />

                                        {formatDate(
                                            order.createdAt
                                        )}
                                    </span>


                                    <span>
                                        •
                                    </span>


                                    <span>
                                        {itemCount} item
                                        {itemCount !== 1
                                            ? "s"
                                            : ""}
                                    </span>
                                </div>
                            </div>


                            {/* STATUS */}

                            <span
                                className={`
                  inline-flex
                  w-fit

                  rounded-full

                  border

                  px-4
                  py-2

                  text-xs
                  font-black
                  uppercase
                  tracking-wide

                  ${statusConfig.className}
                `}
                            >
                                {
                                    statusConfig.label
                                }
                            </span>
                        </div>
                    </div>
                </Container>
            </section>


            {/* =========================
          BODY
      ========================== */}

            <section
                className="
          py-8

          sm:py-10

          lg:py-12
        "
            >
                <Container>
                    <div
                        className="
              grid
              gap-6

              lg:grid-cols-[minmax(0,1fr)_360px]
              lg:items-start
            "
                    >
                        {/* =====================
                LEFT
            ====================== */}

                        <div
                            className="
                space-y-6
              "
                        >
                            {/* =====================
                  STATUS TIMELINE
              ====================== */}

                            <div
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
                    mb-6
                  "
                                >
                                    <p
                                        className="
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.14em]
                      text-orange-500
                    "
                                    >
                                        Live status
                                    </p>

                                    <h2
                                        className="
                      mt-2

                      text-xl
                      font-black
                      text-slate-950

                      sm:text-2xl
                    "
                                    >
                                        Order progress
                                    </h2>
                                </div>


                                <OrderStatusTimeline
                                    status={
                                        order.status
                                    }
                                />
                            </div>


                            {/* =====================
                  LIVE TRACKING
              ====================== */}

                            {showLiveTracking && (
                                <div
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
                      items-center
                      justify-between
                      gap-4

                      border-b
                      border-slate-100

                      p-5

                      sm:p-6
                    "
                                    >
                                        <div>
                                            <p
                                                className="
                          text-xs
                          font-black
                          uppercase
                          tracking-[0.14em]
                          text-orange-500
                        "
                                            >
                                                Delivery tracking
                                            </p>

                                            <h2
                                                className="
                          mt-1

                          text-xl
                          font-black
                          text-slate-950
                        "
                                            >
                                                Track your order
                                            </h2>
                                        </div>


                                        <span
                                            className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center

                        rounded-2xl

                        bg-orange-100

                        text-orange-600
                      "
                                        >
                                            <FaRoute />
                                        </span>
                                    </div>


                                    {/* MAP PLACEHOLDER */}

                                    <div
                                        className="
                      relative

                      min-h-[300px]

                      overflow-hidden

                      bg-[#f3efe7]
                    "
                                    >
                                        {/* ROAD LINES */}

                                        <div
                                            className="
                        absolute
                        -left-10
                        top-1/2

                        h-10
                        w-[120%]

                        -rotate-6

                        bg-white/80
                      "
                                        />

                                        <div
                                            className="
                        absolute
                        left-1/3
                        top-0

                        h-[130%]
                        w-8

                        rotate-[28deg]

                        bg-white/70
                      "
                                        />

                                        <div
                                            className="
                        absolute
                        right-12
                        top-6

                        h-[80%]
                        w-6

                        -rotate-[20deg]

                        bg-white/60
                      "
                                        />


                                        {/* RESTAURANT */}

                                        <div
                                            className="
                        absolute
                        left-[14%]
                        top-[30%]

                        flex
                        flex-col
                        items-center
                      "
                                        >
                                            <span
                                                className="
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center

                          rounded-full

                          bg-slate-950

                          text-white

                          shadow-xl
                        "
                                            >
                                                <FaStore />
                                            </span>

                                            <span
                                                className="
                          mt-2

                          rounded-lg

                          bg-white

                          px-2
                          py-1

                          text-[9px]
                          font-black
                          text-slate-700

                          shadow
                        "
                                            >
                                                Restaurant
                                            </span>
                                        </div>


                                        {/* RIDER */}

                                        <div
                                            className="
                        absolute
                        left-[52%]
                        top-[48%]

                        flex
                        flex-col
                        items-center
                      "
                                        >
                                            <span
                                                className="
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center

                          rounded-full

                          border-4
                          border-white

                          bg-orange-500

                          text-white

                          shadow-2xl
                          shadow-orange-500/30
                        "
                                            >
                                                <FaMotorcycle />
                                            </span>

                                            <span
                                                className="
                          mt-2

                          rounded-lg

                          bg-orange-500

                          px-2
                          py-1

                          text-[9px]
                          font-black
                          text-white

                          shadow
                        "
                                            >
                                                Delivery Agent
                                            </span>
                                        </div>


                                        {/* USER */}

                                        <div
                                            className="
                        absolute
                        bottom-[18%]
                        right-[12%]

                        flex
                        flex-col
                        items-center
                      "
                                        >
                                            <span
                                                className="
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center

                          rounded-full

                          bg-emerald-500

                          text-white

                          shadow-xl
                        "
                                            >
                                                <FaMapMarkerAlt />
                                            </span>

                                            <span
                                                className="
                          mt-2

                          rounded-lg

                          bg-white

                          px-2
                          py-1

                          text-[9px]
                          font-black
                          text-slate-700

                          shadow
                        "
                                            >
                                                You
                                            </span>
                                        </div>


                                        {/* INFO */}

                                        <div
                                            className="
                        absolute
                        bottom-4
                        left-4
                        right-4

                        rounded-2xl

                        border
                        border-white/60

                        bg-white/90

                        p-4

                        backdrop-blur
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
                            h-10
                            w-10
                            shrink-0
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
                                                    <p
                                                        className="
                              text-sm
                              font-black
                              text-slate-950
                            "
                                                    >
                                                        {
                                                            statusConfig.label
                                                        }
                                                    </p>

                                                    <p
                                                        className="
                              mt-0.5

                              text-xs
                              text-slate-500
                            "
                                                    >
                                                        Live GPS map will
                                                        connect here using
                                                        Socket.IO and Redis.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* =====================
                  ORDER ITEMS
              ====================== */}

                            <div
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
                      h-10
                      w-10
                      items-center
                      justify-center

                      rounded-xl

                      bg-orange-100

                      text-orange-600
                    "
                                    >
                                        <FaUtensils />
                                    </span>


                                    <div>
                                        <h2
                                            className="
                        text-lg
                        font-black
                        text-slate-950

                        sm:text-xl
                      "
                                        >
                                            Order items
                                        </h2>

                                        <p
                                            className="
                        mt-0.5

                        text-xs
                        text-slate-500
                      "
                                        >
                                            {itemCount} item
                                            {itemCount !== 1
                                                ? "s"
                                                : ""}
                                        </p>
                                    </div>
                                </div>


                                <div
                                    className="
                    mt-5

                    divide-y
                    divide-slate-100
                  "
                                >
                                    {order.items.map(
                                        (item) => {
                                            const subtotal =
                                                Number(
                                                    item.price
                                                ) *
                                                Number(
                                                    item.quantity
                                                );


                                            return (
                                                <div
                                                    key={
                                                        item.name
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
                                text-sm
                                font-black
                                text-slate-900
                              "
                                                        >
                                                            {
                                                                item.name
                                                            }
                                                        </p>


                                                        <p
                                                            className="
                                mt-1

                                text-xs
                                text-slate-500
                              "
                                                        >
                                                            {formatPrice(
                                                                item.price
                                                            )}

                                                            {" × "}

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
                                                        {formatPrice(
                                                            subtotal
                                                        )}
                                                    </p>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>


                            {/* =====================
                  DELIVERY ADDRESS
              ====================== */}

                            {order.deliveryAddress && (
                                <div
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

                        bg-rose-100

                        text-rose-600
                      "
                                        >
                                            <FaMapMarkerAlt />
                                        </span>


                                        <div>
                                            <p
                                                className="
                          text-xs
                          font-black
                          uppercase
                          tracking-wide
                          text-slate-400
                        "
                                            >
                                                Delivery Address
                                            </p>


                                            <p
                                                className="
                          mt-2

                          text-sm
                          leading-6
                          text-slate-700
                        "
                                            >
                                                {
                                                    order
                                                        .deliveryAddress
                                                        .addressLine
                                                }
                                                ,{" "}
                                                {
                                                    order
                                                        .deliveryAddress
                                                        .city
                                                }
                                                ,{" "}
                                                {
                                                    order
                                                        .deliveryAddress
                                                        .state
                                                }
                                                {" - "}
                                                {
                                                    order
                                                        .deliveryAddress
                                                        .pincode
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* =====================
                RIGHT
            ====================== */}

                        <aside
                            className="
                space-y-5

                lg:sticky
                lg:top-28
              "
                        >
                            {/* =====================
                  SUMMARY
              ====================== */}

                            <div
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
                                    <span
                                        className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center

                      rounded-xl

                      bg-slate-100

                      text-slate-700
                    "
                                    >
                                        <FaReceipt />
                                    </span>


                                    <h2
                                        className="
                      text-lg
                      font-black
                      text-slate-950
                    "
                                    >
                                        Order summary
                                    </h2>
                                </div>


                                <div
                                    className="
                    mt-5
                    space-y-4
                  "
                                >
                                    <div
                                        className="
                      flex
                      items-center
                      justify-between
                      gap-3

                      text-sm
                    "
                                    >
                                        <span
                                            className="
                        text-slate-500
                      "
                                        >
                                            Items
                                        </span>

                                        <span
                                            className="
                        font-bold
                        text-slate-900
                      "
                                        >
                                            {itemCount}
                                        </span>
                                    </div>


                                    <div
                                        className="
                      flex
                      items-center
                      justify-between
                      gap-3

                      text-sm
                    "
                                    >
                                        <span
                                            className="
                        text-slate-500
                      "
                                        >
                                            Payment
                                        </span>

                                        <span
                                            className="
                        inline-flex
                        items-center
                        gap-1.5

                        font-bold
                        text-emerald-600
                      "
                                        >
                                            <FaMoneyBillWave />

                                            {
                                                order.paymentMethod ||
                                                "COD"
                                            }
                                        </span>
                                    </div>


                                    <div
                                        className="
                      h-px
                      bg-slate-100
                    "
                                    />


                                    <div
                                        className="
                      flex
                      items-end
                      justify-between
                      gap-4
                    "
                                    >
                                        <span
                                            className="
                        text-sm
                        font-bold
                        text-slate-500
                      "
                                        >
                                            Total
                                        </span>

                                        <span
                                            className="
                        text-2xl
                        font-black
                        text-slate-950
                      "
                                        >
                                            {formatPrice(
                                                order.total
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>


                            {/* =====================
                  RESTAURANT
              ====================== */}

                            <div
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
                                        <FaStore />
                                    </span>


                                    <div
                                        className="
                      min-w-0
                      flex-1
                    "
                                    >
                                        <p
                                            className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-wide
                        text-slate-400
                      "
                                        >
                                            Restaurant
                                        </p>


                                        <p
                                            className="
                        mt-1

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


                                        <Link
                                            to={`/restaurants/${order.restaurantSlug}`}

                                            className="
                        mt-3

                        inline-flex

                        text-xs
                        font-black
                        text-orange-600

                        hover:text-orange-700
                      "
                                        >
                                            View restaurant
                                        </Link>
                                    </div>
                                </div>
                            </div>


                            {/* =====================
                  DELIVERY AGENT
              ====================== */}

                            {order.deliveryAgent && (
                                <div
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
                                        <span
                                            className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center

                        rounded-xl

                        bg-emerald-100

                        text-emerald-600
                      "
                                        >
                                            <FaMotorcycle />
                                        </span>


                                        <div>
                                            <p
                                                className="
                          text-[10px]
                          font-black
                          uppercase
                          tracking-wide
                          text-slate-400
                        "
                                            >
                                                Delivery Partner
                                            </p>

                                            <p
                                                className="
                          mt-1

                          text-sm
                          font-black
                          text-slate-950
                        "
                                            >
                                                {
                                                    order
                                                        .deliveryAgent
                                                        .name
                                                }
                                            </p>
                                        </div>
                                    </div>


                                    <div
                                        className="
                      mt-4

                      space-y-3

                      border-t
                      border-slate-100

                      pt-4
                    "
                                    >
                                        <div
                                            className="
                        flex
                        items-center
                        gap-3

                        text-xs
                        text-slate-600
                      "
                                        >
                                            <FaMotorcycle
                                                className="
                          text-slate-400
                        "
                                            />

                                            <span>
                                                {
                                                    order
                                                        .deliveryAgent
                                                        .vehicleType
                                                }

                                                {" • "}

                                                {
                                                    order
                                                        .deliveryAgent
                                                        .vehicleNumber
                                                }
                                            </span>
                                        </div>


                                        {order.deliveryAgent
                                            .phone && (
                                                <div
                                                    className="
                          flex
                          items-center
                          gap-3

                          text-xs
                          text-slate-600
                        "
                                                >
                                                    <FaPhoneAlt
                                                        className="
                            text-slate-400
                          "
                                                    />

                                                    <span>
                                                        +91{" "}
                                                        {
                                                            order
                                                                .deliveryAgent
                                                                .phone
                                                        }
                                                    </span>
                                                </div>
                                            )}


                                        <div
                                            className="
                        flex
                        items-center
                        gap-3

                        text-xs
                        text-slate-600
                      "
                                        >
                                            <FaUser
                                                className="
                          text-slate-400
                        "
                                            />

                                            <span>
                                                {
                                                    order
                                                        .deliveryAgent
                                                        .publicId
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* NOT ASSIGNED */}

                            {!order.deliveryAgent &&
                                order.status !==
                                ORDER_STATUS.DELIVERED &&
                                order.status !==
                                ORDER_STATUS.CANCELLED && (
                                    <div
                                        className="
                      rounded-[1.75rem]

                      border
                      border-dashed
                      border-orange-200

                      bg-orange-50

                      p-5
                    "
                                    >
                                        <FaMotorcycle
                                            className="
                        text-xl
                        text-orange-500
                      "
                                        />

                                        <p
                                            className="
                        mt-3

                        text-sm
                        font-black
                        text-slate-900
                      "
                                        >
                                            Delivery partner
                                            not assigned yet
                                        </p>

                                        <p
                                            className="
                        mt-1

                        text-xs
                        leading-5
                        text-slate-500
                      "
                                        >
                                            A delivery agent will
                                            be assigned when your
                                            order is ready for
                                            pickup.
                                        </p>
                                    </div>
                                )}
                        </aside>
                    </div>
                </Container>
            </section>
        </div>
    );
};


export default OrderDetails;