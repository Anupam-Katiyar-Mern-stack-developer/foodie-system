import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingBag,
  Users,
  UtensilsCrossed,
  RefreshCw,
  Eye,
} from "lucide-react";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Card from "../../../components/common/Card/Card";
import CommonTable from "../../../components/common/CommonTable/CommonTable";
import TableToolbar from "../../../components/common/TableToolbar/TableToolbar";
import Pagination from "../../../components/common/Pagination/Pagination";
import Button from "../../../components/common/Button/Button";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Drawer from "../../../components/common/Drawer/Drawer";
import OptimizedImage from "../../../components/common/OptimizedImage/OptimizedImage";
import { fetchAdminResource } from "../../../redux/thunks/admin/admin.thunk";
import { ORDER_STATUS } from "../../../constants/orderStatus";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
const date = (value) => (value ? new Date(value).toLocaleString("en-IN") : "—");
const badge = (value) => (
  <StatusBadge
    variant={
      ["PAID", "DELIVERED", "Active", "Available", "Verified"].includes(value)
        ? "success"
        : ["REJECTED", "CANCELLED", "Blocked", "Unavailable"].includes(value)
        ? "danger"
        : "warning"
    }
  >
    {String(value || "Unknown").replaceAll("_", " ")}
  </StatusBadge>
);
const config = {
  orders: {
    title: "Orders",
    description:
      "Follow every order across your platform, from the kitchen to the doorstep.",
    icon: ShoppingBag,
    key: "orderNumber",
    search: "Search order number, restaurant or customer...",
  },
  users: {
    title: "Customers",
    description: "Get to know the people who make your Foodie community.",
    icon: Users,
    key: "id",
    search: "Search customer name, email or phone...",
  },
  foods: {
    title: "Food catalogue",
    description:
      "Explore the dishes offered by restaurants across your platform.",
    icon: UtensilsCrossed,
    key: "slug",
    search: "Search food, restaurant or category...",
  },
};

export default function AdminRecords({ resource }) {
  const view = config[resource];
  const Icon = view.icon;
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("ALL");
  const [paymentMethod, setPaymentMethod] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const { data, loading, pagination, error } = useSelector(
    (state) => state.admin.resources[resource]
  );
  const reload = () =>
    dispatch(
      fetchAdminResource({
        resource,
        params: {
          search: search.trim(),
          status,
          paymentStatus,
          paymentMethod,
          page,
          limit: 15,
        },
      })
    );
  useEffect(() => {
    let request;
    const timer = setTimeout(() => {
      request = dispatch(
        fetchAdminResource({
          resource,
          params: {
            search: search.trim(),
            status,
            paymentStatus,
            paymentMethod,
            page,
            limit: 15,
          },
        })
      );
    }, 250);
    return () => {
      clearTimeout(timer);
      request?.abort();
    };
  }, [dispatch, resource, search, status, paymentStatus, paymentMethod, page]);
  const columns =
    resource === "orders"
      ? [
          {
            key: "orderNumber",
            label: "Order",
            render: (row) => (
              <div>
                <p className="font-bold text-slate-900">{row.orderNumber}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {date(row.createdAt)}
                </p>
              </div>
            ),
          },
          { key: "restaurantName", label: "Restaurant" },
          { key: "customerName", label: "Customer" },
          {
            key: "totalAmount",
            label: "Amount",
            render: (row) => money(row.totalAmount),
          },
          {
            key: "paymentStatus",
            label: "Checkout payment",
            render: (row) => (
              <div>
                {badge(row.paymentStatus)}
                <p className="mt-1 text-xs text-slate-500">
                  {row.paymentMethod} · checkout level
                </p>
              </div>
            ),
          },
          {
            key: "status",
            label: "Order status",
            render: (row) => badge(row.status),
          },
        ]
      : resource === "users"
      ? [
          {
            key: "name",
            label: "Customer",
            render: (row) => (
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700">
                  {row.name?.charAt(0)?.toUpperCase()}
                </span>
                <span className="font-bold">{row.name}</span>
              </div>
            ),
          },
          { key: "email", label: "Email" },
          {
            key: "phone",
            label: "Phone",
            render: (row) => row.phone || "Not provided",
          },
          {
            key: "emailVerified",
            label: "Email verification",
            render: (row) =>
              badge(row.emailVerified ? "Verified" : "Unverified"),
          },
          {
            key: "isBlocked",
            label: "Account",
            render: (row) => badge(row.isBlocked ? "Blocked" : "Active"),
          },
        ]
      : [
          {
            key: "name",
            label: "Dish",
            render: (row) => (
              <div className="flex items-center gap-3">
                <OptimizedImage
                  src={row.image}
                  alt={row.name}
                  className="h-12 w-12"
                  wrapperClassName="h-12 w-12 shrink-0"
                />
                <div>
                  <p className="font-bold text-slate-900">{row.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {row.isVeg ? "Vegetarian" : "Non-vegetarian"} ·{" "}
                    {row.categoryName}
                  </p>
                </div>
              </div>
            ),
          },
          { key: "restaurantName", label: "Restaurant" },
          {
            key: "price",
            label: "Price",
            render: (row) => (
              <div className="font-semibold">
                {money(row.discountPrice ?? row.price)}
                {row.discountPrice && (
                  <p className="text-xs font-normal text-slate-400 line-through">
                    {money(row.price)}
                  </p>
                )}
              </div>
            ),
          },
          {
            key: "isAvailable",
            label: "Availability",
            render: (row) =>
              badge(row.isAvailable ? "Available" : "Unavailable"),
          },
        ];
  columns.push({
    key: "actions",
    label: "Details",
    align: "right",
    render: (row) => (
      <Button
        variant="ghost"
        size="sm"
        leftIcon={Eye}
        onClick={() => setSelected(row)}
      >
        View
      </Button>
    ),
  });
  const detailFields =
    resource === "orders"
      ? [
          ["Order", "orderNumber"],
          ["Restaurant", "restaurantName"],
          ["Customer", "customerName"],
          ["Customer phone", "customerPhone"],
          ["Delivery address", "addressLine"],
          ["City", "city"],
          ["Pincode", "pincode"],
          ["Order status", "status"],
          ["Payment method", "paymentMethod"],
          ["Checkout payment status", "paymentStatus"],
        ]
      : resource === "foods"
      ? [
          ["Dish", "name"],
          ["Restaurant", "restaurantName"],
          ["Category", "categoryName"],
          ["Description", "description"],
          ["Preparation time (min)", "preparationTime"],
        ]
      : [
          ["Customer", "name"],
          ["Email", "email"],
          ["Phone", "phone"],
        ];
  return (
    <div className="space-y-6">
      <PageHeader
        title={view.title}
        description={view.description}
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
      <Card padding="lg">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-3xl font-black">
              {pagination?.total ?? "—"}
              <span className="ml-3 text-sm font-medium text-slate-500">
                {search || status !== "ALL"
                  ? "matching records"
                  : resource === "foods"
                  ? "dishes to discover"
                  : resource === "users"
                  ? "registered customers"
                  : "orders across Foodie"}
              </span>
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {resource === "orders"
                ? "Order progress and checkout payment information in one place."
                : resource === "foods"
                ? "Menus and availability are maintained by restaurant partners."
                : "Customer contact and account information."}
            </p>
          </div>
        </div>
      </Card>
      <Card>
        <TableToolbar
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder={view.search}
          filters={
            resource === "orders"
              ? [
                  {
                    key: "status",
                    label: "Order status",
                    value: status,
                    options: [
                      "ALL",
                      ...Object.values(ORDER_STATUS),
                      "REJECTED",
                    ].map((value) => ({
                      value,
                      label:
                        value === "ALL"
                          ? "All statuses"
                          : value.replaceAll("_", " "),
                    })),
                  },
                  {
                    key: "paymentStatus",
                    label: "Payment status",
                    value: paymentStatus,
                    options: [
                      "ALL",
                      "PENDING",
                      "PAID",
                      "FAILED",
                      "REFUNDED",
                    ].map((value) => ({
                      value,
                      label: value === "ALL" ? "All payments" : value,
                    })),
                  },
                  {
                    key: "paymentMethod",
                    label: "Payment method",
                    value: paymentMethod,
                    options: ["ALL", "COD", "ONLINE"].map((value) => ({
                      value,
                      label: value === "ALL" ? "All methods" : value,
                    })),
                  },
                ]
              : []
          }
          onFilterChange={(key, value) => {
            if (key === "paymentStatus") setPaymentStatus(value);
            else if (key === "paymentMethod") setPaymentMethod(value);
            else setStatus(value);
            setPage(1);
          }}
          onClearFilters={() => {
            setSearch("");
            setStatus("ALL");
            setPaymentStatus("ALL");
            setPaymentMethod("ALL");
            setPage(1);
          }}
        />
        {error && (
          <ErrorState
            title={`Unable to load ${view.title.toLowerCase()}`}
            description={error}
            onRetry={reload}
          />
        )}
        <div className="mt-5">
          <CommonTable
            columns={columns}
            data={data || []}
            rowKey={view.key}
            loading={loading}
            emptyState={
              <EmptyState
                icon={Icon}
                title="No records found"
                description="Try changing your search or filters."
              />
            }
          />
        </div>
        <div className="mt-5">
          <Pagination
            currentPage={page}
            totalPages={pagination?.totalPages}
            onPageChange={setPage}
            loading={loading}
          />
        </div>
      </Card>
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        side="right"
        size="xl"
        title={
          resource === "orders"
            ? "Order details"
            : resource === "foods"
            ? "Dish details"
            : "Customer details"
        }
      >
        {selected && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-widest text-orange-300">
                {view.title}
              </p>
              <p className="mt-2 break-words text-xl font-bold">
                {selected.orderNumber || selected.name}
              </p>
              {selected.status && (
                <div className="mt-3">{badge(selected.status)}</div>
              )}
            </div>
            {resource === "foods" && (
              <OptimizedImage
                src={selected.image}
                alt={selected.name}
                className="h-48 w-full"
              />
            )}
            <dl className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white px-5">
              {detailFields.map(([label, key]) => (
                <div key={key} className="py-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                  </dt>
                  <dd className="mt-1 break-words text-sm font-medium">
                    {selected[key] || "Not provided"}
                  </dd>
                </div>
              ))}
              {resource === "orders" && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Order amount
                  </dt>
                  <dd className="mt-1 text-xl font-black">
                    {money(selected.totalAmount)}
                  </dd>
                </div>
              )}
            </dl>
            <p className="border-t pt-4 text-xs text-slate-500">
              Created {date(selected.createdAt)}
            </p>
          </div>
        )}
      </Drawer>
    </div>
  );
}
