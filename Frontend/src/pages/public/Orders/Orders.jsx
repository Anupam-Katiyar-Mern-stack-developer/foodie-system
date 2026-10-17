import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Package, Store } from "lucide-react";
import Container from "../../../components/common/Container/Container";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import { getMyOrders } from "../../../redux/thunks/public/order.thunk";

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

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

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

const OrderCard = ({ order, onClick }) => {
  const status = statusConfig[order.status] || {
    label: order.status || "-",
    variant: "neutral",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-orange-50 text-orange-500">
            {order.restaurantLogo ? (
              <img
                src={order.restaurantLogo}
                alt={order.restaurantName || "Restaurant"}
                className="h-full w-full object-cover"
              />
            ) : (
              <Store className="h-6 w-6" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-black text-slate-950">
              {order.restaurantName || "Restaurant"}
            </h3>

            <p className="mt-1 text-xs font-semibold text-slate-400">
              #{order.orderNumber}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <ChevronRight className="mt-2 h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge variant={status.variant} size="sm" dot>
            {status.label}
          </StatusBadge>

          {order.totalItems !== undefined && (
            <span className="text-xs font-semibold text-slate-500">
              {order.totalItems} item{Number(order.totalItems) === 1 ? "" : "s"}
            </span>
          )}

          {order.paymentMethod && (
            <span className="text-xs font-semibold text-slate-400">
              {order.paymentMethod}
            </span>
          )}
        </div>

        <p className="text-lg font-black text-slate-950">
          {formatPrice(order.totalAmount)}
        </p>
      </div>
    </button>
  );
};

const OrdersSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((item) => (
      <Skeleton
        key={item}
        width="w-full"
        height="h-40"
        rounded="rounded-2xl"
      />
    ))}
  </div>
);

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    orders = [],
    fetchLoading,
    error,
  } = useSelector((state) => state.publicOrder) || {};

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const handleOrderClick = (orderNumber) => {
    navigate(`/orders/${orderNumber}`);
  };

  const handleRetry = () => {
    dispatch(getMyOrders());
  };

  return (
    <main className="min-h-screen bg-[#fffaf5] py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-orange-500">
            <Package className="h-4 w-4" />
            My Orders
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Your orders
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            View all your food orders and open any order to check its complete details and live status.
          </p>
        </div>

        {fetchLoading && orders.length === 0 ? (
          <OrdersSkeleton />
        ) : error && orders.length === 0 ? (
          <ErrorState
            title="Unable to load orders"
            description={
              typeof error === "string"
                ? error
                : "Something went wrong while loading your orders."
            }
            onRetry={handleRetry}
          />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Your food orders will appear here after you place your first order."
          />
        ) : (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Order history
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {orders.length} order{orders.length === 1 ? "" : "s"} found
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.orderNumber}
                  order={order}
                  onClick={() => handleOrderClick(order.orderNumber)}
                />
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
};

export default Orders;