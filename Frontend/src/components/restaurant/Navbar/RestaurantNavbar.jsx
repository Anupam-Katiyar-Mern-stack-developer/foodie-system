import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  ChevronDown,
  Clock3,
  LogOut,
  Menu,
  Search,
  Store,
  UserRound,
  Utensils,
} from "lucide-react";


import Avatar
  from "../../common/Avatar/Avatar";


import {
  getRestaurantProfile,
} from "../../../redux/thunks/restaurant/restaurantProfile.thunk";

import {
  logoutRestaurant,
} from "../../../redux/slices/restaurant/restaurantAuth.slice";


const RestaurantNavbar = ({
  onMenuOpen,
}) => {

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();


  // =========================================
  // DROPDOWN
  // =========================================

  const [
    profileMenuOpen,
    setProfileMenuOpen,
  ] = useState(false);


  const profileMenuRef =
    useRef(null);


  // =========================================
  // REDUX PROFILE
  // =========================================

  const {
    profile,
    fetchLoading,
  } = useSelector(
    (state) =>
      state.restaurantProfile
  ) || {
    profile: null,
    fetchLoading: false,
  };


  // =========================================
  // FETCH PROFILE
  // =========================================

  useEffect(() => {

    if (
      !profile &&
      !fetchLoading
    ) {
      dispatch(
        getRestaurantProfile()
      );
    }

  }, [
    dispatch,
    profile,
    fetchLoading,
  ]);


  // =========================================
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // =========================================

  useEffect(() => {

    const handleOutsideClick =
      (event) => {

        if (
          profileMenuRef.current &&
          !profileMenuRef.current.contains(
            event.target
          )
        ) {
          setProfileMenuOpen(
            false
          );
        }

      };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  // =========================================
  // CLOSE ON ESCAPE
  // =========================================

  useEffect(() => {

    const handleEscape =
      (event) => {

        if (
          event.key ===
          "Escape"
        ) {
          setProfileMenuOpen(
            false
          );
        }

      };


    document.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, []);


  // =========================================
  // VALUES
  // =========================================

  const restaurantName =
    profile?.restaurantName ||
    "Restaurant";


  const ownerName =
    profile?.ownerName ||
    "Restaurant Owner";


  const restaurantEmail =
    profile?.email ||
    "";


  const restaurantOpen =
    Boolean(
      profile?.isOpen
    );


  const restaurantImage =
    profile?.logo ||
    profile?.image ||
    "";


  // =========================================
  // NAVIGATION
  // =========================================

  const handleNavigate =
    (path) => {

      setProfileMenuOpen(
        false
      );

      navigate(
        path
      );

    };


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout =
    () => {

      setProfileMenuOpen(
        false
      );


      dispatch(
        logoutRestaurant()
      );


      navigate(
        "/restaurant/login",
        {
          replace: true,
        }
      );

    };


  return (

    <header
      className="
        sticky
        top-0
        z-30

        border-b
        border-slate-200/80

        bg-[#fffaf5]/95

        backdrop-blur-xl
      "
    >

      {/* =================================
          TOP ACCENT
      ================================= */}

      <div
        className="
          h-1
          w-full

          bg-gradient-to-r
          from-orange-500
          via-rose-500
          to-amber-400
        "
      />


      <div
        className="
          flex
          min-h-[72px]
          items-center
          justify-between
          gap-4

          px-4

          sm:px-6
          lg:px-8
        "
      >

        {/* =================================
            LEFT
        ================================= */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >

          {/* MOBILE MENU */}

          <button
            type="button"

            onClick={
              onMenuOpen
            }

            aria-label="Open sidebar"

            className="
              inline-flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center

              rounded-xl

              border
              border-slate-200

              bg-white

              text-slate-700

              shadow-sm

              transition

              hover:border-orange-200
              hover:text-orange-600

              lg:hidden
            "
          >
            <Menu
              className="
                h-5
                w-5
              "
            />
          </button>


          {/* RESTAURANT NAME */}

          <div
            className="
              min-w-0
            "
          >

            <p
              className="
                text-[11px]
                font-semibold
                text-slate-400
              "
            >
              Restaurant Panel
            </p>


            {fetchLoading &&
            !profile ? (

              <div
                className="
                  mt-1
                  h-5
                  w-36

                  animate-pulse

                  rounded-md

                  bg-slate-200
                "
              />

            ) : (

              <h2
                className="
                  truncate

                  text-lg
                  font-black
                  tracking-tight
                  text-slate-950

                  sm:text-xl
                "
              >
                {
                  restaurantName
                }
              </h2>

            )}

          </div>

        </div>


        {/* =================================
            SEARCH
        ================================= */}

        <div
          className="
            hidden
            max-w-[430px]
            flex-1

            md:block
          "
        >

          <div
            className="
              flex
              h-11
              items-center
              gap-2.5

              rounded-2xl

              border
              border-slate-200

              bg-white

              px-3.5

              shadow-sm

              transition-all

              focus-within:border-orange-300
              focus-within:ring-4
              focus-within:ring-orange-100
            "
          >

            <Search
              className="
                h-4
                w-4
                shrink-0
                text-orange-500
              "
            />


            <input
              type="search"

              placeholder="Search order, customer or food..."

              className="
                min-w-0
                flex-1

                bg-transparent

                text-sm
                text-slate-900

                outline-none

                placeholder:text-slate-400
              "
            />

          </div>

        </div>


        {/* =================================
            RIGHT
        ================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
          "
        >

          {/* =================================
              RESTAURANT STATUS
          ================================= */}

          <button
            type="button"

            onClick={() =>
              navigate(
                "/restaurant/business-hours"
              )
            }

            title="Manage restaurant status"

            className={`
              hidden
              items-center
              gap-2

              rounded-xl

              border

              px-3
              py-2

              transition

              lg:flex

              ${
                restaurantOpen
                  ? `
                    border-emerald-200
                    bg-emerald-50

                    hover:bg-emerald-100
                  `
                  : `
                    border-rose-200
                    bg-rose-50

                    hover:bg-rose-100
                  `
              }
            `}
          >

            <span
              className={`
                h-2
                w-2

                rounded-full

                ${
                  restaurantOpen
                    ? "bg-emerald-500"
                    : "bg-rose-500"
                }
              `}
            />


            <span
              className={`
                text-xs
                font-black

                ${
                  restaurantOpen
                    ? "text-emerald-700"
                    : "text-rose-700"
                }
              `}
            >
              {
                restaurantOpen
                  ? "Open"
                  : "Closed"
              }
            </span>

          </button>


          {/* =================================
              NOTIFICATION
          ================================= */}

          <button
            type="button"

            aria-label="Notifications"

            onClick={() =>
              navigate(
                "/restaurant/notifications"
              )
            }

            className="
              relative

              inline-flex
              h-11
              w-11
              items-center
              justify-center

              rounded-xl

              text-slate-600

              transition

              hover:bg-orange-50
              hover:text-orange-600
            "
          >

            <Bell
              className="
                h-5
                w-5
              "
            />


            {/*
              Notification API abhi
              ready nahi hai.

              Jab backend notification
              module banega tab unread
              count ke basis par ye dot
              conditionally show karenge.
            */}

          </button>


          {/* =================================
              PROFILE DROPDOWN
          ================================= */}

          <div
            ref={
              profileMenuRef
            }

            className="
              relative
            "
          >

            {/* PROFILE BUTTON */}

            <button
              type="button"

              onClick={() =>
                setProfileMenuOpen(
                  (previous) =>
                    !previous
                )
              }

              aria-expanded={
                profileMenuOpen
              }

              className="
                flex
                items-center
                gap-2

                rounded-xl

                p-1.5

                transition

                hover:bg-white
                hover:shadow-sm
              "
            >

              <Avatar
                src={
                  restaurantImage
                }

                name={
                  restaurantName
                }

                size="sm"
              />


              <div
                className="
                  hidden
                  max-w-[140px]
                  text-left

                  xl:block
                "
              >

                <p
                  className="
                    truncate

                    text-sm
                    font-black
                    text-slate-900
                  "
                >
                  {
                    restaurantName
                  }
                </p>


                <p
                  className="
                    mt-0.5

                    truncate

                    text-[10px]
                    text-slate-400
                  "
                >
                  {
                    ownerName
                  }
                </p>

              </div>


              <ChevronDown
                className={`
                  hidden
                  h-4
                  w-4

                  text-slate-400

                  transition-transform

                  xl:block

                  ${
                    profileMenuOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>


            {/* =================================
                DROPDOWN MENU
            ================================= */}

            {profileMenuOpen && (

              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+12px)]

                  w-[280px]

                  overflow-hidden

                  rounded-2xl

                  border
                  border-slate-200

                  bg-white

                  shadow-xl
                  shadow-slate-200/60
                "
              >

                {/* PROFILE INFO */}

                <div
                  className="
                    border-b
                    border-slate-100

                    p-4
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <Avatar
                      src={
                        restaurantImage
                      }

                      name={
                        restaurantName
                      }

                      size="md"
                    />


                    <div
                      className="
                        min-w-0
                      "
                    >

                      <p
                        className="
                          truncate

                          text-sm
                          font-black
                          text-slate-950
                        "
                      >
                        {
                          restaurantName
                        }
                      </p>


                      <p
                        className="
                          mt-0.5

                          truncate

                          text-xs
                          text-slate-400
                        "
                      >
                        {
                          restaurantEmail ||
                          ownerName
                        }
                      </p>

                    </div>

                  </div>


                  {/* STATUS */}

                  <div
                    className="
                      mt-3

                      flex
                      items-center
                      justify-between

                      rounded-xl

                      bg-slate-50

                      px-3
                      py-2
                    "
                  >

                    <span
                      className="
                        text-xs
                        font-semibold
                        text-slate-500
                      "
                    >
                      Restaurant Status
                    </span>


                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1.5

                        text-xs
                        font-black

                        ${
                          restaurantOpen
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }
                      `}
                    >

                      <span
                        className={`
                          h-2
                          w-2

                          rounded-full

                          ${
                            restaurantOpen
                              ? "bg-emerald-500"
                              : "bg-rose-500"
                          }
                        `}
                      />


                      {
                        restaurantOpen
                          ? "Open"
                          : "Closed"
                      }

                    </span>

                  </div>

                </div>


                {/* =================================
                    NAVIGATION OPTIONS
                ================================= */}

                <div
                  className="
                    p-2
                  "
                >

                  {/* PROFILE */}

                  <button
                    type="button"

                    onClick={() =>
                      handleNavigate(
                        "/restaurant/profile"
                      )
                    }

                    className="
                      flex
                      w-full
                      items-center
                      gap-3

                      rounded-xl

                      px-3
                      py-2.5

                      text-left

                      text-sm
                      font-semibold
                      text-slate-700

                      transition

                      hover:bg-orange-50
                      hover:text-orange-700
                    "
                  >

                    <UserRound
                      className="
                        h-4
                        w-4
                      "
                    />

                    Restaurant Profile

                  </button>


                  {/* BUSINESS HOURS */}

                  <button
                    type="button"

                    onClick={() =>
                      handleNavigate(
                        "/restaurant/business-hours"
                      )
                    }

                    className="
                      flex
                      w-full
                      items-center
                      gap-3

                      rounded-xl

                      px-3
                      py-2.5

                      text-left

                      text-sm
                      font-semibold
                      text-slate-700

                      transition

                      hover:bg-orange-50
                      hover:text-orange-700
                    "
                  >

                    <Clock3
                      className="
                        h-4
                        w-4
                      "
                    />

                    Open / Close Restaurant

                  </button>


                  {/* FOODS */}

                  <button
                    type="button"

                    onClick={() =>
                      handleNavigate(
                        "/restaurant/foods"
                      )
                    }

                    className="
                      flex
                      w-full
                      items-center
                      gap-3

                      rounded-xl

                      px-3
                      py-2.5

                      text-left

                      text-sm
                      font-semibold
                      text-slate-700

                      transition

                      hover:bg-orange-50
                      hover:text-orange-700
                    "
                  >

                    <Utensils
                      className="
                        h-4
                        w-4
                      "
                    />

                    Manage Foods

                  </button>


                  {/* RESTAURANT */}

                  <button
                    type="button"

                    onClick={() =>
                      handleNavigate(
                        "/restaurant/dashboard"
                      )
                    }

                    className="
                      flex
                      w-full
                      items-center
                      gap-3

                      rounded-xl

                      px-3
                      py-2.5

                      text-left

                      text-sm
                      font-semibold
                      text-slate-700

                      transition

                      hover:bg-orange-50
                      hover:text-orange-700
                    "
                  >

                    <Store
                      className="
                        h-4
                        w-4
                      "
                    />

                    Dashboard

                  </button>

                </div>


                {/* =================================
                    LOGOUT
                ================================= */}

                <div
                  className="
                    border-t
                    border-slate-100

                    p-2
                  "
                >

                  <button
                    type="button"

                    onClick={
                      handleLogout
                    }

                    className="
                      flex
                      w-full
                      items-center
                      gap-3

                      rounded-xl

                      px-3
                      py-2.5

                      text-left

                      text-sm
                      font-bold
                      text-rose-600

                      transition

                      hover:bg-rose-50
                    "
                  >

                    <LogOut
                      className="
                        h-4
                        w-4
                      "
                    />

                    Logout

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </header>

  );

};


export default RestaurantNavbar;