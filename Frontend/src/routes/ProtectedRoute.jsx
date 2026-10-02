import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";


const ProtectedRoute = () => {
  const location =
    useLocation();


  const {
    isAuthenticated,
    authReady,
  } = useSelector(
    (state) =>
      state.publicAuth
  );


  // =========================
  // AUTH CHECK RUNNING
  // =========================

  if (!authReady) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center

          bg-[#fffaf5]
        "
      >
        <div
          className="
            h-10
            w-10

            animate-spin

            rounded-full

            border-4
            border-orange-100
            border-t-orange-500
          "
        />
      </div>
    );
  }


  // =========================
  // GUEST
  // =========================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"

        replace

        state={{
          from:
            location.pathname +
            location.search,
        }}
      />
    );
  }


  return <Outlet />;
};


export default ProtectedRoute;