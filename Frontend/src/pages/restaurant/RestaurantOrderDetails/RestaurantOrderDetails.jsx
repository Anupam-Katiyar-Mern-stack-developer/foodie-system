import {
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    ChefHat,
    Clock3,
    CreditCard,
    MapPin,
    PackageCheck,
    Phone,
    ReceiptText,
    ShoppingBag,
    User,
} from "lucide-react";


import PageHeader
    from "../../../components/common/PageHeader/PageHeader";

import Button
    from "../../../components/common/Button/Button";

import StatusBadge
    from "../../../components/common/StatusBadge/StatusBadge";

import Skeleton
    from "../../../components/common/Skeleton/Skeleton";

import ErrorState
    from "../../../components/common/ErrorState/ErrorState";

import EmptyState
    from "../../../components/common/EmptyState/EmptyState";

import OptimizedImage
    from "../../../components/common/OptimizedImage/OptimizedImage";

import ConfirmModal
    from "../../../components/common/ConfirmModal/ConfirmModal";


const RestaurantOrderDetails = () => {
    const navigate =
        useNavigate();

    const {
        orderNumber,
    } = useParams();


    // =========================================
    // DUMMY STATE
    // Later restaurantOrder Redux se replace
    // =========================================

    const [
        order,
        setOrder,
    ] = useState({
        orderNumber:
            orderNumber ||
            "ORD-31FA3A64",

        status:
            "PLACED",

        subtotal:
            520,

        deliveryFee:
            29,

        taxAmount:
            26,

        totalAmount:
            575,

        rejectionReason:
            null,

        cancelledReason:
            null,

        confirmedAt:
            null,

        preparingAt:
            null,

        readyAt:
            null,

        pickedUpAt:
            null,

        deliveredAt:
            null,

        cancelledAt:
            null,

        createdAt:
            "2026-10-06T07:45:00.000Z",

        updatedAt:
            "2026-10-06T07:45:00.000Z",

        checkoutNumber:
            "CHK-91QWE72",

        paymentMethod:
            "COD",

        paymentStatus:
            "PENDING",

        deliveryName:
            "Rahul Kumar",

        deliveryPhone:
            "9876543210",

        addressLine:
            "117/45 Kakadeo",

        landmark:
            "Near Main Market",

        city:
            "Kanpur",

        state:
            "Uttar Pradesh",

        pincode:
            "208025",

        latitude:
            26.4812,

        longitude:
            80.3041,

        items: [
            {
                name:
                    "Paneer Burger",

                slug:
                    "paneer-burger",

                image:
                    "/uploads/foods/paneer-burger.jpg",

                unitPrice:
                    199,

                quantity:
                    2,

                itemTotal:
                    398,
            },

            {
                name:
                    "French Fries",

                slug:
                    "french-fries",

                image:
                    "/uploads/foods/french-fries.jpg",

                unitPrice:
                    122,

                quantity:
                    1,

                itemTotal:
                    122,
            },
        ],
    });


    const [
        fetchLoading,
        setFetchLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState(null);


    const [
        actionLoading,
        setActionLoading,
    ] = useState(false);


    const [
        pendingAction,
        setPendingAction,
    ] = useState(null);


    // =========================================
    // STATUS CONFIG
    // =========================================

    const statusConfig = {
        PLACED: {
            label:
                "Placed",

            variant:
                "warning",
        },

        CONFIRMED: {
            label:
                "Confirmed",

            variant:
                "info",
        },

        PREPARING: {
            label:
                "Preparing",

            variant:
                "purple",
        },

        READY_FOR_PICKUP: {
            label:
                "Ready For Pickup",

            variant:
                "success",
        },

        DELIVERY_ASSIGNED: {
            label:
                "Delivery Assigned",

            variant:
                "info",
        },

        PICKED_UP: {
            label:
                "Picked Up",

            variant:
                "info",
        },

        OUT_FOR_DELIVERY: {
            label:
                "Out For Delivery",

            variant:
                "warning",
        },

        DELIVERED: {
            label:
                "Delivered",

            variant:
                "success",
        },

        REJECTED: {
            label:
                "Rejected",

            variant:
                "danger",
        },

        CANCELLED: {
            label:
                "Cancelled",

            variant:
                "danger",
        },
    };


    // =========================================
    // PRICE
    // =========================================

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
                    0,
            }
        ).format(
            Number(
                amount || 0
            )
        );
    };


    // =========================================
    // DATE
    // =========================================

    const formatDate = (
        value
    ) => {
        if (!value) {
            return "-";
        }


        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric",

                hour:
                    "2-digit",

                minute:
                    "2-digit",
            }
        ).format(
            new Date(value)
        );
    };


    // =========================================
    // DUMMY ACTION
    //
    // Later:
    // dispatch(acceptRestaurantOrder())
    // dispatch(rejectRestaurantOrder())
    // dispatch(markOrderPreparing())
    // dispatch(markOrderReady())
    // =========================================

    const handleActionConfirm =
        () => {
            if (
                !pendingAction
            ) {
                return;
            }


            setActionLoading(
                true
            );


            const now =
                new Date()
                    .toISOString();


            if (
                pendingAction ===
                "ACCEPT"
            ) {
                setOrder(
                    (previous) => ({
                        ...previous,

                        status:
                            "CONFIRMED",

                        confirmedAt:
                            now,

                        updatedAt:
                            now,
                    })
                );
            }


            if (
                pendingAction ===
                "REJECT"
            ) {
                setOrder(
                    (previous) => ({
                        ...previous,

                        status:
                            "REJECTED",

                        rejectionReason:
                            "Order rejected by restaurant",

                        updatedAt:
                            now,
                    })
                );
            }


            if (
                pendingAction ===
                "PREPARING"
            ) {
                setOrder(
                    (previous) => ({
                        ...previous,

                        status:
                            "PREPARING",

                        preparingAt:
                            now,

                        updatedAt:
                            now,
                    })
                );
            }


            if (
                pendingAction ===
                "READY"
            ) {
                setOrder(
                    (previous) => ({
                        ...previous,

                        status:
                            "READY_FOR_PICKUP",

                        readyAt:
                            now,

                        updatedAt:
                            now,
                    })
                );
            }


            setActionLoading(
                false
            );

            setPendingAction(
                null
            );
        };


    // =========================================
    // ACTION MODAL DATA
    // =========================================

    const actionModalConfig = {
        ACCEPT: {
            title:
                "Accept this order?",

            description:
                "The customer order will be confirmed and you can start preparing it.",

            confirmText:
                "Accept Order",
        },

        REJECT: {
            title:
                "Reject this order?",

            description:
                "The order will be rejected and cannot continue through restaurant preparation.",

            confirmText:
                "Reject Order",
        },

        PREPARING: {
            title:
                "Start preparing?",

            description:
                "This order will be moved to the preparing stage.",

            confirmText:
                "Start Preparing",
        },

        READY: {
            title:
                "Mark order ready?",

            description:
                "The order will be marked ready for pickup and the delivery flow can continue.",

            confirmText:
                "Mark Ready",
        },
    };


    const modalConfig =
        pendingAction
            ? actionModalConfig[
            pendingAction
            ]
            : null;


    // =========================================
    // LOADING
    // =========================================

    if (fetchLoading) {
        return (
            <div
                className="
          space-y-6
        "
            >
                <Skeleton
                    width="w-full"
                    height="h-[110px]"
                    rounded="rounded-[1.75rem]"
                />

                <div
                    className="
            grid
            gap-6

            xl:grid-cols-[minmax(0,1fr)_360px]
          "
                >
                    <Skeleton
                        width="w-full"
                        height="h-[520px]"
                        rounded="rounded-[1.75rem]"
                    />

                    <Skeleton
                        width="w-full"
                        height="h-[520px]"
                        rounded="rounded-[1.75rem]"
                    />
                </div>
            </div>
        );
    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {
        return (
            <ErrorState
                title="Unable to load order"

                description={
                    typeof error ===
                        "string"
                        ? error
                        : "Something went wrong while loading this order."
                }
            />
        );
    }


    // =========================================
    // EMPTY
    // =========================================

    if (!order) {
        return (
            <EmptyState
                icon={
                    ShoppingBag
                }

                title="Order not found"

                description="The requested restaurant order could not be found."

                action={{
                    label:
                        "Back to Orders",

                    onClick: () =>
                        navigate(
                            "/restaurant/orders"
                        ),
                }}
            />
        );
    }


    const currentStatus =
        statusConfig[
        order.status
        ] || {
            label:
                order.status,

            variant:
                "neutral",
        };


    return (
        <div
            className="
        space-y-6
      "
        >
            {/* =========================
          BACK
      ========================== */}

            <Button
                type="button"

                variant="ghost"

                onClick={() =>
                    navigate(
                        "/restaurant/orders"
                    )
                }
            >
                <span
                    className="
            inline-flex
            items-center
            gap-2
          "
                >
                    <ArrowLeft
                        className="
              h-4
              w-4
            "
                    />

                    Back to Orders
                </span>
            </Button>


            {/* =========================
          HEADER
      ========================== */}

            <div
                className="
          flex
          flex-col
          gap-4

          lg:flex-row
          lg:items-start
          lg:justify-between
        "
            >
                <PageHeader
                    title={
                        order.orderNumber
                    }

                    description={`Checkout ${order.checkoutNumber}`}
                />


                <StatusBadge
                    variant={
                        currentStatus.variant
                    }

                    size="md"

                    dot
                >
                    {
                        currentStatus.label
                    }
                </StatusBadge>
            </div>


            {/* =========================
          ORDER ACTIONS
      ========================== */}

            {order.status ===
                "PLACED" && (
                    <div
                        className="
            flex
            flex-wrap
            gap-3

            rounded-[1.5rem]

            border
            border-orange-100

            bg-orange-50

            p-4
          "
                    >
                        <Button
                            type="button"

                            onClick={() =>
                                setPendingAction(
                                    "ACCEPT"
                                )
                            }
                        >
                            <span
                                className="
                inline-flex
                items-center
                gap-2
              "
                            >
                                <CheckCircle2
                                    className="
                  h-4
                  w-4
                "
                                />

                                Accept Order
                            </span>
                        </Button>


                        <Button
                            type="button"

                            variant="outline"

                            onClick={() =>
                                setPendingAction(
                                    "REJECT"
                                )
                            }
                        >
                            Reject Order
                        </Button>
                    </div>
                )}


            {order.status ===
                "CONFIRMED" && (
                    <div
                        className="
            rounded-[1.5rem]

            border
            border-blue-100

            bg-blue-50

            p-4
          "
                    >
                        <Button
                            type="button"

                            onClick={() =>
                                setPendingAction(
                                    "PREPARING"
                                )
                            }
                        >
                            <span
                                className="
                inline-flex
                items-center
                gap-2
              "
                            >
                                <ChefHat
                                    className="
                  h-4
                  w-4
                "
                                />

                                Start Preparing
                            </span>
                        </Button>
                    </div>
                )}


            {order.status ===
                "PREPARING" && (
                    <div
                        className="
            rounded-[1.5rem]

            border
            border-emerald-100

            bg-emerald-50

            p-4
          "
                    >
                        <Button
                            type="button"

                            onClick={() =>
                                setPendingAction(
                                    "READY"
                                )
                            }
                        >
                            <span
                                className="
                inline-flex
                items-center
                gap-2
              "
                            >
                                <PackageCheck
                                    className="
                  h-4
                  w-4
                "
                                />

                                Mark Ready
                            </span>
                        </Button>
                    </div>
                )}


            {/* =========================
          CONTENT
      ========================== */}

            <div
                className="
          grid
          gap-6

          xl:grid-cols-[minmax(0,1fr)_360px]
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
                    {/* ORDER ITEMS */}

                    <section
                        className="
              rounded-[1.5rem]

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
                            <ReceiptText
                                className="
                  h-5
                  w-5
                  text-orange-500
                "
                            />

                            <div>
                                <h2
                                    className="
                    text-lg
                    font-black
                    text-slate-950
                  "
                                >
                                    Order Items
                                </h2>

                                <p
                                    className="
                    text-sm
                    text-slate-500
                  "
                                >
                                    {
                                        order.items
                                            .length
                                    }{" "}
                                    menu items
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
                                (item) => (
                                    <div
                                        key={
                                            item.slug
                                        }

                                        className="
                      flex
                      gap-4
                      py-4

                      first:pt-0
                      last:pb-0
                    "
                                    >
                                        <OptimizedImage
                                            src={
                                                item.image
                                            }

                                            alt={
                                                item.name
                                            }

                                            className="
                        h-20
                        w-20
                        shrink-0

                        rounded-xl

                        object-cover
                      "
                                        />


                                        <div
                                            className="
                        min-w-0
                        flex-1
                      "
                                        >
                                            <h3
                                                className="
                          font-black
                          text-slate-900
                        "
                                            >
                                                {
                                                    item.name
                                                }
                                            </h3>


                                            <p
                                                className="
                          mt-1

                          text-sm
                          text-slate-500
                        "
                                            >
                                                {formatPrice(
                                                    item.unitPrice
                                                )}{" "}
                                                ×{" "}
                                                {
                                                    item.quantity
                                                }
                                            </p>
                                        </div>


                                        <p
                                            className="
                        shrink-0

                        font-black
                        text-slate-900
                      "
                                        >
                                            {formatPrice(
                                                item.itemTotal
                                            )}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </section>


                    {/* CUSTOMER + ADDRESS */}

                    <section
                        className="
              grid
              gap-4

              md:grid-cols-2
            "
                    >
                        <div
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
                  items-center
                  gap-3
                "
                            >
                                <User
                                    className="
                    h-5
                    w-5
                    text-orange-500
                  "
                                />

                                <h2
                                    className="
                    font-black
                    text-slate-950
                  "
                                >
                                    Customer
                                </h2>
                            </div>


                            <p
                                className="
                  mt-5

                  font-black
                  text-slate-900
                "
                            >
                                {
                                    order.deliveryName
                                }
                            </p>


                            <div
                                className="
                  mt-2

                  flex
                  items-center
                  gap-2

                  text-sm
                  text-slate-500
                "
                            >
                                <Phone
                                    className="
                    h-4
                    w-4
                  "
                                />

                                {
                                    order.deliveryPhone
                                }
                            </div>
                        </div>


                        <div
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
                  items-center
                  gap-3
                "
                            >
                                <MapPin
                                    className="
                    h-5
                    w-5
                    text-orange-500
                  "
                                />

                                <h2
                                    className="
                    font-black
                    text-slate-950
                  "
                                >
                                    Delivery Address
                                </h2>
                            </div>


                            <p
                                className="
                  mt-5

                  text-sm
                  font-bold
                  leading-6
                  text-slate-700
                "
                            >
                                {
                                    order.addressLine
                                }

                                {order.landmark &&
                                    `, ${order.landmark}`}

                                <br />

                                {
                                    order.city
                                }
                                ,{" "}
                                {
                                    order.state
                                }

                                <br />

                                {
                                    order.pincode
                                }
                            </p>
                        </div>
                    </section>
                </div>


                {/* =====================
            RIGHT
        ====================== */}

                <div
                    className="
            space-y-6
          "
                >
                    {/* PAYMENT */}

                    <section
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
                items-center
                gap-3
              "
                        >
                            <CreditCard
                                className="
                  h-5
                  w-5
                  text-orange-500
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
              "
                        >
                            <div
                                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
                            >
                                <span
                                    className="
                    text-sm
                    text-slate-500
                  "
                                >
                                    Method
                                </span>

                                <span
                                    className="
                    text-sm
                    font-black
                    text-slate-900
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
                  items-center
                  justify-between
                  gap-4
                "
                            >
                                <span
                                    className="
                    text-sm
                    text-slate-500
                  "
                                >
                                    Status
                                </span>

                                <StatusBadge
                                    variant={
                                        order.paymentStatus ===
                                            "PAID"
                                            ? "success"
                                            : "warning"
                                    }

                                    size="sm"

                                    dot
                                >
                                    {
                                        order.paymentStatus
                                    }
                                </StatusBadge>
                            </div>
                        </div>
                    </section>


                    {/* BILL */}

                    <section
                        className="
              rounded-[1.5rem]

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
                            Order Summary
                        </h2>


                        <div
                            className="
                mt-5
                space-y-3
              "
                        >
                            <div
                                className="
                  flex
                  justify-between

                  text-sm
                  text-slate-500
                "
                            >
                                <span>
                                    Subtotal
                                </span>

                                <span>
                                    {formatPrice(
                                        order.subtotal
                                    )}
                                </span>
                            </div>


                            <div
                                className="
                  flex
                  justify-between

                  text-sm
                  text-slate-500
                "
                            >
                                <span>
                                    Delivery Fee
                                </span>

                                <span>
                                    {formatPrice(
                                        order.deliveryFee
                                    )}
                                </span>
                            </div>


                            <div
                                className="
                  flex
                  justify-between

                  text-sm
                  text-slate-500
                "
                            >
                                <span>
                                    Tax
                                </span>

                                <span>
                                    {formatPrice(
                                        order.taxAmount
                                    )}
                                </span>
                            </div>


                            <div
                                className="
                  mt-4

                  flex
                  justify-between

                  border-t
                  border-slate-100

                  pt-4
                "
                            >
                                <span
                                    className="
                    font-black
                    text-slate-950
                  "
                                >
                                    Total
                                </span>

                                <span
                                    className="
                    text-lg
                    font-black
                    text-orange-600
                  "
                                >
                                    {formatPrice(
                                        order.totalAmount
                                    )}
                                </span>
                            </div>
                        </div>
                    </section>


                    {/* ORDER INFO */}

                    <section
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
                items-center
                gap-3
              "
                        >
                            <Clock3
                                className="
                  h-5
                  w-5
                  text-orange-500
                "
                            />

                            <h2
                                className="
                  font-black
                  text-slate-950
                "
                            >
                                Order Information
                            </h2>
                        </div>


                        <div
                            className="
                mt-5
                space-y-4
              "
                        >
                            <div>
                                <p
                                    className="
                    text-xs
                    font-bold
                    text-slate-400
                  "
                                >
                                    ORDERED AT
                                </p>

                                <p
                                    className="
                    mt-1
                    text-sm
                    font-bold
                    text-slate-700
                  "
                                >
                                    {formatDate(
                                        order.createdAt
                                    )}
                                </p>
                            </div>


                            {order.confirmedAt && (
                                <div>
                                    <p
                                        className="
                      text-xs
                      font-bold
                      text-slate-400
                    "
                                    >
                                        CONFIRMED
                                    </p>

                                    <p
                                        className="
                      mt-1
                      text-sm
                      font-bold
                      text-slate-700
                    "
                                    >
                                        {formatDate(
                                            order.confirmedAt
                                        )}
                                    </p>
                                </div>
                            )}


                            {order.preparingAt && (
                                <div>
                                    <p
                                        className="
                      text-xs
                      font-bold
                      text-slate-400
                    "
                                    >
                                        PREPARING
                                    </p>

                                    <p
                                        className="
                      mt-1
                      text-sm
                      font-bold
                      text-slate-700
                    "
                                    >
                                        {formatDate(
                                            order.preparingAt
                                        )}
                                    </p>
                                </div>
                            )}


                            {order.readyAt && (
                                <div>
                                    <p
                                        className="
                      text-xs
                      font-bold
                      text-slate-400
                    "
                                    >
                                        READY
                                    </p>

                                    <p
                                        className="
                      mt-1
                      text-sm
                      font-bold
                      text-slate-700
                    "
                                    >
                                        {formatDate(
                                            order.readyAt
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>


            {/* =========================
          CONFIRM MODAL
      ========================== */}

            <ConfirmModal
                open={
                    Boolean(
                        pendingAction
                    )
                }

                onClose={() =>
                    setPendingAction(
                        null
                    )
                }

                title={
                    modalConfig?.title
                }

                description={
                    modalConfig?.description
                }

                confirmText={
                    modalConfig?.confirmText
                }

                loading={
                    actionLoading
                }

                onConfirm={
                    handleActionConfirm
                }
            />
        </div>
    );
};


export default RestaurantOrderDetails;