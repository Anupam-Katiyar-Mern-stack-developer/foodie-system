import { Navigate, Outlet, useLocation } from "react-router-dom";
import { STORAGE_KEYS } from "../constants/storageKeys";

const DeliveryProtectedRoute = () => {
  const location = useLocation();

  const deliveryToken = localStorage.getItem(
    STORAGE_KEYS.DELIVERY_TOKEN
  );

  if (!deliveryToken) {
    return (
      <Navigate
        to="/delivery/login"
        replace
        state={{
          from: `${location.pathname}${location.search}`,
        }}
      />
    );
  }

  return <Outlet />;
};

export default DeliveryProtectedRoute;