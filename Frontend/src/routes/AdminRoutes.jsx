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


const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <Screen title="Admin Login" />
        }
      />

      <Route
        path="dashboard"
        element={
          <Screen title="Admin Dashboard" />
        }
      />

      <Route
        path="restaurants"
        element={
          <Screen title="Manage Restaurants" />
        }
      />

      <Route
        path="delivery-agents"
        element={
          <Screen title="Manage Delivery Agents" />
        }
      />

      <Route
        path="categories"
        element={
          <Screen title="Manage Categories" />
        }
      />

      <Route
        path="foods"
        element={
          <Screen title="Manage Foods" />
        }
      />

      <Route
        path="orders"
        element={
          <Screen title="Manage Orders" />
        }
      />

      <Route
        path="settings"
        element={
          <Screen title="Settings" />
        }
      />
    </Routes>
  );
};


export default AdminRoutes;