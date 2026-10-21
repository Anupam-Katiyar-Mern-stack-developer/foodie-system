import { useDispatch, useSelector } from "react-redux";
import EmailVerification from "../components/common/EmailVerification/EmailVerification";
import { getDeliveryProfile } from "../redux/thunks/deliveryAgent/deliveryProfile.thunk";
import { useState } from "react";

import { Outlet } from "react-router-dom";

import DeliverySidebar from "../components/deliveryAgent/DeliverySidebar";

import DeliveryNavbar from "../components/deliveryAgent/DeliveryNavbar";

import DeliveryRealtime from "../components/deliveryAgent/DeliveryRealtime";
const DeliveryLayout = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.deliveryProfile?.profile);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="
        min-h-screen

        bg-[#fffaf5]
      "
    >
      <DeliveryRealtime />

      <DeliverySidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className="
          min-h-screen

          lg:pl-[280px]
        "
      >
        <DeliveryNavbar onMenuOpen={() => setSidebarOpen(true)} />

        <main
          className="p-4

            sm:p-6
            lg:p-8
          "
        >
          <EmailVerification
            kind="delivery"
            accountEmail={profile?.email}
            onVerified={() => dispatch(getDeliveryProfile())}
          />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DeliveryLayout;
