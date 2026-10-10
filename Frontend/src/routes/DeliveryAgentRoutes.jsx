import { Navigate, Route, Routes } from "react-router-dom";

import DeliveryLayout from "../layouts/DeliveryLayout";

import DeliveryDashboard from "../pages/deliveryAgent/Dashboard/DeliveryDashboard";
import DeliveryOffers from "../pages/deliveryAgent/Offers/DeliveryOffers";
import DeliveryActive from "../pages/deliveryAgent/Active/DeliveryActive";
import DeliveryHistory from "../pages/deliveryAgent/History/DeliveryHistory";
import DeliveryProfile from "../pages/deliveryAgent/Profile/DeliveryProfile";
import DeliveryLogin from "../pages/deliveryAgent/Auth/DeliveryLogin";
import DeliveryRegister from "../pages/deliveryAgent/Auth/DeliveryRegister";
import DeliveryEarnings from "../pages/deliveryAgent/Earnings/DeliveryEarnings";

import DeliveryProtectedRoute from "../protectedRoutes/DeliveryProtectedRoute";

const DeliveryAgentRoutes = () => {
  return (
    <Routes>
      {/* =================================
          PUBLIC AUTH ROUTES
      ================================= */}

      <Route path="login" element={<DeliveryLogin />} />
      <Route path="register" element={<DeliveryRegister />} />

      {/* =================================
          PROTECTED DELIVERY ROUTES
      ================================= */}

      <Route element={<DeliveryProtectedRoute />}>
        <Route element={<DeliveryLayout />}>
          {/* DEFAULT */}
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          {/* DASHBOARD */}
          <Route
            path="dashboard"
            element={<DeliveryDashboard />}
          />

          {/* PROFILE */}
          <Route
            path="profile"
            element={<DeliveryProfile />}
          />

          {/* EARNINGS */}
          <Route
            path="earnings"
            element={<DeliveryEarnings />}
          />

          {/* DELIVERY OFFERS */}
          <Route
            path="offers"
            element={<DeliveryOffers />}
          />

          {/* ACTIVE DELIVERY */}
          <Route
            path="active"
            element={<DeliveryActive />}
          />

          {/* DELIVERY HISTORY */}
          <Route
            path="history"
            element={<DeliveryHistory />}
          />
        </Route>
      </Route>

      {/* =================================
          UNKNOWN ROUTE
      ================================= */}

      <Route
        path="*"
        element={<Navigate to="dashboard" replace />}
      />
    </Routes>
  );
};

export default DeliveryAgentRoutes;