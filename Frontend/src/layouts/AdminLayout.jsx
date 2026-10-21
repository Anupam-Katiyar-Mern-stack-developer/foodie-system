import { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Store,
  Bike,
  Tags,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import Button from "../components/common/Button/Button";
import Drawer from "../components/common/Drawer/Drawer";
import ConfirmModal from "../components/common/ConfirmModal/ConfirmModal";
import { sessionExpired } from "../redux/slices/admin/admin.slice";
import OptimizedImage from "../components/common/OptimizedImage/OptimizedImage";

const navigation = [
  ["dashboard", "Overview", LayoutDashboard],
  ["orders", "Orders", ShoppingBag],
  ["restaurants", "Restaurants", Store],
  ["delivery-agents", "Delivery partners", Bike],
  ["users", "Customers", Users],
  ["categories", "Categories", Tags],
  ["foods", "Food catalogue", UtensilsCrossed],
  ["settings", "Account settings", Settings],
  ["site-settings", "Website settings", Settings],
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useSelector((state) => state.admin.profile);
  const { settings } = useSelector((state) => state.siteSettings);
  const current = navigation.find(([path]) =>
    location.pathname.startsWith(`/admin/${path}`)
  );
  const navigationContent = (
    <div className="flex h-full flex-col">
      <Link
        to="/admin/dashboard"
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-3 rounded-xl px-2 py-3 focus-visible:outline-orange-500"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
          {settings.logo ? (
            <OptimizedImage
              src={settings.logo}
              alt={settings.siteName}
              objectFit="contain"
              wrapperClassName="h-11 w-11 bg-white"
              className="h-11 w-11"
            />
          ) : (
            <UtensilsCrossed className="h-6 w-6" aria-hidden="true" />
          )}
        </span>
        <span>
          <span className="block text-2xl font-black tracking-tight text-slate-950">
            {settings.siteName}
            <span className="text-orange-500">.</span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Admin workspace
          </span>
        </span>
      </Link>
      <p className="mb-3 mt-8 px-4 text-xs font-bold uppercase tracking-widest text-slate-400">
        Manage your platform
      </p>
      <nav aria-label="Admin navigation" className="space-y-1">
        {navigation.map(([path, label, Icon]) => (
          <NavLink
            key={path}
            to={`/admin/${path}`}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline-orange-500 ${
                isActive
                  ? "bg-orange-50 text-orange-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`
            }
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-8">
        <div className="mb-4 rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
          <ShieldCheck
            className="mb-2 h-5 w-5 text-orange-600"
            aria-hidden="true"
          />
          <p className="text-sm font-bold text-slate-900">
            A better delivery, together.
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Review partners and keep your food community moving.
          </p>
        </div>
        <Button
          fullWidth
          variant="ghost"
          leftIcon={LogOut}
          onClick={() => setLogoutOpen(true)}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:p-3"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex">
        {navigationContent}
      </aside>
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Admin menu"
        size="sm"
      >
        {navigationContent}
      </Drawer>
      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm sm:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="lg:hidden"
              aria-label="Open admin menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-xs font-medium text-slate-500">
                Workspace /{" "}
                <span className="text-slate-700">
                  {current?.[1] || "Overview"}
                </span>
              </p>
              <p className="mt-1 text-sm font-bold">
                {settings.siteName} control centre
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-slate-600 hover:text-orange-600 focus-visible:outline-orange-500 sm:flex"
            >
              View website{" "}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <span className="h-8 w-px bg-slate-200" />
            <Link
              to="/admin/settings"
              className="flex items-center gap-3 rounded-xl focus-visible:outline-orange-500"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700">
                {profile?.name?.charAt(0)?.toUpperCase() || "A"}
              </span>
              <span className="hidden sm:block">
                <span className="block text-sm font-bold">
                  {profile?.name || "Administrator"}
                </span>
                <span className="text-xs text-slate-500">
                  Super administrator
                </span>
              </span>
            </Link>
          </div>
        </header>
        <main id="admin-main" className="mx-auto max-w-[1600px] p-4 sm:p-8">
          <Outlet />
        </main>
        <footer className="px-4 pb-6 text-xs text-slate-500 sm:px-8">
          {settings.siteName} Admin · Your platform, in one place.
        </footer>
      </div>
      <ConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Sign out of admin?"
        description="You can sign back in to continue managing your platform."
        confirmText="Sign out"
        onConfirm={() => {
          dispatch(sessionExpired());
          navigate("/admin/login", { replace: true });
        }}
      />
    </div>
  );
}
