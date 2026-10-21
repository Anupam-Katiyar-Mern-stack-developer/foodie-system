import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProfile } from "../redux/thunks/admin/admin.thunk";
import Loader from "../components/common/Loader/Loader";
import ErrorState from "../components/common/ErrorState/ErrorState";

export default function AdminProtectedRoute() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, sessionStatus, sessionError } = useSelector(
    (state) => state.admin
  );
  useEffect(() => {
    if (token && sessionStatus === "idle") dispatch(fetchAdminProfile());
  }, [dispatch, token, sessionStatus]);
  if (!token)
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  if (sessionStatus === "error")
    return (
      <div className="p-8">
        <ErrorState
          title="Unable to verify admin session"
          description={sessionError}
          onRetry={() => dispatch(fetchAdminProfile())}
        />
      </div>
    );
  if (sessionStatus !== "ready")
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader text="Opening admin workspace..." />
      </div>
    );
  return <Outlet />;
}
