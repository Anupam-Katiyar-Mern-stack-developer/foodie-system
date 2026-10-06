import {
  Route,
  Routes,
  Navigate,
} from "react-router-dom";



import RestaurantLayout
  from "../layouts/RestaurantLayout";

import RestaurantDashboard
  from "../pages/restaurant/Dashboard/RestaurantDashboard";


import RestaurantOrders from "../pages/restaurant/Orders/RestaurantOrders";
import RestaurantOrderDetails from "../pages/restaurant/RestaurantOrderDetails/RestaurantOrderDetails";
import RestaurantFoods from "../pages/restaurant/Foods/RestaurantFoods";
import RestaurantFoodForm
  from "../pages/restaurant/Foods/RestaurantFoodForm";

const Screen = ({
  title,
}) => {
  return (
    <div className="p-8">
      <h1
        className="
          text-2xl
          font-bold
          text-gray-900
        "
      >
        {title}
      </h1>
    </div>
  );
};


const RestaurantRoutes = () => {
  return (
    <Routes>
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
            <div>
              <RestaurantOrders />
            </div>
          }
        />

        <Route
          path="orders/:orderNumber"
          element={
            <div>
              <RestaurantOrderDetails />
            </div>
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
            <div>
              Restaurant Categories
            </div>
          }
        />


        {/* PROFILE */}

        <Route
          path="profile"
          element={
            <div>
              Restaurant Profile
            </div>
          }
        />


        {/* BUSINESS HOURS */}

        <Route
          path="business-hours"
          element={
            <div>
              Restaurant Business Hours
            </div>
          }
        />
      </Route>
    </Routes>
  );
};


export default RestaurantRoutes;