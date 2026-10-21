import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  WalletCards,
  IndianRupee,
  CalendarDays,
  PackageCheck,
  RefreshCw,
} from "lucide-react";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import StatCard from "../../../components/common/StatCard/StatCard";
import Card from "../../../components/common/Card/Card";
import CommonTable from "../../../components/common/CommonTable/CommonTable";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import TableToolbar from "../../../components/common/TableToolbar/TableToolbar";
import Pagination from "../../../components/common/Pagination/Pagination";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import Button from "../../../components/common/Button/Button";
import { getDeliveryEarnings } from "../../../redux/thunks/deliveryAgent/deliveryDashboard.thunk";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
export default function DeliveryEarnings() {
  const dispatch = useDispatch();
  const {
    entries = [],
    summary = {},
    weekly = [],
    pagination = {},
    loading = false,
    error,
  } = useSelector((state) => state.deliveryDashboard.earnings) || {};
  const [search, setSearch] = useState(""),
    [query, setQuery] = useState(""),
    [range, setRange] = useState("ALL"),
    [paymentMethod, setPaymentMethod] = useState("ALL"),
    [page, setPage] = useState(1);
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);
  const reload = useCallback(
    () =>
      dispatch(
        getDeliveryEarnings({
          search: query,
          range,
          paymentMethod,
          page,
          limit: 15,
        })
      ),
    [dispatch, query, range, paymentMethod, page]
  );
  useEffect(() => {
    let request = reload();
    const refresh = () => {
      if (!document.hidden) {
        request?.abort();
        request = reload();
      }
    };
    const timer = setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      request?.abort();
    };
  }, [reload]);
  const reset = () => {
    setSearch("");
    setQuery("");
    setRange("ALL");
    setPaymentMethod("ALL");
    setPage(1);
  };
  const maximum = Math.max(1, ...weekly.map((day) => Number(day.earning)));
  const columns = [
    {
      key: "orderNumber",
      label: "Order",
      render: (row) => (
        <span className="font-bold text-slate-900">{row.orderNumber}</span>
      ),
    },
    { key: "restaurantName", label: "Restaurant" },
    {
      key: "completedAt",
      label: "Delivered",
      render: (row) =>
        new Date(row.completedAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "earning",
      label: "Your earning",
      render: (row) => (
        <span className="font-bold text-green-700">{money(row.earning)}</span>
      ),
    },
    { key: "paymentMethod", label: "Customer method" },
    {
      key: "customerPaymentStatus",
      label: "Customer payment",
      render: (row) => (
        <StatusBadge
          variant={row.customerPaymentStatus === "PAID" ? "success" : "warning"}
        >
          {row.customerPaymentStatus === "PAID"
            ? "Collected"
            : row.customerPaymentStatus}
        </StatusBadge>
      ),
    },
  ];
  return (
    <div className="space-y-6">
      <PageHeader
        title="Your earnings"
        description="Every completed delivery, every rupee earned."
        actions={
          <Button
            variant="outline"
            leftIcon={RefreshCw}
            loading={loading}
            onClick={reload}
          >
            Refresh
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [
            "Total earned",
            money(summary.totalEarnings),
            WalletCards,
            "All completed deliveries",
          ],
          [
            "Today",
            money(summary.todayEarnings),
            IndianRupee,
            "Today's delivery fees",
          ],
          [
            "Last 7 days",
            money(summary.weekEarnings),
            CalendarDays,
            "Including today",
          ],
          [
            "Completed deliveries",
            summary.completedDeliveries || 0,
            PackageCheck,
            "Delivered orders only",
          ],
        ].map(([title, value, Icon, description]) => (
          <StatCard
            key={title}
            title={title}
            value={value}
            icon={Icon}
            description={description}
            loading={loading}
          />
        ))}
      </div>
      <Card
        title="Your week at a glance"
        description="Delivery fees earned each day ? India time"
      >
        <div
          className="mt-5 grid grid-cols-7 gap-2 sm:gap-5"
          role="img"
          aria-label={`Last seven days: ${weekly
            .map((day) => `${day.label} ${money(day.earning)}`)
            .join(", ")}`}
        >
          {weekly.map((day) => (
            <div key={day.date} className="min-w-0 text-center">
              <p className="truncate text-[10px] font-bold text-slate-600 sm:text-xs">
                {money(day.earning)}
              </p>
              <div className="mt-3 flex h-32 items-end rounded-lg bg-orange-50">
                <div
                  className="w-full rounded-lg bg-orange-500"
                  style={{
                    height: `${
                      Number(day.earning) > 0
                        ? Math.max(4, (Number(day.earning) / maximum) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="mt-3 text-xs font-semibold text-slate-500">
                {day.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs leading-6 text-slate-500">
          Earnings use the delivery fee saved on each completed order. Customer
          payment collection is shown separately from your earnings.
        </p>
      </Card>
      <Card
        title="Delivery earnings"
        description={`${pagination.total || 0} matching completed deliveries`}
      >
        <TableToolbar
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder="Search order, restaurant or customer..."
          filters={[
            {
              key: "range",
              label: "Period",
              value: range,
              options: [
                { value: "ALL", label: "All time" },
                { value: "TODAY", label: "Today" },
                { value: "WEEK", label: "Last 7 days" },
                { value: "MONTH", label: "Last 30 days" },
              ],
            },
            {
              key: "paymentMethod",
              label: "Payment method",
              value: paymentMethod,
              options: [
                { value: "ALL", label: "All methods" },
                { value: "COD", label: "Cash on delivery" },
                { value: "ONLINE", label: "Online" },
              ],
            },
          ]}
          onFilterChange={(key, value) => {
            if (key === "range") setRange(value);
            else setPaymentMethod(value);
            setPage(1);
          }}
          onClearFilters={reset}
        />
        {error && (
          <ErrorState
            title="Unable to load earnings"
            description={error}
            onRetry={reload}
          />
        )}
        {!error && (
          <div className="mt-5">
            <CommonTable
              columns={columns}
              data={entries}
              rowKey="orderNumber"
              loading={loading}
              emptyState={
                <EmptyState
                  icon={WalletCards}
                  title="No earnings yet"
                  description="Completed deliveries will appear here. Try clearing your filters."
                  action={
                    <Button variant="outline" onClick={reset}>
                      Clear filters
                    </Button>
                  }
                />
              }
            />
          </div>
        )}
        <div className="mt-5">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            loading={loading}
            onPageChange={setPage}
          />
        </div>
      </Card>
    </div>
  );
}
