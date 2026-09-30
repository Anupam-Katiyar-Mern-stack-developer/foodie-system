import {
  Route,
  Routes,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";


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
            <Screen title="Foodie Home" />
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
            <Screen title="Saved Addresses" />
          }
        />

        <Route
          path="restaurants"
          element={
            <Screen title="Restaurants" />
          }
        />

        <Route
          path="restaurants/:slug"
          element={
            <Screen title="Restaurant Details" />
          }
        />

        <Route
          path="categories/:slug"
          element={
            <Screen title="Category Foods" />
          }
        />

        <Route
          path="search"
          element={
            <Screen title="Search" />
          }
        />

        <Route
          path="cart"
          element={
            <Screen title="Cart" />
          }
        />

        <Route
          path="checkout"
          element={
            <Screen title="Checkout" />
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