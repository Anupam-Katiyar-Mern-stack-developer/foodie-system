import { useNavigate } from "react-router-dom";
import {
    MapPin,
    Navigation,
    PackageCheck,
    PackageOpen,
} from "lucide-react";

import Button from "../../common/Button/Button";
import StatusBadge from "../../common/StatusBadge/StatusBadge";

const STATUS_CONFIG = {
    DELIVERY_ASSIGNED: {
        label: "Delivery Assigned",
        variant: "warning",
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
};

const CurrentDeliveryCard = ({
    delivery,
    loading,
}) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <section className="animate-pulse rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="h-5 w-44 rounded bg-slate-200" />
                <div className="mt-3 h-7 w-64 rounded bg-slate-200" />

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="h-28 rounded-2xl bg-slate-100" />
                    <div className="h-28 rounded-2xl bg-slate-100" />
                </div>
            </section>
        );
    }

    if (!delivery) {
        return (
            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                    <PackageCheck className="h-6 w-6 text-slate-500" />
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-950">
                    No active delivery
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Your active delivery assignment
                    will appear here.
                </p>
            </section>
        );
    }

    const status =
        STATUS_CONFIG[delivery.status] || {
            label: delivery.status,
            variant: "neutral",
        };

    return (
        <section className="rounded-[1.5rem] border border-orange-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-wider text-orange-500">
                        Current Assignment
                    </p>

                    <h2 className="mt-1 text-xl font-black text-slate-950">
                        {delivery.orderNumber}
                    </h2>
                </div>

                <StatusBadge
                    variant={status.variant}
                    size="sm"
                    dot
                >
                    {status.label}
                </StatusBadge>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <InfoCard
                    icon={PackageOpen}
                    iconClass="bg-orange-100 text-orange-600"
                    label="Pickup From"
                    title={
                        delivery.restaurantName
                    }
                    description={
                        delivery.restaurantAddress
                    }
                />

                <InfoCard
                    icon={MapPin}
                    iconClass="bg-emerald-100 text-emerald-600"
                    label="Deliver To"
                    title={
                        delivery.customerName
                    }
                    description={
                        delivery.customerAddress
                    }
                />
            </div>

            <div className="mt-5 flex justify-end">
                <Button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/delivery/active"
                        )
                    }
                >
                    <span className="inline-flex items-center gap-2">
                        <Navigation className="h-4 w-4" />
                        View Delivery
                    </span>
                </Button>
            </div>
        </section>
    );
};

const InfoCard = ({
    icon: Icon,
    iconClass,
    label,
    title,
    description,
}) => {
    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 font-black text-slate-900">
                        {title || "Not available"}
                    </p>

                    {description && (
                        <p className="mt-1 text-sm text-slate-500">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CurrentDeliveryCard;