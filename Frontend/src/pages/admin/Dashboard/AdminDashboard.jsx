import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Store, Bike, Users, ArrowUpRight, RefreshCw, ClipboardCheck, Tags } from "lucide-react";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import StatCard from "../../../components/common/StatCard/StatCard";
import Card from "../../../components/common/Card/Card";
import Button from "../../../components/common/Button/Button";
import CommonTable from "../../../components/common/CommonTable/CommonTable";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import { fetchAdminResource } from "../../../redux/thunks/admin/admin.thunk";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((state) => state.admin.resources.dashboard);
  const profile = useSelector((state) => state.admin.profile);
  useEffect(() => { const request = dispatch(fetchAdminResource({ resource: "dashboard" })); return () => request.abort(); }, [dispatch]);
  const refresh = () => dispatch(fetchAdminResource({ resource: "dashboard" }));
  const stats = data?.stats || {};
  const max = Math.max(1, ...(data?.trend || []).map((day) => day.orders));
  const columns = [
    { key: "orderNumber", label: "Order", render: (row) => <span className="font-bold text-slate-900">{row.orderNumber}</span> },
    { key: "restaurantName", label: "Restaurant", render: (row) => <div><p className="font-semibold">{row.restaurantName}</p><p className="mt-1 text-xs text-slate-500">{row.customerName}</p></div> },
    { key: "totalAmount", label: "Amount", render: (row) => money(row.totalAmount) },
    { key: "status", label: "Status", render: (row) => <StatusBadge variant={row.status === "DELIVERED" ? "success" : ["REJECTED", "CANCELLED"].includes(row.status) ? "danger" : "warning"}>{row.status.replaceAll("_", " ")}</StatusBadge> },
  ];
  return <div className="space-y-7">
    <PageHeader title={`Hello, ${profile?.name?.split(" ")[0] || "Admin"}.`} description="Here’s what’s happening across your Foodie community." actions={<Button variant="outline" leftIcon={RefreshCw} loading={loading} onClick={refresh}>Refresh overview</Button>} />
    {error && <ErrorState title="Unable to load overview" description={error} onRetry={refresh} />}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Total orders", stats.orders, ShoppingBag, "orders", "Across your platform"], ["Restaurants", stats.restaurants, Store, "restaurants", "Restaurant partners"], ["Delivery partners", stats.deliveryAgents, Bike, "delivery-agents", "Registered delivery agents"], ["Customers", stats.customers, Users, "users", "People in your community"]].map(([title, value, icon, path, description]) => <StatCard key={path} title={title} value={value ?? "—"} icon={icon} description={description} loading={loading} onClick={() => navigate(`/admin/${path}`)} actionLabel="View all" />)}</div>
    <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
      <Card padding="lg" title="Orders this week" description="Daily order volume · last 7 days" headerAction={<StatusBadge variant="neutral">7 days</StatusBadge>}>
        {loading && !data ? <Skeleton height="h-52" width="w-full" /> : <><div className="mt-2 flex items-baseline gap-3"><span className="text-4xl font-black tracking-tight">{(data?.trend || []).reduce((sum, item) => sum + item.orders, 0)}</span><span className="text-sm text-slate-500">orders placed</span></div><div className="mt-8 grid h-44 grid-cols-7 items-end gap-3" role="img" aria-label={(data?.trend || []).map((day) => `${day.label}: ${day.orders} orders`).join(", ")}>{(data?.trend || []).map((day) => <div key={day.day} className="flex h-full flex-col items-center justify-end gap-2"><span className="text-xs font-semibold text-slate-600">{day.orders}</span><div className="w-full max-w-12 rounded-t-lg bg-orange-400 transition-colors hover:bg-orange-500" style={{ height: `${Math.max(3, (day.orders / max) * 115)}px` }} /><span className="text-xs text-slate-500">{day.label}</span></div>)}</div></>}
      </Card>
      <Card padding="lg" title="Needs your attention" description="A little review goes a long way."><div className="space-y-3">{[["Restaurant applications", stats.pendingRestaurants, Store, "restaurants"], ["Delivery applications", stats.pendingAgents, Bike, "delivery-agents"]].map(([label, count, Icon, path]) => <button key={path} onClick={() => navigate(`/admin/${path}?status=PENDING`)} className="flex min-h-20 w-full items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/60 p-4 text-left transition-colors hover:bg-orange-100 focus-visible:outline-orange-500"><Icon className="h-5 w-5 shrink-0 text-orange-600" aria-hidden="true" /><span className="flex-1 text-sm font-semibold">{label}<span className="mt-1 block text-xs font-normal text-slate-500">Waiting for approval</span></span><span className="text-2xl font-bold">{count ?? "—"}</span><ArrowUpRight className="h-4 w-4 text-slate-400" aria-hidden="true" /></button>)}<div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm"><span className="text-slate-500">Active orders</span><span className="font-bold">{stats.activeOrders ?? "—"}</span></div></div></Card>
    </div>
    <div className="grid gap-4 md:grid-cols-3"><StatCard title="Delivered order value" value={data ? money(stats.deliveredValue) : "—"} description="Value of delivered orders, not platform profit" icon={ClipboardCheck} variant="success" loading={loading} /><StatCard title="Completed deliveries" value={stats.deliveredOrders ?? "—"} description="Orders that reached their destination" icon={Bike} variant="info" loading={loading} /><StatCard title="Food catalogue" value={stats.foods ?? "—"} description={`${stats.categories ?? "—"} categories for customers to explore`} icon={Tags} loading={loading} onClick={() => navigate("/admin/foods")} actionLabel="Browse catalogue" /></div>
    <Card title="Latest orders" description="The most recently placed orders" headerAction={<Button variant="ghost" rightIcon={ArrowUpRight} onClick={() => navigate("/admin/orders")}>All orders</Button>}><CommonTable columns={columns} data={data?.recentOrders || []} rowKey="orderNumber" loading={loading} minWidth="min-w-[620px]" emptyState={<EmptyState icon={ShoppingBag} title="No orders yet" description="New customer orders will appear here." />} /></Card>
    {data?.updatedAt && <p className="text-xs text-slate-500">Updated {new Date(data.updatedAt).toLocaleTimeString("en-IN")} · Refresh to get the latest overview.</p>}
  </div>;
}
