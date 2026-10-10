import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../common/Button/Button";
import CommonTable from "../../common/CommonTable/CommonTable";
import StatusBadge from "../../common/StatusBadge/StatusBadge";

const STATUS_CONFIG = {
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

    CANCELLED: {
        label: "Cancelled",
        variant: "danger",
    },
};

const RecentDeliveries = ({
    deliveries = [],
    loading = false,
}) => {
    const navigate = useNavigate();

    const columns = useMemo(
        () => [
            {
                key: "orderNumber",
                label: "Order",

                render: (row) => (
                    <span className="font-black text-slate-900">
                        {row.orderNumber}
                    </span>
                ),
            },

            {
                key: "restaurantName",
                label: "Restaurant",
            },

            {
                key: "customerName",
                label: "Customer",
            },

            {
                key: "amount",
                label: "Order Amount",

                render: (row) => (
                    <span className="font-black text-slate-900">
                        ₹
                        {Number(
                            row.amount ?? 0
                        ).toFixed(2)}
                    </span>
                ),
            },

            {
                key: "status",
                label: "Status",

                render: (row) => {
                    const config =
                        STATUS_CONFIG[
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
                            {config.label}
                        </StatusBadge>
                    );
                },
            },

            {
                key: "action",
                label: "Action",
                align: "right",

                render: () => (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                            navigate(
                                "/delivery/history"
                            )
                        }
                    >
                        View
                    </Button>
                ),
            },
        ],
        [navigate]
    );

    return (
        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-black text-slate-950">
                        Recent Deliveries
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Your recently completed
                        delivery orders.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                        navigate(
                            "/delivery/history"
                        )
                    }
                >
                    View All
                </Button>
            </div>

            <CommonTable
                columns={columns}
                data={deliveries}
                loading={loading}
            />
        </section>
    );
};

export default RecentDeliveries;