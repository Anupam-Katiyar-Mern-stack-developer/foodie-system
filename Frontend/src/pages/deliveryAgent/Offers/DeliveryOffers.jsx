import {
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    Bike,
    CheckCircle2,
    Clock3,
    IndianRupee,
    MapPin,
    Navigation,
    PackageOpen,
    Store,
    XCircle,
} from "lucide-react";


import PageHeader
    from "../../../components/common/PageHeader/PageHeader";

import StatCard
    from "../../../components/common/StatCard/StatCard";

import StatusBadge
    from "../../../components/common/StatusBadge/StatusBadge";

import Button
    from "../../../components/common/Button/Button";

import EmptyState
    from "../../../components/common/EmptyState/EmptyState";

import ConfirmModal
    from "../../../components/common/ConfirmModal/ConfirmModal";


const DeliveryOffers = () => {

    const navigate =
        useNavigate();


    // =========================================
    // DUMMY OFFERS
    //
    // Later Redux/API se aayega
    // =========================================

    const [
        offers,
        setOffers,
    ] = useState([
        {
            id:
                1,

            orderNumber:
                "ORD-31FA3A64",

            restaurantName:
                "Foodie Kitchen",

            restaurantAddress:
                "117/N/65, Kakadeo, Kanpur",

            customerName:
                "Rahul Sharma",

            customerAddress:
                "Swaroop Nagar, Kanpur",

            itemCount:
                3,

            distance:
                4.2,

            estimatedTime:
                24,

            earning:
                72,

            orderAmount:
                489,

            paymentMethod:
                "COD",

            createdAt:
                "2 min ago",
        },

        {
            id:
                2,

            orderNumber:
                "ORD-82KL9B21",

            restaurantName:
                "Burger Point",

            restaurantAddress:
                "Arya Nagar, Kanpur",

            customerName:
                "Aman Verma",

            customerAddress:
                "Tilak Nagar, Kanpur",

            itemCount:
                2,

            distance:
                3.1,

            estimatedTime:
                18,

            earning:
                58,

            orderAmount:
                349,

            paymentMethod:
                "ONLINE",

            createdAt:
                "5 min ago",
        },

        {
            id:
                3,

            orderNumber:
                "ORD-52PT7C94",

            restaurantName:
                "Pizza House",

            restaurantAddress:
                "Govind Nagar, Kanpur",

            customerName:
                "Mohit Singh",

            customerAddress:
                "Kidwai Nagar, Kanpur",

            itemCount:
                4,

            distance:
                5.6,

            estimatedTime:
                32,

            earning:
                95,

            orderAmount:
                799,

            paymentMethod:
                "COD",

            createdAt:
                "8 min ago",
        },
    ]);


    // =========================================
    // MODAL STATE
    // =========================================

    const [
        selectedOffer,
        setSelectedOffer,
    ] = useState(null);


    const [
        modalType,
        setModalType,
    ] = useState(null);


    const [
        actionLoading,
        setActionLoading,
    ] = useState(false);


    // =========================================
    // STATS
    // =========================================

    const stats =
        useMemo(() => {

            const totalPotentialEarning =
                offers.reduce(
                    (
                        total,
                        offer
                    ) =>
                        total +
                        Number(
                            offer.earning ||
                            0
                        ),

                    0
                );


            const averageDistance =
                offers.length
                    ? (
                        offers.reduce(
                            (
                                total,
                                offer
                            ) =>
                                total +
                                Number(
                                    offer.distance ||
                                    0
                                ),

                            0
                        ) /
                        offers.length
                    ).toFixed(1)
                    : 0;


            return [

                {
                    key:
                        "offers",

                    title:
                        "Available Offers",

                    value:
                        offers.length,

                    description:
                        "Ready to accept",

                    icon:
                        PackageOpen,

                    variant:
                        "orange",
                },


                {
                    key:
                        "earning",

                    title:
                        "Potential Earnings",

                    value:
                        `₹${totalPotentialEarning}`,

                    description:
                        "From current offers",

                    icon:
                        IndianRupee,

                    variant:
                        "success",
                },


                {
                    key:
                        "distance",

                    title:
                        "Avg. Distance",

                    value:
                        `${averageDistance} km`,

                    description:
                        "Current offers",

                    icon:
                        Navigation,

                    variant:
                        "purple",
                },


                {
                    key:
                        "status",

                    title:
                        "Delivery Status",

                    value:
                        "Online",

                    description:
                        "Receiving offers",

                    icon:
                        Bike,

                    variant:
                        "success",
                },

            ];

        }, [
            offers,
        ]);


    // =========================================
    // ACCEPT
    // =========================================

    const handleAccept =
        async () => {

            if (
                !selectedOffer
            ) {
                return;
            }


            try {

                setActionLoading(
                    true
                );


                /*
                 * FRONTEND ONLY
                 *
                 * Later:
                 *
                 * dispatch(
                 *   acceptDeliveryOffer({
                 *     orderNumber:
                 *       selectedOffer.orderNumber
                 *   })
                 * )
                 */


                await new Promise(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            500
                        )
                );


                const orderNumber =
                    selectedOffer.orderNumber;


                setOffers(
                    (
                        previous
                    ) =>
                        previous.filter(
                            (offer) =>
                                offer.id !==
                                selectedOffer.id
                        )
                );


                setSelectedOffer(
                    null
                );

                setModalType(
                    null
                );


                /*
                 * Later active delivery
                 * backend/current assignment
                 * se load hogi.
                 */
                navigate(
                    `/delivery/active?order=${orderNumber}`
                );

            } finally {

                setActionLoading(
                    false
                );

            }

        };


    // =========================================
    // REJECT
    // =========================================

    const handleReject =
        async () => {

            if (
                !selectedOffer
            ) {
                return;
            }


            try {

                setActionLoading(
                    true
                );


                /*
                 * FRONTEND ONLY
                 *
                 * Later:
                 *
                 * dispatch(
                 *   rejectDeliveryOffer({
                 *     orderNumber:
                 *       selectedOffer.orderNumber
                 *   })
                 * )
                 */


                await new Promise(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            400
                        )
                );


                setOffers(
                    (
                        previous
                    ) =>
                        previous.filter(
                            (offer) =>
                                offer.id !==
                                selectedOffer.id
                        )
                );


                setSelectedOffer(
                    null
                );

                setModalType(
                    null
                );

            } finally {

                setActionLoading(
                    false
                );

            }

        };


    // =========================================
    // MODAL CLOSE
    // =========================================

    const handleModalClose =
        () => {

            if (
                actionLoading
            ) {
                return;
            }


            setSelectedOffer(
                null
            );

            setModalType(
                null
            );

        };


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
                title="Delivery Offers"

                description="View nearby delivery opportunities and choose the orders you want to deliver."
            />


            {/* =================================
          ONLINE INFO
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
                shrink-0
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
                  flex-wrap
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
                                    You're Online
                                </h2>


                                <StatusBadge
                                    variant="success"

                                    size="sm"

                                    dot
                                >
                                    Available
                                </StatusBadge>

                            </div>


                            <p
                                className="
                  mt-1

                  text-sm
                  text-slate-500
                "
                            >
                                New delivery offers
                                will appear here while
                                you're available.
                            </p>

                        </div>

                    </div>


                    <Button
                        type="button"

                        variant="outline"

                        onClick={() =>
                            navigate(
                                "/delivery/active"
                            )
                        }
                    >
                        Active Delivery
                    </Button>

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
                        />

                    )
                )}

            </section>


            {/* =================================
          SECTION HEADER
      ================================= */}

            <section>

                <div
                    className="
            mb-4

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
                text-xl
                font-black
                text-slate-950
              "
                        >
                            Available Deliveries
                        </h2>


                        <p
                            className="
                mt-1

                text-sm
                text-slate-500
              "
                        >
                            Review pickup, drop and
                            estimated earning before
                            accepting.
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
                            offers.length
                        }{" "}
                        offer
                        {
                            offers.length !==
                                1
                                ? "s"
                                : ""
                        }
                    </p>

                </div>


                {/* =================================
            EMPTY
        ================================= */}

                {offers.length ===
                    0 ? (

                    <EmptyState
                        icon={
                            PackageOpen
                        }

                        title="No delivery offers"

                        description="There are no new delivery offers available right now."
                    />

                ) : (

                    <div
                        className="
              grid
              gap-5

              xl:grid-cols-2
            "
                    >

                        {offers.map(
                            (offer) => (

                                <article
                                    key={
                                        offer.id
                                    }

                                    className="
                    overflow-hidden

                    rounded-[1.5rem]

                    border
                    border-slate-200

                    bg-white

                    shadow-sm

                    transition

                    hover:border-orange-200
                    hover:shadow-md
                  "
                                >

                                    {/* =========================
                      OFFER HEADER
                  ========================== */}

                                    <div
                                        className="
                      flex
                      flex-col
                      gap-4

                      border-b
                      border-slate-100

                      bg-slate-50/70

                      p-5

                      sm:flex-row
                      sm:items-center
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

                                                <h3
                                                    className="
                            text-base
                            font-black
                            text-slate-950
                          "
                                                >
                                                    {
                                                        offer.orderNumber
                                                    }
                                                </h3>


                                                <StatusBadge
                                                    variant="warning"

                                                    size="sm"

                                                    dot
                                                >
                                                    New Offer
                                                </StatusBadge>

                                            </div>


                                            <p
                                                className="
                          mt-1

                          text-xs
                          font-semibold
                          text-slate-400
                        "
                                            >
                                                Received{" "}
                                                {
                                                    offer.createdAt
                                                }
                                            </p>

                                        </div>


                                        <div
                                            className="
                        text-left

                        sm:text-right
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
                                                Estimated Earning
                                            </p>


                                            <p
                                                className="
                          mt-1

                          text-2xl
                          font-black
                          text-emerald-600
                        "
                                            >
                                                ₹
                                                {
                                                    offer.earning
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    {/* =========================
                      ROUTE
                  ========================== */}

                                    <div
                                        className="
                      p-5
                    "
                                    >

                                        <div
                                            className="
                        relative
                        space-y-5
                      "
                                        >

                                            {/* CONNECTOR */}

                                            <div
                                                className="
                          absolute
                          left-[19px]
                          top-10
                          h-[55px]
                          w-px

                          border-l-2
                          border-dashed
                          border-slate-200
                        "
                                            />


                                            {/* PICKUP */}

                                            <div
                                                className="
                          relative

                          flex
                          gap-3
                        "
                                            >

                                                <div
                                                    className="
                            relative
                            z-10

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
                                                    <Store
                                                        className="
                              h-5
                              w-5
                            "
                                                    />
                                                </div>


                                                <div
                                                    className="
                            min-w-0
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
                                                        Pickup
                                                    </p>


                                                    <p
                                                        className="
                              mt-1

                              font-black
                              text-slate-900
                            "
                                                    >
                                                        {
                                                            offer.restaurantName
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                              mt-1

                              text-sm
                              leading-5
                              text-slate-500
                            "
                                                    >
                                                        {
                                                            offer.restaurantAddress
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            {/* DROP */}

                                            <div
                                                className="
                          relative

                          flex
                          gap-3
                        "
                                            >

                                                <div
                                                    className="
                            relative
                            z-10

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


                                                <div
                                                    className="
                            min-w-0
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
                                                            offer.customerName
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                              mt-1

                              text-sm
                              leading-5
                              text-slate-500
                            "
                                                    >
                                                        {
                                                            offer.customerAddress
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </div>


                                        {/* =========================
                        DELIVERY DETAILS
                    ========================== */}

                                        <div
                                            className="
                        mt-6

                        grid
                        grid-cols-2
                        gap-3

                        sm:grid-cols-4
                      "
                                        >

                                            <div
                                                className="
                          rounded-xl

                          bg-slate-50

                          p-3
                        "
                                            >

                                                <Navigation
                                                    className="
                            h-4
                            w-4
                            text-orange-500
                          "
                                                />

                                                <p
                                                    className="
                            mt-2

                            text-sm
                            font-black
                            text-slate-900
                          "
                                                >
                                                    {
                                                        offer.distance
                                                    }{" "}
                                                    km
                                                </p>


                                                <p
                                                    className="
                            text-[10px]
                            font-semibold
                            text-slate-400
                          "
                                                >
                                                    Distance
                                                </p>

                                            </div>


                                            <div
                                                className="
                          rounded-xl

                          bg-slate-50

                          p-3
                        "
                                            >

                                                <Clock3
                                                    className="
                            h-4
                            w-4
                            text-orange-500
                          "
                                                />

                                                <p
                                                    className="
                            mt-2

                            text-sm
                            font-black
                            text-slate-900
                          "
                                                >
                                                    {
                                                        offer.estimatedTime
                                                    }{" "}
                                                    min
                                                </p>


                                                <p
                                                    className="
                            text-[10px]
                            font-semibold
                            text-slate-400
                          "
                                                >
                                                    Est. Time
                                                </p>

                                            </div>


                                            <div
                                                className="
                          rounded-xl

                          bg-slate-50

                          p-3
                        "
                                            >

                                                <PackageOpen
                                                    className="
                            h-4
                            w-4
                            text-orange-500
                          "
                                                />

                                                <p
                                                    className="
                            mt-2

                            text-sm
                            font-black
                            text-slate-900
                          "
                                                >
                                                    {
                                                        offer.itemCount
                                                    }
                                                </p>


                                                <p
                                                    className="
                            text-[10px]
                            font-semibold
                            text-slate-400
                          "
                                                >
                                                    Items
                                                </p>

                                            </div>


                                            <div
                                                className="
                          rounded-xl

                          bg-slate-50

                          p-3
                        "
                                            >

                                                <IndianRupee
                                                    className="
                            h-4
                            w-4
                            text-orange-500
                          "
                                                />

                                                <p
                                                    className="
                            mt-2

                            text-sm
                            font-black
                            text-slate-900
                          "
                                                >
                                                    ₹
                                                    {
                                                        offer.orderAmount
                                                    }
                                                </p>


                                                <p
                                                    className="
                            text-[10px]
                            font-semibold
                            text-slate-400
                          "
                                                >
                                                    {
                                                        offer.paymentMethod
                                                    }
                                                </p>

                                            </div>

                                        </div>


                                        {/* =========================
                        ACTIONS
                    ========================== */}

                                        <div
                                            className="
                        mt-5

                        flex
                        flex-col
                        gap-2

                        border-t
                        border-slate-100

                        pt-5

                        sm:flex-row
                        sm:justify-end
                      "
                                        >

                                            <Button
                                                type="button"

                                                variant="outline"

                                                onClick={() => {

                                                    setSelectedOffer(
                                                        offer
                                                    );

                                                    setModalType(
                                                        "REJECT"
                                                    );

                                                }}
                                            >

                                                <span
                                                    className="
                            inline-flex
                            items-center
                            gap-2
                          "
                                                >
                                                    <XCircle
                                                        className="
                              h-4
                              w-4
                            "
                                                    />

                                                    Reject
                                                </span>

                                            </Button>


                                            <Button
                                                type="button"

                                                onClick={() => {

                                                    setSelectedOffer(
                                                        offer
                                                    );

                                                    setModalType(
                                                        "ACCEPT"
                                                    );

                                                }}
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

                                                    Accept Delivery
                                                </span>

                                            </Button>

                                        </div>

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =================================
          ACCEPT CONFIRM
      ================================= */}

            <ConfirmModal
                open={
                    modalType ===
                    "ACCEPT"
                }

                onClose={
                    handleModalClose
                }

                title="Accept Delivery?"

                description={
                    selectedOffer
                        ? `Accept ${selectedOffer.orderNumber} from ${selectedOffer.restaurantName}?`
                        : ""
                }

                confirmText="Accept Delivery"

                loading={
                    actionLoading
                }

                onConfirm={
                    handleAccept
                }
            />


            {/* =================================
          REJECT CONFIRM
      ================================= */}

            <ConfirmModal
                open={
                    modalType ===
                    "REJECT"
                }

                onClose={
                    handleModalClose
                }

                title="Reject Delivery Offer?"

                description={
                    selectedOffer
                        ? `Are you sure you want to reject ${selectedOffer.orderNumber}?`
                        : ""
                }

                confirmText="Reject Offer"

                variant="danger"

                loading={
                    actionLoading
                }

                onConfirm={
                    handleReject
                }
            />

        </div>

    );

};


export default DeliveryOffers;