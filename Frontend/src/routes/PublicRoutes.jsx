import {
  Route,
  Routes,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";


// =========================
// PUBLIC PAGES
// =========================

import Home from "../pages/public/Home/Home";

import Restaurants from "../pages/public/Restaurants/Restaurants";

import RestaurantDetails from "../pages/public/RestaurantDetails/RestaurantDetails";

import CategoryFoods from "../pages/public/CategoryFoods/CategoryFoods";

import Search from "../pages/public/Search/Search";


// =========================
// AUTH
// =========================

import Login from "../pages/public/Login/Login";

import Register from "../pages/public/Register/Register";


// =========================
// PROTECTED USER PAGES
// =========================

import Profile from "../pages/public/Profile/Profile";

import Addresses from "../pages/public/Addresses/Addresses";

import Cart from "../pages/public/Cart/Cart";

import Checkout from "../pages/public/Checkout/Checkout";

import Orders from "../pages/public/Orders/Orders";

import OrderDetails from "../pages/public/OrderDetails/OrderDetails";
import FoodDetails from "../pages/public/FoodDetails/FoodDetails";


const PublicRoutes = () => {
  return (
    <Routes>

      {/* =========================
          PUBLIC LAYOUT
      ========================== */}

      <Route
        element={
          <PublicLayout />
        }
      >

        {/* =====================
            PUBLIC ROUTES
        ====================== */}

        <Route
          index
          element={
            <Home />
          }
        />


        <Route
          path="restaurants"
          element={
            <Restaurants />
          }
        />


        <Route
          path="restaurants/:slug"
          element={
            <RestaurantDetails />
          }
        />


        <Route
          path="categories/:slug"
          element={
            <CategoryFoods />
          }
        />
        <Route
          path="foods/:slug"
          element={
            <FoodDetails />
          }
        />


        <Route
          path="search"
          element={
            <Search />
          }
        />


        {/* =====================
            PROTECTED USER
        ====================== */}

        <Route
          element={
            <ProtectedRoute />
          }
        >
          <Route
            path="profile"
            element={
              <Profile />
            }
          />


          <Route
            path="addresses"
            element={
              <Addresses />
            }
          />


          <Route
            path="cart"
            element={
              <Cart />
            }
          />


          <Route
            path="checkout"
            element={
              <Checkout />
            }
          />


          <Route
            path="orders"
            element={
              <Orders />
            }
          />


          <Route
            path="orders/:orderNumber"
            element={
              <OrderDetails />
            }
          />
        </Route>
      </Route>


      {/* =========================
          GUEST ONLY
      ========================== */}

      <Route
        element={
          <GuestRoute />
        }
      >
        <Route
          path="login"
          element={
            <Login />
          }
        />


        <Route
          path="register"
          element={
            <Register />
          }
        />
      </Route>

    </Routes>
  );
};


export default PublicRoutes;