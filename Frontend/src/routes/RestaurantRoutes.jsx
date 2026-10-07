import {
  Route,
  Routes,
  Navigate,
} from "react-router-dom";


import RestaurantLayout
  from "../layouts/RestaurantLayout";


import ProtectedRestaurantRoute
  from "../protectedRoutes/ProtectedRestaurantRoute";


import RestaurantLogin
  from "../pages/restaurant/Auth/RestaurantLogin";

import RestaurantRegister
  from "../pages/restaurant/Auth/RestaurantRegister";


import RestaurantDashboard
  from "../pages/restaurant/Dashboard/RestaurantDashboard";

import RestaurantOrders
  from "../pages/restaurant/Orders/RestaurantOrders";

import RestaurantOrderDetails
  from "../pages/restaurant/RestaurantOrderDetails/RestaurantOrderDetails";

import RestaurantFoods
  from "../pages/restaurant/Foods/RestaurantFoods";

import RestaurantFoodForm
  from "../pages/restaurant/Foods/RestaurantFoodForm";

import RestaurantCategories
  from "../pages/restaurant/categories/RestaurantCategories";

import RestaurantProfile
  from "../pages/restaurant/Profile/RestaurantProfile";

import RestaurantBusinessHours
  from "../pages/restaurant/Business/RestaurantBusinessHours";

// import RestaurantNotifications
//   from "../pages/restaurant/Notifications/RestaurantNotifications";


const RestaurantRoutes = () => {
  return (
    <Routes>

      {/* =========================
          PUBLIC AUTH ROUTES
      ========================== */}

      <Route
        path="login"
        element={
          <RestaurantLogin />
        }
      />

      <Route
        path="register"
        element={
          <RestaurantRegister />
        }
      />


      {/* =========================
          PROTECTED RESTAURANT
      ========================== */}

      <Route
        element={
          <ProtectedRestaurantRoute />
        }
      >

        <Route
          element={
            <RestaurantLayout />
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
              <RestaurantDashboard />
            }
          />


          {/* ORDERS */}

          <Route
            path="orders"
            element={
              <RestaurantOrders />
            }
          />

          <Route
            path="orders/:orderNumber"
            element={
              <RestaurantOrderDetails />
            }
          />


          {/* FOODS */}

          <Route
            path="foods"
            element={
              <RestaurantFoods />
            }
          />

          <Route
            path="foods/add"
            element={
              <RestaurantFoodForm />
            }
          />

          <Route
            path="foods/:foodSlug/edit"
            element={
              <RestaurantFoodForm />
            }
          />


          {/* CATEGORIES */}

          <Route
            path="categories"
            element={
              <RestaurantCategories />
            }
          />


          {/* PROFILE */}

          <Route
            path="profile"
            element={
              <RestaurantProfile />
            }
          />


          {/* OPEN / CLOSE */}

          <Route
            path="business-hours"
            element={
              <RestaurantBusinessHours />
            }
          />


          {/* NOTIFICATIONS */}

          {/* <Route
            path="notifications"
            element={
              <RestaurantNotifications />
            }
          /> */}

        </Route>
      </Route>

    </Routes>
  );
};


export default RestaurantRoutes;