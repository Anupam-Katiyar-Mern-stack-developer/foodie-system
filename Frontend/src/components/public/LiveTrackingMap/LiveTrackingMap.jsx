import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Polyline,
    Popup,
    useMap,
} from "react-leaflet";

import {
    useEffect,
    useMemo,
} from "react";

import "leaflet/dist/leaflet.css";


// =========================
// HELPERS
// =========================

const isValidPoint = (point) => {
    return (
        point &&
        Number.isFinite(
            Number(point.lat)
        ) &&
        Number.isFinite(
            Number(point.lng)
        )
    );
};


const toLatLng = (point) => [
    Number(point.lat),
    Number(point.lng),
];


// =========================
// AUTO FIT MAP
// =========================

const MapViewport = ({
    points,
}) => {
    const map = useMap();

    useEffect(() => {
        if (!points.length) {
            return;
        }

        if (points.length === 1) {
            map.setView(
                toLatLng(points[0]),
                15
            );

            return;
        }

        map.fitBounds(
            points.map(
                toLatLng
            ),
            {
                padding: [
                    40,
                    40,
                ],
            }
        );
    }, [
        map,
        points,
    ]);

    return null;
};


// =========================
// LIVE TRACKING MAP
// =========================

const LiveTrackingMap = ({
    tracking,
}) => {
    const restaurant =
        tracking?.restaurant;

    const customer =
        tracking?.customer;

    const deliveryAgent =
        tracking?.deliveryAgent;


    const points =
        useMemo(
            () =>
                [
                    restaurant,
                    deliveryAgent,
                    customer,
                ].filter(
                    isValidPoint
                ),
            [
                restaurant,
                deliveryAgent,
                customer,
            ]
        );


    const routePoints =
        useMemo(
            () =>
                [
                    restaurant,
                    deliveryAgent,
                    customer,
                ]
                    .filter(
                        isValidPoint
                    )
                    .map(
                        toLatLng
                    ),
            [
                restaurant,
                deliveryAgent,
                customer,
            ]
        );


    // =========================
    // TRACKING NOT STARTED
    // =========================

    if (
        points.length === 0
    ) {
        return (
            <div
                className="
          flex
          min-h-[320px]
          items-center
          justify-center

          rounded-[1.75rem]

          border
          border-dashed
          border-orange-200

          bg-orange-50/40

          p-8
          text-center
        "
            >
                <div>
                    <div
                        className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center

              rounded-full
              bg-orange-100

              text-2xl
            "
                    >
                        📍
                    </div>

                    <h3
                        className="
              mt-4
              text-lg
              font-black
              text-slate-900
            "
                    >
                        Live tracking will
                        start soon
                    </h3>

                    <p
                        className="
              mx-auto
              mt-2
              max-w-sm

              text-sm
              leading-6
              text-slate-500
            "
                    >
                        The map becomes live
                        after a delivery
                        partner is assigned
                        and starts sharing
                        location.
                    </p>
                </div>
            </div>
        );
    }


    const center =
        isValidPoint(
            deliveryAgent
        )
            ? toLatLng(
                deliveryAgent
            )
            : toLatLng(
                points[0]
            );


    return (
        <div
            className="
        overflow-hidden
        rounded-[1.75rem]

        border
        border-slate-200

        bg-white

        shadow-sm
      "
        >
            <MapContainer
                center={center}
                zoom={15}
                scrollWheelZoom
                className="
          h-[360px]
          w-full

          sm:h-[430px]
        "
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                <MapViewport
                    points={points}
                />


                {/* ROUTE LINE */}

                {routePoints.length >
                    1 && (
                        <Polyline
                            positions={
                                routePoints
                            }
                            pathOptions={{
                                color:
                                    "#f97316",

                                weight: 5,

                                opacity: 0.8,
                            }}
                        />
                    )}


                {/* RESTAURANT */}

                {isValidPoint(
                    restaurant
                ) && (
                        <CircleMarker
                            center={toLatLng(
                                restaurant
                            )}
                            radius={10}
                            pathOptions={{
                                color:
                                    "#ffffff",

                                fillColor:
                                    "#0f172a",

                                fillOpacity: 1,

                                weight: 3,
                            }}
                        >
                            <Popup>
                                Restaurant
                            </Popup>
                        </CircleMarker>
                    )}


                {/* DELIVERY AGENT */}

                {isValidPoint(
                    deliveryAgent
                ) && (
                        <CircleMarker
                            center={toLatLng(
                                deliveryAgent
                            )}
                            radius={12}
                            pathOptions={{
                                color:
                                    "#ffffff",

                                fillColor:
                                    "#f97316",

                                fillOpacity: 1,

                                weight: 4,
                            }}
                        >
                            <Popup>
                                Delivery partner
                                current location
                            </Popup>
                        </CircleMarker>
                    )}


                {/* CUSTOMER */}

                {isValidPoint(
                    customer
                ) && (
                        <CircleMarker
                            center={toLatLng(
                                customer
                            )}
                            radius={10}
                            pathOptions={{
                                color:
                                    "#ffffff",

                                fillColor:
                                    "#16a34a",

                                fillOpacity: 1,

                                weight: 3,
                            }}
                        >
                            <Popup>
                                Delivery location
                            </Popup>
                        </CircleMarker>
                    )}
            </MapContainer>
        </div>
    );
};


export default LiveTrackingMap;