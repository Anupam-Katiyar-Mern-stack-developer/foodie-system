import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";


import DeliveryLayout
  from "../layouts/DeliveryLayout";

import DeliveryDashboard
  from "../pages/deliveryAgent/Dashboard/DeliveryDashboard";

import DeliveryOffers
  from "../pages/deliveryAgent/Offers/DeliveryOffers";

import DeliveryActive
  from "../pages/deliveryAgent/Active/DeliveryActive";
import DeliveryHistory from "../pages/deliveryAgent/History/DeliveryHistory";
import DeliveryProfile from "../pages/deliveryAgent/Profile/DeliveryProfile";
import DeliveryLogin from "../pages/deliveryAgent/Auth/DeliveryLogin";
import DeliveryRegister from "../pages/deliveryAgent/Auth/DeliveryRegister";
// =========================================
// TEMP SCREEN
// Jab actual pages banenge
// tab remove kar denge
// =========================================

const Screen = ({
  title,
}) => {
  return (
    <div
      className="
        rounded-[1.5rem]

        border
        border-slate-200

        bg-white

        p-6

        shadow-sm
      "
    >
      <h1
        className="
          text-2xl
          font-black
          text-slate-950
        "
      >
        {title}
      </h1>
    </div>
  );
};


const DeliveryAgentRoutes = () => {

  return (

    <Routes>

      {/* =================================
          AUTH ROUTES

          Layout ke bahar
      ================================= */}

      <Route
        path="login"
        element={
          <DeliveryLogin />
        }
      />


      <Route
        path="register"
        element={
          <DeliveryRegister />
        }
      />


      {/* =================================
          DELIVERY PANEL

          Sab pages DeliveryLayout
          ke andar render honge.
      ================================= */}

      <Route
        element={
          <DeliveryLayout />
        }
      >

        {/* DEFAULT */}

        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />


        {/* DASHBOARD */}

        <Route
          path="dashboard"
          element={
            <DeliveryDashboard />
          }
        />


        {/* PROFILE */}

        <Route
          path="profile"
          element={
            <DeliveryProfile />
          }
        />


        {/* NEW DELIVERY OFFERS */}

        <Route
          path="offers"
          element={
            <DeliveryOffers />
          }
        />


        {/* CURRENT / ACTIVE DELIVERY */}

        <Route
          path="active"
          element={

            <DeliveryActive />
          }
        />


        {/* DELIVERY HISTORY */}

        <Route
          path="history"
          element={
            <DeliveryHistory />
          }
        />

      </Route>


      {/* =================================
          UNKNOWN ROUTE
      ================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="dashboard"
            replace
          />
        }
      />

    </Routes>

  );

};


export default DeliveryAgentRoutes;