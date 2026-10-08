import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    ChefHat,
    PackageCheck,
    PackageOpen,
    Search,
    ShoppingBag,
} from "lucide-react";


import PageHeader
    from "../../../components/common/PageHeader/PageHeader";

import StatCard
    from "../../../components/common/StatCard/StatCard";

import StatusBadge
    from "../../../components/common/StatusBadge/StatusBadge";

import CommonTable
    from "../../../components/common/CommonTable/CommonTable";

import Button
    from "../../../components/common/Button/Button";

import EmptyState
    from "../../../components/common/EmptyState/EmptyState";

import ErrorState
    from "../../../components/common/ErrorState/ErrorState";


import {
    getRestaurantOrders,
} from "../../../redux/thunks/restaurant/restaurantOrder.thunk";


// =========================================
// STATUS CONFIG
// =========================================

const statusConfig = {

    PLACED: {
        label: "Placed",
        variant: "warning",
    },

    CONFIRMED: {
        label: "Confirmed",
        variant: "info",
    },

    PREPARING: {
        label: "Preparing",
        variant: "purple",
    },

    READY_FOR_PICKUP: {
        label: "Ready",
        variant: "success",
    },

    DELIVERY_ASSIGNED: {
        label: "Delivery Assigned",
        variant: "info",
    },

    PICKED_UP: {
        label: "Picked Up",
        variant: "info",
    },

    OUT_FOR_DELIVERY: {
        label: "Out For Delivery",
        variant: "warning",
    },

    DELIVERED: {
        label: "Delivered",
        variant: "success",
    },

    REJECTED: {
        label: "Rejected",
        variant: "danger",
    },

    CANCELLED: {
        label: "Cancelled",
        variant: "danger",
    },
};


// =========================================
// STATUS FILTER OPTIONS
// =========================================

const statusOptions = [

    {
        label: "All Orders",
        value: "ALL",
    },

    {
        label: "Placed",
        value: "PLACED",
    },

    {
        label: "Confirmed",
        value: "CONFIRMED",
    },

    {
        label: "Preparing",
        value: "PREPARING",
    },

    {
        label: "Ready",
        value: "READY_FOR_PICKUP",
    },

    {
        label: "Delivery Assigned",
        value: "DELIVERY_ASSIGNED",
    },

    {
        label: "Picked Up",
        value: "PICKED_UP",
    },

    {
        label: "Out For Delivery",
        value: "OUT_FOR_DELIVERY",
    },

    {
        label: "Delivered",
        value: "DELIVERED",
    },

    {
        label: "Rejected",
        value: "REJECTED",
    },

    {
        label: "Cancelled",
        value: "CANCELLED",
    },
];


// =========================================
// PRICE
// =========================================

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
    date
) => {

    if (!date) {
        return "-";
    }


    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        }
    ).format(
        new Date(date)
    );
};


// =========================================
// COMPONENT
// =========================================

const RestaurantOrders = () => {

    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();


    // =========================================
    // REDUX
    // =========================================

    const {

        orders = [],

        pagination = {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1,
        },

        fetchLoading,

        error,

    } = useSelector(
        (state) =>
            state.restaurantOrder
    ) || {};


    // =========================================
    // LOCAL STATE
    // =========================================

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");


    const [
        statusFilter,
        setStatusFilter,
    ] = useState("ALL");


    const [
        page,
        setPage,
    ] = useState(1);


    const limit = 10;


    // =========================================
    // FETCH ORDERS
    // =========================================

    useEffect(() => {

        dispatch(
            getRestaurantOrders({

                page,

                limit,

                status:
                    statusFilter ===
                        "ALL"
                        ? undefined
                        : statusFilter,
            })
        );

    }, [
        dispatch,
        page,
        statusFilter,
    ]);


    // =========================================
    // SEARCH
    // =========================================
    //
    // Status backend handle kar raha hai.
    //
    // Search current loaded page par
    // frontend me rahega.
    // =========================================

    const filteredOrders =
        useMemo(
            () => {

                const search =
                    searchTerm
                        .trim()
                        .toLowerCase();


                if (!search) {
                    return orders;
                }


                return orders.filter(
                    (order) => {

                        return (

                            order.orderNumber
                                ?.toLowerCase()
                                .includes(
                                    search
                                ) ||

                            order.customerName
                                ?.toLowerCase()
                                .includes(
                                    search
                                ) ||

                            order.checkoutNumber
                                ?.toLowerCase()
                                .includes(
                                    search
                                )
                        );
                    }
                );

            },
            [
                orders,
                searchTerm,
            ]
        );


    // =========================================
    // STATS
    // =========================================

    const stats =
        useMemo(
            () => {

                return [

                    {
                        title:
                            "Total Orders",

                        value:
                            pagination?.total ??
                            orders.length,

                        description:
                            statusFilter === "ALL"
                                ? "All restaurant orders"
                                : "Orders in selected status",

                        icon:
                            ShoppingBag,

                        variant:
                            "orange",
                    },


                    {
                        title:
                            "New Orders",

                        value:
                            orders.filter(
                                (order) =>
                                    order.status ===
                                    "PLACED"
                            ).length,

                        description:
                            "On current page",

                        icon:
                            PackageOpen,

                        variant:
                            "warning",
                    },


                    {
                        title:
                            "Preparing",

                        value:
                            orders.filter(
                                (order) =>
                                    order.status ===
                                    "PREPARING"
                            ).length,

                        description:
                            "On current page",

                        icon:
                            ChefHat,

                        variant:
                            "purple",
                    },


                    {
                        title:
                            "Ready",

                        value:
                            orders.filter(
                                (order) =>
                                    order.status ===
                                    "READY_FOR_PICKUP"
                            ).length,

                        description:
                            "On current page",

                        icon:
                            PackageCheck,

                        variant:
                            "success",
                    },
                ];

            },
            [
                orders,
                pagination?.total,
                statusFilter,
            ]
        );


    // =========================================
    // TABLE COLUMNS
    // =========================================

    const columns = [

        {
            key:
                "orderNumber",

            label:
                "Order",

            render:
                (order) => (

                    <button
                        type="button"

                        onClick={() =>
                            navigate(
                                `/restaurant/orders/${order.orderNumber}`
                            )
                        }

                        className="
                            text-left
                            font-black
                            text-slate-900

                            transition

                            hover:text-orange-600
                        "
                    >
                        {
                            order.orderNumber
                        }
                    </button>
                ),
        },


        {
            key:
                "customerName",

            label:
                "Customer",

            render:
                (order) => (

                    <div>

                        <p
                            className="
                                font-bold
                                text-slate-800
                            "
                        >
                            {
                                order.customerName ||
                                "-"
                            }
                        </p>


                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-slate-400
                            "
                        >
                            {
                                order.totalItems ??
                                0
                            }{" "}
                            items
                        </p>

                    </div>
                ),
        },


        {
            key:
                "totalAmount",

            label:
                "Amount",

            render:
                (order) => (

                    <span
                        className="
                            font-black
                            text-slate-900
                        "
                    >
                        {
                            formatPrice(
                                order.totalAmount
                            )
                        }
                    </span>
                ),
        },


        {
            key:
                "paymentStatus",

            label:
                "Payment",

            render:
                (order) => (

                    <div
                        className="
                            space-y-1
                        "
                    >

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
                                order.paymentStatus ||
                                "-"
                            }
                        </StatusBadge>


                        <p
                            className="
                                text-[11px]
                                font-semibold
                                text-slate-400
                            "
                        >
                            {
                                order.paymentMethod ||
                                "-"
                            }
                        </p>

                    </div>
                ),
        },


        {
            key:
                "status",

            label:
                "Status",

            render:
                (order) => {

                    const config =
                        statusConfig[
                            order.status
                        ] || {
                            label:
                                order.status ||
                                "-",

                            variant:
                                "neutral",
                        };


                    return (

                        <StatusBadge
                            variant={
                                config.variant
                            }

                            size="sm"

                            dot
                        >
                            {
                                config.label
                            }
                        </StatusBadge>
                    );
                },
        },


        {
            key:
                "createdAt",

            label:
                "Received",

            render:
                (order) => (

                    <span
                        className="
                            text-sm
                            text-slate-500
                        "
                    >
                        {
                            formatDate(
                                order.createdAt
                            )
                        }
                    </span>
                ),
        },


        {
            key:
                "action",

            label:
                "Action",

            align:
                "right",

            render:
                (order) => (

                    <Button
                        type="button"

                        variant="ghost"

                        onClick={() =>
                            navigate(
                                `/restaurant/orders/${order.orderNumber}`
                            )
                        }
                    >
                        View
                    </Button>
                ),
        },
    ];


    // =========================================
    // STATUS CHANGE
    // =========================================

    const handleStatusChange =
        (
            event
        ) => {

            setStatusFilter(
                event.target.value
            );

            setPage(1);
        };


    // =========================================
    // CLEAR FILTER
    // =========================================

    const clearFilters =
        () => {

            setSearchTerm("");

            setStatusFilter(
                "ALL"
            );

            setPage(1);
        };


    const hasFilters =
        Boolean(
            searchTerm.trim()
        ) ||
        statusFilter !==
            "ALL";


    // =========================================
    // RETRY
    // =========================================

    const handleRetry =
        () => {

            dispatch(
                getRestaurantOrders({

                    page,

                    limit,

                    status:
                        statusFilter ===
                            "ALL"
                            ? undefined
                            : statusFilter,
                })
            );
        };


    // =========================================
    // ERROR
    // =========================================

    if (
        error &&
        orders.length === 0
    ) {

        return (

            <ErrorState
                title="Unable to load orders"

                description={
                    typeof error ===
                        "string"
                        ? error
                        : "Something went wrong while loading restaurant orders."
                }

                onRetry={
                    handleRetry
                }
            />
        );
    }


    // =========================================
    // RENDER
    // =========================================

    return (

        <div
            className="
                space-y-7
            "
        >

            {/* =========================
                PAGE HEADER
            ========================== */}

            <PageHeader
                title="Orders"

                description="
                    View and manage all orders
                    received by your restaurant.
                "
            />


            {/* =========================
                STATS
            ========================== */}

            <section
                className="
                    grid
                    gap-4

                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >

                {
                    stats.map(
                        (stat) => (

                            <StatCard
                                key={
                                    stat.title
                                }

                                title={
                                    stat.title
                                }

                                value={
                                    stat.value
                                }

                                description={
                                    stat.description
                                }

                                icon={
                                    stat.icon
                                }

                                variant={
                                    stat.variant
                                }

                                loading={
                                    fetchLoading
                                }
                            />
                        )
                    )
                }

            </section>


            {/* =========================
                FILTERS
            ========================== */}

            <section
                className="
                    rounded-[1.5rem]

                    border
                    border-slate-200

                    bg-white

                    p-4

                    shadow-sm
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-3

                        xl:flex-row
                        xl:items-center
                        xl:justify-between
                    "
                >

                    {/* SEARCH */}

                    <div
                        className="
                            relative
                            w-full

                            xl:max-w-md
                        "
                    >

                        <Search
                            className="
                                pointer-events-none

                                absolute
                                left-4
                                top-1/2

                                h-4
                                w-4

                                -translate-y-1/2

                                text-slate-400
                            "
                        />


                        <input
                            type="search"

                            value={
                                searchTerm
                            }

                            onChange={(
                                event
                            ) =>
                                setSearchTerm(
                                    event.target
                                        .value
                                )
                            }

                            placeholder="
                                Search order,
                                customer or checkout...
                            "

                            className="
                                h-11
                                w-full

                                rounded-xl

                                border
                                border-slate-200

                                bg-slate-50

                                pl-11
                                pr-4

                                text-sm
                                text-slate-900

                                outline-none

                                transition

                                placeholder:text-slate-400

                                focus:border-orange-300
                                focus:bg-white
                                focus:ring-4
                                focus:ring-orange-50
                            "
                        />

                    </div>


                    {/* STATUS */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >

                        <select
                            value={
                                statusFilter
                            }

                            onChange={
                                handleStatusChange
                            }

                            className="
                                h-11

                                rounded-xl

                                border
                                border-slate-200

                                bg-white

                                px-4

                                text-sm
                                font-bold
                                text-slate-700

                                outline-none

                                transition

                                focus:border-orange-300
                                focus:ring-4
                                focus:ring-orange-50
                            "
                        >

                            {
                                statusOptions.map(
                                    (
                                        option
                                    ) => (

                                        <option
                                            key={
                                                option.value
                                            }

                                            value={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    )
                                )
                            }

                        </select>


                        {
                            hasFilters && (

                                <Button
                                    type="button"

                                    variant="ghost"

                                    onClick={
                                        clearFilters
                                    }
                                >
                                    Clear
                                </Button>
                            )
                        }

                    </div>

                </div>

            </section>


            {/* =========================
                RESULT INFO
            ========================== */}

            <div
                className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                "
            >

                <p
                    className="
                        text-sm
                        text-slate-500
                    "
                >
                    Showing{" "}

                    <span
                        className="
                            font-black
                            text-slate-900
                        "
                    >
                        {
                            filteredOrders.length
                        }
                    </span>{" "}

                    orders
                </p>


                {
                    statusFilter !==
                        "ALL" && (

                        <StatusBadge
                            variant={
                                statusConfig[
                                    statusFilter
                                ]?.variant ||
                                "neutral"
                            }

                            size="sm"

                            dot
                        >
                            {
                                statusConfig[
                                    statusFilter
                                ]?.label ||
                                statusFilter
                            }
                        </StatusBadge>
                    )
                }

            </div>


            {/* =========================
                TABLE
            ========================== */}

            {
                !fetchLoading &&
                filteredOrders.length ===
                    0 ? (

                    <EmptyState
                        icon={
                            ShoppingBag
                        }

                        title="No orders found"

                        description={
                            hasFilters
                                ? "Try changing or clearing your filters."
                                : "Customer orders will appear here."
                        }

                        action={
                            hasFilters
                                ? {
                                    label:
                                        "Clear Filters",

                                    onClick:
                                        clearFilters,
                                }
                                : undefined
                        }
                    />

                ) : (

                    <CommonTable
                        columns={
                            columns
                        }

                        data={
                            filteredOrders
                        }

                        loading={
                            fetchLoading
                        }
                    />
                )
            }


            {/* =========================
                PAGINATION
            ========================== */}

            {
                !fetchLoading &&
                orders.length > 0 &&
                (
                    pagination
                        ?.totalPages ||
                    1
                ) > 1 && (

                    <div
                        className="
                            flex
                            flex-col
                            gap-3

                            rounded-2xl

                            border
                            border-slate-200

                            bg-white

                            px-4
                            py-3

                            shadow-sm

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-500
                            "
                        >
                            Page{" "}

                            <span
                                className="
                                    font-black
                                    text-slate-900
                                "
                            >
                                {
                                    pagination?.page ||
                                    page
                                }
                            </span>

                            {" "}of{" "}

                            <span
                                className="
                                    font-black
                                    text-slate-900
                                "
                            >
                                {
                                    pagination
                                        ?.totalPages ||
                                    1
                                }
                            </span>

                            {" "}•{" "}

                            {
                                pagination?.total ||
                                0
                            }{" "}

                            orders
                        </p>


                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <Button
                                type="button"

                                variant="ghost"

                                disabled={
                                    page <= 1 ||
                                    fetchLoading
                                }

                                onClick={() =>
                                    setPage(
                                        (
                                            current
                                        ) =>
                                            Math.max(
                                                current -
                                                    1,
                                                1
                                            )
                                    )
                                }
                            >
                                Previous
                            </Button>


                            <Button
                                type="button"

                                disabled={
                                    page >=
                                        (
                                            pagination
                                                ?.totalPages ||
                                            1
                                        ) ||
                                    fetchLoading
                                }

                                onClick={() =>
                                    setPage(
                                        (
                                            current
                                        ) =>
                                            current +
                                            1
                                    )
                                }
                            >
                                Next
                            </Button>

                        </div>

                    </div>
                )
            }

        </div>
    );
};


export default RestaurantOrders;