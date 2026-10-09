import {
    useNavigate,
} from "react-router-dom";

import {
    Banknote,
    Bike,
    CheckCircle2,
    MapPin,
    Navigation,
    PackageCheck,
    PackageOpen,
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


const DeliveryDashboard = () => {

    const navigate =
        useNavigate();


    // =========================================
    // DUMMY STATS
    //
    // Backend integration later.
    // =========================================

    const stats = [

        {
            key:
                "today",

            title:
                "Today's Deliveries",

            value:
                "12",

            description:
                "Assigned today",

            icon:
                Bike,

            variant:
                "orange",
        },


        {
            key:
                "active",

            title:
                "Active Delivery",

            value:
                "1",

            description:
                "Currently delivering",

            icon:
                Navigation,

            variant:
                "warning",
        },


        {
            key:
                "completed",

            title:
                "Completed Today",

            value:
                "9",

            description:
                "Successfully delivered",

            icon:
                CheckCircle2,

            variant:
                "success",
        },


        {
            key:
                "earnings",

            title:
                "Today's Earnings",

            value:
                "₹720",

            description:
                "Demo earnings data",

            icon:
                Banknote,

            variant:
                "purple",
        },

    ];


    // =========================================
    // CURRENT DELIVERY
    // =========================================

    const currentDelivery = {

        orderNumber:
            "ORD-31FA3A64",

        restaurantName:
            "Foodie Kitchen",

        restaurantAddress:
            "Swaroop Nagar, Kanpur",

        customerName:
            "Rahul Sharma",

        customerAddress:
            "Kakadeo, Kanpur",

        totalItems:
            3,

        status:
            "DELIVERY_ASSIGNED",

    };


    // =========================================
    // RECENT DELIVERIES
    // =========================================

    const recentDeliveries = [

        {
            orderNumber:
                "ORD-A824KD92",

            customerName:
                "Aman",

            restaurantName:
                "Burger Hub",

            status:
                "DELIVERED",

            amount:
                "₹420",
        },


        {
            orderNumber:
                "ORD-B73JKA11",

            customerName:
                "Mohit",

            restaurantName:
                "Pizza Point",

            status:
                "DELIVERED",

            amount:
                "₹680",
        },


        {
            orderNumber:
                "ORD-C19PQM82",

            customerName:
                "Rohit",

            restaurantName:
                "Foodie Kitchen",

            status:
                "DELIVERED",

            amount:
                "₹350",
        },

    ];


    // =========================================
    // STATUS CONFIG
    // =========================================

    const statusConfig = {

        DELIVERY_ASSIGNED: {
            label:
                "Assigned",

            variant:
                "warning",
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
                "purple",
        },


        DELIVERED: {
            label:
                "Delivered",

            variant:
                "success",
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
                                `/delivery/orders/${row.orderNumber}`
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
        },


        {
            key:
                "customerName",

            label:
                "Customer",
        },


        {
            key:
                "amount",

            label:
                "Order Amount",

            render:
                (row) => (

                    <span
                        className="
              font-black
              text-slate-900
            "
                    >
                        {
                            row.amount
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
                                `/delivery/orders/${row.orderNumber}`
                            )
                        }
                    >
                        View
                    </Button>

                ),
        },

    ];


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
                title="Delivery Dashboard"

                description="Manage assigned deliveries and track your daily delivery activity."
            />


            {/* =================================
          ONLINE STATUS
      ================================= */}

            <section
                className="
          rounded-[1.5rem]

          border
          border-emerald-200

          bg-gradient-to-r
          from-emerald-50
          via-white
          to-orange-50

          p-5

          shadow-sm

          sm:p-6
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
              items-center
              gap-4
            "
                    >

                        <div
                            className="
                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-xl

                bg-white

                text-emerald-600

                shadow-sm
              "
                        >
                            <Bike
                                className="
                  h-5
                  w-5
                "
                            />
                        </div>


                        <div>

                            <div
                                className="
                  flex
                  items-center
                  gap-2
                "
                            >

                                <h2
                                    className="
                    text-lg
                    font-black
                    text-slate-950
                  "
                                >
                                    Delivery Status
                                </h2>


                                <StatusBadge
                                    variant="success"

                                    size="sm"

                                    dot
                                >
                                    Online
                                </StatusBadge>

                            </div>


                            <p
                                className="
                  mt-1

                  text-sm
                  text-slate-500
                "
                            >
                                You're available for
                                delivery assignments.
                            </p>

                        </div>

                    </div>


                    {/* FRONTEND ONLY */}

                    <button
                        type="button"

                        className="
              relative

              h-8
              w-16

              rounded-full

              bg-emerald-500

              transition
            "
                    >

                        <span
                            className="
                absolute
                left-9
                top-1

                h-6
                w-6

                rounded-full

                bg-white

                shadow-sm
              "
                        />

                    </button>

                </div>

            </section>


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

                            onClick={
                                stat.key ===
                                    "earnings"
                                    ? () =>
                                        navigate(
                                            "/delivery/earnings"
                                        )
                                    : stat.key ===
                                        "today"
                                        ? () =>
                                            navigate(
                                                "/delivery/orders"
                                            )
                                        : undefined
                            }
                        />

                    )
                )}

            </section>


            {/* =================================
          CURRENT ASSIGNMENT
      ================================= */}

            <section
                className="
          rounded-[1.5rem]

          border
          border-orange-200

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
            gap-4

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
                >

                    <div>

                        <p
                            className="
                text-xs
                font-black
                uppercase
                tracking-wider
                text-orange-500
              "
                        >
                            Current Assignment
                        </p>


                        <h2
                            className="
                mt-1

                text-xl
                font-black
                text-slate-950
              "
                        >
                            {
                                currentDelivery
                                    .orderNumber
                            }
                        </h2>

                    </div>


                    <StatusBadge
                        variant="warning"

                        size="sm"

                        dot
                    >
                        Delivery Assigned
                    </StatusBadge>

                </div>


                <div
                    className="
            mt-6

            grid
            gap-4

            md:grid-cols-2
          "
                >

                    {/* RESTAURANT */}

                    <div
                        className="
              rounded-2xl

              border
              border-slate-100

              bg-slate-50

              p-4
            "
                    >

                        <div
                            className="
                flex
                gap-3
              "
                        >

                            <div
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
                                <PackageOpen
                                    className="
                    h-5
                    w-5
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
                                    Pickup From
                                </p>


                                <p
                                    className="
                    mt-1

                    font-black
                    text-slate-900
                  "
                                >
                                    {
                                        currentDelivery
                                            .restaurantName
                                    }
                                </p>


                                <p
                                    className="
                    mt-1

                    text-sm
                    text-slate-500
                  "
                                >
                                    {
                                        currentDelivery
                                            .restaurantAddress
                                    }
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* CUSTOMER */}

                    <div
                        className="
              rounded-2xl

              border
              border-slate-100

              bg-slate-50

              p-4
            "
                    >

                        <div
                            className="
                flex
                gap-3
              "
                        >

                            <div
                                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  bg-emerald-100

                  text-emerald-600
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

                                <p
                                    className="
                    text-xs
                    font-bold
                    text-slate-400
                  "
                                >
                                    Deliver To
                                </p>


                                <p
                                    className="
                    mt-1

                    font-black
                    text-slate-900
                  "
                                >
                                    {
                                        currentDelivery
                                            .customerName
                                    }
                                </p>


                                <p
                                    className="
                    mt-1

                    text-sm
                    text-slate-500
                  "
                                >
                                    {
                                        currentDelivery
                                            .customerAddress
                                    }
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                <div
                    className="
            mt-5

            flex
            justify-end
          "
                >

                    <Button
                        type="button"

                        onClick={() =>
                            navigate(
                                `/delivery/orders/${currentDelivery.orderNumber}`
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
                            <Navigation
                                className="
                  h-4
                  w-4
                "
                            />

                            View Delivery
                        </span>

                    </Button>

                </div>

            </section>


            {/* =================================
          RECENT DELIVERIES
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
            items-center
            justify-between
            gap-4
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
                            Recent Deliveries
                        </h2>


                        <p
                            className="
                mt-1

                text-sm
                text-slate-500
              "
                        >
                            Your recently completed
                            delivery orders.
                        </p>

                    </div>


                    <Button
                        type="button"

                        variant="ghost"

                        onClick={() =>
                            navigate(
                                "/delivery/orders"
                            )
                        }
                    >
                        View All
                    </Button>

                </div>


                <CommonTable
                    columns={
                        columns
                    }

                    data={
                        recentDeliveries
                    }

                    loading={
                        false
                    }
                />

            </section>

        </div>

    );

};


export default DeliveryDashboard;