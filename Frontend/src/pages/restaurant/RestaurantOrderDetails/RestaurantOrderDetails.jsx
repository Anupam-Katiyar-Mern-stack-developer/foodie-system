import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Bike,
    CalendarDays,
    CheckCircle2,
    ChefHat,
    Clock3,
    CreditCard,
    Hash,
    MapPin,
    Navigation,
    PackageCheck,
    Phone,
    ReceiptText,
    Search,
    ShieldCheck,
    ShoppingBag,
    UserRound,
    X,
    XCircle,
} from "lucide-react";

import Button from "../../../components/common/Button/Button";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import OptimizedImage from "../../../components/common/OptimizedImage/OptimizedImage";

import {
    getRestaurantOrder,
    acceptRestaurantOrder,
    rejectRestaurantOrder,
    markRestaurantOrderPreparing,
    markRestaurantOrderReady,
} from "../../../redux/thunks/restaurant/restaurantOrder.thunk";

import { clearSelectedOrder } from "../../../redux/slices/restaurant/restaurantOrder.slice";

// ========================================================
// STATUS CONFIG
// ========================================================

const statusConfig = {
    PLACED: {
        label: "Placed",
        variant: "warning",
    },
    CONFIRMED: {
        label: "Confirmed",
        variant: "info",
    },
    PREPARING: {
        label: "Preparing",
        variant: "purple",
    },
    READY_FOR_PICKUP: {
        label: "Ready For Pickup",
        variant: "success",
    },
    DELIVERY_ASSIGNED: {
        label: "Delivery Assigned",
        variant: "info",
    },
    PICKED_UP: {
        label: "Picked Up",
        variant: "info",
    },
    OUT_FOR_DELIVERY: {
        label: "Out For Delivery",
        variant: "warning",
    },
    DELIVERED: {
        label: "Delivered",
        variant: "success",
    },
    REJECTED: {
        label: "Rejected",
        variant: "danger",
    },
    CANCELLED: {
        label: "Cancelled",
        variant: "danger",
    },
};

// ========================================================
// TEMP AVAILABLE DELIVERY AGENTS
//
// Sirf UI preview ke liye.
// Backend API connect hote hi remove kar denge.
// ========================================================

const demoAvailableAgents = [
    {
        id: 1,
        name: "Aman Kumar",
        phone: "9876543210",
        image: "",
        vehicleType: "BIKE",
        vehicleNumber: "UP78 AB 1234",
        distanceKm: 1.2,
        isOnline: true,
        isAvailable: true,
    },
    {
        id: 2,
        name: "Rahul Verma",
        phone: "9876501234",
        image: "",
        vehicleType: "SCOOTER",
        vehicleNumber: "UP78 CD 4567",
        distanceKm: 2.4,
        isOnline: true,
        isAvailable: true,
    },
    {
        id: 3,
        name: "Arjun Singh",
        phone: "8765432109",
        image: "",
        vehicleType: "BIKE",
        vehicleNumber: "UP78 EF 9087",
        distanceKm: 3.1,
        isOnline: true,
        isAvailable: true,
    },
];

// ========================================================
// HELPERS
// ========================================================

const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0));
};

const formatDate = (date) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
};

// ========================================================
// COMPONENT
// ========================================================

const RestaurantOrderDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orderNumber } = useParams();

    const {
        selectedOrder: order,
        detailLoading,
        detailError,
        actionLoading,
        actionError,
    } = useSelector((state) => state.restaurantOrder) || {};

    // ======================================================
    // REJECT
    // ======================================================

    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    // ======================================================
    // DELIVERY ASSIGN UI
    // ======================================================

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [agentSearch, setAgentSearch] = useState("");
    const [selectedAgent, setSelectedAgent] = useState(null);

    const filteredAgents = useMemo(() => {
        const search = agentSearch.trim().toLowerCase();

        if (!search) return demoAvailableAgents;

        return demoAvailableAgents.filter((agent) => {
            return (
                agent.name.toLowerCase().includes(search) ||
                agent.phone.includes(search) ||
                agent.vehicleNumber.toLowerCase().includes(search)
            );
        });
    }, [agentSearch]);

    // ======================================================
    // FETCH
    // ======================================================

    useEffect(() => {
        if (!orderNumber) return;

        dispatch(getRestaurantOrder(orderNumber));

        return () => {
            dispatch(clearSelectedOrder());
        };
    }, [dispatch, orderNumber]);

    // ======================================================
    // MODAL ESCAPE / SCROLL
    // ======================================================

    useEffect(() => {
        if (!showAssignModal) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowAssignModal(false);
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [showAssignModal]);

    // ======================================================
    // ACCEPT
    // ======================================================

    const handleAccept = async () => {
        try {
            await dispatch(acceptRestaurantOrder(orderNumber)).unwrap();
            dispatch(getRestaurantOrder(orderNumber));
        } catch (error) {
            console.error("ACCEPT ORDER ERROR:", error);
        }
    };

    // ======================================================
    // REJECT
    // ======================================================

    const handleReject = async () => {
        const reason = rejectionReason.trim();

        if (!reason) return;

        try {
            await dispatch(
                rejectRestaurantOrder({
                    orderNumber,
                    reason,
                })
            ).unwrap();

            setShowRejectForm(false);
            setRejectionReason("");

            dispatch(getRestaurantOrder(orderNumber));
        } catch (error) {
            console.error("REJECT ORDER ERROR:", error);
        }
    };

    // ======================================================
    // PREPARING
    // ======================================================

    const handlePreparing = async () => {
        try {
            await dispatch(markRestaurantOrderPreparing(orderNumber)).unwrap();
            dispatch(getRestaurantOrder(orderNumber));
        } catch (error) {
            console.error("PREPARING ORDER ERROR:", error);
        }
    };

    // ======================================================
    // READY
    // ======================================================

    const handleReady = async () => {
        try {
            await dispatch(markRestaurantOrderReady(orderNumber)).unwrap();
            dispatch(getRestaurantOrder(orderNumber));
        } catch (error) {
            console.error("READY ORDER ERROR:", error);
        }
    };

    // ======================================================
    // TEMP SEND OFFER
    //
    // Backend integration next step me yahan dispatch lagega.
    // ======================================================

    const handleSendOffer = (agent) => {
        setSelectedAgent(agent);
        setShowAssignModal(false);
        setAgentSearch("");
    };

    // ======================================================
    // RETRY
    // ======================================================

    const handleRetry = () => {
        dispatch(getRestaurantOrder(orderNumber));
    };

    // ======================================================
    // LOADING
    // ======================================================

    if (detailLoading && !order) {
        return (
            <div className="space-y-5">
                <Skeleton
                    width="w-56"
                    height="h-10"
                    rounded="rounded-xl"
                />

                <Skeleton
                    width="w-full"
                    height="h-44"
                    rounded="rounded-[1.75rem]"
                />

                <div className="grid gap-5 lg:grid-cols-2">
                    <Skeleton
                        width="w-full"
                        height="h-80"
                        rounded="rounded-[1.75rem]"
                    />

                    <Skeleton
                        width="w-full"
                        height="h-80"
                        rounded="rounded-[1.75rem]"
                    />
                </div>
            </div>
        );
    }

    // ======================================================
    // ERROR
    // ======================================================

    if (detailError && !order) {
        return (
            <ErrorState
                title="Unable to load order"
                description={
                    typeof detailError === "string"
                        ? detailError
                        : "Unable to fetch order details."
                }
                onRetry={handleRetry}
            />
        );
    }

    // ======================================================
    // EMPTY
    // ======================================================

    if (!order) {
        return (
            <EmptyState
                icon={ShoppingBag}
                title="Order not found"
                description="The requested restaurant order could not be found."
                action={
                    <Button
                        type="button"
                        onClick={() => navigate("/restaurant/orders")}
                    >
                        Back to Orders
                    </Button>
                }
            />
        );
    }

    // ======================================================
    // DERIVED
    // ======================================================

    const currentStatus = statusConfig[order.status] || {
        label: order.status,
        variant: "neutral",
    };

    const customerAddress = [
        order.addressLine,
        order.landmark,
        order.city,
        order.state,
        order.pincode,
    ]
        .filter(Boolean)
        .join(", ");

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <>
            <div className="space-y-6">
                {/* BACK */}

                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/restaurant/orders")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                </Button>

                {/* =================================================
            ORDER HEADER
        ================================================= */}

                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                                    Order {order.orderNumber}
                                </h1>

                                <StatusBadge variant={currentStatus.variant} dot>
                                    {currentStatus.label}
                                </StatusBadge>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-500">
                                <span className="flex items-center gap-2">
                                    <Hash className="h-4 w-4" />
                                    Checkout: {order.checkoutNumber || "-"}
                                </span>

                                <span className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" />
                                    {formatDate(order.createdAt)}
                                </span>
                            </div>
                        </div>

                        {/* =============================================
                ORDER ACTIONS
            ============================================= */}

                        <div className="flex flex-wrap gap-2">
                            {order.status === "PLACED" && (
                                <>
                                    <Button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={handleAccept}
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Accept Order
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="danger"
                                        disabled={actionLoading}
                                        onClick={() => setShowRejectForm(true)}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                    </Button>
                                </>
                            )}

                            {order.status === "CONFIRMED" && (
                                <Button
                                    type="button"
                                    disabled={actionLoading}
                                    onClick={handlePreparing}
                                >
                                    <ChefHat className="mr-2 h-4 w-4" />
                                    Start Preparing
                                </Button>
                            )}

                            {order.status === "PREPARING" && (
                                <Button
                                    type="button"
                                    disabled={actionLoading}
                                    onClick={handleReady}
                                >
                                    <PackageCheck className="mr-2 h-4 w-4" />
                                    Mark Ready
                                </Button>
                            )}

                            {order.status === "READY_FOR_PICKUP" && (
                                <Button
                                    type="button"
                                    onClick={() => setShowAssignModal(true)}
                                >
                                    <Bike className="mr-2 h-4 w-4" />
                                    Assign Delivery Partner
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* ACTION ERROR */}

                    {actionError && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                            {actionError}
                        </div>
                    )}

                    {/* TEMP SELECTED DELIVERY AGENT PREVIEW */}

                    {order.status === "READY_FOR_PICKUP" && selectedAgent && (
                        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <AgentAvatar agent={selectedAgent} />

                                    <div>
                                        <p className="text-xs font-black uppercase tracking-wider text-emerald-600">
                                            Offer Preview
                                        </p>

                                        <h3 className="mt-1 font-black text-slate-900">
                                            {selectedAgent.name}
                                        </h3>

                                        <p className="mt-1 text-xs font-semibold text-slate-500">
                                            {selectedAgent.vehicleType} •{" "}
                                            {selectedAgent.vehicleNumber}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
                                        Offer selected
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedAgent(null);
                                            setShowAssignModal(true);
                                        }}
                                        className="rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm transition hover:text-orange-600"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>

                            <p className="mt-3 text-xs font-semibold text-emerald-700">
                                UI preview only. Backend connect hone ke baad offer realtime
                                delivery partner ko jayega.
                            </p>
                        </div>
                    )}

                    {/* REJECT FORM */}

                    {showRejectForm && order.status === "PLACED" && (
                        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50/60 p-4">
                            <label className="text-sm font-black text-slate-800">
                                Why are you rejecting this order?
                            </label>

                            <textarea
                                rows={4}
                                value={rejectionReason}
                                onChange={(event) =>
                                    setRejectionReason(event.target.value)
                                }
                                placeholder="Example: Ordered item is currently unavailable."
                                className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50"
                            />

                            <div className="mt-3 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setShowRejectForm(false);
                                        setRejectionReason("");
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    variant="danger"
                                    disabled={
                                        actionLoading ||
                                        !rejectionReason.trim()
                                    }
                                    onClick={handleReject}
                                >
                                    Confirm Reject
                                </Button>
                            </div>
                        </div>
                    )}
                </section>

                {/* =================================================
            CUSTOMER + ADDRESS
        ================================================= */}

                <div className="grid gap-5 lg:grid-cols-2">
                    {/* CUSTOMER */}

                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <SectionTitle
                            icon={UserRound}
                            title="Customer Details"
                            description="Customer who placed this order"
                        />

                        <div className="mt-5 space-y-4">
                            <DetailRow
                                icon={UserRound}
                                label="Customer Name"
                                value={order.deliveryName || "-"}
                            />

                            <DetailRow
                                icon={Phone}
                                label="Phone Number"
                                value={order.deliveryPhone || "-"}
                            />
                        </div>
                    </section>

                    {/* ADDRESS */}

                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <SectionTitle
                            icon={MapPin}
                            title="Delivery Address"
                            description="Where this order needs to be delivered"
                        />

                        <p className="mt-5 text-sm font-semibold leading-7 text-slate-700">
                            {customerAddress || "Address unavailable"}
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <SmallDetail
                                label="City"
                                value={order.city}
                            />

                            <SmallDetail
                                label="State"
                                value={order.state}
                            />

                            <SmallDetail
                                label="Pincode"
                                value={order.pincode}
                            />

                            <SmallDetail
                                label="Landmark"
                                value={order.landmark}
                            />
                        </div>
                    </section>
                </div>

                {/* =================================================
            ORDERED ITEMS
        ================================================= */}

                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <SectionTitle
                            icon={ShoppingBag}
                            title="Ordered Items"
                            description="Food items ordered by the customer"
                        />

                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
                            {order.items?.length || 0} items
                        </span>
                    </div>

                    {order.items?.length > 0 ? (
                        <div className="mt-5 divide-y divide-slate-100">
                            {order.items.map((item, index) => (
                                <div
                                    key={item.slug || index}
                                    className="flex flex-col gap-4 py-4 first:pt-0 sm:flex-row sm:items-center"
                                >
                                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                                        {item.image ? (
                                            <OptimizedImage
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <ShoppingBag className="h-6 w-6 text-slate-300" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-black text-slate-900">
                                            {item.name}
                                        </h3>

                                        <p className="mt-1 text-xs font-semibold text-slate-400">
                                            {item.slug}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-3">
                                            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600">
                                                Qty: {item.quantity}
                                            </span>

                                            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600">
                                                Unit: {formatPrice(item.unitPrice)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="sm:text-right">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Item Total
                                        </p>

                                        <p className="mt-1 text-lg font-black text-slate-900">
                                            {formatPrice(item.itemTotal)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <ShoppingBag className="mx-auto h-8 w-8 text-slate-300" />

                            <p className="mt-3 text-sm font-bold text-slate-500">
                                No order items found.
                            </p>
                        </div>
                    )}
                </section>

                {/* =================================================
            PAYMENT + BILL
        ================================================= */}

                <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
                    {/* PAYMENT */}

                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-orange-500" />

                            <h2 className="font-black text-slate-900">
                                Payment Details
                            </h2>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <SmallDetail
                                label="Payment Method"
                                value={order.paymentMethod}
                            />

                            <div>
                                <p className="text-xs font-bold text-slate-400">
                                    Payment Status
                                </p>

                                <div className="mt-2">
                                    <StatusBadge
                                        variant={
                                            order.paymentStatus === "PAID"
                                                ? "success"
                                                : "warning"
                                        }
                                        dot
                                    >
                                        {order.paymentStatus || "-"}
                                    </StatusBadge>
                                </div>
                            </div>

                            <SmallDetail
                                label="Checkout Number"
                                value={order.checkoutNumber}
                            />

                            <SmallDetail
                                label="Order Date"
                                value={formatDate(order.createdAt)}
                            />
                        </div>
                    </section>

                    {/* BILL */}

                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <ReceiptText className="h-5 w-5 text-orange-500" />

                            <h2 className="font-black text-slate-900">
                                Bill Summary
                            </h2>
                        </div>

                        <div className="mt-5 space-y-3">
                            <PriceRow
                                label="Subtotal"
                                value={order.subtotal}
                            />

                            <PriceRow
                                label="Delivery Fee"
                                value={order.deliveryFee}
                            />

                            <PriceRow
                                label="Tax"
                                value={order.taxAmount}
                            />

                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                                <span className="font-black text-slate-900">
                                    Total Amount
                                </span>

                                <span className="text-xl font-black text-orange-600">
                                    {formatPrice(order.totalAmount)}
                                </span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* =================================================
            TIMELINE
        ================================================= */}

                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Clock3 className="h-5 w-5 text-orange-500" />

                        <h2 className="font-black text-slate-900">
                            Order Timeline
                        </h2>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <TimelineCard
                            label="Placed"
                            value={order.createdAt}
                        />

                        <TimelineCard
                            label="Confirmed"
                            value={order.confirmedAt}
                        />

                        <TimelineCard
                            label="Preparing"
                            value={order.preparingAt}
                        />

                        <TimelineCard
                            label="Ready"
                            value={order.readyAt}
                        />

                        <TimelineCard
                            label="Picked Up"
                            value={order.pickedUpAt}
                        />

                        <TimelineCard
                            label="Delivered"
                            value={order.deliveredAt}
                        />

                        <TimelineCard
                            label="Cancelled"
                            value={order.cancelledAt}
                        />
                    </div>

                    {order.rejectionReason && (
                        <ReasonCard
                            title="Rejection Reason"
                            value={order.rejectionReason}
                            danger
                        />
                    )}

                    {order.cancelledReason && (
                        <ReasonCard
                            title="Cancellation Reason"
                            value={order.cancelledReason}
                        />
                    )}
                </section>
            </div>

            {/* ===================================================
          ASSIGN DELIVERY AGENT MODAL
      =================================================== */}

            {showAssignModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* BACKDROP */}

                    <button
                        type="button"
                        aria-label="Close delivery partner modal"
                        onClick={() => setShowAssignModal(false)}
                        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
                    />

                    {/* MODAL */}

                    <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
                        {/* HEADER */}

                        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                                        <Bike className="h-6 w-6" />
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="text-xl font-black text-slate-950">
                                            Assign Delivery Partner
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Order{" "}
                                            <span className="font-bold text-slate-700">
                                                {order.orderNumber}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowAssignModal(false)}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* BODY */}

                        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                            {/* AVAILABILITY INFO */}

                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                                <div className="flex gap-3">
                                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                                    <div>
                                        <p className="text-sm font-black text-emerald-900">
                                            Available partners only
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-emerald-700">
                                            Yahan sirf online, free aur currently kisi active
                                            delivery par na hone wale nearby partners show honge.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* SEARCH */}

                            <div className="relative mt-5">
                                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    value={agentSearch}
                                    onChange={(event) =>
                                        setAgentSearch(event.target.value)
                                    }
                                    placeholder="Search delivery partner..."
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-50"
                                />
                            </div>

                            {/* SUMMARY */}

                            <div className="mt-5 flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-black text-slate-900">
                                        Nearby Delivery Partners
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Nearest available partners are shown first.
                                    </p>
                                </div>

                                <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600">
                                    {filteredAgents.length} Available
                                </span>
                            </div>

                            {/* AGENTS */}

                            {filteredAgents.length > 0 ? (
                                <div className="mt-4 space-y-3">
                                    {filteredAgents.map((agent) => (
                                        <div
                                            key={agent.id}
                                            className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-orange-200 hover:shadow-sm"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                <AgentAvatar agent={agent} />

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h4 className="font-black text-slate-900">
                                                            {agent.name}
                                                        </h4>

                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                            Available
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
                                                        <span className="flex items-center gap-1.5">
                                                            <Bike className="h-3.5 w-3.5" />
                                                            {agent.vehicleType}
                                                        </span>

                                                        <span>
                                                            {agent.vehicleNumber}
                                                        </span>

                                                        <span className="flex items-center gap-1.5 font-bold text-orange-600">
                                                            <Navigation className="h-3.5 w-3.5" />
                                                            {agent.distanceKm} km away
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                                                        <Phone className="h-3.5 w-3.5" />
                                                        {agent.phone}
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleSendOffer(agent)}
                                                    className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 px-4 text-sm font-black text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98]"
                                                >
                                                    Send Offer
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 py-12 text-center">
                                    <Bike className="mx-auto h-8 w-8 text-slate-300" />

                                    <h3 className="mt-3 font-black text-slate-700">
                                        No delivery partners found
                                    </h3>

                                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-400">
                                        No online and available delivery partner matches your
                                        search right now.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FOOTER */}

                        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-xs font-semibold text-slate-400">
                                    Partner ko accept/reject karne ke liye realtime offer milega.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setShowAssignModal(false)}
                                    className="rounded-xl bg-white px-4 py-2.5 text-sm font-black text-slate-600 shadow-sm transition hover:text-slate-900"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ========================================================
// SECTION TITLE
// ========================================================

const SectionTitle = ({
    icon: Icon,
    title,
    description,
}) => {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Icon className="h-5 w-5" />
            </div>

            <div>
                <h2 className="font-black text-slate-900">
                    {title}
                </h2>

                <p className="text-xs text-slate-400">
                    {description}
                </p>
            </div>
        </div>
    );
};

// ========================================================
// AGENT AVATAR
// ========================================================

const AgentAvatar = ({ agent }) => {
    return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-rose-100">
            {agent.image ? (
                <OptimizedImage
                    src={agent.image}
                    alt={agent.name}
                    className="h-full w-full object-cover"
                />
            ) : (
                <span className="text-base font-black text-orange-600">
                    {agent.name?.charAt(0)?.toUpperCase() || "D"}
                </span>
            )}
        </div>
    );
};

// ========================================================
// DETAIL ROW
// ========================================================

const DetailRow = ({
    icon: Icon,
    label,
    value,
}) => {
    return (
        <div className="flex gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Icon className="h-4 w-4" />
            </div>

            <div>
                <p className="text-xs font-bold text-slate-400">
                    {label}
                </p>

                <p className="mt-1 font-black text-slate-800">
                    {value || "-"}
                </p>
            </div>
        </div>
    );
};

// ========================================================
// SMALL DETAIL
// ========================================================

const SmallDetail = ({ label, value }) => {
    return (
        <div>
            <p className="text-xs font-bold text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-black text-slate-800">
                {value || "-"}
            </p>
        </div>
    );
};

// ========================================================
// PRICE
// ========================================================

const PriceRow = ({ label, value }) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate-500">
                {label}
            </span>

            <span className="text-sm font-black text-slate-800">
                {formatPrice(value)}
            </span>
        </div>
    );
};

// ========================================================
// TIMELINE
// ========================================================

const TimelineCard = ({ label, value }) => {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                {label}
            </p>

            <p className="mt-2 text-sm font-bold text-slate-800">
                {value ? formatDate(value) : "-"}
            </p>
        </div>
    );
};

// ========================================================
// REASON
// ========================================================

const ReasonCard = ({
    title,
    value,
    danger = false,
}) => {
    return (
        <div
            className={`mt-5 rounded-xl border p-4 ${danger
                    ? "border-red-100 bg-red-50"
                    : "border-slate-200 bg-slate-50"
                }`}
        >
            <p
                className={`text-xs font-black uppercase tracking-wider ${danger
                        ? "text-red-500"
                        : "text-slate-500"
                    }`}
            >
                {title}
            </p>

            <p
                className={`mt-2 text-sm font-semibold ${danger
                        ? "text-red-700"
                        : "text-slate-700"
                    }`}
            >
                {value}
            </p>
        </div>
    );
};

export default RestaurantOrderDetails;