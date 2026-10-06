import {
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    CheckCircle2,
    ChefHat,
    Clock3,
    PackageCheck,
    PackageOpen,
    Search,
    ShoppingBag,
    XCircle,
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



const RestaurantOrders = () => {
    const navigate =
        useNavigate();


    // =========================================
    // DUMMY STATE
    // Later exactly Redux state se replace hoga
    // =========================================

    const [
        orders,
        setOrders,
    ] = useState([
        {
            orderNumber:
                "ORD-31FA3A64",

            status:
                "PLACED",

            subtotal:
                320,

            deliveryFee:
                29,

            taxAmount:
                16,

            totalAmount:
                365,

            createdAt:
                "2026-10-06T09:20:00.000Z",

            checkoutNumber:
                "CHK-61ABC90",

            paymentMethod:
                "COD",

            paymentStatus:
                "PENDING",

            customerName:
                "Rahul Kumar",

            totalItems:
                2,
        },

        {
            orderNumber:
                "ORD-82KL9B21",

            status:
                "CONFIRMED",

            subtotal:
                570,

            deliveryFee:
                29,

            taxAmount:
                28,

            totalAmount:
                627,

            createdAt:
                "2026-10-06T09:05:00.000Z",

            checkoutNumber:
                "CHK-91QWE72",

            paymentMethod:
                "ONLINE",

            paymentStatus:
                "PAID",

            customerName:
                "Aman Singh",

            totalItems:
                4,
        },

        {
            orderNumber:
                "ORD-52PT7C94",

            status:
                "PREPARING",

            subtotal:
                400,

            deliveryFee:
                29,

            taxAmount:
                20,

            totalAmount:
                449,

            createdAt:
                "2026-10-06T08:48:00.000Z",

            checkoutNumber:
                "CHK-81PLM29",

            paymentMethod:
                "COD",

            paymentStatus:
                "PENDING",

            customerName:
                "Mohit Sharma",

            totalItems:
                3,
        },

        {
            orderNumber:
                "ORD-93MN6A43",

            status:
                "READY_FOR_PICKUP",

            subtotal:
                720,

            deliveryFee:
                29,

            taxAmount:
                36,

            totalAmount:
                785,

            createdAt:
                "2026-10-06T08:35:00.000Z",

            checkoutNumber:
                "CHK-27RTY66",

            paymentMethod:
                "ONLINE",

            paymentStatus:
                "PAID",

            customerName:
                "Rohit Verma",

            totalItems:
                5,
        },

        {
            orderNumber:
                "ORD-48YU3M22",

            status:
                "DELIVERED",

            subtotal:
                280,

            deliveryFee:
                29,

            taxAmount:
                14,

            totalAmount:
                323,

            createdAt:
                "2026-10-06T07:50:00.000Z",

            checkoutNumber:
                "CHK-55POI12",

            paymentMethod:
                "ONLINE",

            paymentStatus:
                "PAID",

            customerName:
                "Neha Gupta",

            totalItems:
                2,
        },

        {
            orderNumber:
                "ORD-71LK5P18",

            status:
                "REJECTED",

            subtotal:
                450,

            deliveryFee:
                29,

            taxAmount:
                22,

            totalAmount:
                501,

            createdAt:
                "2026-10-06T07:20:00.000Z",

            checkoutNumber:
                "CHK-41GHJ80",

            paymentMethod:
                "COD",

            paymentStatus:
                "PENDING",

            customerName:
                "Ankit Yadav",

            totalItems:
                3,
        },
    ]);


    const [
        pagination,
        setPagination,
    ] = useState({
        page: 1,
        limit: 10,
        total: 6,
        totalPages: 1,
    });


    const [
        fetchLoading,
        setFetchLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState(null);


    // =========================================
    // FILTER STATE
    // Later API params banenge
    // =========================================

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");


    const [
        statusFilter,
        setStatusFilter,
    ] = useState("ALL");


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
                "Ready",

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
    // FORMAT PRICE
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
    // FORMAT DATE
    // =========================================

    const formatDate = (
        date
    ) => {
        if (!date) return "-";


        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day:
                    "2-digit",

                month:
                    "short",

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
    // FILTERED ORDERS
    // UI ONLY
    //
    // Later:
    // getRestaurantOrders({
    //   page,
    //   limit,
    //   status,
    // })
    // =========================================

    const filteredOrders =
        useMemo(() => {
            const search =
                searchTerm
                    .trim()
                    .toLowerCase();


            return orders.filter(
                (order) => {
                    const matchesStatus =
                        statusFilter ===
                        "ALL" ||
                        order.status ===
                        statusFilter;


                    const matchesSearch =
                        !search ||
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
                            );


                    return (
                        matchesStatus &&
                        matchesSearch
                    );
                }
            );
        }, [
            orders,
            searchTerm,
            statusFilter,
        ]);


    // =========================================
    // STATS
    // =========================================

    const stats =
        useMemo(() => {
            return [
                {
                    title:
                        "Total Orders",

                    value:
                        orders.length,

                    description:
                        "All restaurant orders",

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
                        "Waiting for response",

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
                        "Currently cooking",

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
                        "Waiting for pickup",

                    icon:
                        PackageCheck,

                    variant:
                        "success",
                },
            ];
        }, [orders]);


    // =========================================
    // FILTER OPTIONS
    // =========================================

    const statusOptions = [
        {
            label:
                "All Orders",

            value:
                "ALL",
        },

        {
            label:
                "Placed",

            value:
                "PLACED",
        },

        {
            label:
                "Confirmed",

            value:
                "CONFIRMED",
        },

        {
            label:
                "Preparing",

            value:
                "PREPARING",
        },

        {
            label:
                "Ready",

            value:
                "READY_FOR_PICKUP",
        },

        {
            label:
                "Delivery Assigned",

            value:
                "DELIVERY_ASSIGNED",
        },

        {
            label:
                "Picked Up",

            value:
                "PICKED_UP",
        },

        {
            label:
                "Out For Delivery",

            value:
                "OUT_FOR_DELIVERY",
        },

        {
            label:
                "Delivered",

            value:
                "DELIVERED",
        },

        {
            label:
                "Rejected",

            value:
                "REJECTED",
        },

        {
            label:
                "Cancelled",

            value:
                "CANCELLED",
        },
    ];


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
                                order.customerName
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
                                order.totalItems
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
                        {formatPrice(
                            order.totalAmount
                        )}
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
                                order.paymentStatus
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
                                order.paymentMethod
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
                                order.status,

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
                        {formatDate(
                            order.createdAt
                        )}
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
    // CLEAR FILTERS
    // =========================================

    const clearFilters =
        () => {
            setSearchTerm("");
            setStatusFilter(
                "ALL"
            );
        };


    const hasFilters =
        Boolean(
            searchTerm.trim()
        ) ||
        statusFilter !==
        "ALL";


    // =========================================
    // ERROR STATE
    // =========================================

    if (error) {
        return (
            <ErrorState
                title="Unable to load orders"

                description={
                    typeof error ===
                        "string"
                        ? error
                        : "Something went wrong while loading restaurant orders."
                }
            />
        );
    }


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
                {stats.map(
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
                )}
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

                            placeholder="Search order, customer or checkout..."

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


                    {/* STATUS FILTER */}

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

                            onChange={(
                                event
                            ) =>
                                setStatusFilter(
                                    event.target
                                        .value
                                )
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
                            {statusOptions.map(
                                (option) => (
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
                            )}
                        </select>


                        {hasFilters && (
                            <Button
                                type="button"

                                variant="ghost"

                                onClick={
                                    clearFilters
                                }
                            >
                                Clear
                            </Button>
                        )}
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


                {statusFilter !==
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
                    )}
            </div>


            {/* =========================
          TABLE
      ========================== */}

            {/*
        CommonTable loading=true hone par
        common table ka skeleton use karega.

        Page me separate table/skeleton
        component create nahi karenge.
      */}

            {!fetchLoading &&
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
            )}
        </div>
    );
};


export default RestaurantOrders;