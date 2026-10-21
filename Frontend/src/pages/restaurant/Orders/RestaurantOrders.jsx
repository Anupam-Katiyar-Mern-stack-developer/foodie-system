import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChefHat, PackageCheck, PackageOpen, ShoppingBag } from "lucide-react";

import PageHeader from "../../../components/common/PageHeader/PageHeader";
import StatCard from "../../../components/common/StatCard/StatCard";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import CommonTable from "../../../components/common/CommonTable/CommonTable";
import Button from "../../../components/common/Button/Button";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import TableToolbar from "../../../components/common/TableToolbar/TableToolbar";
import ErrorState from "../../../components/common/ErrorState/ErrorState";

import { getRestaurantOrders } from "../../../redux/thunks/restaurant/restaurantOrder.thunk";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { socket, connectSocket } from "../../../socket/socket";

const statusConfig = {
  PLACED: { label: "Placed", variant: "warning" },
  CONFIRMED: { label: "Confirmed", variant: "info" },
  PREPARING: { label: "Preparing", variant: "purple" },
  READY_FOR_PICKUP: { label: "Ready", variant: "success" },
  DELIVERY_ASSIGNED: { label: "Delivery Assigned", variant: "info" },
  PICKED_UP: { label: "Picked Up", variant: "info" },
  OUT_FOR_DELIVERY: { label: "Out For Delivery", variant: "warning" },
  DELIVERED: { label: "Delivered", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
  CANCELLED: { label: "Cancelled", variant: "danger" },
};

const statusOptions = [
  { label: "All Orders", value: "ALL" },
  { label: "Placed", value: "PLACED" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Ready", value: "READY_FOR_PICKUP" },
  { label: "Delivery Assigned", value: "DELIVERY_ASSIGNED" },
  { label: "Picked Up", value: "PICKED_UP" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const formatDate = (date) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const RestaurantOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    orders = [],
    pagination = {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
    fetchLoading,
    error,
  } = useSelector((state) => state.restaurantOrder) || {};

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentMethod, setPaymentMethod] = useState("ALL");
  const [paymentStatus, setPaymentStatus] = useState("ALL");
  const [query, setQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setQuery(searchTerm.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  const [page, setPage] = useState(1);

  const limit = 10;

  const fetchOrders = useCallback(() => {
    return dispatch(
      getRestaurantOrders({
        page,
        limit,
        search: query,
        paymentMethod,
        paymentStatus,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      })
    );
  }, [dispatch, page, statusFilter, query, paymentMethod, paymentStatus]);

  // =========================================
  // INITIAL REST FETCH
  // =========================================
  useEffect(() => {
    const request = fetchOrders();
    return () => request.abort();
  }, [fetchOrders]);

  // =========================================
  // REALTIME NEW ORDER
  // User place order -> backend
  // restaurant:new-order -> restaurant live
  // =========================================
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.RESTAURANT_TOKEN);

    if (!token) return;

    connectSocket(token);

    const handleNewOrder = (newOrder) => {
      console.log("LIVE RESTAURANT ORDER:", newOrder);

      // New order PLACED hota hai.
      // Agar restaurant kisi unrelated status filter
      // par hai to unnecessary request nahi karni.
      if (statusFilter !== "ALL" && statusFilter !== "PLACED") {
        return;
      }

      // Latest order always first page par aayega.
      if (page !== 1) {
        setPage(1);
        return;
      }

      // Socket sirf realtime signal de raha hai.
      // Actual source of truth PostgreSQL/API hai.
      fetchOrders();
    };

    const handleReconnect = () => {
      fetchOrders();
    };

    const handleConnectError = (socketError) => {
      console.error("RESTAURANT SOCKET CONNECTION ERROR:", socketError.message);
    };

    socket.on("restaurant:new-order", handleNewOrder);
    socket.on("connect_error", handleConnectError);
    socket.io.on("reconnect", handleReconnect);

    return () => {
      socket.off("restaurant:new-order", handleNewOrder);
      socket.off("connect_error", handleConnectError);
      socket.io.off("reconnect", handleReconnect);
    };
  }, [fetchOrders, page, statusFilter]);

  // =========================================
  // SEARCH CURRENT LOADED PAGE
  // =========================================
  const filteredOrders = orders;

  // =========================================
  // STATS
  // =========================================
  const stats = useMemo(
    () => [
      {
        title: "Total Orders",
        value: pagination?.total ?? orders.length,
        description:
          statusFilter === "ALL"
            ? "All restaurant orders"
            : "Orders in selected status",
        icon: ShoppingBag,
        variant: "orange",
      },
      {
        title: "New Orders",
        value: orders.filter((order) => order.status === "PLACED").length,
        description: "On current page",
        icon: PackageOpen,
        variant: "warning",
      },
      {
        title: "Preparing",
        value: orders.filter((order) => order.status === "PREPARING").length,
        description: "On current page",
        icon: ChefHat,
        variant: "purple",
      },
      {
        title: "Ready",
        value: orders.filter((order) => order.status === "READY_FOR_PICKUP")
          .length,
        description: "On current page",
        icon: PackageCheck,
        variant: "success",
      },
    ],
    [orders, pagination?.total, statusFilter]
  );

  // =========================================
  // TABLE COLUMNS
  // =========================================
  const columns = useMemo(
    () => [
      {
        key: "orderNumber",
        label: "Order",
        render: (order) => (
          <button
            type="button"
            onClick={() => navigate(`/restaurant/orders/${order.orderNumber}`)}
            className="text-left font-black text-slate-900 transition hover:text-orange-600"
          >
            {order.orderNumber}
          </button>
        ),
      },
      {
        key: "customerName",
        label: "Customer",
        render: (order) => (
          <div>
            <p className="font-bold text-slate-800">
              {order.customerName || "-"}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {order.totalItems ?? 0} items
            </p>
          </div>
        ),
      },
      {
        key: "totalAmount",
        label: "Amount",
        render: (order) => (
          <span className="font-black text-slate-900">
            {formatPrice(order.totalAmount)}
          </span>
        ),
      },
      {
        key: "paymentStatus",
        label: "Payment",
        render: (order) => (
          <div className="space-y-1">
            <StatusBadge
              variant={order.paymentStatus === "PAID" ? "success" : "warning"}
              size="sm"
              dot
            >
              {order.paymentStatus || "-"}
            </StatusBadge>

            <p className="text-[11px] font-semibold text-slate-400">
              {order.paymentMethod || "-"}
            </p>
          </div>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (order) => {
          const config = statusConfig[order.status] || {
            label: order.status || "-",
            variant: "neutral",
          };

          return (
            <StatusBadge variant={config.variant} size="sm" dot>
              {config.label}
            </StatusBadge>
          );
        },
      },
      {
        key: "createdAt",
        label: "Received",
        render: (order) => (
          <span className="text-sm text-slate-500">
            {formatDate(order.createdAt)}
          </span>
        ),
      },
      {
        key: "action",
        label: "Action",
        align: "right",
        render: (order) => (
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(`/restaurant/orders/${order.orderNumber}`)}
          >
            View
          </Button>
        ),
      },
    ],
    [navigate]
  );

  // =========================================
  // FILTERS
  // =========================================
  const clearFilters = () => {
    setSearchTerm("");
    setQuery("");
    setPaymentMethod("ALL");
    setPaymentStatus("ALL");
    setStatusFilter("ALL");
    setPage(1);
  };

  const hasFilters =
    Boolean(searchTerm.trim()) ||
    statusFilter !== "ALL" ||
    paymentMethod !== "ALL" ||
    paymentStatus !== "ALL";

  // =========================================
  // RETRY
  // =========================================
  const handleRetry = () => {
    fetchOrders();
  };

  // =========================================
  // ERROR
  // =========================================
  return (
    <div className="space-y-7">
      <PageHeader
        title="Orders"
        description="View and manage all orders received by your restaurant."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            variant={stat.variant}
            loading={fetchLoading}
          />
        ))}
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
        <TableToolbar
          searchValue={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setPage(1);
          }}
          searchPlaceholder="Search order, customer, phone or checkout..."
          filters={[
            {
              key: "status",
              label: "Order status",
              value: statusFilter,
              options: statusOptions,
            },
            {
              key: "paymentMethod",
              label: "Payment method",
              value: paymentMethod,
              options: [
                { value: "ALL", label: "All methods" },
                { value: "COD", label: "Cash on delivery" },
                { value: "ONLINE", label: "Online / Razorpay" },
              ],
            },
            {
              key: "paymentStatus",
              label: "Payment status",
              value: paymentStatus,
              options: [
                { value: "ALL", label: "All payments" },
                ...["PENDING", "PAID", "FAILED", "REFUNDED"].map((value) => ({
                  value,
                  label: value.charAt(0) + value.slice(1).toLowerCase(),
                })),
              ],
            },
          ]}
          onFilterChange={(key, value) => {
            if (key === "status") setStatusFilter(value);
            if (key === "paymentMethod") setPaymentMethod(value);
            if (key === "paymentStatus") setPaymentStatus(value);
            setPage(1);
          }}
          onClearFilters={clearFilters}
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-black text-slate-900">
            {filteredOrders.length}
          </span>{" "}
          of {pagination?.total ?? 0} matching orders
        </p>

        {statusFilter !== "ALL" && (
          <StatusBadge
            variant={statusConfig[statusFilter]?.variant || "neutral"}
            size="sm"
            dot
          >
            {statusConfig[statusFilter]?.label || statusFilter}
          </StatusBadge>
        )}
      </div>

      {error && (
        <ErrorState
          title="Unable to load orders"
          description={
            typeof error === "string"
              ? error
              : "Please retry or clear the filters."
          }
          onRetry={handleRetry}
        />
      )}
      {!error &&
        (!fetchLoading && filteredOrders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders found"
            description={
              hasFilters
                ? "Try changing or clearing your filters."
                : "Customer orders will appear here."
            }
            action={
              hasFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <CommonTable
            columns={columns}
            data={filteredOrders}
            loading={fetchLoading}
            rowKey="orderNumber"
          />
        ))}

      {!error &&
        !fetchLoading &&
        orders.length > 0 &&
        (pagination?.totalPages || 1) > 1 && (
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Page{" "}
              <span className="font-black text-slate-900">
                {pagination?.page || page}
              </span>{" "}
              of{" "}
              <span className="font-black text-slate-900">
                {pagination?.totalPages || 1}
              </span>{" "}
              • {pagination?.total || 0} orders
            </p>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={page <= 1 || fetchLoading}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
              >
                Previous
              </Button>

              <Button
                type="button"
                disabled={page >= (pagination?.totalPages || 1) || fetchLoading}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
    </div>
  );
};

export default RestaurantOrders;
