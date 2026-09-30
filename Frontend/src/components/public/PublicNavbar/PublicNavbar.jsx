import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ChefHat,
  ChevronDown,
  LogOut,
  MapPin,
  MapPinned,
  Menu,
  PackageOpen,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import Container from "../../common/Container/Container";
import Drawer from "../../common/Drawer/Drawer";
import Dropdown from "../../common/Dropdown/Dropdown";
import Avatar from "../../common/Avatar/Avatar";
import Button from "../../common/Button/Button";

import {
  publicNavigation,
} from "../../../data/public/navigation";


const PublicNavbar = ({
  user = null,

  cartCount = 0,

  locationLabel = "Choose delivery location",

  onLogout,
}) => {
  const navigate =
    useNavigate();

  const location =
    useLocation();


  // =========================
  // STATES
  // =========================

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);


  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");


  /*
    MD / LG screen par
    expandable search.
  */
  const [
    mediumSearchOpen,
    setMediumSearchOpen,
  ] = useState(false);


  // =========================
  // REFS
  // =========================

  const mediumSearchRef =
    useRef(null);

  const mediumSearchInputRef =
    useRef(null);


  const isAuthenticated =
    Boolean(user);


  // =========================
  // URL QUERY → NAVBAR INPUT
  // =========================

  /*
    Agar user already:

    /search?q=pizza

    page par hai to navbar me
    "pizza" visible rahe.
  */
  useEffect(() => {
    if (
      location.pathname !==
      "/search"
    ) {
      return;
    }


    const params =
      new URLSearchParams(
        location.search
      );


    const query =
      params.get("q") || "";


    setSearchQuery(query);

  }, [
    location.pathname,
    location.search,
  ]);


  // =========================
  // MEDIUM SEARCH AUTO FOCUS
  // =========================

  useEffect(() => {
    if (!mediumSearchOpen) {
      return;
    }


    const timer =
      setTimeout(() => {
        mediumSearchInputRef
          .current
          ?.focus();
      }, 100);


    return () => {
      clearTimeout(timer);
    };

  }, [mediumSearchOpen]);


  // =========================
  // CLICK OUTSIDE
  // =========================

  useEffect(() => {
    if (!mediumSearchOpen) {
      return;
    }


    const handleOutsideClick = (
      event
    ) => {
      if (
        mediumSearchRef.current &&
        !mediumSearchRef.current.contains(
          event.target
        )
      ) {
        setMediumSearchOpen(
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

  }, [mediumSearchOpen]);


  // =========================
  // ESC CLOSE MEDIUM SEARCH
  // =========================

  useEffect(() => {
    if (!mediumSearchOpen) {
      return;
    }


    const handleEscape = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        setMediumSearchOpen(
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

  }, [mediumSearchOpen]);


  // =========================
  // HELPERS
  // =========================

  const closeMobileMenu =
    () => {
      setMobileMenuOpen(
        false
      );
    };


  const handleNavigate = (
    path
  ) => {
    navigate(path);

    closeMobileMenu();
  };


  const handleLogout = () => {
    closeMobileMenu();

    onLogout?.();
  };


  // =========================
  // SEARCH
  // =========================

  const handleSearchSubmit = (
    event
  ) => {
    event.preventDefault();


    const query =
      searchQuery.trim();


    if (!query) {
      return;
    }


    navigate(
      `/search?q=${encodeURIComponent(
        query
      )}`
    );


    setMediumSearchOpen(
      false
    );

    closeMobileMenu();
  };


  const handleClearSearch =
    () => {
      setSearchQuery("");

      /*
        Search open hai to
        input focused hi rahe.
      */
      requestAnimationFrame(
        () => {
          mediumSearchInputRef
            .current
            ?.focus();
        }
      );
    };


  return (
    <>
      {/* =========================
          NAVBAR
      ========================== */}
      <header
        className="
          sticky
          top-0
          z-40

          border-b
          border-orange-100/80

          bg-[#fffaf5]/95

          backdrop-blur-xl
        "
      >
        {/* Premium Top Accent */}
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


        <Container>
          {/* =====================
              MAIN NAVBAR ROW
          ====================== */}
          <div
            className="
              flex
              min-h-[68px]
              items-center
              justify-between
              gap-3

              sm:min-h-[72px]
            "
          >
            {/* =====================
                LEFT SIDE
            ====================== */}
            <div
              className="
                flex
                min-w-0
                items-center

                gap-4
                lg:gap-5
                xl:gap-6
              "
            >
              {/* LOGO */}
              <Link
                to="/"

                aria-label="Foodie home"

                className="
                  group

                  flex
                  shrink-0
                  items-center
                  gap-2.5

                  rounded-xl

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-orange-500/30
                "
              >
                <span
                  className="
                    relative

                    flex
                    h-11
                    w-11
                    items-center
                    justify-center

                    overflow-hidden

                    rounded-2xl

                    bg-gradient-to-br
                    from-orange-500
                    via-orange-500
                    to-rose-500

                    text-white

                    shadow-lg
                    shadow-orange-500/20

                    transition
                    duration-300

                    group-hover:-rotate-3
                    group-hover:scale-105
                  "
                >
                  <ChefHat
                    className="
                      relative
                      z-10
                      h-6
                      w-6
                    "

                    strokeWidth={2.2}
                  />


                  <span
                    className="
                      absolute
                      -right-2
                      -top-2

                      h-6
                      w-6

                      rounded-full

                      bg-amber-300/80

                      blur-[1px]
                    "
                  />
                </span>


                {/* LOGO TEXT */}
                <div
                  className="
                    hidden
                    sm:block
                  "
                >
                  <p
                    className="
                      text-xl
                      font-black
                      leading-none
                      tracking-tight
                      text-slate-950
                    "
                  >
                    Food
                    <span
                      className="
                        text-orange-500
                      "
                    >
                      ie
                    </span>
                  </p>

                  <p
                    className="
                      mt-1
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.24em]
                      text-slate-400
                    "
                  >
                    eat better
                  </p>
                </div>
              </Link>


              {/* =====================
                  LOCATION
              ====================== */}
              <button
                type="button"

                className="
                  hidden
                  max-w-[180px]
                  items-center
                  gap-2

                  rounded-xl

                  px-2.5
                  py-2

                  text-left

                  transition

                  hover:bg-orange-50

                  lg:flex
                  xl:max-w-[200px]
                "
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center

                    rounded-lg

                    bg-orange-100
                    text-orange-600
                  "
                >
                  <MapPin
                    className="
                      h-4
                      w-4
                    "
                  />
                </span>


                <span
                  className="
                    min-w-0
                  "
                >
                  <span
                    className="
                      block
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    Deliver to
                  </span>

                  <span
                    className="
                      block
                      truncate
                      text-sm
                      font-semibold
                      text-slate-800
                    "
                  >
                    {locationLabel}
                  </span>
                </span>
              </button>


              {/* =====================
                  XL NAVIGATION
              ====================== */}
              <nav
                className="
                  hidden
                  items-center
                  gap-1

                  xl:flex
                "

                aria-label="Main navigation"
              >
                {publicNavigation.map(
                  (item) => (
                    <NavLink
                      key={item.to}

                      to={item.to}

                      end={
                        item.to === "/"
                      }

                      className={({
                        isActive,
                      }) => `
                        relative

                        rounded-xl

                        px-3
                        py-2.5

                        text-sm
                        font-semibold

                        transition

                        ${
                          isActive
                            ? `
                              bg-orange-50
                              text-orange-600
                            `
                            : `
                              text-slate-600

                              hover:bg-white
                              hover:text-slate-950
                            `
                        }
                      `}
                    >
                      {item.label}
                    </NavLink>
                  )
                )}
              </nav>
            </div>


            {/* =====================
                RIGHT SIDE
            ====================== */}
            <div
              className="
                flex
                shrink-0
                items-center

                gap-1
                sm:gap-1.5
                lg:gap-2
              "
            >
              {/* =================================
                  XL FULL SEARCH
                  1280px+
              ================================== */}
              <form
                onSubmit={
                  handleSearchSubmit
                }

                className="
                  hidden

                  xl:block
                  xl:w-[280px]

                  2xl:w-[330px]
                "
              >
                <div
                  className="
                    group

                    flex
                    h-11
                    w-full
                    items-center

                    rounded-2xl

                    border
                    border-slate-200

                    bg-white

                    px-2.5

                    shadow-sm

                    transition-all
                    duration-300

                    hover:border-orange-200
                    hover:shadow-md

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

                    aria-hidden="true"
                  />


                  <input
                    type="search"

                    value={
                      searchQuery
                    }

                    onChange={(
                      event
                    ) => {
                      setSearchQuery(
                        event.target
                          .value
                      );
                    }}

                    placeholder="Search food or restaurant..."

                    aria-label="Search food or restaurant"

                    className="
                      min-w-0
                      flex-1

                      bg-transparent

                      px-2.5

                      text-sm
                      text-slate-900

                      outline-none

                      placeholder:text-slate-400
                    "
                  />


                  {searchQuery && (
                    <button
                      type="button"

                      onClick={() => {
                        setSearchQuery(
                          ""
                        );
                      }}

                      aria-label="Clear search"

                      className="
                        inline-flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center

                        rounded-lg

                        text-slate-400

                        transition

                        hover:bg-slate-100
                        hover:text-slate-700
                      "
                    >
                      <X
                        className="
                          h-3.5
                          w-3.5
                        "
                      />
                    </button>
                  )}


                  <button
                    type="submit"

                    disabled={
                      !searchQuery.trim()
                    }

                    aria-label="Search"

                    className="
                      ml-1

                      inline-flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center

                      rounded-xl

                      bg-slate-950

                      text-white

                      transition

                      hover:bg-orange-500

                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <Search
                      className="
                        h-3.5
                        w-3.5
                      "
                    />
                  </button>
                </div>
              </form>


              {/* =================================
                  MD / LG EXPANDABLE SEARCH
                  768px - 1279px
              ================================== */}
              <div
                ref={
                  mediumSearchRef
                }

                className="
                  relative

                  hidden
                  h-11
                  w-11

                  md:block
                  xl:hidden
                "
              >
                {/* SEARCH ICON */}
                <button
                  type="button"

                  onClick={() => {
                    setMediumSearchOpen(
                      true
                    );
                  }}

                  aria-label="Open search"

                  className={`
                    absolute
                    inset-0

                    inline-flex
                    h-11
                    w-11
                    items-center
                    justify-center

                    rounded-xl

                    text-slate-600

                    transition-all
                    duration-200

                    hover:bg-orange-50
                    hover:text-orange-600

                    ${
                      mediumSearchOpen
                        ? `
                          pointer-events-none
                          scale-90
                          opacity-0
                        `
                        : `
                          scale-100
                          opacity-100
                        `
                    }
                  `}
                >
                  <Search
                    className="
                      h-5
                      w-5
                    "
                  />
                </button>


                {/* EXPANDING INPUT */}
                <form
                  onSubmit={
                    handleSearchSubmit
                  }

                  className={`
                    absolute
                    right-0
                    top-0
                    z-50

                    flex
                    h-11
                    items-center

                    overflow-hidden

                    rounded-2xl

                    border
                    border-orange-200

                    bg-white

                    shadow-xl
                    shadow-slate-900/10

                    transition-all
                    duration-300
                    ease-out

                    md:w-[285px]
                    lg:w-[340px]

                    ${
                      mediumSearchOpen
                        ? `
                          visible
                          translate-x-0
                          scale-100
                          opacity-100
                        `
                        : `
                          invisible
                          pointer-events-none
                          translate-x-3
                          scale-95
                          opacity-0
                        `
                    }
                  `}
                >
                  <span
                    className="
                      flex
                      h-full
                      shrink-0
                      items-center

                      pl-3
                    "
                  >
                    <Search
                      className="
                        h-4
                        w-4
                        text-orange-500
                      "
                    />
                  </span>


                  <input
                    ref={
                      mediumSearchInputRef
                    }

                    type="search"

                    value={
                      searchQuery
                    }

                    onChange={(
                      event
                    ) => {
                      setSearchQuery(
                        event.target
                          .value
                      );
                    }}

                    placeholder="Search food or restaurant..."

                    aria-label="Search food or restaurant"

                    className="
                      min-w-0
                      flex-1

                      bg-transparent

                      px-2.5

                      text-sm
                      text-slate-900

                      outline-none

                      placeholder:text-slate-400
                    "
                  />


                  {/* CLEAR QUERY */}
                  {searchQuery && (
                    <button
                      type="button"

                      onClick={
                        handleClearSearch
                      }

                      aria-label="Clear search"

                      className="
                        inline-flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center

                        rounded-lg

                        text-slate-400

                        transition

                        hover:bg-slate-100
                        hover:text-slate-700
                      "
                    >
                      <X
                        className="
                          h-3.5
                          w-3.5
                        "
                      />
                    </button>
                  )}


                  {/* SUBMIT */}
                  <button
                    type="submit"

                    disabled={
                      !searchQuery.trim()
                    }

                    aria-label="Search"

                    className="
                      mr-1

                      inline-flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center

                      rounded-xl

                      bg-gradient-to-br
                      from-orange-500
                      to-rose-500

                      text-white

                      shadow-sm

                      transition

                      hover:scale-105

                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <Search
                      className="
                        h-3.5
                        w-3.5
                      "
                    />
                  </button>


                  {/* CLOSE SEARCH */}
                  <button
                    type="button"

                    onClick={() => {
                      setMediumSearchOpen(
                        false
                      );
                    }}

                    aria-label="Close search"

                    className="
                      mr-1

                      inline-flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center

                      rounded-xl

                      text-slate-400

                      transition

                      hover:bg-slate-100
                      hover:text-slate-800
                    "
                  >
                    <X
                      className="
                        h-4
                        w-4
                      "
                    />
                  </button>
                </form>
              </div>


              {/* =====================
                  CART
              ====================== */}
              <button
                type="button"

                onClick={() =>
                  navigate("/cart")
                }

                aria-label={
                  cartCount > 0
                    ? `Cart with ${cartCount} items`
                    : "Cart"
                }

                className="
                  relative

                  inline-flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  text-slate-600

                  transition

                  hover:bg-orange-50
                  hover:text-orange-600

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-orange-500/30
                "
              >
                <ShoppingBag
                  className="
                    h-5
                    w-5
                  "
                />


                {cartCount > 0 && (
                  <span
                    className="
                      absolute

                      -right-0.5
                      -top-0.5

                      flex
                      min-h-5
                      min-w-5
                      items-center
                      justify-center

                      rounded-full

                      bg-gradient-to-br
                      from-orange-500
                      to-rose-500

                      px-1

                      text-[10px]
                      font-bold
                      text-white

                      ring-2
                      ring-[#fffaf5]
                    "
                  >
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
                  </span>
                )}
              </button>


              {/* =====================
                  AUTH
              ====================== */}
              <div
                className="
                  hidden
                  lg:block
                "
              >
                {isAuthenticated ? (
                  <Dropdown
                    width="lg"

                    trigger={
                      <button
                        type="button"

                        className="
                          flex
                          min-h-11
                          items-center
                          gap-2

                          rounded-xl

                          px-1.5
                          py-1

                          transition

                          hover:bg-white
                          hover:shadow-sm
                        "
                      >
                        <Avatar
                          src={
                            user?.image ||
                            ""
                          }

                          name={
                            user?.name ||
                            ""
                          }

                          size="sm"
                        />


                        <span
                          className="
                            hidden
                            max-w-24
                            truncate

                            text-sm
                            font-semibold
                            text-slate-800

                            2xl:block
                          "
                        >
                          {user?.name}
                        </span>


                        <ChevronDown
                          className="
                            hidden
                            h-4
                            w-4
                            text-slate-400

                            2xl:block
                          "
                        />
                      </button>
                    }

                    header={
                      <div>
                        <p
                          className="
                            truncate

                            text-sm
                            font-semibold
                            text-slate-900
                          "
                        >
                          {user?.name}
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate

                            text-xs
                            text-slate-500
                          "
                        >
                          {user?.email}
                        </p>
                      </div>
                    }

                    items={[
                      {
                        key:
                          "profile",

                        label:
                          "My Profile",

                        icon:
                          User,

                        onClick:
                          () =>
                            navigate(
                              "/profile"
                            ),
                      },

                      {
                        key:
                          "addresses",

                        label:
                          "Saved Addresses",

                        icon:
                          MapPinned,

                        onClick:
                          () =>
                            navigate(
                              "/addresses"
                            ),
                      },

                      {
                        key:
                          "orders",

                        label:
                          "My Orders",

                        icon:
                          PackageOpen,

                        onClick:
                          () =>
                            navigate(
                              "/orders"
                            ),
                      },

                      {
                        type:
                          "separator",

                        key:
                          "logout-divider",
                      },

                      {
                        key:
                          "logout",

                        label:
                          "Logout",

                        icon:
                          LogOut,

                        danger:
                          true,

                        onClick:
                          handleLogout,
                      },
                    ]}
                  />
                ) : (
                  <div
                    className="
                      flex
                      items-center
                      gap-1
                    "
                  >
                    <Button
                      variant="ghost"

                      onClick={() =>
                        navigate(
                          "/login"
                        )
                      }
                    >
                      Login
                    </Button>

                    <Button
                      onClick={() =>
                        navigate(
                          "/register"
                        )
                      }
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>


              {/* =====================
                  MENU BUTTON
              ====================== */}
              <button
                type="button"

                onClick={() =>
                  setMobileMenuOpen(
                    true
                  )
                }

                aria-label="Open menu"

                className="
                  inline-flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  bg-slate-950

                  text-white

                  shadow-sm

                  transition

                  hover:bg-orange-600
                  hover:shadow-md

                  xl:hidden
                "
              >
                <Menu
                  className="
                    h-5
                    w-5
                  "
                />
              </button>
            </div>
          </div>


          {/* =================================
              MOBILE SEARCH
              BELOW MAIN NAVBAR
              < 768px
          ================================== */}
          <form
            onSubmit={
              handleSearchSubmit
            }

            className="
              pb-3

              md:hidden
            "
          >
            <div
              className="
                flex
                min-h-11
                w-full
                items-center

                rounded-2xl

                border
                border-orange-100

                bg-white

                px-2.5

                shadow-sm

                transition

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

                value={
                  searchQuery
                }

                onChange={(
                  event
                ) => {
                  setSearchQuery(
                    event.target
                      .value
                  );
                }}

                placeholder="Search food or restaurant..."

                aria-label="Search food or restaurant"

                className="
                  min-w-0
                  flex-1

                  bg-transparent

                  px-2.5

                  text-sm
                  text-slate-900

                  outline-none

                  placeholder:text-slate-400
                "
              />


              {searchQuery && (
                <button
                  type="button"

                  onClick={() => {
                    setSearchQuery(
                      ""
                    );
                  }}

                  aria-label="Clear search"

                  className="
                    mr-1

                    inline-flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center

                    rounded-lg

                    text-slate-400

                    hover:bg-slate-100
                    hover:text-slate-700
                  "
                >
                  <X
                    className="
                      h-3.5
                      w-3.5
                    "
                  />
                </button>
              )}


              <button
                type="submit"

                disabled={
                  !searchQuery.trim()
                }

                aria-label="Search"

                className="
                  inline-flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  bg-gradient-to-br
                  from-orange-500
                  to-rose-500

                  text-white

                  shadow-sm

                  transition

                  active:scale-95

                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <Search
                  className="
                    h-4
                    w-4
                  "
                />
              </button>
            </div>
          </form>
        </Container>
      </header>


      {/* =========================
          MOBILE / TABLET DRAWER
      ========================== */}
      <Drawer
        open={
          mobileMenuOpen
        }

        onClose={
          closeMobileMenu
        }

        title="Foodie"

        size="md"

        footer={
          !isAuthenticated ? (
            <div
              className="
                grid
                grid-cols-2
                gap-2
              "
            >
              <Button
                variant="outline"

                onClick={() =>
                  handleNavigate(
                    "/login"
                  )
                }
              >
                Login
              </Button>


              <Button
                onClick={() =>
                  handleNavigate(
                    "/register"
                  )
                }
              >
                Sign Up
              </Button>
            </div>
          ) : (
            <Button
              variant="danger"

              fullWidth

              leftIcon={
                LogOut
              }

              onClick={
                handleLogout
              }
            >
              Logout
            </Button>
          )
        }
      >
        <div className="p-4">

          {/* LOCATION */}
          <button
            type="button"

            className="
              mb-5

              flex
              w-full
              items-center
              gap-3

              rounded-2xl

              bg-gradient-to-r
              from-orange-50
              to-rose-50

              p-3.5

              text-left
            "
          >
            <span
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-xl

                bg-white

                text-orange-600

                shadow-sm
              "
            >
              <MapPin
                className="
                  h-5
                  w-5
                "
              />
            </span>


            <span
              className="
                min-w-0
              "
            >
              <span
                className="
                  block

                  text-xs
                  font-medium
                  text-slate-500
                "
              >
                Deliver to
              </span>

              <span
                className="
                  block
                  truncate

                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                {locationLabel}
              </span>
            </span>
          </button>


          {/* USER */}
          {isAuthenticated && (
            <div
              className="
                mb-5

                flex
                items-center
                gap-3

                rounded-2xl

                border
                border-slate-100

                bg-white

                p-3

                shadow-sm
              "
            >
              <Avatar
                src={
                  user?.image ||
                  ""
                }

                name={
                  user?.name ||
                  ""
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
                    font-semibold
                    text-slate-900
                  "
                >
                  {user?.name}
                </p>

                <p
                  className="
                    truncate

                    text-xs
                    text-slate-500
                  "
                >
                  {user?.email}
                </p>
              </div>
            </div>
          )}


          {/* =====================
              NAVIGATION
          ====================== */}
          <nav
            className="
              space-y-1
            "
          >
            {publicNavigation.map(
              (item) => (
                <NavLink
                  key={
                    item.to
                  }

                  to={
                    item.to
                  }

                  end={
                    item.to ===
                    "/"
                  }

                  onClick={
                    closeMobileMenu
                  }

                  className={({
                    isActive,
                  }) => `
                    flex
                    min-h-11
                    items-center

                    rounded-xl

                    px-3.5

                    text-sm
                    font-semibold

                    transition

                    ${
                      isActive
                        ? `
                          bg-orange-50
                          text-orange-600
                        `
                        : `
                          text-slate-700

                          hover:bg-slate-50
                        `
                    }
                  `}
                >
                  {
                    item.label
                  }
                </NavLink>
              )
            )}


            {/* CART */}
            <button
              type="button"

              onClick={() =>
                handleNavigate(
                  "/cart"
                )
              }

              className="
                flex
                min-h-11
                w-full
                items-center
                justify-between

                rounded-xl

                px-3.5

                text-sm
                font-semibold
                text-slate-700

                transition

                hover:bg-slate-50
              "
            >
              <span
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <ShoppingBag
                  className="
                    h-4
                    w-4
                  "
                />

                Cart
              </span>


              {cartCount > 0 && (
                <span
                  className="
                    rounded-full

                    bg-orange-100

                    px-2
                    py-0.5

                    text-xs
                    font-bold
                    text-orange-700
                  "
                >
                  {cartCount}
                </span>
              )}
            </button>


            {/* AUTHENTICATED NAV */}
            {isAuthenticated && (
              <>
                <button
                  type="button"

                  onClick={() =>
                    handleNavigate(
                      "/profile"
                    )
                  }

                  className="
                    flex
                    min-h-11
                    w-full
                    items-center
                    gap-3

                    rounded-xl

                    px-3.5

                    text-sm
                    font-semibold
                    text-slate-700

                    transition

                    hover:bg-slate-50
                  "
                >
                  <User
                    className="
                      h-4
                      w-4
                    "
                  />

                  My Profile
                </button>


                <button
                  type="button"

                  onClick={() =>
                    handleNavigate(
                      "/addresses"
                    )
                  }

                  className="
                    flex
                    min-h-11
                    w-full
                    items-center
                    gap-3

                    rounded-xl

                    px-3.5

                    text-sm
                    font-semibold
                    text-slate-700

                    transition

                    hover:bg-slate-50
                  "
                >
                  <MapPinned
                    className="
                      h-4
                      w-4
                    "
                  />

                  Saved Addresses
                </button>
              </>
            )}
          </nav>
        </div>
      </Drawer>
    </>
  );
};


export default PublicNavbar;