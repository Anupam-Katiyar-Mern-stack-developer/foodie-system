import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircle2,
  Clock3,
  IndianRupee,
  PackageCheck,
  Search,
  XCircle,
} from "lucide-react";

import PageHeader from "../../../components/common/PageHeader/PageHeader";
import StatCard from "../../../components/common/StatCard/StatCard";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import CommonTable from "../../../components/common/CommonTable/CommonTable";
import Button from "../../../components/common/Button/Button";
import EmptyState from "../../../components/common/EmptyState/EmptyState";

import { getDeliveryHistory } from "../../../redux/thunks/deliveryAgent/deliveryHistory.thunk";

const STATUS_CONFIG = {
  DELIVERED: {
    label: "Delivered",
    variant: "success",
  },

  CANCELLED: {
    label: "Cancelled",
    variant: "danger",
  },
};

const STATUS_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

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

const DeliveryHistory = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const {
    deliveries,
    stats: historyStats,
    loading,
  } = useSelector((state) => state.deliveryHistory);

  // =========================
  // FETCH HISTORY
  // =========================

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        getDeliveryHistory({
          page: 1,
          limit: 50,
          search: searchTerm.trim() || undefined,
          status:
            statusFilter === "ALL"
              ? undefined
              : statusFilter,
        }),
      );
    }, 350);

    return () => clearTimeout(timer);
  }, [dispatch, searchTerm, statusFilter]);

  // =========================
  // STATS
  // =========================

  const stats = useMemo(
    () => [
      {
        key: "total",
        title: "Total Deliveries",
        value: historyStats?.totalDeliveries ?? 0,
        description: "Delivery history",
        icon: PackageCheck,
        variant: "orange",
      },
      {
        key: "completed",
        title: "Completed",
        value: historyStats?.completed ?? 0,
        description: "Successfully delivered",
        icon: CheckCircle2,
        variant: "success",
      },
      {
        key: "cancelled",
        title: "Cancelled",
        value: historyStats?.cancelled ?? 0,
        description: "Cancelled deliveries",
        icon: XCircle,
        variant: "danger",
      },
      {
        key: "earning",
        title: "Total Earnings",
        value: `₹${Number(
          historyStats?.totalEarnings ?? 0,
        ).toFixed(2)}`,
        description: "Completed delivery earnings",
        icon: IndianRupee,
        variant: "purple",
      },
    ],
    [historyStats],
  );

  // =========================
  // TABLE
  // =========================

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

        render: (row) => (
          <span className="font-semibold text-slate-700">
            {row.restaurantName}
          </span>
        ),
      },
      {
        key: "customerName",
        label: "Customer",
      },
      {
        key: "distance",
        label: "Distance",

        render: (row) => (
          <span className="text-sm text-slate-600">
            {row.distance != null
              ? `${row.distance} km`
              : "—"}
          </span>
        ),
      },
      {
        key: "earning",
        label: "Earning",

        render: (row) => (
          <span className="font-black text-emerald-600">
            ₹{Number(row.earning || 0).toFixed(2)}
          </span>
        ),
      },
      {
        key: "status",
        label: "Status",

        render: (row) => {
          const config =
            STATUS_CONFIG[row.status] || {
              label: row.status,
              variant: "neutral",
            };

          return (
            <StatusBadge
              variant={config.variant}
              size="sm"
              dot
            >
              {config.label}
            </StatusBadge>
          );
        },
      },
      {
        key: "completedAt",
        label: "Date",

        render: (row) => (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 className="h-4 w-4" />
            {formatDate(row.completedAt)}
          </div>
        ),
      },
    ],
    [],
  );

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
  };

  const hasFilters =
    Boolean(searchTerm.trim()) ||
    statusFilter !== "ALL";

  return (
    <div className="space-y-7">
      <PageHeader
        title="Delivery History"
        description="View your completed and previous delivery orders."
      />

      {/* STATS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            variant={stat.variant}
          />
        ))}
      </section>

      {/* FILTERS */}
      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 transition focus-within:border-orange-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100 lg:max-w-[420px]">
            <Search className="h-4 w-4 shrink-0 text-orange-500" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search order, restaurant or customer..."
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setStatusFilter(item.value)
                }
                className={`rounded-xl border px-4 py-2 text-xs font-black transition ${
                  statusFilter === item.value
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-600"
                }`}
              >
                {item.label}
              </button>
            ))}

            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                onClick={clearFilters}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* HISTORY TABLE */}
      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-black text-slate-950">
            Previous Deliveries
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your recent delivery activity.
          </p>
        </div>

        {!loading && deliveries.length === 0 ? (
          <EmptyState
            icon={PackageCheck}
            title="No deliveries found"
            description={
              hasFilters
                ? "Try changing or clearing your filters."
                : "Your completed deliveries will appear here."
            }
            action={
              hasFilters ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              ) : null
            }
          />
        ) : (
          <CommonTable
            columns={columns}
            data={deliveries}
            loading={loading}
          />
        )}
      </section>
    </div>
  );
};

export default DeliveryHistory;