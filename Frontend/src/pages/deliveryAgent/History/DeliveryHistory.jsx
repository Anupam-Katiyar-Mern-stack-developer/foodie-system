import {
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    CheckCircle2,
    Clock3,
    IndianRupee,
    PackageCheck,
    Search,
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


const DeliveryHistory = () => {

    const navigate =
        useNavigate();


    // =========================================
    // FILTER STATE
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
    // DUMMY HISTORY
    //
    // Later Redux/API se aayega
    // =========================================

    const deliveries = [

        {
            orderNumber:
                "ORD-A824KD92",

            restaurantName:
                "Burger Hub",

            customerName:
                "Aman Verma",

            amount:
                420,

            earning:
                68,

            distance:
                4.1,

            status:
                "DELIVERED",

            deliveredAt:
                "09 Oct 2026, 09:45 AM",
        },


        {
            orderNumber:
                "ORD-B73JKA11",

            restaurantName:
                "Pizza Point",

            customerName:
                "Mohit Singh",

            amount:
                680,

            earning:
                85,

            distance:
                5.6,

            status:
                "DELIVERED",

            deliveredAt:
                "08 Oct 2026, 08:20 PM",
        },


        {
            orderNumber:
                "ORD-C19PQM82",

            restaurantName:
                "Foodie Kitchen",

            customerName:
                "Rohit Kumar",

            amount:
                350,

            earning:
                55,

            distance:
                3.2,

            status:
                "DELIVERED",

            deliveredAt:
                "08 Oct 2026, 06:10 PM",
        },


        {
            orderNumber:
                "ORD-D82PQK41",

            restaurantName:
                "Spice Hub",

            customerName:
                "Ankit",

            amount:
                540,

            earning:
                0,

            distance:
                2.8,

            status:
                "CANCELLED",

            deliveredAt:
                "08 Oct 2026, 04:15 PM",
        },


        {
            orderNumber:
                "ORD-E19AKP32",

            restaurantName:
                "Chinese Corner",

            customerName:
                "Rahul",

            amount:
                790,

            earning:
                92,

            distance:
                6.3,

            status:
                "DELIVERED",

            deliveredAt:
                "07 Oct 2026, 09:30 PM",
        },

    ];


    // =========================================
    // FILTERED DATA
    // =========================================

    const filteredDeliveries =
        useMemo(
            () => {

                const search =
                    searchTerm
                        .trim()
                        .toLowerCase();


                return deliveries.filter(
                    (delivery) => {

                        const matchesSearch =
                            !search ||
                            delivery.orderNumber
                                .toLowerCase()
                                .includes(search) ||
                            delivery.restaurantName
                                .toLowerCase()
                                .includes(search) ||
                            delivery.customerName
                                .toLowerCase()
                                .includes(search);


                        const matchesStatus =
                            statusFilter === "ALL" ||
                            delivery.status ===
                            statusFilter;


                        return (
                            matchesSearch &&
                            matchesStatus
                        );

                    }
                );

            },
            [
                searchTerm,
                statusFilter,
            ]
        );


    // =========================================
    // STATS
    // =========================================

    const stats =
        useMemo(
            () => {

                const completed =
                    deliveries.filter(
                        (delivery) =>
                            delivery.status ===
                            "DELIVERED"
                    );


                const cancelled =
                    deliveries.filter(
                        (delivery) =>
                            delivery.status ===
                            "CANCELLED"
                    );


                const totalEarning =
                    completed.reduce(
                        (
                            total,
                            delivery
                        ) =>
                            total +
                            Number(
                                delivery.earning ||
                                0
                            ),

                        0
                    );


                return [

                    {
                        key:
                            "total",

                        title:
                            "Total Deliveries",

                        value:
                            deliveries.length,

                        description:
                            "Delivery history",

                        icon:
                            PackageCheck,

                        variant:
                            "orange",
                    },


                    {
                        key:
                            "completed",

                        title:
                            "Completed",

                        value:
                            completed.length,

                        description:
                            "Successfully delivered",

                        icon:
                            CheckCircle2,

                        variant:
                            "success",
                    },


                    {
                        key:
                            "cancelled",

                        title:
                            "Cancelled",

                        value:
                            cancelled.length,

                        description:
                            "Cancelled deliveries",

                        icon:
                            XCircle,

                        variant:
                            "danger",
                    },


                    {
                        key:
                            "earning",

                        title:
                            "Total Earnings",

                        value:
                            `₹${totalEarning}`,

                        description:
                            "Demo earning data",

                        icon:
                            IndianRupee,

                        variant:
                            "purple",
                    },

                ];

            },
            []
        );


    // =========================================
    // STATUS CONFIG
    // =========================================

    const statusConfig = {

        DELIVERED: {
            label:
                "Delivered",

            variant:
                "success",
        },


        CANCELLED: {
            label:
                "Cancelled",

            variant:
                "danger",
        },

    };


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
                (row) => (

                    <button
                        type="button"

                        onClick={() =>
                            navigate(
                                `/delivery/history/${row.orderNumber}`
                            )
                        }

                        className="
              font-black
              text-slate-900

              transition

              hover:text-orange-600
            "
                    >
                        {
                            row.orderNumber
                        }
                    </button>

                ),
        },


        {
            key:
                "restaurantName",

            label:
                "Restaurant",

            render:
                (row) => (

                    <span
                        className="
              font-semibold
              text-slate-700
            "
                    >
                        {
                            row.restaurantName
                        }
                    </span>

                ),
        },


        {
            key:
                "customerName",

            label:
                "Customer",
        },


        {
            key:
                "distance",

            label:
                "Distance",

            render:
                (row) => (

                    <span
                        className="
              text-sm
              text-slate-600
            "
                    >
                        {
                            row.distance
                        }{" "}
                        km
                    </span>

                ),
        },


        {
            key:
                "earning",

            label:
                "Earning",

            render:
                (row) => (

                    <span
                        className="
              font-black
              text-emerald-600
            "
                    >
                        ₹
                        {
                            row.earning
                        }
                    </span>

                ),
        },


        {
            key:
                "status",

            label:
                "Status",

            render:
                (row) => {

                    const config =
                        statusConfig[
                        row.status
                        ] || {
                            label:
                                row.status,

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
                "deliveredAt",

            label:
                "Date",

            render:
                (row) => (

                    <div
                        className="
              flex
              items-center
              gap-2

              text-sm
              text-slate-500
            "
                    >
                        <Clock3
                            className="
                h-4
                w-4
              "
                        />

                        {
                            row.deliveredAt
                        }
                    </div>

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
                (row) => (

                    <Button
                        type="button"

                        variant="ghost"

                        onClick={() =>
                            navigate(
                                `/delivery/history/${row.orderNumber}`
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


    return (

        <div
            className="
        space-y-7
      "
        >

            {/* =================================
          HEADER
      ================================= */}

            <PageHeader
                title="Delivery History"

                description="View your completed and previous delivery orders."
            />


            {/* =================================
          STATS
      ================================= */}

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
                                stat.key
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
                        />

                    )
                )}

            </section>


            {/* =================================
          FILTERS
      ================================= */}

            <section
                className="
          rounded-[1.5rem]

          border
          border-slate-200

          bg-white

          p-4

          shadow-sm

          sm:p-5
        "
            >

                <div
                    className="
            flex
            flex-col
            gap-3

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
                >

                    {/* SEARCH */}

                    <div
                        className="
              flex
              h-11
              w-full
              items-center
              gap-2.5

              rounded-xl

              border
              border-slate-200

              bg-slate-50

              px-3.5

              transition

              focus-within:border-orange-300
              focus-within:bg-white
              focus-within:ring-4
              focus-within:ring-orange-100

              lg:max-w-[420px]
            "
                    >

                        <Search
                            className="
                h-4
                w-4
                shrink-0
                text-orange-500
              "
                        />


                        <input
                            type="search"

                            value={
                                searchTerm
                            }

                            onChange={
                                (event) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                            }

                            placeholder="Search order, restaurant or customer..."

                            className="
                min-w-0
                flex-1

                bg-transparent

                text-sm
                text-slate-900

                outline-none

                placeholder:text-slate-400
              "
                        />

                    </div>


                    {/* STATUS */}

                    <div
                        className="
              flex
              flex-wrap
              gap-2
            "
                    >

                        {[
                            {
                                label:
                                    "All",

                                value:
                                    "ALL",
                            },

                            {
                                label:
                                    "Delivered",

                                value:
                                    "DELIVERED",
                            },

                            {
                                label:
                                    "Cancelled",

                                value:
                                    "CANCELLED",
                            },

                        ].map(
                            (item) => (

                                <button
                                    key={
                                        item.value
                                    }

                                    type="button"

                                    onClick={() =>
                                        setStatusFilter(
                                            item.value
                                        )
                                    }

                                    className={`
                    rounded-xl

                    border

                    px-4
                    py-2

                    text-xs
                    font-black

                    transition

                    ${statusFilter ===
                                            item.value
                                            ? `
                          border-orange-500

                          bg-orange-500

                          text-white
                        `
                                            : `
                          border-slate-200

                          bg-white

                          text-slate-600

                          hover:border-orange-200
                          hover:text-orange-600
                        `
                                        }
                  `}
                                >
                                    {
                                        item.label
                                    }
                                </button>

                            )
                        )}


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


            {/* =================================
          HISTORY TABLE
      ================================= */}

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
            mb-5

            flex
            flex-col
            gap-2

            sm:flex-row
            sm:items-end
            sm:justify-between
          "
                >

                    <div>

                        <h2
                            className="
                text-lg
                font-black
                text-slate-950
              "
                        >
                            Previous Deliveries
                        </h2>


                        <p
                            className="
                mt-1

                text-sm
                text-slate-500
              "
                        >
                            Your recent delivery
                            activity.
                        </p>

                    </div>


                    <p
                        className="
              text-sm
              font-semibold
              text-slate-500
            "
                    >
                        {
                            filteredDeliveries.length
                        }{" "}
                        result
                        {
                            filteredDeliveries.length !==
                                1
                                ? "s"
                                : ""
                        }
                    </p>

                </div>


                {filteredDeliveries.length ===
                    0 ? (

                    <EmptyState
                        icon={
                            PackageCheck
                        }

                        title="No deliveries found"

                        description={
                            hasFilters
                                ? "Try changing or clearing your filters."
                                : "Your completed deliveries will appear here."
                        }

                        action={
                            hasFilters ? (

                                <Button
                                    type="button"

                                    variant="outline"

                                    onClick={
                                        clearFilters
                                    }
                                >
                                    Clear Filters
                                </Button>

                            ) : null
                        }
                    />

                ) : (

                    <CommonTable
                        columns={
                            columns
                        }

                        data={
                            filteredDeliveries
                        }

                        loading={
                            false
                        }
                    />

                )}

            </section>

        </div>

    );

};


export default DeliveryHistory;