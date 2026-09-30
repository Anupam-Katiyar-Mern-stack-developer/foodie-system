import {
    Route,
    Routes,
} from "react-router-dom";

import PublicRoutes from "./PublicRoutes";
import RestaurantRoutes from "./RestaurantRoutes";
import DeliveryAgentRoutes from "./DeliveryAgentRoutes";
import AdminRoutes from "./AdminRoutes";


const AppRoutes = () => {
    return (
        <Routes>

            {/* =====================
          RESTAURANT
      ===================== */}
            <Route
                path="/restaurant/*"
                element={
                    <RestaurantRoutes />
                }
            />


            {/* =====================
          DELIVERY AGENT
      ===================== */}
            <Route
                path="/delivery/*"
                element={
                    <DeliveryAgentRoutes />
                }
            />


            {/* =====================
          ADMIN
      ===================== */}
            <Route
                path="/admin/*"
                element={
                    <AdminRoutes />
                }
            />


            {/* =====================
          PUBLIC / CUSTOMER
      ===================== */}
            <Route
                path="/*"
                element={
                    <PublicRoutes />
                }
            />

        </Routes>
    );
};


export default AppRoutes;