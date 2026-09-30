import {
  Route,
  Routes,
} from "react-router-dom";


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
        path="login"
        element={
          <Screen title="Restaurant Login" />
        }
      />

      <Route
        path="register"
        element={
          <Screen title="Restaurant Register" />
        }
      />

      <Route
        path="dashboard"
        element={
          <Screen title="Restaurant Dashboard" />
        }
      />

      <Route
        path="profile"
        element={
          <Screen title="Restaurant Profile" />
        }
      />

      <Route
        path="foods"
        element={
          <Screen title="Restaurant Foods" />
        }
      />

      <Route
        path="foods/add"
        element={
          <Screen title="Add Food" />
        }
      />

      <Route
        path="foods/:slug/edit"
        element={
          <Screen title="Edit Food" />
        }
      />

      <Route
        path="orders"
        element={
          <Screen title="Restaurant Orders" />
        }
      />

      <Route
        path="orders/:orderNumber"
        element={
          <Screen title="Restaurant Order Details" />
        }
      />
    </Routes>
  );
};


export default RestaurantRoutes;