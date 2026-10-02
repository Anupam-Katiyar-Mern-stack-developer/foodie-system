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
  } = useSelector(
    (state) =>
      state.publicAuth
  );


  // Already logged in
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