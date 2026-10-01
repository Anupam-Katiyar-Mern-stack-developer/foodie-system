import {
  Outlet,
} from "react-router-dom";

import PublicNavbar from "../components/public/PublicNavbar/PublicNavbar";
import PublicFooter from "../components/public/PublicFooter/PublicFooter";


const PublicLayout = () => {
  /*
    UI phase.

    Later ye values Redux/API
    se aayengi.
  */
  const user = null;


  const handleLogout = () => {
    /*
      Later:
      dispatch logout
      clear token
      toast
      navigate
    */
  };


  return (
    <div
      className="
        flex
        min-h-screen
        flex-col

        bg-[#fffaf5]
        text-slate-900
      "
    >
      <PublicNavbar
        user={user}

        cartCount={0}

        locationLabel="Choose delivery location"

        onLogout={
          handleLogout
        }
      />


      <main
        className="
          min-w-0
          flex-1
        "
      >
        <Outlet />
      </main>


      <PublicFooter />
    </div>
  );
};


export default PublicLayout;