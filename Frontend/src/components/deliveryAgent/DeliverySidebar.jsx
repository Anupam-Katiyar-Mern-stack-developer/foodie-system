import {
  Banknote,
  Bike,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  UserRound,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { STORAGE_KEYS } from "../../constants/storageKeys";

const DeliverySidebar = ({
  mobileOpen,
  onClose,
}) => {
  // =========================================
  // MENU
  // =========================================

  const menuItems = [
    {
      label: "Dashboard",
      path: "/delivery/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Deliveries",
      path: "/delivery/history",
      icon: PackageCheck,
    },
    {
      label: "Earnings",
      path: "/delivery/earnings",
      icon: Banknote,
    },
    {
      label: "Offers",
      path: "/delivery/offers",
      icon: Bike,
    },
    {
      label: "Profile",
      path: "/delivery/profile",
      icon: UserRound,
    },
  ];

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem(
      STORAGE_KEYS.DELIVERY_TOKEN
    );

    window.location.replace(
      "/delivery/login"
    );
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <>
      {/* MOBILE OVERLAY */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[280px] flex-col
          border-r border-slate-200
          bg-white
          transition-transform duration-300

          lg:z-30
          lg:translate-x-0

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =========================================
            BRAND
        ========================================= */}

        <div className="flex min-h-[76px] items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-100">
              <Bike className="h-5 w-5" />
            </div>

            <div>
              <p className="text-lg font-black text-slate-950">
                Foodie
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-500">
                Delivery Partner
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =========================================
            NAVIGATION
        ========================================= */}

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3
                  rounded-xl
                  px-3 py-3
                  text-sm font-bold
                  transition

                  ${
                    isActive
                      ? "bg-orange-50 text-orange-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }
                `}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />

                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* =========================================
            BOTTOM
        ========================================= */}

        <div className="space-y-3 border-t border-slate-100 p-4">
          {/* ONLINE INFO */}

          {/* <div className="rounded-2xl bg-orange-50 p-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <span className="text-xs font-black text-slate-900">
                You're Online
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              You can receive new delivery assignments.
            </p>
          </div> */}

          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="
              flex w-full items-center gap-3
              rounded-xl
              border border-red-100
              px-3 py-3
              text-sm font-bold
              text-red-600
              transition
              hover:border-red-200
              hover:bg-red-50
            "
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />

            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default DeliverySidebar;