import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";


const GuestRoute = () => {
  const {
    isAuthenticated,
    authReady,
  } = useSelector(
    (state) =>
      state.publicAuth
  );


  if (!authReady) {
    return (
      <div
        className="
          flex
          min-h-screen
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


  if (isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  return <Outlet />;
};


export default GuestRoute;