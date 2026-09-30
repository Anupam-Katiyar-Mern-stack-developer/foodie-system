import {
  Outlet,
} from "react-router-dom";

import PublicNavbar from "../components/public/PublicNavbar/PublicNavbar";


const PublicLayout = () => {
  /*
    Abhi UI phase hai.

    Later:
    user      → Redux
    cartCount → cart Redux
    location  → address/current location
  */

  const user = null;


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
      />


      <main className="flex-1">
        <Outlet />
      </main>


      {/* Footer actual component later */}
      <footer
        className="
          mt-auto
          border-t
          border-orange-100

          bg-slate-950

          px-4
          py-8

          text-center
          text-sm
          text-slate-400
        "
      >
        Foodie — Fresh food,
        delivered with care.
      </footer>
    </div>
  );
};


export default PublicLayout;