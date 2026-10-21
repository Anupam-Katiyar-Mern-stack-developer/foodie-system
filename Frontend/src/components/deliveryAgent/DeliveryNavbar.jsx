import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";

import Avatar from "../common/Avatar/Avatar";

import {
  getDeliveryProfile,
} from "../../redux/thunks/deliveryAgent/deliveryProfile.thunk";

import getImageUrl from "../../utils/getImageUrl";

const DeliveryNavbar = ({ onMenuOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =========================================
  // REDUX PROFILE
  // =========================================

  const {
    profile,
    fetchLoading,
  } = useSelector(
    (state) => state.deliveryProfile
  ) || {};

  // =========================================
  // GET PROFILE
  // =========================================

  useEffect(() => {
    if (!profile) {
      dispatch(getDeliveryProfile());
    }
  }, [dispatch, profile]);

  // =========================================
  // PROFILE DATA
  // =========================================

  const name =
    profile?.name || "Delivery Partner";

  const firstName =
    profile?.name?.split(" ")[0] ||
    "Partner";

  const profileImage =
    profile?.image
      ? getImageUrl(profile.image)
      : "";

  const isOnline =
    Boolean(profile?.isOnline);

  // =========================================
  // RENDER
  // =========================================

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#fffaf5]/95 backdrop-blur-xl">
      {/* TOP ACCENT */}

      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-rose-500 to-amber-400" />

      <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* LEFT */}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuOpen}
            aria-label="Open menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <p className="text-[11px] font-semibold text-slate-400">
              Delivery Partner
            </p>

            <h2 className="text-lg font-black text-slate-950 sm:text-xl">
              {fetchLoading && !profile
                ? "Welcome back"
                : `Welcome back, ${firstName}`}
            </h2>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-2">
          {/* ONLINE STATUS */}

          <div
            className={`hidden items-center gap-2 rounded-xl border px-3 py-2 sm:flex ${
              isOnline
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-200 bg-slate-100"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isOnline
                  ? "bg-emerald-500"
                  : "bg-slate-400"
              }`}
            />

            <span
              className={`text-xs font-black ${
                isOnline
                  ? "text-emerald-700"
                  : "text-slate-600"
              }`}
            >
              {isOnline
                ? "Online"
                : "Offline"}
            </span>
          </div>

          {/* NOTIFICATION */}

          <button
            type="button"
            aria-label="Notifications"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* PROFILE */}

          <button
            type="button"
            onClick={() =>
              navigate("/delivery/profile")
            }
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-white hover:shadow-sm"
          >
            <Avatar
              src={profileImage}
              name={name}
              size="sm"
            />

            <div className="hidden text-left xl:block">
              <p className="text-sm font-black text-slate-900">
                {fetchLoading && !profile
                  ? "Loading..."
                  : name}
              </p>

              <p className="text-[10px] text-slate-400">
                Delivery Partner
              </p>
            </div>

            <ChevronDown className="hidden h-4 w-4 text-slate-400 xl:block" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DeliveryNavbar;