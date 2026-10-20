import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    FaArrowLeft,
    FaBoxOpen,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaMotorcycle,
    FaPhoneAlt,
    FaReceipt,
    FaStore,
    FaUtensils,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import Button from "../../../components/common/Button/Button";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import OrderStatusTimeline from "../../../components/public/OrderStatusTimeline/OrderStatusTimeline";

import {
    getOrderStatusConfig,
    ORDER_STATUS,
} from "../../../constants/orderStatus";

import {
    getMyOrders,
} from "../../../redux/thunks/public/order.thunk";

import {
    socket,
    connectSocket,
} from "../../../socket/socket";

import {
    STORAGE_KEYS,
} from "../../../constants/storageKeys";

const LIVE_TRACKING_STATUSES = [
    ORDER_STATUS.DELIVERY_ASSIGNED,
    ORDER_STATUS.PICKED_UP,
    ORDER_STATUS.OUT_FOR_DELIVERY,
];

const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0));

const formatDate = (value) => {
    if (!value) return "-";

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
};

const OrderDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orderNumber } = useParams();

    const {
        orders = [],
        fetchLoading,
        error,
    } = useSelector((state) => state.publicOrder) || {};

    const [initialLoading, setInitialLoading] = useState(true);
    const [liveStatus, setLiveStatus] = useState(null);
    const [liveDeliveryAgent, setLiveDeliveryAgent] = useState(null);
    const [agentLocation, setAgentLocation] = useState(null);
    const [paymentUpdate, setPaymentUpdate] = useState(null);

    const order = useMemo(
        () =>
            orders.find(
                (item) =>
                    item.orderNumber === orderNumber,
            ),
        [orders, orderNumber],
    );

    // ======================================================
    // INITIAL FETCH
    // Refresh ke baad Redux empty hoga, isliye API fetch.
    // ======================================================

    useEffect(() => {
        let active = true;

        if (!orderNumber) {
            setInitialLoading(false);
            return undefined;
        }

        setInitialLoading(true);

        dispatch(getMyOrders()).finally(() => {
            if (active) {
                setInitialLoading(false);
            }
        });

        return () => {
            active = false;
        };
    }, [dispatch, orderNumber]);

    // ======================================================
    // SOCKET.IO — USER ORDER ROOM
    // ======================================================

    useEffect(() => {
        if (!orderNumber) return undefined;

        const token =
            localStorage.getItem(
                STORAGE_KEYS.USER_TOKEN,
            );

        if (!token) {
            return undefined;
        }

        let joinedOnce = false;

        const joinOrderRoom = () => {
            socket.emit(
                "order:join",
                { orderNumber },
                (response) => {
                    if (!response?.success) {
                        console.error(
                            "ORDER ROOM JOIN ERROR:",
                            response?.message,
                        );
                    }
                },
            );

            // Reconnect ke baad missed event ho sakta hai.
            // REST API se latest source-of-truth reload.
            if (joinedOnce) {
                dispatch(getMyOrders());
            }

            joinedOnce = true;
        };

        const handleStatusUpdate = (data) => {
            if (
                data?.orderNumber !== orderNumber
            ) {
                return;
            }

            setLiveStatus(data.status);

            // REST remains source of truth.
            dispatch(getMyOrders());
        };

        const handleDeliveryAssigned = (data) => {
            if (
                data?.orderNumber !== orderNumber
            ) {
                return;
            }

            setLiveStatus(
                data.status ||
                ORDER_STATUS.DELIVERY_ASSIGNED,
            );

            if (data.deliveryAgent) {
                setLiveDeliveryAgent(
                    data.deliveryAgent,
                );
            }

            dispatch(getMyOrders());
        };

        const handleDeliveryLocation = (data) => {
            if (
                data?.orderNumber !== orderNumber
            ) {
                return;
            }

            const latitude =
                Number(data.latitude);

            const longitude =
                Number(data.longitude);

            if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude)
            ) {
                return;
            }

            setAgentLocation({
                latitude,
                longitude,
                updatedAt:
                    data.updatedAt ||
                    new Date().toISOString(),
            });
        };

        const handlePaymentUpdate = (data) => {
            if (
                data?.orderNumber !== orderNumber
            ) {
                return;
            }

            setPaymentUpdate({
                paymentMethod:
                    data.paymentMethod,
                paymentStatus:
                    data.paymentStatus,
            });

            dispatch(getMyOrders());
        };

        const handleConnectError = (socketError) => {
            console.error(
                "USER ORDER SOCKET ERROR:",
                socketError.message,
            );
        };

        socket.on(
            "connect",
            joinOrderRoom,
        );

        socket.on(
            "order:status-updated",
            handleStatusUpdate,
        );

        socket.on(
            "delivery:assigned",
            handleDeliveryAssigned,
        );

        socket.on(
            "delivery:location-updated",
            handleDeliveryLocation,
        );

        socket.on(
            "payment:updated",
            handlePaymentUpdate,
        );

        socket.on(
            "connect_error",
            handleConnectError,
        );

        connectSocket(token);

        if (socket.connected) {
            joinOrderRoom();
        }

        return () => {
            if (socket.connected) {
                socket.emit(
                    "order:leave",
                    { orderNumber },
                );
            }

            socket.off(
                "connect",
                joinOrderRoom,
            );

            socket.off(
                "order:status-updated",
                handleStatusUpdate,
            );

            socket.off(
                "delivery:assigned",
                handleDeliveryAssigned,
            );

            socket.off(
                "delivery:location-updated",
                handleDeliveryLocation,
            );

            socket.off(
                "payment:updated",
                handlePaymentUpdate,
            );

            socket.off(
                "connect_error",
                handleConnectError,
            );
        };
    }, [dispatch, orderNumber]);

    // Route change par temporary live data reset.
    useEffect(() => {
        setLiveStatus(null);
        setLiveDeliveryAgent(null);
        setAgentLocation(null);
        setPaymentUpdate(null);
    }, [orderNumber]);

    useEffect(() => {
        if (!order || order.orderNumber !== orderNumber) return;

        const agent = order.deliveryAgent;

        if (
            agent?.latitude == null ||
            agent?.longitude == null ||
            String(agent.latitude).trim() === "" ||
            String(agent.longitude).trim() === ""
        ) {
            return;
        }

        const latitude = Number(agent.latitude);
        const longitude = Number(agent.longitude);
        const updatedAt = agent.locationUpdatedAt;
        const savedTime = new Date(updatedAt).getTime();

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180 ||
            !Number.isFinite(savedTime)
        ) {
            return;
        }

        setAgentLocation((current) => {
            const currentTime = current
                ? new Date(current.updatedAt).getTime()
                : NaN;

            // Purana API response fresh socket location overwrite na kare.
            if (
                Number.isFinite(currentTime) &&
                currentTime >= savedTime
            ) {
                return current;
            }

            return {
                latitude,
                longitude,
                updatedAt,
            };
        });
    }, [order, orderNumber]);

    // ======================================================
    // LOADING
    // ======================================================

    if (
        initialLoading &&
        !order
    ) {
        return (
            <div className="min-h-screen bg-[#fffaf5] py-10">
                <Container>
                    <Skeleton
                        width="w-full"
                        height="h-[180px]"
                        rounded="rounded-[2rem]"
                    />
                    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                        <Skeleton
                            width="w-full"
                            height="h-[420px]"
                            rounded="rounded-[1.75rem]"
                        />
                        <Skeleton
                            width="w-full"
                            height="h-[340px]"
                            rounded="rounded-[1.75rem]"
                        />
                    </div>
                </Container>
            </div>
        );
    }

    // ======================================================
    // ERROR
    // ======================================================

    if (
        error &&
        !order
    ) {
        return (
            <div className="min-h-[70vh] bg-[#fffaf5] py-14">
                <Container>
                    <ErrorState
                        title="Unable to load order"
                        description={
                            typeof error === "string"
                                ? error
                                : "Something went wrong while loading this order."
                        }
                        onRetry={() =>
                            dispatch(getMyOrders())
                        }
                    />
                </Container>
            </div>
        );
    }

    // ======================================================
    // NOT FOUND
    // ======================================================

    if (!order) {
        return (
            <div className="min-h-[70vh] bg-[#fffaf5] py-14">
                <Container>
                    <EmptyState
                        icon={FaBoxOpen}
                        title="Order not found"
                        description="The requested order could not be found."
                        action={
                            <Button
                                type="button"
                                onClick={() =>
                                    navigate("/orders")
                                }
                            >
                                View My Orders
                            </Button>
                        }
                    />
                </Container>
            </div>
        );
    }

    // ======================================================
    // DERIVED DATA
    // ======================================================

    const currentStatus =
        liveStatus ||
        order.status;

    const statusConfig =
        getOrderStatusConfig(
            currentStatus,
        );

    const showLiveTracking =
        LIVE_TRACKING_STATUSES.includes(
            currentStatus,
        );

    const deliveryAgent =
        liveDeliveryAgent ||
        order.deliveryAgent ||
        null;

    const paymentMethod =
        paymentUpdate?.paymentMethod ||
        order.paymentMethod ||
        "COD";

    const paymentStatus =
        paymentUpdate?.paymentStatus ||
        order.paymentStatus ||
        "PENDING";

    const itemCount =
        order.items?.reduce(
            (total, item) =>
                total +
                Number(
                    item.quantity || 0,
                ),
            0,
        ) || 0;

    const deliveryAddress = [
        order.addressLine,
        order.landmark,
        order.city,
        order.state,
        order.pincode,
    ]
        .filter(Boolean)
        .join(", ");

    const mapUrl =
        agentLocation
            ? `https://maps.google.com/maps?q=${agentLocation.latitude},${agentLocation.longitude}&z=16&output=embed`
            : "";

    return (
        <main className="min-h-screen bg-[#fffaf5]">
            {/* HEADER */}
            <section className="border-b border-orange-100 bg-white">
                <Container>
                    <div className="py-8 sm:py-10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() =>
                                navigate("/orders")
                            }
                        >
                            <FaArrowLeft />
                            Back to orders
                        </Button>

                        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-500">
                                    Order details
                                </p>

                                <h1 className="mt-2 break-all text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                                    {order.orderNumber}
                                </h1>

                                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                    <span className="inline-flex items-center gap-2">
                                        <FaCalendarAlt />
                                        {formatDate(
                                            order.createdAt,
                                        )}
                                    </span>

                                    <span>•</span>

                                    <span>
                                        {itemCount}{" "}
                                        {itemCount === 1
                                            ? "item"
                                            : "items"}
                                    </span>
                                </div>
                            </div>

                            <span
                                className={`inline-flex w-fit rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wide ${statusConfig.className}`}
                            >
                                {statusConfig.label}
                            </span>
                        </div>
                    </div>
                </Container>
            </section>

            <Container>
                <div className="space-y-6 py-8 sm:py-10">
                    {/* STATUS */}
                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-6">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-500">
                                Live status
                            </p>

                            <h2 className="mt-1 text-xl font-black text-slate-950">
                                Order progress
                            </h2>

                            {fetchLoading && (
                                <p className="mt-1 text-xs text-slate-400">
                                    Syncing latest order data...
                                </p>
                            )}
                        </div>

                        <OrderStatusTimeline
                            status={currentStatus}
                        />
                    </section>

                    {/* LIVE MAP */}
                    {showLiveTracking && (
                        <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-500">
                                            Delivery tracking
                                        </p>

                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                            LIVE
                                        </span>
                                    </div>

                                    <h2 className="mt-1 text-xl font-black text-slate-950">
                                        Track delivery partner
                                    </h2>
                                </div>

                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                    <FaMotorcycle />
                                </span>
                            </div>

                            {agentLocation ? (
                                <>
                                    <iframe
                                        key={`${agentLocation.latitude}-${agentLocation.longitude}`}
                                        title="Delivery partner live location"
                                        src={mapUrl}
                                        loading="lazy"
                                        className="h-[320px] w-full border-0 sm:h-[380px]"
                                    />

                                    <div className="grid gap-3 border-t border-slate-100 p-4 text-xs sm:grid-cols-3 sm:p-5">
                                        <div>
                                            <p className="font-bold text-slate-400">
                                                Latitude
                                            </p>
                                            <p className="mt-1 font-black text-slate-800">
                                                {agentLocation.latitude.toFixed(
                                                    6,
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="font-bold text-slate-400">
                                                Longitude
                                            </p>
                                            <p className="mt-1 font-black text-slate-800">
                                                {agentLocation.longitude.toFixed(
                                                    6,
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="font-bold text-slate-400">
                                                Last updated
                                            </p>
                                            <p className="mt-1 font-black text-slate-800">
                                                {formatDate(
                                                    agentLocation.updatedAt,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
                                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-xl text-orange-600">
                                        <FaMapMarkerAlt />
                                    </span>

                                    <h3 className="mt-4 font-black text-slate-900">
                                        Waiting for live location
                                    </h3>

                                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                                        Delivery partner is assigned.
                                        Live coordinates will appear
                                        automatically as soon as the
                                        rider shares location.
                                    </p>
                                </div>
                            )}
                        </section>
                    )}

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                        <div className="space-y-6">
                            {/* ITEMS */}
                            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                        <FaUtensils />
                                    </span>

                                    <div>
                                        <h2 className="text-lg font-black text-slate-950">
                                            Order items
                                        </h2>

                                        <p className="text-xs text-slate-500">
                                            {itemCount}{" "}
                                            {itemCount === 1
                                                ? "item"
                                                : "items"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 divide-y divide-slate-100">
                                    {(order.items || []).map(
                                        (item, index) => {
                                            const unitPrice =
                                                Number(
                                                    item.unitPrice ||
                                                    0,
                                                );

                                            const itemTotal =
                                                Number(
                                                    item.itemTotal ??
                                                    unitPrice *
                                                    Number(
                                                        item.quantity ||
                                                        0,
                                                    ),
                                                );

                                            return (
                                                <div
                                                    key={
                                                        item.slug ||
                                                        `${item.name}-${index}`
                                                    }
                                                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-black text-slate-900">
                                                            {item.name}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {formatPrice(
                                                                unitPrice,
                                                            )}
                                                            {" × "}
                                                            {item.quantity}
                                                        </p>
                                                    </div>

                                                    <p className="shrink-0 text-sm font-black text-slate-950">
                                                        {formatPrice(
                                                            itemTotal,
                                                        )}
                                                    </p>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </section>

                            {/* ADDRESS */}
                            {deliveryAddress && (
                                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                                            <FaMapMarkerAlt />
                                        </span>

                                        <div>
                                            <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                                                Delivery address
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-slate-700">
                                                {deliveryAddress}
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* REJECTION */}
                            {order.rejectionReason && (
                                <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                                    <p className="text-xs font-black uppercase text-rose-500">
                                        Rejection reason
                                    </p>

                                    <p className="mt-2 text-sm font-semibold text-rose-700">
                                        {order.rejectionReason}
                                    </p>
                                </section>
                            )}
                        </div>

                        <aside className="space-y-5 lg:sticky lg:top-28">
                            {/* SUMMARY */}
                            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                        <FaReceipt />
                                    </span>

                                    <h2 className="text-lg font-black text-slate-950">
                                        Order summary
                                    </h2>
                                </div>

                                <div className="mt-5 space-y-3 text-sm">
                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">
                                            Subtotal
                                        </span>

                                        <span className="font-bold text-slate-900">
                                            {formatPrice(
                                                order.subtotal,
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">
                                            Delivery fee
                                        </span>

                                        <span className="font-bold text-slate-900">
                                            {formatPrice(
                                                order.deliveryFee,
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">
                                            Tax
                                        </span>

                                        <span className="font-bold text-slate-900">
                                            {formatPrice(
                                                order.taxAmount,
                                            )}
                                        </span>
                                    </div>

                                    <div className="border-t border-slate-100 pt-4">
                                        <div className="flex items-end justify-between gap-4">
                                            <span className="font-bold text-slate-500">
                                                Total
                                            </span>

                                            <span className="text-2xl font-black text-slate-950">
                                                {formatPrice(
                                                    order.totalAmount,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* PAYMENT */}
                            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                        <FaMoneyBillWave />
                                    </span>

                                    <div>
                                        <p className="text-xs font-black uppercase text-slate-400">
                                            Payment
                                        </p>

                                        <p className="mt-1 font-black text-slate-950">
                                            {paymentMethod}
                                        </p>

                                        <p className="mt-0.5 text-xs font-bold text-slate-500">
                                            {paymentStatus}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* RESTAURANT */}
                            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                        <FaStore />
                                    </span>

                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                                            Restaurant
                                        </p>

                                        <p className="mt-1 truncate text-sm font-black text-slate-950">
                                            {order.restaurantName}
                                        </p>

                                        {order.restaurantSlug && (
                                            <Link
                                                to={`/restaurants/${order.restaurantSlug}`}
                                                className="mt-3 inline-flex text-xs font-black text-orange-600 hover:text-orange-700"
                                            >
                                                View restaurant
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* DELIVERY AGENT */}
                            {showLiveTracking && (
                                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                            <FaMotorcycle />
                                        </span>

                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                                                Delivery partner
                                            </p>

                                            <p className="mt-1 text-sm font-black text-slate-950">
                                                {deliveryAgent?.name ||
                                                    "Delivery partner assigned"}
                                            </p>

                                            {deliveryAgent?.phone && (
                                                <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                                    <FaPhoneAlt />
                                                    {deliveryAgent.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            )}
                        </aside>
                    </div>
                </div>
            </Container>
        </main>
    );
};

export default OrderDetails;