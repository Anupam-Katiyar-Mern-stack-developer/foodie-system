import {
  Route,
  Routes,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/public/Home/Home";
import Restaurants from "../pages/public/Restaurants/Restaurants";
import RestaurantDetails from "../pages/public/RestaurantDetails/RestaurantDetails";
import CategoryFoods from "../pages/public/CategoryFoods/CategoryFoods";
import Search from "../pages/public/Search/Search";
import Cart from "../pages/public/Cart/Cart";
import Checkout from "../pages/public/Checkout/Checkout";
import Addresses from "../pages/public/Addresses/Addresses";


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


const PublicRoutes = () => {
  return (
    <Routes>

      {/* =========================
          PUBLIC WEBSITE LAYOUT
      ========================== */}
      <Route
        element={
          <PublicLayout />
        }
      >
        <Route
          index
          element={
            <Home />
          }
        />

        <Route
          path="profile"
          element={
            <Screen title="User Profile" />
          }
        />

        <Route
          path="addresses"
          element={
            <Addresses />
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
          path="search"
          element={
            <Search />
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
            <Screen title="My Orders" />
          }
        />

        <Route
          path="orders/:orderNumber"
          element={
            <Screen title="Order Details" />
          }
        />
      </Route>


      {/* =========================
          AUTH PAGES
          Navbar/Footer ke bina
      ========================== */}
      <Route
        path="login"
        element={
          <Screen title="User Login" />
        }
      />

      <Route
        path="register"
        element={
          <Screen title="User Register" />
        }
      />

    </Routes>
  );
};


export default PublicRoutes;