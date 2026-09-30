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


const DeliveryAgentRoutes = () => {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <Screen title="Delivery Agent Login" />
        }
      />

      <Route
        path="register"
        element={
          <Screen title="Delivery Agent Register" />
        }
      />

      <Route
        path="dashboard"
        element={
          <Screen title="Delivery Dashboard" />
        }
      />

      <Route
        path="profile"
        element={
          <Screen title="Delivery Profile" />
        }
      />

      <Route
        path="offers"
        element={
          <Screen title="Delivery Offers" />
        }
      />

      <Route
        path="active"
        element={
          <Screen title="Active Delivery" />
        }
      />

      <Route
        path="history"
        element={
          <Screen title="Delivery History" />
        }
      />
    </Routes>
  );
};


export default DeliveryAgentRoutes;