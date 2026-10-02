import {
  Outlet,
} from "react-router-dom";

import PublicNavbar from "../components/public/PublicNavbar/PublicNavbar";
import PublicFooter from "../components/public/PublicFooter/PublicFooter";
import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  logoutUser,
} from "../redux/thunks/public/auth.thunk";

const PublicLayout = () => {

  const dispatch =
  useDispatch();
  
  const {
    profile,
  } = useSelector(
    (state) =>
      state.publicProfile
  );

  const {
    user,
    isAuthenticated,
  } = useSelector(
    (state) =>
      state.publicAuth
  );
  /*
    UI phase.

    Later ye values Redux/API
    se aayengi.
  */


  const {
    cartGroups,
  } = useSelector(
    (state) =>
      state.publicCart
  );


  const cartCount =
    cartGroups.reduce(
      (
        total,
        group
      ) => {
        const groupTotal =
          group.items.reduce(
            (
              sum,
              item
            ) =>
              sum +
              Number(
                item.quantity
              ),

            0
          );


        return (
          total +
          groupTotal
        );
      },

      0
    );

 const handleLogout =
  async () => {
    await dispatch(
      logoutUser()
    );

    navigate(
      "/",
      {
        replace: true,
      }
    );
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
        user={
          isAuthenticated
            ? user
            : null
        }

        cartCount={
          cartCount
        }

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