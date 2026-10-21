import { useDispatch, useSelector } from "react-redux";
import EmailVerification from "../components/common/EmailVerification/EmailVerification";
import { getRestaurantProfile } from "../redux/thunks/restaurant/restaurantProfile.thunk";
import { useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";

import RestaurantSidebar from "../components/restaurant/Sidebar/RestaurantSidebar";

import RestaurantNavbar from "../components/restaurant/Navbar/RestaurantNavbar";

const RestaurantLayout = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.restaurantProfile?.profile);
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // SIDEBAR
  // =========================

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // =========================
  // LOGOUT
  // Temporary
  // Later Redux thunk lagega
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("restaurantToken");

    navigate("/restaurant/login", {
      replace: true,
    });
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#fffaf5]
      "
    >
      {/* =========================
          SIDEBAR
      ========================== */}

      <RestaurantSidebar
        open={sidebarOpen}
        onClose={closeSidebar}
        onLogout={handleLogout}
      />

      {/* =========================
          RIGHT CONTENT
      ========================== */}

      <div
        className="
          min-h-screen

          transition-all

          lg:pl-[280px]
        "
      >
        {/* NAVBAR */}

        <RestaurantNavbar onMenuOpen={openSidebar} />

        {/* PAGE CONTENT */}

        <main
          className="
            min-h-[calc(100vh-76px)]

            px-4
            py-6

            sm:px-6
            sm:py-7

            lg:px-8
            lg:py-8
          "
        >
          <EmailVerification
            kind="restaurant"
            accountEmail={profile?.email}
            onVerified={() => dispatch(getRestaurantProfile())}
          />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RestaurantLayout;
