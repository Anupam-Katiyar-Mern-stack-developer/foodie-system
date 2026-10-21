import { Navigate, Route, Routes } from "react-router-dom";
import AdminProtectedRoute from "../protectedRoutes/AdminProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/admin/Auth/AdminLogin";
import AdminDashboard from "../pages/admin/Dashboard/AdminDashboard";
import AdminPartners from "../pages/admin/Partners/AdminPartners";
import AdminCategories from "../pages/admin/Categories/AdminCategories";
import AdminRecords from "../pages/admin/Records/AdminRecords";
import AdminSettings from "../pages/admin/Settings/AdminSettings";
import SiteSettings from "../pages/admin/Settings/SiteSettings";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route
            path="restaurants"
            element={<AdminPartners key="restaurants" kind="restaurants" />}
          />
          <Route
            path="delivery-agents"
            element={
              <AdminPartners key="delivery-agents" kind="delivery-agents" />
            }
          />
          <Route path="categories" element={<AdminCategories />} />
          <Route
            path="foods"
            element={<AdminRecords key="foods" resource="foods" />}
          />
          <Route
            path="orders"
            element={<AdminRecords key="orders" resource="orders" />}
          />
          <Route
            path="users"
            element={<AdminRecords key="users" resource="users" />}
          />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="site-settings" element={<SiteSettings />} />
          <Route
            path="*"
            element={<Navigate to="/admin/dashboard" replace />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
