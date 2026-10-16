import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    Bike,
    CheckCircle2,
    Clock3,
    CreditCard,
    IndianRupee,
    MapPin,
    Navigation,
    PackageCheck,
    Phone,
    ReceiptText,
    ShieldCheck,
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

import L from "leaflet";

import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Button from "../../../components/common/Button/Button";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import EmptyState from "../../../components/common/EmptyState/EmptyState";

import { getActiveOrder } from "../../../redux/thunks/deliveryAgent/deliveryActiveOrders.thunk";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const STEPS = [
    {
        key: "DELIVERY_ASSIGNED",
        label: "Assigned",
        description: "Go to restaurant",
    },
    {
        key: "PICKED_UP",
        label: "Picked Up",
        description: "Order collected",
    },
    {
        key: "OUT_FOR_DELIVERY",
        label: "On The Way",
        description: "Deliver to customer",
    },
    {
        key: "DELIVERED",
        label: "Delivered",
        description: "OTP verified",
    },
];

const STATUS_INDEX = {
    DELIVERY_ASSIGNED: 0,
    PICKED_UP: 1,
    OUT_FOR_DELIVERY: 2,
    DELIVERED: 3,
};

const STATUS_CONFIG = {
    DELIVERY_ASSIGNED: {
        label: "Go To Restaurant",
        variant: "warning",
    },
    PICKED_UP: {
        label: "Order Picked Up",
        variant: "info",
    },
    OUT_FOR_DELIVERY: {
        label: "Out For Delivery",
        variant: "purple",
    },
    DELIVERED: {
        label: "Delivered",
        variant: "success",
    },
};

const MapFocus = ({ position }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, 14, { duration: 1 });
        }
    }, [map, position]);

    return null;
};

const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(Number(amount || 0));

const buildAddress = (...values) =>
    values.filter((value) => value && String(value).trim()).join(", ");

const getPosition = (latitude, longitude) => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    return Number.isFinite(lat) && Number.isFinite(lng)
        ? [lat, lng]
        : null;
};

const DeliveryActive = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orderNumber = useParams()

    const { activeOrder, fetchLoading, error } = useSelector(
        (state) => state.deliveryActiveOrder,
    );

    const [agentLocation, setAgentLocation] = useState(null);
    const [locationError, setLocationError] = useState("");

    useEffect(() => {
        dispatch(getActiveOrder(orderNumber));
    }, [dispatch]);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError("Location is not supported on this device.");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setAgentLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

                setLocationError("");
            },
            () => {
                setLocationError(
                    "Please allow location permission for live delivery tracking.",
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000,
            },
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    const delivery = useMemo(() => {
        if (!activeOrder) return null;

        const items = Array.isArray(activeOrder.items)
            ? activeOrder.items
            : [];

        return {
            ...activeOrder,

            totalItems: items.reduce(
                (total, item) => total + Number(item.quantity || 0),
                0,
            ),

            orderAmount: activeOrder.totalAmount,

            restaurant: {
                name: activeOrder.restaurantName,
                phone: activeOrder.restaurantPhone,
                address: buildAddress(
                    activeOrder.restaurantAddress,
                    activeOrder.restaurantCity,
                    activeOrder.restaurantState,
                    activeOrder.restaurantPincode,
                ),
                latitude: activeOrder.restaurantLatitude,
                longitude: activeOrder.restaurantLongitude,
            },

            customer: {
                name: activeOrder.customerName,
                phone: activeOrder.customerPhone,
                address: buildAddress(
                    activeOrder.deliveryAddress,
                    activeOrder.landmark,
                    activeOrder.deliveryCity,
                    activeOrder.deliveryState,
                    activeOrder.deliveryPincode,
                ),
                latitude: activeOrder.deliveryLatitude,
                longitude: activeOrder.deliveryLongitude,
            },

            items,
        };
    }, [activeOrder]);

    if (fetchLoading && !delivery) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Active Delivery"
                    description="Track and manage your current delivery."
                />

                <Skeleton
                    width="w-full"
                    height="h-44"
                    rounded="rounded-[1.75rem]"
                />

                <Skeleton
                    width="w-full"
                    height="h-[450px]"
                    rounded="rounded-[1.75rem]"
                />
            </div>
        );
    }

    if (error && !delivery) {
        return (
            <ErrorState
                title="Unable to load active delivery"
                description={error}
                onRetry={() => dispatch(getActiveOrder())}
            />
        );
    }

    if (!delivery) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Active Delivery"
                    description="Track and manage your current delivery."
                />

                <EmptyState
                    icon={Bike}
                    title="No active delivery"
                    description="You don't currently have an assigned delivery."
                    action={
                        <Button onClick={() => navigate("/delivery/offers")}>
                            View Delivery Offers
                        </Button>
                    }
                />
            </div>
        );
    }

    const goingToRestaurant =
        delivery.status === "DELIVERY_ASSIGNED";

    const destination = goingToRestaurant
        ? delivery.restaurant
        : delivery.customer;

    const destinationPosition = getPosition(
        destination?.latitude,
        destination?.longitude,
    );

    const agentPosition = agentLocation
        ? getPosition(
            agentLocation.latitude,
            agentLocation.longitude,
        )
        : null;

    const routeLine =
        agentPosition && destinationPosition
            ? [agentPosition, destinationPosition]
            : [];

    const currentStep =
        STATUS_INDEX[delivery.status] ?? 0;

    const status =
        STATUS_CONFIG[delivery.status] || {
            label: delivery.status,
            variant: "neutral",
        };

    const openDirections = (location = destination) => {
        const position = getPosition(
            location?.latitude,
            location?.longitude,
        );

        if (!position) return;

        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}&travelmode=driving`,
            "_blank",
            "noopener,noreferrer",
        );
    };

    const handleCall = (phone) => {
        if (phone) window.location.href = `tel:${phone}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <PageHeader
                    title="Active Delivery"
                    description="Track route, delivery progress and secure handover."
                />

                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge variant={status.variant} size="sm" dot>
                        {status.label}
                    </StatusBadge>

                    <StatusBadge variant="success" size="sm" dot>
                        Live Tracking On
                    </StatusBadge>
                </div>
            </div>

            <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 p-5 text-white sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
                                Current Delivery
                            </p>

                            <h1 className="mt-2 text-2xl font-black">
                                {delivery.orderNumber}
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                                {goingToRestaurant
                                    ? `Head to ${delivery.restaurant.name} and collect the order.`
                                    : `Deliver the order to ${delivery.customer.name}.`}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <SummaryBox
                                label="Items"
                                value={delivery.totalItems}
                            />
                            <SummaryBox
                                label="Payment"
                                value={delivery.paymentMethod}
                            />
                            <SummaryBox
                                label="Amount"
                                value={formatPrice(delivery.orderAmount)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 p-5 sm:p-6 md:grid-cols-4">
                    {STEPS.map((step, index) => {
                        const completed = index < currentStep;
                        const active = index === currentStep;

                        return (
                            <div
                                key={step.key}
                                className={`rounded-2xl border p-4 ${completed
                                    ? "border-emerald-200 bg-emerald-50"
                                    : active
                                        ? "border-orange-200 bg-orange-50"
                                        : "border-slate-200 bg-slate-50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${completed
                                            ? "bg-emerald-600 text-white"
                                            : active
                                                ? "bg-orange-500 text-white"
                                                : "bg-white text-slate-400"
                                            }`}
                                    >
                                        {completed ? (
                                            <CheckCircle2 className="h-4 w-4" />
                                        ) : (
                                            <span className="text-xs font-black">
                                                {index + 1}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-sm font-black text-slate-900">
                                            {step.label}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
                <div className="space-y-6">
                    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Navigation className="h-5 w-5 text-orange-500" />

                                    <h2 className="font-black text-slate-950">
                                        {goingToRestaurant
                                            ? "Navigate to Restaurant"
                                            : "Navigate to Customer"}
                                    </h2>
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    {destination.address || "Address unavailable"}
                                </p>
                            </div>

                            <Button
                                type="button"
                                disabled={!destinationPosition}
                                onClick={() => openDirections(destination)}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <Navigation className="h-4 w-4" />
                                    Open Navigation
                                </span>
                            </Button>
                        </div>

                        <div className="relative h-[430px]">
                            {destinationPosition ? (
                                <MapContainer
                                    center={destinationPosition}
                                    zoom={14}
                                    scrollWheelZoom
                                    className="h-full w-full"
                                >
                                    <TileLayer
                                        attribution="&copy; OpenStreetMap contributors"
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    <Marker position={destinationPosition}>
                                        <Popup>
                                            <strong>{destination.name}</strong>
                                            <br />
                                            {destination.address}
                                        </Popup>
                                    </Marker>

                                    {agentPosition && (
                                        <CircleMarker
                                            center={agentPosition}
                                            radius={10}
                                            pathOptions={{
                                                fillOpacity: 1,
                                                weight: 3,
                                            }}
                                        >
                                            <Popup>
                                                Delivery partner live location
                                            </Popup>
                                        </CircleMarker>
                                    )}

                                    {routeLine.length === 2 && (
                                        <Polyline positions={routeLine} />
                                    )}

                                    <MapFocus
                                        position={destinationPosition}
                                    />
                                </MapContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center bg-slate-50">
                                    <div className="text-center">
                                        <MapPin className="mx-auto h-7 w-7 text-slate-300" />
                                        <p className="mt-2 text-sm font-bold text-slate-500">
                                            Location unavailable
                                        </p>
                                    </div>
                                </div>
                            )}

                            {locationError && (
                                <div className="absolute bottom-4 left-4 right-4 z-[500] rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800 shadow-sm">
                                    {locationError}
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="grid gap-5 lg:grid-cols-2">
                        <ContactCard
                            icon={Store}
                            eyebrow="Pickup Restaurant"
                            name={delivery.restaurant.name}
                            address={delivery.restaurant.address}
                            phone={delivery.restaurant.phone}
                            onCall={() =>
                                handleCall(delivery.restaurant.phone)
                            }
                            onDirections={() =>
                                openDirections(delivery.restaurant)
                            }
                        />

                        <ContactCard
                            icon={UserRound}
                            eyebrow="Customer"
                            name={delivery.customer.name}
                            address={delivery.customer.address}
                            phone={delivery.customer.phone}
                            onCall={() =>
                                handleCall(delivery.customer.phone)
                            }
                            onDirections={() =>
                                openDirections(delivery.customer)
                            }
                        />
                    </div>

                    {delivery.items.length > 0 && (
                        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                            <SectionTitle
                                icon={ReceiptText}
                                title="Order Items"
                                description="Items included in this delivery."
                            />

                            <div className="mt-5 divide-y divide-slate-100">
                                {delivery.items.map((item) => (
                                    <div
                                        key={`${item.slug}-${item.name}`}
                                        className="flex items-center justify-between gap-4 py-3"
                                    >
                                        <div>
                                            <p className="font-black text-slate-900">
                                                {item.name}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {item.quantity} ×{" "}
                                                {formatPrice(item.unitPrice)}
                                            </p>
                                        </div>

                                        <p className="font-black text-slate-900">
                                            {formatPrice(item.itemTotal)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <aside className="space-y-5">
                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <SectionTitle
                            icon={Bike}
                            title="Current Task"
                            description="Complete the next delivery step."
                        />

                        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                Next Action
                            </p>

                            <p className="mt-2 font-black text-slate-900">
                                {delivery.status === "DELIVERY_ASSIGNED"
                                    ? "Collect order from restaurant"
                                    : delivery.status === "PICKED_UP"
                                        ? "Start delivery to customer"
                                        : "Verify customer OTP and complete delivery"}
                            </p>
                        </div>

                        <p className="mt-4 text-xs leading-5 text-slate-500">
                            Status action APIs will be connected here next. No fake frontend
                            status updates are being used.
                        </p>
                    </section>

                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <SectionTitle
                            icon={CreditCard}
                            title="Payment"
                            description="Order payment information."
                        />

                        <div className="mt-5 space-y-3">
                            <Row
                                label="Method"
                                value={delivery.paymentMethod || "-"}
                            />

                            <Row
                                label="Subtotal"
                                value={formatPrice(delivery.subtotal)}
                            />

                            <Row
                                label="Delivery Fee"
                                value={formatPrice(delivery.deliveryFee)}
                            />

                            <Row
                                label="Tax"
                                value={formatPrice(delivery.taxAmount)}
                            />

                            <Row
                                label="Total"
                                value={formatPrice(delivery.totalAmount)}
                            />

                            <Row
                                label="Status"
                                value={delivery.paymentStatus || "-"}
                                success={delivery.paymentStatus === "PAID"}
                            />
                        </div>
                    </section>

                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <SectionTitle
                            icon={ShieldCheck}
                            title="Secure Handover"
                            description="Delivery completion will require customer OTP."
                        />

                        <div className="mt-5 rounded-2xl bg-orange-50 p-4">
                            <p className="text-sm font-black text-slate-900">
                                OTP verification
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-600">
                                When Start Delivery API is connected, OTP will be generated on
                                backend and emailed to the customer.
                            </p>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

const SummaryBox = ({ label, value }) => (
    <div className="min-w-[88px] rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-300">
            {label}
        </p>
        <p className="mt-1 text-sm font-black text-white">
            {value}
        </p>
    </div>
);

const SectionTitle = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Icon className="h-5 w-5" />
        </div>

        <div>
            <h2 className="font-black text-slate-950">{title}</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
                {description}
            </p>
        </div>
    </div>
);

const ContactCard = ({
    icon: Icon,
    eyebrow,
    name,
    address,
    phone,
    onCall,
    onDirections,
}) => (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {eyebrow}
                </p>

                <h3 className="mt-1 text-lg font-black text-slate-950">
                    {name || "-"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    {address || "Address unavailable"}
                </p>
            </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
            {phone && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCall}
                >
                    <span className="inline-flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Call
                    </span>
                </Button>
            )}

            <Button
                type="button"
                variant="outline"
                onClick={onDirections}
            >
                <span className="inline-flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Directions
                </span>
            </Button>
        </div>
    </section>
);

const Row = ({ label, value, success = false }) => (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
        <span className="text-sm text-slate-500">{label}</span>
        <span
            className={`text-sm font-black ${success
                ? "text-emerald-600"
                : "text-slate-900"
                }`}
        >
            {value}
        </span>
    </div>
);

export default DeliveryActive;