import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PublicNavbar from "../components/public/PublicNavbar/PublicNavbar";
import PublicFooter from "../components/public/PublicFooter/PublicFooter";
import { logoutUser } from "../redux/thunks/public/auth.thunk";
import getImageUrl from "../utils/getImageUrl";

export default function PublicLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.publicAuth);
  const { cartGroups } = useSelector((state) => state.publicCart);
  const { settings } = useSelector((state) => state.siteSettings);
  const cartCount = cartGroups.reduce(
    (sum, group) =>
      sum +
      group.items.reduce((count, item) => count + Number(item.quantity), 0),
    0
  );
  useEffect(() => {
    document.title = settings.seoTitle || settings.siteName;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.append(meta);
    }
    meta.content = settings.seoDescription || settings.tagline || "";
    if (settings.favicon) {
      let icon = document.querySelector('link[rel="icon"]');
      if (!icon) {
        icon = document.createElement("link");
        icon.rel = "icon";
        document.head.append(icon);
      }
      icon.href = getImageUrl(settings.favicon);
    }
  }, [settings]);
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/", { replace: true });
  };
  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf5] text-slate-900">
      {settings.announcementEnabled && settings.announcement && (
        <div className="bg-slate-950 px-4 py-2.5 text-center text-sm font-medium text-white">
          {settings.announcement}
        </div>
      )}
      {settings.maintenanceMode && (
        <div className="bg-amber-100 px-4 py-3 text-center text-sm text-amber-900">
          {settings.maintenanceMessage}
        </div>
      )}
      <PublicNavbar
        user={isAuthenticated ? user : null}
        cartCount={cartCount}
        locationLabel="Choose delivery location"
        onLogout={handleLogout}
      />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
