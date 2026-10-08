import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ChefHat,
    Clock3,
    CreditCard,
    Hash,
    MapPin,
    PackageCheck,
    Phone,
    ReceiptText,
    ShoppingBag,
    UserRound,
    XCircle,
} from "lucide-react";


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


import {
    getRestaurantOrder,
    acceptRestaurantOrder,
    rejectRestaurantOrder,
    markRestaurantOrderPreparing,
    markRestaurantOrderReady,
} from "../../../redux/thunks/restaurant/restaurantOrder.thunk";


import {
    clearSelectedOrder,
} from "../../../redux/slices/restaurant/restaurantOrder.slice";


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
// PRICE FORMAT
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

            minimumFractionDigits:
                2,

            maximumFractionDigits:
                2,
        }
    ).format(
        Number(
            amount || 0
        )
    );
};


// =========================================
// DATE FORMAT
// =========================================

const formatDate = (
    date
) => {

    if (!date) {
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
        new Date(date)
    );
};


// =========================================
// COMPONENT
// =========================================

const RestaurantOrderDetails = () => {

    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();


    const {
        orderNumber,
    } = useParams();


    // =========================================
    // REDUX
    // =========================================

    const {

        selectedOrder:
        order,

        detailLoading,

        detailError,

        actionLoading,

        actionError,

    } = useSelector(
        (state) =>
            state.restaurantOrder
    ) || {};


    // =========================================
    // REJECT STATE
    // =========================================

    const [
        showRejectForm,
        setShowRejectForm,
    ] = useState(false);


    const [
        rejectionReason,
        setRejectionReason,
    ] = useState("");


    // =========================================
    // FETCH ORDER
    // =========================================

    useEffect(() => {

        if (!orderNumber) {
            return;
        }


        dispatch(
            getRestaurantOrder(
                orderNumber
            )
        );


        return () => {

            dispatch(
                clearSelectedOrder()
            );
        };

    }, [
        dispatch,
        orderNumber,
    ]);


    // =========================================
    // ACCEPT
    // =========================================

    const handleAccept =
        async () => {

            try {

                await dispatch(
                    acceptRestaurantOrder(
                        orderNumber
                    )
                ).unwrap();


                dispatch(
                    getRestaurantOrder(
                        orderNumber
                    )
                );

            } catch (error) {

                console.error(
                    "ACCEPT ORDER ERROR:",
                    error
                );
            }
        };


    // =========================================
    // REJECT
    // =========================================

    const handleReject =
        async () => {

            const reason =
                rejectionReason
                    .trim();


            if (!reason) {
                return;
            }


            try {

                await dispatch(
                    rejectRestaurantOrder({
                        orderNumber,
                        reason,
                    })
                ).unwrap();


                setShowRejectForm(
                    false
                );

                setRejectionReason(
                    ""
                );


                dispatch(
                    getRestaurantOrder(
                        orderNumber
                    )
                );

            } catch (error) {

                console.error(
                    "REJECT ORDER ERROR:",
                    error
                );
            }
        };


    // =========================================
    // PREPARING
    // =========================================

    const handlePreparing =
        async () => {

            try {

                await dispatch(
                    markRestaurantOrderPreparing(
                        orderNumber
                    )
                ).unwrap();


                dispatch(
                    getRestaurantOrder(
                        orderNumber
                    )
                );

            } catch (error) {

                console.error(
                    "PREPARING ORDER ERROR:",
                    error
                );
            }
        };


    // =========================================
    // READY
    // =========================================

    const handleReady =
        async () => {

            try {

                await dispatch(
                    markRestaurantOrderReady(
                        orderNumber
                    )
                ).unwrap();


                dispatch(
                    getRestaurantOrder(
                        orderNumber
                    )
                );

            } catch (error) {

                console.error(
                    "READY ORDER ERROR:",
                    error
                );
            }
        };


    // =========================================
    // RETRY
    // =========================================

    const handleRetry =
        () => {

            dispatch(
                getRestaurantOrder(
                    orderNumber
                )
            );
        };


    // =========================================
    // LOADING
    // =========================================

    if (
        detailLoading &&
        !order
    ) {

        return (

            <div
                className="
                    space-y-5
                "
            >

                <Skeleton
                    width="w-56"
                    height="h-10"
                    rounded="rounded-xl"
                />


                <Skeleton
                    width="w-full"
                    height="h-44"
                    rounded="rounded-[1.75rem]"
                />


                <div
                    className="
                        grid
                        gap-5

                        lg:grid-cols-2
                    "
                >

                    <Skeleton
                        width="w-full"
                        height="h-80"
                        rounded="rounded-[1.75rem]"
                    />

                    <Skeleton
                        width="w-full"
                        height="h-80"
                        rounded="rounded-[1.75rem]"
                    />

                </div>

            </div>
        );
    }


    // =========================================
    // ERROR
    // =========================================

    if (
        detailError &&
        !order
    ) {

        return (

            <ErrorState
                title="Unable to load order"

                description={
                    typeof detailError ===
                        "string"
                        ? detailError
                        : "Unable to fetch order details."
                }

                onRetry={
                    handleRetry
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
                icon={ShoppingBag}
                title="Order not found"
                description="The requested restaurant order could not be found."

                action={
                    <Button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/restaurant/orders"
                            )
                        }
                    >
                        Back to Orders
                    </Button>
                }
            />
        );
    }


    // =========================================
    // DERIVED DATA
    // =========================================

    const currentStatus =
        statusConfig[
        order.status
        ] || {

            label:
                order.status,

            variant:
                "neutral",
        };


    const customerAddress = [

        order.addressLine,

        order.landmark,

        order.city,

        order.state,

        order.pincode,

    ]
        .filter(Boolean)
        .join(", ");


    // =========================================
    // RENDER
    // =========================================

    return (

        <div
            className="
                space-y-6
            "
        >

            {/* =========================
                BACK BUTTON
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

                <ArrowLeft
                    className="
                        mr-2
                        h-4
                        w-4
                    "
                />

                Back to Orders

            </Button>


            {/* =========================
                ORDER HEADER
            ========================== */}

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
                        flex-col
                        gap-5

                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-3
                            "
                        >

                            <h1
                                className="
                                    text-2xl
                                    font-black
                                    text-slate-900

                                    sm:text-3xl
                                "
                            >
                                Order{" "}
                                {
                                    order.orderNumber
                                }
                            </h1>


                            <StatusBadge
                                variant={
                                    currentStatus
                                        .variant
                                }

                                dot
                            >
                                {
                                    currentStatus
                                        .label
                                }
                            </StatusBadge>

                        </div>


                        <div
                            className="
                                mt-3
                                flex
                                flex-wrap
                                gap-x-5
                                gap-y-2

                                text-sm
                                font-semibold
                                text-slate-500
                            "
                        >

                            <span
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <Hash
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                Checkout:{" "}

                                {
                                    order.checkoutNumber ||
                                    "-"
                                }

                            </span>


                            <span
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <CalendarDays
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                {
                                    formatDate(
                                        order.createdAt
                                    )
                                }

                            </span>

                        </div>

                    </div>


                    {/* ACTION BUTTONS */}

                    <div
                        className="
                            flex
                            flex-wrap
                            gap-2
                        "
                    >

                        {
                            order.status ===
                            "PLACED" && (

                                <>

                                    <Button
                                        type="button"

                                        disabled={
                                            actionLoading
                                        }

                                        onClick={
                                            handleAccept
                                        }
                                    >

                                        <CheckCircle2
                                            className="
                                                mr-2
                                                h-4
                                                w-4
                                            "
                                        />

                                        Accept Order

                                    </Button>


                                    <Button
                                        type="button"

                                        variant="danger"

                                        disabled={
                                            actionLoading
                                        }

                                        onClick={() =>
                                            setShowRejectForm(
                                                true
                                            )
                                        }
                                    >

                                        <XCircle
                                            className="
                                                mr-2
                                                h-4
                                                w-4
                                            "
                                        />

                                        Reject

                                    </Button>

                                </>
                            )
                        }


                        {
                            order.status ===
                            "CONFIRMED" && (

                                <Button
                                    type="button"

                                    disabled={
                                        actionLoading
                                    }

                                    onClick={
                                        handlePreparing
                                    }
                                >

                                    <ChefHat
                                        className="
                                            mr-2
                                            h-4
                                            w-4
                                        "
                                    />

                                    Start Preparing

                                </Button>
                            )
                        }


                        {
                            order.status ===
                            "PREPARING" && (

                                <Button
                                    type="button"

                                    disabled={
                                        actionLoading
                                    }

                                    onClick={
                                        handleReady
                                    }
                                >

                                    <PackageCheck
                                        className="
                                            mr-2
                                            h-4
                                            w-4
                                        "
                                    />

                                    Mark Ready

                                </Button>
                            )
                        }

                    </div>

                </div>


                {
                    actionError && (

                        <div
                            className="
                                mt-4

                                rounded-xl

                                border
                                border-red-200

                                bg-red-50

                                px-4
                                py-3

                                text-sm
                                font-semibold
                                text-red-700
                            "
                        >
                            {
                                actionError
                            }
                        </div>
                    )
                }


                {/* REJECT FORM */}

                {
                    showRejectForm &&
                    order.status ===
                    "PLACED" && (

                        <div
                            className="
                                mt-5

                                rounded-2xl

                                border
                                border-red-100

                                bg-red-50/60

                                p-4
                            "
                        >

                            <label
                                className="
                                    text-sm
                                    font-black
                                    text-slate-800
                                "
                            >
                                Why are you rejecting
                                this order?
                            </label>


                            <textarea
                                rows={4}

                                value={
                                    rejectionReason
                                }

                                onChange={(
                                    event
                                ) =>
                                    setRejectionReason(
                                        event.target
                                            .value
                                    )
                                }

                                placeholder="
                                    Example:
                                    Ordered item is
                                    currently unavailable.
                                "

                                className="
                                    mt-3
                                    w-full

                                    resize-none

                                    rounded-xl

                                    border
                                    border-slate-200

                                    bg-white

                                    px-4
                                    py-3

                                    text-sm

                                    outline-none

                                    focus:border-red-300
                                    focus:ring-4
                                    focus:ring-red-50
                                "
                            />


                            <div
                                className="
                                    mt-3
                                    flex
                                    justify-end
                                    gap-2
                                "
                            >

                                <Button
                                    type="button"

                                    variant="ghost"

                                    onClick={() => {

                                        setShowRejectForm(
                                            false
                                        );

                                        setRejectionReason(
                                            ""
                                        );
                                    }}
                                >
                                    Cancel
                                </Button>


                                <Button
                                    type="button"

                                    variant="danger"

                                    disabled={
                                        actionLoading ||
                                        !rejectionReason
                                            .trim()
                                    }

                                    onClick={
                                        handleReject
                                    }
                                >
                                    Confirm Reject
                                </Button>

                            </div>

                        </div>
                    )
                }

            </section>


            {/* =========================
                CUSTOMER DETAILS
            ========================== */}

            <div
                className="
                    grid
                    gap-5

                    lg:grid-cols-2
                "
            >

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

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center

                                rounded-xl

                                bg-orange-50

                                text-orange-600
                            "
                        >
                            <UserRound
                                className="
                                    h-5
                                    w-5
                                "
                            />
                        </div>


                        <div>

                            <h2
                                className="
                                    font-black
                                    text-slate-900
                                "
                            >
                                Customer Details
                            </h2>

                            <p
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Customer who placed
                                this order
                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            mt-5
                            space-y-4
                        "
                    >

                        <DetailRow
                            icon={
                                UserRound
                            }

                            label="Customer Name"

                            value={
                                order.deliveryName ||
                                "-"
                            }
                        />


                        <DetailRow
                            icon={
                                Phone
                            }

                            label="Phone Number"

                            value={
                                order.deliveryPhone ||
                                "-"
                            }
                        />

                    </div>

                </section>


                {/* DELIVERY ADDRESS */}

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

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center

                                rounded-xl

                                bg-orange-50

                                text-orange-600
                            "
                        >
                            <MapPin
                                className="
                                    h-5
                                    w-5
                                "
                            />
                        </div>


                        <div>

                            <h2
                                className="
                                    font-black
                                    text-slate-900
                                "
                            >
                                Delivery Address
                            </h2>

                            <p
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Where this order
                                needs to be delivered
                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            mt-5
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-semibold
                                leading-7
                                text-slate-700
                            "
                        >
                            {
                                customerAddress ||
                                "Address unavailable"
                            }
                        </p>


                        <div
                            className="
                                mt-4

                                grid
                                gap-3

                                sm:grid-cols-2
                            "
                        >

                            <SmallDetail
                                label="City"

                                value={
                                    order.city
                                }
                            />


                            <SmallDetail
                                label="State"

                                value={
                                    order.state
                                }
                            />


                            <SmallDetail
                                label="Pincode"

                                value={
                                    order.pincode
                                }
                            />


                            <SmallDetail
                                label="Landmark"

                                value={
                                    order.landmark
                                }
                            />

                        </div>

                    </div>

                </section>

            </div>


            {/* =========================
                WHAT CUSTOMER ORDERED
            ========================== */}

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
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                    "
                >

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

                                text-orange-600
                            "
                        >
                            <ShoppingBag
                                className="
                                    h-5
                                    w-5
                                "
                            />
                        </div>


                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-black
                                    text-slate-900
                                "
                            >
                                Ordered Items
                            </h2>

                            <p
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Food items ordered
                                by the customer
                            </p>

                        </div>

                    </div>


                    <span
                        className="
                            rounded-full

                            bg-slate-100

                            px-3
                            py-1.5

                            text-xs
                            font-black
                            text-slate-600
                        "
                    >
                        {
                            order.items?.length ||
                            0
                        }{" "}
                        items
                    </span>

                </div>


                {
                    order.items?.length > 0 ? (

                        <div
                            className="
                                mt-5

                                divide-y
                                divide-slate-100
                            "
                        >

                            {
                                order.items.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <div
                                            key={
                                                item.slug ||
                                                index
                                            }

                                            className="
                                                flex
                                                flex-col
                                                gap-4
                                                py-4

                                                first:pt-0

                                                sm:flex-row
                                                sm:items-center
                                            "
                                        >

                                            {/* IMAGE */}

                                            <div
                                                className="
                                                    h-24
                                                    w-24
                                                    shrink-0

                                                    overflow-hidden

                                                    rounded-2xl

                                                    bg-slate-100
                                                "
                                            >

                                                {
                                                    item.image ? (

                                                        <OptimizedImage
                                                            src={
                                                                item.image
                                                            }

                                                            alt={
                                                                item.name
                                                            }

                                                            className="
                                                                h-full
                                                                w-full
                                                                object-cover
                                                            "
                                                        />

                                                    ) : (

                                                        <div
                                                            className="
                                                                flex
                                                                h-full
                                                                w-full
                                                                items-center
                                                                justify-center
                                                            "
                                                        >
                                                            <ShoppingBag
                                                                className="
                                                                    h-6
                                                                    w-6
                                                                    text-slate-300
                                                                "
                                                            />
                                                        </div>
                                                    )
                                                }

                                            </div>


                                            {/* FOOD DETAILS */}

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
                                                        text-xs
                                                        font-semibold
                                                        text-slate-400
                                                    "
                                                >
                                                    {
                                                        item.slug
                                                    }
                                                </p>


                                                <div
                                                    className="
                                                        mt-3

                                                        flex
                                                        flex-wrap
                                                        gap-3
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            rounded-lg

                                                            bg-slate-100

                                                            px-2.5
                                                            py-1.5

                                                            text-xs
                                                            font-bold
                                                            text-slate-600
                                                        "
                                                    >
                                                        Qty:{" "}

                                                        {
                                                            item.quantity
                                                        }
                                                    </span>


                                                    <span
                                                        className="
                                                            rounded-lg

                                                            bg-slate-100

                                                            px-2.5
                                                            py-1.5

                                                            text-xs
                                                            font-bold
                                                            text-slate-600
                                                        "
                                                    >
                                                        Unit:{" "}

                                                        {
                                                            formatPrice(
                                                                item.unitPrice
                                                            )
                                                        }
                                                    </span>

                                                </div>

                                            </div>


                                            {/* TOTAL */}

                                            <div
                                                className="
                                                    sm:text-right
                                                "
                                            >

                                                <p
                                                    className="
                                                        text-xs
                                                        font-bold
                                                        uppercase
                                                        tracking-wider
                                                        text-slate-400
                                                    "
                                                >
                                                    Item Total
                                                </p>


                                                <p
                                                    className="
                                                        mt-1
                                                        text-lg
                                                        font-black
                                                        text-slate-900
                                                    "
                                                >
                                                    {
                                                        formatPrice(
                                                            item.itemTotal
                                                        )
                                                    }
                                                </p>

                                            </div>

                                        </div>
                                    )
                                )
                            }

                        </div>

                    ) : (

                        <div
                            className="
                                py-12
                                text-center
                            "
                        >
                            <ShoppingBag
                                className="
                                    mx-auto
                                    h-8
                                    w-8
                                    text-slate-300
                                "
                            />

                            <p
                                className="
                                    mt-3
                                    text-sm
                                    font-bold
                                    text-slate-500
                                "
                            >
                                No order items found.
                            </p>
                        </div>
                    )
                }

            </section>


            {/* =========================
                PAYMENT + BILL
            ========================== */}

            <div
                className="
                    grid
                    gap-5

                    lg:grid-cols-[1fr_0.8fr]
                "
            >

                {/* PAYMENT INFO */}

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
                                text-slate-900
                            "
                        >
                            Payment Details
                        </h2>

                    </div>


                    <div
                        className="
                            mt-5

                            grid
                            gap-4

                            sm:grid-cols-2
                        "
                    >

                        <SmallDetail
                            label="Payment Method"

                            value={
                                order.paymentMethod
                            }
                        />


                        <div>

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    text-slate-400
                                "
                            >
                                Payment Status
                            </p>


                            <div
                                className="
                                    mt-2
                                "
                            >

                                <StatusBadge
                                    variant={
                                        order.paymentStatus ===
                                            "PAID"
                                            ? "success"
                                            : "warning"
                                    }

                                    dot
                                >
                                    {
                                        order.paymentStatus ||
                                        "-"
                                    }
                                </StatusBadge>

                            </div>

                        </div>


                        <SmallDetail
                            label="Checkout Number"

                            value={
                                order.checkoutNumber
                            }
                        />


                        <SmallDetail
                            label="Order Date"

                            value={
                                formatDate(
                                    order.createdAt
                                )
                            }
                        />

                    </div>

                </section>


                {/* BILL SUMMARY */}

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

                        <ReceiptText
                            className="
                                h-5
                                w-5
                                text-orange-500
                            "
                        />


                        <h2
                            className="
                                font-black
                                text-slate-900
                            "
                        >
                            Bill Summary
                        </h2>

                    </div>


                    <div
                        className="
                            mt-5
                            space-y-3
                        "
                    >

                        <PriceRow
                            label="Subtotal"

                            value={
                                order.subtotal
                            }
                        />


                        <PriceRow
                            label="Delivery Fee"

                            value={
                                order.deliveryFee
                            }
                        />


                        <PriceRow
                            label="Tax"

                            value={
                                order.taxAmount
                            }
                        />


                        <div
                            className="
                                mt-4

                                flex
                                items-center
                                justify-between

                                border-t
                                border-slate-100

                                pt-4
                            "
                        >

                            <span
                                className="
                                    font-black
                                    text-slate-900
                                "
                            >
                                Total Amount
                            </span>


                            <span
                                className="
                                    text-xl
                                    font-black
                                    text-orange-600
                                "
                            >
                                {
                                    formatPrice(
                                        order.totalAmount
                                    )
                                }
                            </span>

                        </div>

                    </div>

                </section>

            </div>


            {/* =========================
                ORDER TIMELINE
            ========================== */}

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
                            text-slate-900
                        "
                    >
                        Order Timeline
                    </h2>

                </div>


                <div
                    className="
                        mt-5

                        grid
                        gap-3

                        sm:grid-cols-2
                        lg:grid-cols-4
                    "
                >

                    <TimelineCard
                        label="Placed"

                        value={
                            order.createdAt
                        }
                    />


                    <TimelineCard
                        label="Confirmed"

                        value={
                            order.confirmedAt
                        }
                    />


                    <TimelineCard
                        label="Preparing"

                        value={
                            order.preparingAt
                        }
                    />


                    <TimelineCard
                        label="Ready"

                        value={
                            order.readyAt
                        }
                    />


                    <TimelineCard
                        label="Picked Up"

                        value={
                            order.pickedUpAt
                        }
                    />


                    <TimelineCard
                        label="Delivered"

                        value={
                            order.deliveredAt
                        }
                    />


                    <TimelineCard
                        label="Cancelled"

                        value={
                            order.cancelledAt
                        }
                    />

                </div>


                {
                    order.rejectionReason && (

                        <div
                            className="
                                mt-5

                                rounded-xl

                                border
                                border-red-100

                                bg-red-50

                                p-4
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-black
                                    uppercase
                                    tracking-wider
                                    text-red-500
                                "
                            >
                                Rejection Reason
                            </p>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    font-semibold
                                    text-red-700
                                "
                            >
                                {
                                    order.rejectionReason
                                }
                            </p>

                        </div>
                    )
                }


                {
                    order.cancelledReason && (

                        <div
                            className="
                                mt-5

                                rounded-xl

                                border
                                border-slate-200

                                bg-slate-50

                                p-4
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-black
                                    uppercase
                                    tracking-wider
                                    text-slate-500
                                "
                            >
                                Cancellation Reason
                            </p>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                {
                                    order.cancelledReason
                                }
                            </p>

                        </div>
                    )
                }

            </section>

        </div>
    );
};


// =========================================
// DETAIL ROW
// =========================================

const DetailRow = ({
    icon: Icon,
    label,
    value,
}) => {

    return (

        <div
            className="
                flex
                gap-3
            "
        >

            <div
                className="
                    mt-0.5

                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center

                    rounded-lg

                    bg-slate-100

                    text-slate-500
                "
            >
                <Icon
                    className="
                        h-4
                        w-4
                    "
                />
            </div>


            <div>

                <p
                    className="
                        text-xs
                        font-bold
                        text-slate-400
                    "
                >
                    {
                        label
                    }
                </p>


                <p
                    className="
                        mt-1
                        font-black
                        text-slate-800
                    "
                >
                    {
                        value ||
                        "-"
                    }
                </p>

            </div>

        </div>
    );
};


// =========================================
// SMALL DETAIL
// =========================================

const SmallDetail = ({
    label,
    value,
}) => {

    return (

        <div>

            <p
                className="
                    text-xs
                    font-bold
                    text-slate-400
                "
            >
                {
                    label
                }
            </p>


            <p
                className="
                    mt-1
                    text-sm
                    font-black
                    text-slate-800
                "
            >
                {
                    value ||
                    "-"
                }
            </p>

        </div>
    );
};


// =========================================
// PRICE ROW
// =========================================

const PriceRow = ({
    label,
    value,
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
                className="
                    text-sm
                    font-semibold
                    text-slate-500
                "
            >
                {
                    label
                }
            </span>


            <span
                className="
                    text-sm
                    font-black
                    text-slate-800
                "
            >
                {
                    formatPrice(
                        value
                    )
                }
            </span>

        </div>
    );
};


// =========================================
// TIMELINE CARD
// =========================================

const TimelineCard = ({
    label,
    value,
}) => {

    return (

        <div
            className="
                rounded-xl

                border
                border-slate-100

                bg-slate-50

                p-4
            "
        >

            <p
                className="
                    text-xs
                    font-black
                    uppercase
                    tracking-wider
                    text-slate-400
                "
            >
                {
                    label
                }
            </p>


            <p
                className="
                    mt-2
                    text-sm
                    font-bold
                    text-slate-800
                "
            >
                {
                    value
                        ? formatDate(
                            value
                        )
                        : "-"
                }
            </p>

        </div>
    );
};


export default RestaurantOrderDetails;