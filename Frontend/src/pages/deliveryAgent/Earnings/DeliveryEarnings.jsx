import {
    useMemo,
    useState,
} from "react";

import {
    Banknote,
    CalendarDays,
    CheckCircle2,
    Clock3,
    IndianRupee,
    PackageCheck,
    Search,
    WalletCards,
} from "lucide-react";


import PageHeader
    from "../../../components/common/PageHeader/PageHeader";

import StatCard
    from "../../../components/common/StatCard/StatCard";

import StatusBadge
    from "../../../components/common/StatusBadge/StatusBadge";

import CommonTable
    from "../../../components/common/CommonTable/CommonTable";

import EmptyState
    from "../../../components/common/EmptyState/EmptyState";


const DeliveryEarnings = () => {

    // =========================================
    // FILTER
    // =========================================

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");


    const [
        paymentFilter,
        setPaymentFilter,
    ] = useState("ALL");


    // =========================================
    // DUMMY EARNING DATA
    //
    // Later Redux/API se aayega
    // =========================================

    const earnings = [
        {
            id:
                1,

            orderNumber:
                "ORD-A824KD92",

            restaurantName:
                "Foodie Kitchen",

            deliveryFee:
                65,

            bonus:
                10,

            totalEarning:
                75,

            paymentStatus:
                "PAID",

            date:
                "09 Oct 2026",

            time:
                "09:45 AM",
        },

        {
            id:
                2,

            orderNumber:
                "ORD-B73JKA11",

            restaurantName:
                "Burger Hub",

            deliveryFee:
                58,

            bonus:
                0,

            totalEarning:
                58,

            paymentStatus:
                "PAID",

            date:
                "09 Oct 2026",

            time:
                "08:20 AM",
        },

        {
            id:
                3,

            orderNumber:
                "ORD-C19PQM82",

            restaurantName:
                "Pizza Point",

            deliveryFee:
                82,

            bonus:
                15,

            totalEarning:
                97,

            paymentStatus:
                "PENDING",

            date:
                "08 Oct 2026",

            time:
                "08:10 PM",
        },

        {
            id:
                4,

            orderNumber:
                "ORD-D82PQK41",

            restaurantName:
                "Spice Hub",

            deliveryFee:
                55,

            bonus:
                5,

            totalEarning:
                60,

            paymentStatus:
                "PAID",

            date:
                "08 Oct 2026",

            time:
                "05:35 PM",
        },

        {
            id:
                5,

            orderNumber:
                "ORD-E19AKP32",

            restaurantName:
                "Chinese Corner",

            deliveryFee:
                75,

            bonus:
                20,

            totalEarning:
                95,

            paymentStatus:
                "PENDING",

            date:
                "07 Oct 2026",

            time:
                "09:30 PM",
        },

        {
            id:
                6,

            orderNumber:
                "ORD-F32LMK77",

            restaurantName:
                "Foodie Kitchen",

            deliveryFee:
                70,

            bonus:
                10,

            totalEarning:
                80,

            paymentStatus:
                "PAID",

            date:
                "07 Oct 2026",

            time:
                "06:40 PM",
        },
    ];


    // =========================================
    // WEEKLY GRAPH DATA
    // =========================================

    const weeklyEarnings = [
        {
            day:
                "Mon",

            earning:
                420,
        },

        {
            day:
                "Tue",

            earning:
                560,
        },

        {
            day:
                "Wed",

            earning:
                480,
        },

        {
            day:
                "Thu",

            earning:
                720,
        },

        {
            day:
                "Fri",

            earning:
                650,
        },

        {
            day:
                "Sat",

            earning:
                890,
        },

        {
            day:
                "Sun",

            earning:
                760,
        },
    ];


    // =========================================
    // SUMMARY
    // =========================================

    const summary =
        useMemo(
            () => {

                const totalEarnings =
                    earnings.reduce(
                        (
                            total,
                            earning
                        ) =>
                            total +
                            Number(
                                earning.totalEarning ||
                                0
                            ),

                        0
                    );


                const paidEarnings =
                    earnings
                        .filter(
                            (earning) =>
                                earning.paymentStatus ===
                                "PAID"
                        )
                        .reduce(
                            (
                                total,
                                earning
                            ) =>
                                total +
                                Number(
                                    earning.totalEarning ||
                                    0
                                ),

                            0
                        );


                const pendingEarnings =
                    earnings
                        .filter(
                            (earning) =>
                                earning.paymentStatus ===
                                "PENDING"
                        )
                        .reduce(
                            (
                                total,
                                earning
                            ) =>
                                total +
                                Number(
                                    earning.totalEarning ||
                                    0
                                ),

                            0
                        );


                return {
                    totalEarnings,
                    paidEarnings,
                    pendingEarnings,
                };

            },
            []
        );


    // =========================================
    // STATS
    // =========================================

    const stats = [
        {
            key:
                "total",

            title:
                "Total Earnings",

            value:
                `₹${summary.totalEarnings}`,

            description:
                "All delivery earnings",

            icon:
                IndianRupee,

            variant:
                "orange",
        },

        {
            key:
                "today",

            title:
                "Today's Earnings",

            value:
                "₹720",

            description:
                "9 deliveries today",

            icon:
                Banknote,

            variant:
                "success",
        },

        {
            key:
                "week",

            title:
                "This Week",

            value:
                "₹4,480",

            description:
                "Weekly earnings",

            icon:
                CalendarDays,

            variant:
                "purple",
        },

        {
            key:
                "deliveries",

            title:
                "Completed Deliveries",

            value:
                "64",

            description:
                "This week",

            icon:
                PackageCheck,

            variant:
                "warning",
        },
    ];


    // =========================================
    // FILTER DATA
    // =========================================

    const filteredEarnings =
        useMemo(
            () => {

                const search =
                    searchTerm
                        .trim()
                        .toLowerCase();


                return earnings.filter(
                    (earning) => {

                        const matchesSearch =
                            !search ||
                            earning.orderNumber
                                .toLowerCase()
                                .includes(
                                    search
                                ) ||
                            earning.restaurantName
                                .toLowerCase()
                                .includes(
                                    search
                                );


                        const matchesPayment =
                            paymentFilter ===
                            "ALL" ||
                            earning.paymentStatus ===
                            paymentFilter;


                        return (
                            matchesSearch &&
                            matchesPayment
                        );

                    }
                );

            },
            [
                searchTerm,
                paymentFilter,
            ]
        );


    // =========================================
    // PAYMENT STATUS
    // =========================================

    const paymentStatusConfig = {

        PAID: {
            label:
                "Paid",

            variant:
                "success",
        },

        PENDING: {
            label:
                "Pending",

            variant:
                "warning",
        },

    };


    // =========================================
    // TABLE
    // =========================================

    const columns = [

        {
            key:
                "orderNumber",

            label:
                "Order",

            render:
                (row) => (
                    <span
                        className="
              font-black
              text-slate-900
            "
                    >
                        {
                            row.orderNumber
                        }
                    </span>
                ),
        },


        {
            key:
                "restaurantName",

            label:
                "Restaurant",
        },


        {
            key:
                "deliveryFee",

            label:
                "Delivery Fee",

            render:
                (row) => (
                    <span
                        className="
              font-semibold
              text-slate-700
            "
                    >
                        ₹
                        {
                            row.deliveryFee
                        }
                    </span>
                ),
        },


        {
            key:
                "bonus",

            label:
                "Bonus",

            render:
                (row) => (
                    <span
                        className="
              font-semibold
              text-emerald-600
            "
                    >
                        +
                        ₹
                        {
                            row.bonus
                        }
                    </span>
                ),
        },


        {
            key:
                "totalEarning",

            label:
                "Total Earning",

            render:
                (row) => (
                    <span
                        className="
              text-base
              font-black
              text-slate-950
            "
                    >
                        ₹
                        {
                            row.totalEarning
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
                (row) => {

                    const config =
                        paymentStatusConfig[
                        row.paymentStatus
                        ];


                    return (
                        <StatusBadge
                            variant={
                                config?.variant ||
                                "neutral"
                            }

                            size="sm"

                            dot
                        >
                            {
                                config?.label ||
                                row.paymentStatus
                            }
                        </StatusBadge>
                    );

                },
        },


        {
            key:
                "date",

            label:
                "Date",

            render:
                (row) => (
                    <div>

                        <p
                            className="
                text-sm
                font-semibold
                text-slate-700
              "
                        >
                            {
                                row.date
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
                                row.time
                            }
                        </p>

                    </div>
                ),
        },

    ];


    // =========================================
    // GRAPH
    // =========================================

    const maxWeeklyEarning =
        Math.max(
            ...weeklyEarnings.map(
                (item) =>
                    item.earning
            )
        );


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
                title="My Earnings"

                description="Track your delivery earnings, bonuses and payout activity."
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
          WEEKLY GRAPH + PAYOUT
      ================================= */}

            <section
                className="
          grid
          gap-6

          xl:grid-cols-[1.4fr_0.6fr]
        "
            >

                {/* =================================
            WEEKLY EARNING
        ================================= */}

                <div
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
              flex-col
              gap-2

              sm:flex-row
              sm:items-center
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
                                Weekly Earnings
                            </h2>


                            <p
                                className="
                  mt-1

                  text-sm
                  text-slate-500
                "
                            >
                                Earnings generated from
                                completed deliveries.
                            </p>

                        </div>


                        <div
                            className="
                rounded-xl

                bg-orange-50

                px-4
                py-2

                text-right
              "
                        >

                            <p
                                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wide
                  text-orange-500
                "
                            >
                                This Week
                            </p>


                            <p
                                className="
                  mt-0.5

                  text-lg
                  font-black
                  text-slate-950
                "
                            >
                                ₹4,480
                            </p>

                        </div>

                    </div>


                    {/* GRAPH */}

                    <div
                        className="
              mt-8

              flex
              h-[260px]
              items-end
              justify-between
              gap-2

              border-b
              border-slate-200
            "
                    >

                        {weeklyEarnings.map(
                            (item) => {

                                const height =
                                    maxWeeklyEarning
                                        ? (
                                            item.earning /
                                            maxWeeklyEarning
                                        ) *
                                        100
                                        : 0;


                                return (

                                    <div
                                        key={
                                            item.day
                                        }

                                        className="
                      flex
                      h-full
                      flex-1
                      flex-col
                      items-center
                      justify-end
                      gap-2
                    "
                                    >

                                        <span
                                            className="
                        text-xs
                        font-black
                        text-slate-700
                      "
                                        >
                                            ₹
                                            {
                                                item.earning
                                            }
                                        </span>


                                        <div
                                            className="
                        flex
                        h-[190px]
                        w-full
                        max-w-[48px]
                        items-end
                      "
                                        >

                                            <div
                                                style={{
                                                    height:
                                                        `${height}%`,
                                                }}

                                                className="
                          w-full

                          rounded-t-xl

                          bg-gradient-to-t
                          from-orange-500
                          to-orange-300

                          transition-all

                          hover:from-orange-600
                          hover:to-orange-400
                        "
                                            />

                                        </div>


                                        <span
                                            className="
                        pb-3

                        text-xs
                        font-bold
                        text-slate-400
                      "
                                        >
                                            {
                                                item.day
                                            }
                                        </span>

                                    </div>

                                );

                            }
                        )}

                    </div>

                </div>


                {/* =================================
            PAYOUT SUMMARY
        ================================= */}

                <div
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

                        <div
                            className="
                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-xl

                bg-emerald-100

                text-emerald-600
              "
                        >
                            <WalletCards
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
                  text-slate-950
                "
                            >
                                Payout Summary
                            </h2>


                            <p
                                className="
                  text-xs
                  text-slate-400
                "
                            >
                                Demo payout details
                            </p>

                        </div>

                    </div>


                    <div
                        className="
              mt-6
              space-y-4
            "
                    >

                        {/* PAID */}

                        <div
                            className="
                flex
                items-center
                justify-between
                gap-4

                rounded-2xl

                bg-emerald-50

                p-4
              "
                        >

                            <div>

                                <p
                                    className="
                    text-xs
                    font-bold
                    text-emerald-700
                  "
                                >
                                    Paid Earnings
                                </p>


                                <p
                                    className="
                    mt-1

                    text-2xl
                    font-black
                    text-slate-950
                  "
                                >
                                    ₹
                                    {
                                        summary.paidEarnings
                                    }
                                </p>

                            </div>


                            <CheckCircle2
                                className="
                  h-6
                  w-6
                  text-emerald-500
                "
                            />

                        </div>


                        {/* PENDING */}

                        <div
                            className="
                flex
                items-center
                justify-between
                gap-4

                rounded-2xl

                bg-amber-50

                p-4
              "
                        >

                            <div>

                                <p
                                    className="
                    text-xs
                    font-bold
                    text-amber-700
                  "
                                >
                                    Pending Payout
                                </p>


                                <p
                                    className="
                    mt-1

                    text-2xl
                    font-black
                    text-slate-950
                  "
                                >
                                    ₹
                                    {
                                        summary.pendingEarnings
                                    }
                                </p>

                            </div>


                            <Clock3
                                className="
                  h-6
                  w-6
                  text-amber-500
                "
                            />

                        </div>


                        {/* NEXT PAYOUT */}

                        <div
                            className="
                rounded-2xl

                border
                border-slate-200

                p-4
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
                                Next Payout
                            </p>


                            <p
                                className="
                  mt-2

                  text-base
                  font-black
                  text-slate-900
                "
                            >
                                Payment integration pending
                            </p>


                            <p
                                className="
                  mt-1

                  text-xs
                  leading-5
                  text-slate-500
                "
                            >
                                Actual payout schedule will
                                be shown after payment
                                system integration.
                            </p>

                        </div>

                    </div>

                </div>

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

                            placeholder="Search order or restaurant..."

                            className="
                min-w-0
                flex-1

                bg-transparent

                text-sm

                outline-none

                placeholder:text-slate-400
              "
                        />

                    </div>


                    {/* PAYMENT FILTER */}

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
                                    "Paid",

                                value:
                                    "PAID",
                            },

                            {
                                label:
                                    "Pending",

                                value:
                                    "PENDING",
                            },

                        ].map(
                            (item) => (

                                <button
                                    key={
                                        item.value
                                    }

                                    type="button"

                                    onClick={() =>
                                        setPaymentFilter(
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

                    ${paymentFilter ===
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

                    </div>

                </div>

            </section>


            {/* =================================
          EARNING HISTORY
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
                            Earning History
                        </h2>


                        <p
                            className="
                mt-1

                text-sm
                text-slate-500
              "
                        >
                            Delivery-wise earning
                            breakdown.
                        </p>

                    </div>


                    <p
                        className="
              text-sm
              font-bold
              text-slate-500
            "
                    >
                        {
                            filteredEarnings.length
                        }{" "}
                        transaction
                        {
                            filteredEarnings.length !==
                                1
                                ? "s"
                                : ""
                        }
                    </p>

                </div>


                {filteredEarnings.length ===
                    0 ? (

                    <EmptyState
                        icon={
                            WalletCards
                        }

                        title="No earnings found"

                        description="No earning transactions match the selected filters."
                    />

                ) : (

                    <CommonTable
                        columns={
                            columns
                        }

                        data={
                            filteredEarnings
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


export default DeliveryEarnings;