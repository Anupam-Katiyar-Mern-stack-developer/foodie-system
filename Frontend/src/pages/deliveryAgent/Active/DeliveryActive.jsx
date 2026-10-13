import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    Banknote,
    Bike,
    CheckCircle2,
    Clock3,
    CreditCard,
    KeyRound,
    MapPin,
    Navigation,
    PackageCheck,
    Phone,
    ReceiptText,
    ShieldCheck,
    Store,
    UserRound,
    WalletCards,
} from "lucide-react";

import {
    CircleMarker,
    MapContainer,
    Marker,
    Polyline,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";

import L from "leaflet";

import PageHeader
    from "../../../components/common/PageHeader/PageHeader";

import Button
    from "../../../components/common/Button/Button";

import StatusBadge
    from "../../../components/common/StatusBadge/StatusBadge";

import Modal
    from "../../../components/common/Modal/Modal";


// =========================================
// LEAFLET FIX
// =========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",

    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});


// =========================================
// MAP FOCUS
// =========================================

const MapFocus = ({
    position,
}) => {

    const map =
        useMap();

    useEffect(() => {

        if (!position) {
            return;
        }

        map.flyTo(
            position,
            14,
            {
                duration: 1,
            }
        );

    }, [
        map,
        position,
    ]);

    return null;
};


// =========================================
// TEMP DATA
// Backend connect hone ke baad remove hoga
// =========================================

const DEMO_DELIVERY = {

    orderNumber:
        "ORD-31FA3A64",

    status:
        "DELIVERY_ASSIGNED",

    totalItems:
        3,

    paymentMethod:
        "COD",

    paymentStatus:
        "PENDING",

    orderAmount:
        489,

    deliveryFee:
        45,


    restaurant: {

        name:
            "Foodie Kitchen",

        phone:
            "9876543210",

        address:
            "Kakadeo, Kanpur, Uttar Pradesh",

        latitude:
            26.4808,

        longitude:
            80.3065,
    },


    customer: {

        name:
            "Rahul Sharma",

        phone:
            "9876501234",

        address:
            "Swaroop Nagar, Kanpur, Uttar Pradesh",

        latitude:
            26.4905,

        longitude:
            80.3127,
    },
};


// =========================================
// DELIVERY STEPS
// =========================================

const STEPS = [

    {
        key:
            "DELIVERY_ASSIGNED",

        label:
            "Assigned",

        description:
            "Go to restaurant",
    },

    {
        key:
            "PICKED_UP",

        label:
            "Picked Up",

        description:
            "Order collected",
    },

    {
        key:
            "OUT_FOR_DELIVERY",

        label:
            "On The Way",

        description:
            "Deliver to customer",
    },

    {
        key:
            "DELIVERED",

        label:
            "Delivered",

        description:
            "OTP verified",
    },

];


const STATUS_INDEX = {

    DELIVERY_ASSIGNED:
        0,

    PICKED_UP:
        1,

    OUT_FOR_DELIVERY:
        2,

    DELIVERED:
        3,
};


const STATUS_CONFIG = {

    DELIVERY_ASSIGNED: {

        label:
            "Go To Restaurant",

        variant:
            "warning",
    },


    PICKED_UP: {

        label:
            "Order Picked Up",

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
// MAIN COMPONENT
// =========================================

const DeliveryActive = () => {

    const navigate =
        useNavigate();


    const [
        delivery,
        setDelivery,
    ] = useState(
        DEMO_DELIVERY
    );


    const [
        agentLocation,
        setAgentLocation,
    ] = useState(null);


    const [
        locationError,
        setLocationError,
    ] = useState("");


    const [
        paymentCollected,
        setPaymentCollected,
    ] = useState(false);


    const [
        otpOpen,
        setOtpOpen,
    ] = useState(false);


    const [
        otp,
        setOtp,
    ] = useState("");


    const [
        otpError,
        setOtpError,
    ] = useState("");


    // =========================================
    // LIVE LOCATION
    // =========================================

    useEffect(() => {

        if (
            !navigator.geolocation
        ) {

            setLocationError(
                "Location is not supported on this device."
            );

            return;
        }


        const watchId =
            navigator.geolocation
                .watchPosition(

                    (position) => {

                        setAgentLocation({

                            latitude:
                                position.coords.latitude,

                            longitude:
                                position.coords.longitude,

                        });


                        setLocationError(
                            ""
                        );
                    },


                    () => {

                        setLocationError(
                            "Please allow location permission for live delivery tracking."
                        );
                    },


                    {

                        enableHighAccuracy:
                            true,

                        timeout:
                            10000,

                        maximumAge:
                            5000,

                    }

                );


        return () => {

            navigator.geolocation
                .clearWatch(
                    watchId
                );
        };

    }, []);


    // =========================================
    // DESTINATION
    // =========================================

    const goingToRestaurant =
        delivery.status ===
        "DELIVERY_ASSIGNED";


    const destination =
        goingToRestaurant
            ? delivery.restaurant
            : delivery.customer;


    const destinationPosition =
        useMemo(
            () => [

                Number(
                    destination.latitude
                ),

                Number(
                    destination.longitude
                ),

            ],
            [
                destination,
            ]
        );


    const agentPosition =
        useMemo(
            () => {

                if (
                    !agentLocation
                ) {
                    return null;
                }

                return [

                    Number(
                        agentLocation.latitude
                    ),

                    Number(
                        agentLocation.longitude
                    ),

                ];
            },
            [
                agentLocation,
            ]
        );


    const routeLine =
        useMemo(
            () => {

                if (
                    !agentPosition
                ) {
                    return [];
                }

                return [

                    agentPosition,

                    destinationPosition,

                ];
            },
            [
                agentPosition,
                destinationPosition,
            ]
        );


    const currentStep =
        STATUS_INDEX[
        delivery.status
        ] ?? 0;


    const status =
        STATUS_CONFIG[
        delivery.status
        ] || {

            label:
                delivery.status,

            variant:
                "neutral",
        };


    const isCod =
        delivery.paymentMethod ===
        "COD";


    const paymentComplete =

        !isCod ||

        paymentCollected ||

        delivery.paymentStatus ===
        "PAID";


    // =========================================
    // CALL
    // =========================================

    const handleCall =
        (phone) => {

            if (!phone) {
                return;
            }

            window.location.href =
                `tel:${phone}`;
        };


    // =========================================
    // DIRECTIONS
    // =========================================

    const openDirections =
        (
            location = destination
        ) => {

            if (
                !location?.latitude ||
                !location?.longitude
            ) {
                return;
            }


            const url =

                `https://www.google.com/maps/dir/?api=1` +

                `&destination=${location.latitude},${location.longitude}` +

                `&travelmode=driving`;


            window.open(

                url,

                "_blank",

                "noopener,noreferrer"

            );
        };


    // =========================================
    // PICKUP
    // =========================================

    const handlePickup =
        () => {

            setDelivery(
                (previous) => ({

                    ...previous,

                    status:
                        "PICKED_UP",

                })
            );
        };


    // =========================================
    // START DELIVERY
    // =========================================

    const handleStartDelivery =
        () => {

            setDelivery(
                (previous) => ({

                    ...previous,

                    status:
                        "OUT_FOR_DELIVERY",

                })
            );
        };


    // =========================================
    // COD PAYMENT
    // =========================================

    const handleCollectPayment =
        () => {

            setPaymentCollected(
                true
            );


            setDelivery(
                (previous) => ({

                    ...previous,

                    paymentStatus:
                        "COLLECTED",

                })
            );
        };


    // =========================================
    // OPEN OTP
    // =========================================

    const handleOpenOtp =
        () => {

            if (
                !paymentComplete
            ) {
                return;
            }


            setOtp("");

            setOtpError("");

            setOtpOpen(
                true
            );
        };


    // =========================================
    // VERIFY OTP
    // =========================================

    const handleVerifyOtp =
        () => {

            const cleanOtp =
                otp.trim();


            if (
                !/^\d{6}$/.test(
                    cleanOtp
                )
            ) {

                setOtpError(
                    "Enter a valid 6 digit OTP."
                );

                return;
            }


            // TEMP FRONTEND TEST
            if (
                cleanOtp !==
                "123456"
            ) {

                setOtpError(
                    "Invalid OTP. Testing OTP is 123456."
                );

                return;
            }


            setDelivery(
                (previous) => ({

                    ...previous,

                    status:
                        "DELIVERED",

                    paymentStatus:

                        previous
                            .paymentMethod ===
                            "COD"

                            ? "COLLECTED"

                            : previous
                                .paymentStatus,

                })
            );


            setOtpOpen(
                false
            );

            setOtp("");

            setOtpError("");
        };


    return (

        <>

            <div className="space-y-6">


                {/* =================================
            HEADER
        ================================= */}

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

                        title="Active Delivery"

                        description="Track route, collect payment and complete delivery securely with OTP."

                    />


                    <div
                        className="
              flex
              flex-wrap
              items-center
              gap-2
            "
                    >

                        <StatusBadge

                            variant={
                                status.variant
                            }

                            size="sm"

                            dot

                        >

                            {
                                status.label
                            }

                        </StatusBadge>


                        <StatusBadge

                            variant="success"

                            size="sm"

                            dot

                        >

                            Live Tracking On

                        </StatusBadge>

                    </div>

                </div>


                {/* =================================
            DELIVERY SUMMARY
        ================================= */}

                <section
                    className="
            overflow-hidden

            rounded-[1.75rem]

            border
            border-slate-200

            bg-white

            shadow-sm
          "
                >

                    <div
                        className="
              bg-gradient-to-r
              from-slate-950
              via-slate-900
              to-orange-950

              p-5

              text-white

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

                                <p
                                    className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-orange-300
                  "
                                >
                                    Current Delivery
                                </p>


                                <h1
                                    className="
                    mt-2
                    text-2xl
                    font-black
                  "
                                >

                                    {
                                        delivery.orderNumber
                                    }

                                </h1>


                                <p
                                    className="
                    mt-2
                    max-w-xl

                    text-sm
                    leading-6
                    text-slate-300
                  "
                                >

                                    {
                                        goingToRestaurant

                                            ? `Head to ${delivery.restaurant.name} and collect the order.`

                                            : delivery.status ===
                                                "DELIVERED"

                                                ? "Delivery completed successfully."

                                                : `Deliver the order to ${delivery.customer.name}.`
                                    }

                                </p>

                            </div>


                            <div
                                className="
                  grid
                  grid-cols-3
                  gap-2
                "
                            >

                                <SummaryBox

                                    label="Items"

                                    value={
                                        delivery.totalItems
                                    }

                                />


                                <SummaryBox

                                    label="Payment"

                                    value={
                                        delivery.paymentMethod
                                    }

                                />


                                <SummaryBox

                                    label="Amount"

                                    value={
                                        `₹${delivery.orderAmount}`
                                    }

                                />

                            </div>

                        </div>

                    </div>


                    {/* DELIVERY PROGRESS */}

                    <div
                        className="
              p-5
              sm:p-6
            "
                    >

                        <div
                            className="
                grid
                gap-3

                md:grid-cols-4
              "
                        >

                            {
                                STEPS.map(
                                    (
                                        step,
                                        index
                                    ) => {

                                        const completed =
                                            index <
                                            currentStep;


                                        const active =
                                            index ===
                                            currentStep;


                                        return (

                                            <div

                                                key={
                                                    step.key
                                                }

                                                className={[
                                                    "rounded-2xl border p-4 transition",

                                                    completed

                                                        ? "border-emerald-200 bg-emerald-50"

                                                        : active

                                                            ? "border-orange-200 bg-orange-50"

                                                            : "border-slate-200 bg-slate-50",

                                                ].join(" ")}

                                            >

                                                <div
                                                    className="
                            flex
                            items-center
                            gap-3
                          "
                                                >

                                                    <div

                                                        className={[
                                                            "flex h-9 w-9 items-center justify-center rounded-xl",

                                                            completed

                                                                ? "bg-emerald-600 text-white"

                                                                : active

                                                                    ? "bg-orange-500 text-white"

                                                                    : "bg-white text-slate-400",

                                                        ].join(" ")}

                                                    >

                                                        {
                                                            completed ? (

                                                                <CheckCircle2
                                                                    className="
                                    h-4
                                    w-4
                                  "
                                                                />

                                                            ) : (

                                                                <span
                                                                    className="
                                    text-xs
                                    font-black
                                  "
                                                                >

                                                                    {
                                                                        index + 1
                                                                    }

                                                                </span>
                                                            )
                                                        }

                                                    </div>


                                                    <div>

                                                        <p
                                                            className="
                                text-sm
                                font-black
                                text-slate-900
                              "
                                                        >

                                                            {
                                                                step.label
                                                            }

                                                        </p>


                                                        <p
                                                            className="
                                mt-0.5
                                text-xs
                                text-slate-500
                              "
                                                        >

                                                            {
                                                                step.description
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    }
                                )
                            }

                        </div>

                    </div>

                </section>


                {/* =================================
            MAIN GRID
        ================================= */}

                <div
                    className="
            grid
            gap-6

            xl:grid-cols-[1.45fr_0.8fr]
          "
                >


                    {/* LEFT SIDE */}

                    <div
                        className="
              space-y-6
            "
                    >


                        {/* MAP */}

                        <section
                            className="
                overflow-hidden

                rounded-[1.75rem]

                border
                border-slate-200

                bg-white

                shadow-sm
              "
                        >

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
                "
                            >

                                <div>

                                    <div
                                        className="
                      flex
                      items-center
                      gap-2
                    "
                                    >

                                        <Navigation
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

                                            {
                                                goingToRestaurant

                                                    ? "Navigate to Restaurant"

                                                    : "Navigate to Customer"
                                            }

                                        </h2>

                                    </div>


                                    <p
                                        className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                                    >

                                        {
                                            destination.address
                                        }

                                    </p>

                                </div>


                                <Button

                                    type="button"

                                    onClick={() =>
                                        openDirections(
                                            destination
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

                                        Open Navigation

                                    </span>

                                </Button>

                            </div>


                            <div
                                className="
                  relative
                  h-[430px]
                "
                            >

                                <MapContainer

                                    center={
                                        destinationPosition
                                    }

                                    zoom={
                                        14
                                    }

                                    scrollWheelZoom

                                    className="
                    h-full
                    w-full
                  "

                                >

                                    <TileLayer

                                        attribution="&copy; OpenStreetMap contributors"

                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                                    />


                                    <Marker
                                        position={
                                            destinationPosition
                                        }
                                    >

                                        <Popup>

                                            <strong>
                                                {
                                                    destination.name
                                                }
                                            </strong>

                                            <br />

                                            {
                                                destination.address
                                            }

                                        </Popup>

                                    </Marker>


                                    {
                                        agentPosition && (

                                            <CircleMarker

                                                center={
                                                    agentPosition
                                                }

                                                radius={
                                                    10
                                                }

                                                pathOptions={{

                                                    fillOpacity:
                                                        1,

                                                    weight:
                                                        3,

                                                }}

                                            >

                                                <Popup>
                                                    Delivery partner live location
                                                </Popup>

                                            </CircleMarker>
                                        )
                                    }


                                    {
                                        routeLine.length >
                                        0 && (

                                            <Polyline
                                                positions={
                                                    routeLine
                                                }
                                            />

                                        )
                                    }


                                    <MapFocus

                                        position={
                                            destinationPosition
                                        }

                                    />

                                </MapContainer>


                                {
                                    locationError && (

                                        <div
                                            className="
                        absolute
                        bottom-4
                        left-4
                        right-4

                        z-[500]

                        rounded-xl

                        border
                        border-amber-200

                        bg-amber-50

                        p-3

                        text-xs
                        font-semibold
                        text-amber-800

                        shadow-sm
                      "
                                        >

                                            {
                                                locationError
                                            }

                                        </div>
                                    )
                                }


                                <div
                                    className="
                    absolute
                    left-4
                    top-4

                    z-[500]

                    rounded-xl

                    border
                    border-emerald-200

                    bg-white/95

                    px-3
                    py-2

                    shadow-sm

                    backdrop-blur
                  "
                                >

                                    <p
                                        className="
                      flex
                      items-center
                      gap-2

                      text-xs
                      font-black
                      text-emerald-700
                    "
                                    >

                                        <span
                                            className="
                        h-2
                        w-2

                        rounded-full

                        bg-emerald-500
                      "
                                        />

                                        Live location sharing

                                    </p>

                                </div>

                            </div>

                        </section>


                        {/* RESTAURANT + CUSTOMER */}

                        <div
                            className="
                grid
                gap-5

                lg:grid-cols-2
              "
                        >

                            <ContactCard

                                icon={
                                    Store
                                }

                                eyebrow="Pickup Restaurant"

                                name={
                                    delivery.restaurant
                                        .name
                                }

                                address={
                                    delivery.restaurant
                                        .address
                                }

                                onCall={() =>
                                    handleCall(
                                        delivery.restaurant
                                            .phone
                                    )
                                }

                                onDirections={() =>
                                    openDirections(
                                        delivery.restaurant
                                    )
                                }

                            />


                            <ContactCard

                                icon={
                                    UserRound
                                }

                                eyebrow="Customer"

                                name={
                                    delivery.customer
                                        .name
                                }

                                address={
                                    delivery.customer
                                        .address
                                }

                                onCall={() =>
                                    handleCall(
                                        delivery.customer
                                            .phone
                                    )
                                }

                                onDirections={() =>
                                    openDirections(
                                        delivery.customer
                                    )
                                }

                            />

                        </div>

                    </div>


                    {/* =================================
              RIGHT SIDEBAR
          ================================= */}

                    <aside
                        className="
              space-y-5
            "
                    >


                        {/* CURRENT TASK */}

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

                            <SectionTitle

                                icon={
                                    Bike
                                }

                                title="Current Task"

                                description="Complete the next delivery step."

                            />


                            <div
                                className="
                  mt-5

                  rounded-2xl

                  bg-slate-50

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
                                    Next Action
                                </p>


                                <p
                                    className="
                    mt-2
                    text-base
                    font-black
                    text-slate-900
                  "
                                >

                                    {
                                        delivery.status ===
                                            "DELIVERY_ASSIGNED"

                                            ? "Collect order from restaurant"

                                            : delivery.status ===
                                                "PICKED_UP"

                                                ? "Start delivery to customer"

                                                : delivery.status ===
                                                    "OUT_FOR_DELIVERY"

                                                    ? "Collect payment & verify OTP"

                                                    : "Delivery completed"
                                    }

                                </p>

                            </div>


                            <div
                                className="
                  mt-4
                "
                            >

                                {
                                    delivery.status ===
                                    "DELIVERY_ASSIGNED" && (

                                        <Button

                                            type="button"

                                            onClick={
                                                handlePickup
                                            }

                                            className="w-full"

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

                                                Confirm Pickup

                                            </span>

                                        </Button>
                                    )
                                }


                                {
                                    delivery.status ===
                                    "PICKED_UP" && (

                                        <Button

                                            type="button"

                                            onClick={
                                                handleStartDelivery
                                            }

                                            className="w-full"

                                        >

                                            <span
                                                className="
                          inline-flex
                          items-center
                          gap-2
                        "
                                            >

                                                <Bike
                                                    className="
                            h-4
                            w-4
                          "
                                                />

                                                Start Delivery

                                            </span>

                                        </Button>
                                    )
                                }


                                {
                                    delivery.status ===
                                    "OUT_FOR_DELIVERY" && (

                                        <Button

                                            type="button"

                                            disabled={
                                                !paymentComplete
                                            }

                                            onClick={
                                                handleOpenOtp
                                            }

                                            className="w-full"

                                        >

                                            <span
                                                className="
                          inline-flex
                          items-center
                          gap-2
                        "
                                            >

                                                <KeyRound
                                                    className="
                            h-4
                            w-4
                          "
                                                />

                                                Verify OTP & Complete

                                            </span>

                                        </Button>
                                    )
                                }


                                {
                                    delivery.status ===
                                    "DELIVERED" && (

                                        <Button

                                            type="button"

                                            onClick={() =>
                                                navigate(
                                                    "/delivery/history"
                                                )
                                            }

                                            className="w-full"

                                        >

                                            View Delivery History

                                        </Button>
                                    )
                                }

                            </div>

                        </section>


                        {/* PAYMENT */}

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

                            <SectionTitle

                                icon={
                                    WalletCards
                                }

                                title="Payment"

                                description="Check payment before delivery completion."

                            />


                            <div
                                className="
                  mt-5
                  space-y-3
                "
                            >

                                <Row

                                    label="Method"

                                    value={
                                        delivery.paymentMethod
                                    }

                                />


                                <Row

                                    label="Order Amount"

                                    value={
                                        `₹${delivery.orderAmount}`
                                    }

                                />


                                <Row

                                    label="Delivery Fee"

                                    value={
                                        `₹${delivery.deliveryFee}`
                                    }

                                />


                                <Row

                                    label="Status"

                                    value={

                                        paymentComplete

                                            ? "Completed"

                                            : "Pending"

                                    }

                                    success={
                                        paymentComplete
                                    }

                                />

                            </div>


                            {
                                isCod &&

                                delivery.status ===
                                "OUT_FOR_DELIVERY" &&

                                !paymentCollected && (

                                    <div
                                        className="
                      mt-5

                      rounded-2xl

                      border
                      border-amber-200

                      bg-amber-50

                      p-4
                    "
                                    >

                                        <div
                                            className="
                        flex
                        gap-3
                      "
                                        >

                                            <Banknote
                                                className="
                          mt-0.5
                          h-5
                          w-5
                          text-amber-600
                        "
                                            />


                                            <div>

                                                <p
                                                    className="
                            font-black
                            text-amber-950
                          "
                                                >

                                                    Collect ₹
                                                    {
                                                        delivery.orderAmount
                                                    }

                                                </p>


                                                <p
                                                    className="
                            mt-1
                            text-xs
                            leading-5
                            text-amber-700
                          "
                                                >

                                                    Confirm cash collection before OTP verification.

                                                </p>

                                            </div>

                                        </div>


                                        <Button

                                            type="button"

                                            className="
                        mt-4
                        w-full
                      "

                                            onClick={
                                                handleCollectPayment
                                            }

                                        >

                                            Mark Payment Collected

                                        </Button>

                                    </div>
                                )
                            }


                            {
                                paymentComplete && (

                                    <div
                                        className="
                      mt-5

                      flex
                      items-center
                      gap-3

                      rounded-2xl

                      border
                      border-emerald-200

                      bg-emerald-50

                      p-4
                    "
                                    >

                                        <CheckCircle2
                                            className="
                        h-5
                        w-5
                        text-emerald-600
                      "
                                        />


                                        <div>

                                            <p
                                                className="
                          text-sm
                          font-black
                          text-emerald-900
                        "
                                            >

                                                Payment cleared

                                            </p>


                                            <p
                                                className="
                          mt-0.5
                          text-xs
                          text-emerald-700
                        "
                                            >

                                                Delivery can be completed with OTP.

                                            </p>

                                        </div>

                                    </div>
                                )
                            }

                        </section>


                        {/* OTP INFO */}

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

                            <SectionTitle

                                icon={
                                    ShieldCheck
                                }

                                title="Secure Handover"

                                description="Customer OTP protects delivery completion."

                            />


                            <div
                                className="
                  mt-5

                  rounded-2xl

                  bg-slate-50

                  p-4
                "
                            >

                                <div
                                    className="
                    flex
                    items-start
                    gap-3
                  "
                                >

                                    <KeyRound
                                        className="
                      mt-0.5
                      h-5
                      w-5
                      text-orange-500
                    "
                                    />


                                    <div>

                                        <p
                                            className="
                        text-sm
                        font-black
                        text-slate-900
                      "
                                        >

                                            Ask customer for 6 digit OTP

                                        </p>


                                        <p
                                            className="
                        mt-1
                        text-xs
                        leading-5
                        text-slate-500
                      "
                                        >

                                            Never complete delivery without customer OTP verification.

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* ORDER SUMMARY */}

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

                            <SectionTitle

                                icon={
                                    ReceiptText
                                }

                                title="Order Summary"

                                description="Quick delivery reference."

                            />


                            <div
                                className="
                  mt-5

                  grid
                  grid-cols-2
                  gap-3
                "
                            >

                                <MiniStat

                                    icon={
                                        PackageCheck
                                    }

                                    label="Items"

                                    value={
                                        delivery.totalItems
                                    }

                                />


                                <MiniStat

                                    icon={
                                        CreditCard
                                    }

                                    label="Payment"

                                    value={
                                        delivery.paymentMethod
                                    }

                                />


                                <MiniStat

                                    icon={
                                        Clock3
                                    }

                                    label="Status"

                                    value={
                                        status.label
                                    }

                                />


                                <MiniStat

                                    icon={
                                        MapPin
                                    }

                                    label="Destination"

                                    value={

                                        goingToRestaurant

                                            ? "Restaurant"

                                            : "Customer"

                                    }

                                />

                            </div>

                        </section>

                    </aside>

                </div>

            </div>


            {/* =================================
          OTP MODAL
      ================================= */}

            <Modal

                open={
                    otpOpen
                }

                onClose={() => {

                    setOtpOpen(
                        false
                    );

                    setOtp("");

                    setOtpError("");

                }}

                title="Verify Delivery OTP"

                description={
                    `Enter the 6 digit OTP shared by ${delivery.customer.name}.`
                }

            >

                <div
                    className="
            space-y-4
          "
                >

                    <div
                        className="
              rounded-2xl

              border
              border-orange-100

              bg-orange-50

              p-4
            "
                    >

                        <div
                            className="
                flex
                items-start
                gap-3
              "
                        >

                            <ShieldCheck
                                className="
                  mt-0.5
                  h-5
                  w-5
                  text-orange-600
                "
                            />


                            <div>

                                <p
                                    className="
                    text-sm
                    font-black
                    text-slate-900
                  "
                                >

                                    Secure delivery confirmation

                                </p>


                                <p
                                    className="
                    mt-1
                    text-xs
                    leading-5
                    text-slate-600
                  "
                                >

                                    Frontend testing OTP:

                                    {" "}

                                    <span
                                        className="
                      font-black
                    "
                                    >

                                        123456

                                    </span>

                                </p>

                            </div>

                        </div>

                    </div>


                    <div>

                        <label
                            className="
                mb-2
                block

                text-xs
                font-bold
                uppercase
                tracking-wide
                text-slate-500
              "
                        >

                            Customer OTP

                        </label>


                        <input

                            value={
                                otp
                            }

                            onChange={
                                (event) => {

                                    const value =
                                        event.target
                                            .value
                                            .replace(
                                                /\D/g,
                                                ""
                                            )
                                            .slice(
                                                0,
                                                6
                                            );


                                    setOtp(
                                        value
                                    );

                                    setOtpError(
                                        ""
                                    );
                                }
                            }

                            inputMode="numeric"

                            autoComplete="one-time-code"

                            placeholder="••••••"

                            className="
                h-14
                w-full

                rounded-2xl

                border
                border-slate-200

                bg-white

                px-4

                text-center
                text-2xl
                font-black
                tracking-[0.5em]

                text-slate-900

                outline-none

                transition

                focus:border-orange-300
                focus:ring-4
                focus:ring-orange-50
              "

                        />


                        {
                            otpError && (

                                <p
                                    className="
                    mt-2

                    text-xs
                    font-semibold
                    text-red-600
                  "
                                >

                                    {
                                        otpError
                                    }

                                </p>
                            )
                        }

                    </div>


                    <Button

                        type="button"

                        disabled={
                            otp.length !==
                            6
                        }

                        onClick={
                            handleVerifyOtp
                        }

                        className="w-full"

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

                            Verify & Complete Delivery

                        </span>

                    </Button>

                </div>

            </Modal>

        </>
    );
};


// =========================================
// SMALL COMPONENTS
// =========================================

const SummaryBox = ({
    label,
    value,
}) => (

    <div
        className="
      min-w-[88px]

      rounded-2xl

      border
      border-white/10

      bg-white/10

      px-3
      py-3

      backdrop-blur
    "
    >

        <p
            className="
        text-[10px]
        font-bold
        uppercase
        tracking-wide
        text-slate-300
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
        text-white
      "
        >

            {
                value
            }

        </p>

    </div>
);


const SectionTitle = ({
    icon: Icon,
    title,
    description,
}) => (

    <div
        className="
      flex
      items-start
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

        bg-orange-50

        text-orange-600
      "
        >

            <Icon
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
          text-slate-950
        "
            >

                {
                    title
                }

            </h2>


            <p
                className="
          mt-1
          text-xs
          leading-5
          text-slate-500
        "
            >

                {
                    description
                }

            </p>

        </div>

    </div>
);


const ContactCard = ({
    icon: Icon,
    eyebrow,
    name,
    address,
    onCall,
    onDirections,
}) => (

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
        items-start
        gap-4
      "
        >

            <div
                className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center

          rounded-xl

          bg-orange-50

          text-orange-600
        "
            >

                <Icon
                    className="
            h-5
            w-5
          "
                />

            </div>


            <div
                className="
          min-w-0
          flex-1
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

                    {
                        eyebrow
                    }

                </p>


                <h3
                    className="
            mt-1
            text-lg
            font-black
            text-slate-950
          "
                >

                    {
                        name
                    }

                </h3>


                <p
                    className="
            mt-2
            text-sm
            leading-6
            text-slate-500
          "
                >

                    {
                        address
                    }

                </p>

            </div>

        </div>


        <div
            className="
        mt-5

        flex
        flex-wrap
        gap-2
      "
        >

            <Button

                type="button"

                variant="outline"

                onClick={
                    onCall
                }

            >

                <span
                    className="
            inline-flex
            items-center
            gap-2
          "
                >

                    <Phone
                        className="
              h-4
              w-4
            "
                    />

                    Call

                </span>

            </Button>


            <Button

                type="button"

                variant="outline"

                onClick={
                    onDirections
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

                    Directions

                </span>

            </Button>

        </div>

    </section>
);


const Row = ({
    label,
    value,
    success = false,
}) => (

    <div
        className="
      flex
      items-center
      justify-between
      gap-3

      border-b
      border-slate-100

      pb-3

      last:border-0
      last:pb-0
    "
    >

        <span
            className="
        text-sm
        text-slate-500
      "
        >

            {
                label
            }

        </span>


        <span
            className={[

                "text-sm font-black",

                success

                    ? "text-emerald-600"

                    : "text-slate-900",

            ].join(" ")}
        >

            {
                value
            }

        </span>

    </div>
);


const MiniStat = ({
    icon: Icon,
    label,
    value,
}) => (

    <div
        className="
      rounded-2xl
      bg-slate-50
      p-3
    "
    >

        <Icon
            className="
        h-4
        w-4
        text-orange-500
      "
        />


        <p
            className="
        mt-2

        truncate

        text-sm
        font-black
        text-slate-900
      "
        >

            {
                value
            }

        </p>


        <p
            className="
        mt-1

        text-[10px]
        font-semibold
        uppercase
        tracking-wide
        text-slate-400
      "
        >

            {
                label
            }

        </p>

    </div>
);


export default DeliveryActive;