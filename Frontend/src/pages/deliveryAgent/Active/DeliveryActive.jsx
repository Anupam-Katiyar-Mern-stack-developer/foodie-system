import {
    useEffect,
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
    MapPin,
    Navigation,
    PackageCheck,
    Phone,
    Store,
    UserRound,
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

import L
    from "leaflet";


import PageHeader
    from "../../../components/common/PageHeader/PageHeader";

import Button
    from "../../../components/common/Button/Button";

import StatusBadge
    from "../../../components/common/StatusBadge/StatusBadge";


// =========================================
// LEAFLET MARKER FIX
// =========================================

delete L.Icon.Default.prototype
    ._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",

    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});


// =========================================
// MAP AUTO FOCUS
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
                duration:
                    1,
            }
        );

    }, [
        position,
        map,
    ]);


    return null;
};


// =========================================
// COMPONENT
// =========================================

const DeliveryActive = () => {

    const navigate =
        useNavigate();


    // =========================================
    // FRONTEND DUMMY ORDER
    //
    // Later API se aayega
    // =========================================

    const [
        delivery,
        setDelivery,
    ] = useState({

        orderNumber:
            "ORD-31FA3A64",

        status:
            "DELIVERY_ASSIGNED",

        totalItems:
            3,

        paymentMethod:
            "COD",

        orderAmount:
            489,


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

    });


    // =========================================
    // AGENT LIVE LOCATION
    // =========================================

    const [
        agentLocation,
        setAgentLocation,
    ] = useState(null);


    const [
        locationError,
        setLocationError,
    ] = useState(null);


    // =========================================
    // GET DEVICE LOCATION
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
            navigator.geolocation.watchPosition(

                (position) => {

                    setAgentLocation({
                        latitude:
                            position.coords
                                .latitude,

                        longitude:
                            position.coords
                                .longitude,
                    });


                    setLocationError(
                        null
                    );

                },


                (error) => {

                    console.error(
                        "LOCATION ERROR:",
                        error
                    );


                    setLocationError(
                        "Please enable location permission to use live navigation."
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
    // DELIVERY STEP
    // =========================================

    const goingToRestaurant =
        delivery.status ===
        "DELIVERY_ASSIGNED";


    const goingToCustomer =
        [
            "PICKED_UP",
            "OUT_FOR_DELIVERY",
        ].includes(
            delivery.status
        );


    // =========================================
    // CURRENT DESTINATION
    // =========================================

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

                    agentLocation.latitude,

                    agentLocation.longitude,

                ];

            },
            [
                agentLocation,
            ]
        );


    // =========================================
    // ROUTE LINE
    //
    // Frontend preview only.
    // Later routing API use hogi.
    // =========================================

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


    // =========================================
    // GOOGLE MAP NAVIGATION
    // =========================================

    const handleNavigation =
        () => {

            const latitude =
                destination.latitude;

            const longitude =
                destination.longitude;


            const navigationUrl =
                `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;


            window.open(
                navigationUrl,
                "_blank",
                "noopener,noreferrer"
            );

        };


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
    // PICKUP
    // =========================================

    const handlePickup =
        () => {

            /*
             * FRONTEND ONLY
             *
             * Later:
             *
             * dispatch(
             *   markOrderPickedUp(
             *     delivery.orderNumber
             *   )
             * )
             */

            setDelivery(
                (
                    previous
                ) => ({
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
                (
                    previous
                ) => ({
                    ...previous,

                    status:
                        "OUT_FOR_DELIVERY",
                })
            );

        };


    // =========================================
    // DELIVERED
    // =========================================

    const handleDelivered =
        () => {

            setDelivery(
                (
                    previous
                ) => ({
                    ...previous,

                    status:
                        "DELIVERED",
                })
            );

        };


    // =========================================
    // STATUS CONFIG
    // =========================================

    const statusConfig = {

        DELIVERY_ASSIGNED: {
            label:
                "Go To Restaurant",

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


    const status =
        statusConfig[
        delivery.status
        ] || {
            label:
                delivery.status,

            variant:
                "neutral",
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

                    description="Follow the pickup and delivery route and update the order as you complete each step."
                />


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

            </div>


            {/* =================================
          ORDER INFO
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
                font-bold
                uppercase
                tracking-wide
                text-slate-400
              "
                        >
                            Order Number
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
                                delivery.orderNumber
                            }
                        </h2>

                    </div>


                    <div
                        className="
              flex
              flex-wrap
              gap-3
            "
                    >

                        <div
                            className="
                rounded-xl

                bg-slate-50

                px-4
                py-2
              "
                        >

                            <p
                                className="
                  text-[10px]
                  font-bold
                  uppercase
                  text-slate-400
                "
                            >
                                Items
                            </p>


                            <p
                                className="
                  font-black
                  text-slate-900
                "
                            >
                                {
                                    delivery.totalItems
                                }
                            </p>

                        </div>


                        <div
                            className="
                rounded-xl

                bg-slate-50

                px-4
                py-2
              "
                        >

                            <p
                                className="
                  text-[10px]
                  font-bold
                  uppercase
                  text-slate-400
                "
                            >
                                Payment
                            </p>


                            <p
                                className="
                  font-black
                  text-slate-900
                "
                            >
                                {
                                    delivery.paymentMethod
                                }
                            </p>

                        </div>


                        <div
                            className="
                rounded-xl

                bg-slate-50

                px-4
                py-2
              "
                        >

                            <p
                                className="
                  text-[10px]
                  font-bold
                  uppercase
                  text-slate-400
                "
                            >
                                Amount
                            </p>


                            <p
                                className="
                  font-black
                  text-slate-900
                "
                            >
                                ₹
                                {
                                    delivery.orderAmount
                                }
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================
          MAP
      ================================= */}

            <section
                className="
          overflow-hidden

          rounded-[1.5rem]

          border
          border-slate-200

          bg-white

          shadow-sm
        "
            >

                {/* MAP HEADER */}

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

                        <h2
                            className="
                text-lg
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

                        onClick={
                            handleNavigation
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

                            Start Navigation

                        </span>

                    </Button>

                </div>


                {/* MAP */}

                <div
                    className="
            relative

            h-[400px]
            w-full

            lg:h-[500px]
          "
                >

                    <MapContainer
                        center={
                            destinationPosition
                        }

                        zoom={14}

                        scrollWheelZoom={
                            true
                        }

                        className="
              h-full
              w-full
            "
                    >

                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'

                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />


                        {/* DESTINATION */}

                        <Marker
                            position={
                                destinationPosition
                            }
                        >

                            <Popup>

                                <strong>
                                    {
                                        goingToRestaurant
                                            ? delivery
                                                .restaurant
                                                .name
                                            : delivery
                                                .customer
                                                .name
                                    }
                                </strong>

                                <br />

                                {
                                    destination.address
                                }

                            </Popup>

                        </Marker>


                        {/* AGENT */}

                        {agentPosition && (

                            <CircleMarker
                                center={
                                    agentPosition
                                }

                                radius={10}

                                pathOptions={{
                                    fillOpacity:
                                        1,

                                    weight:
                                        3,
                                }}
                            >

                                <Popup>
                                    Your current location
                                </Popup>

                            </CircleMarker>

                        )}


                        {/* TEMP STRAIGHT ROUTE */}

                        {routeLine.length >
                            0 && (

                                <Polyline
                                    positions={
                                        routeLine
                                    }
                                />

                            )}


                        <MapFocus
                            position={
                                destinationPosition
                            }
                        />

                    </MapContainer>


                    {/* LOCATION WARNING */}

                    {locationError && (

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

                    )}

                </div>

            </section>


            {/* =================================
          PICKUP + CUSTOMER
      ================================= */}

            <section
                className="
          grid
          gap-5

          lg:grid-cols-2
        "
            >

                {/* RESTAURANT */}

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
                                Pickup Restaurant
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
                                    delivery.restaurant
                                        .name
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
                                    delivery.restaurant
                                        .address
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

                            onClick={() =>
                                handleCall(
                                    delivery
                                        .restaurant
                                        .phone
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

                            onClick={() => {

                                const location =
                                    delivery.restaurant;

                                window.open(
                                    `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}&travelmode=driving`,
                                    "_blank",
                                    "noopener,noreferrer"
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

                </div>


                {/* CUSTOMER */}

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

                bg-emerald-100

                text-emerald-600
              "
                        >
                            <UserRound
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
                                Customer
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
                                    delivery.customer
                                        .name
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
                                    delivery.customer
                                        .address
                                }
                            </p>

                        </div>

                    </div>


                    <div
                        className="
              mt-5
            "
                    >

                        <Button
                            type="button"

                            variant="outline"

                            onClick={() =>
                                handleCall(
                                    delivery
                                        .customer
                                        .phone
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
                                <Phone
                                    className="
                    h-4
                    w-4
                  "
                                />

                                Call Customer
                            </span>

                        </Button>

                    </div>

                </div>

            </section>


            {/* =================================
          DELIVERY ACTION
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
            flex
            flex-col
            gap-4

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
                            Update Delivery
                        </h2>


                        <p
                            className="
                mt-1

                text-sm
                text-slate-500
              "
                        >
                            Update the order after
                            completing the current
                            delivery step.
                        </p>

                    </div>


                    {delivery.status ===
                        "DELIVERY_ASSIGNED" && (

                            <Button
                                type="button"

                                onClick={
                                    handlePickup
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

                                    Confirm Pickup

                                </span>

                            </Button>

                        )}


                    {delivery.status ===
                        "PICKED_UP" && (

                            <Button
                                type="button"

                                onClick={
                                    handleStartDelivery
                                }
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

                        )}


                    {delivery.status ===
                        "OUT_FOR_DELIVERY" && (

                            <Button
                                type="button"

                                onClick={
                                    handleDelivered
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

                                    Mark Delivered

                                </span>

                            </Button>

                        )}


                    {delivery.status ===
                        "DELIVERED" && (

                            <Button
                                type="button"

                                onClick={() =>
                                    navigate(
                                        "/delivery/history"
                                    )
                                }
                            >
                                View History
                            </Button>

                        )}

                </div>

            </section>

        </div>

    );

};


export default DeliveryActive;