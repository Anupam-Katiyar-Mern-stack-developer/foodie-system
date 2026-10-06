import {
    LayoutDashboard,
    ShoppingBag,
    Utensils,
    Layers3,
    Store,
    Clock3,
    LogOut,
    ChefHat,
    X,
} from "lucide-react";

import {
    NavLink,
} from "react-router-dom";


const restaurantNavigation = [
    {
        label: "Dashboard",
        to: "/restaurant/dashboard",
        icon: LayoutDashboard,
    },

    {
        label: "Orders",
        to: "/restaurant/orders",
        icon: ShoppingBag,
    },

    {
        label: "Foods",
        to: "/restaurant/foods",
        icon: Utensils,
    },

    {
        label: "Categories",
        to: "/restaurant/categories",
        icon: Layers3,
    },

    {
        label: "Profile",
        to: "/restaurant/profile",
        icon: Store,
    },

    {
        label: "Business Hours",
        to: "/restaurant/business-hours",
        icon: Clock3,
    },
];


const RestaurantSidebar = ({
    open = false,
    onClose,
    onLogout,
}) => {
    return (
        <>
            {/* =========================
          MOBILE OVERLAY
      ========================== */}

            {open && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={onClose}
                    className="
            fixed
            inset-0
            z-40

            bg-slate-950/40
            backdrop-blur-sm

            lg:hidden
          "
                />
            )}


            {/* =========================
          SIDEBAR
      ========================== */}

            <aside
                className={`
          fixed
          left-0
          top-0
          z-50

          flex
          h-screen
          w-[280px]
          flex-col

          border-r
          border-orange-100

          bg-white

          shadow-xl
          shadow-slate-900/5

          transition-transform
          duration-300

          lg:translate-x-0
          lg:shadow-none

          ${open
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
        `}
            >
                {/* =====================
            LOGO
        ====================== */}

                <div
                    className="
            flex
            min-h-[76px]
            items-center
            justify-between

            border-b
            border-slate-100

            px-5
          "
                >
                    <div
                        className="
              flex
              items-center
              gap-3
            "
                    >
                        <div
                            className="
                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-2xl

                bg-gradient-to-br
                from-orange-500
                to-rose-500

                text-white

                shadow-lg
                shadow-orange-500/20
              "
                        >
                            <ChefHat
                                className="
                  h-6
                  w-6
                "
                            />
                        </div>


                        <div>
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
                  tracking-[0.2em]
                  text-slate-400
                "
                            >
                                Restaurant Panel
                            </p>
                        </div>
                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
              inline-flex
              h-9
              w-9
              items-center
              justify-center

              rounded-xl

              text-slate-500

              transition

              hover:bg-slate-100
              hover:text-slate-900

              lg:hidden
            "
                    >
                        <X
                            className="
                h-5
                w-5
              "
                        />
                    </button>
                </div>


                {/* =====================
            RESTAURANT INFO
        ====================== */}

                <div
                    className="
            px-4
            pb-3
            pt-5
          "
                >
                    <div
                        className="
              rounded-2xl

              border
              border-orange-100

              bg-gradient-to-br
              from-orange-50
              to-rose-50

              p-3.5
            "
                    >
                        <div
                            className="
                flex
                items-center
                gap-3
              "
                        >
                            <div
                                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  bg-white

                  text-orange-600

                  shadow-sm
                "
                            >
                                <Store
                                    className="
                    h-5
                    w-5
                  "
                                />
                            </div>


                            <div
                                className="
                  min-w-0
                  flex-1
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
                                    Foodie Kitchen
                                </p>

                                <div
                                    className="
                    mt-1
                    flex
                    items-center
                    gap-1.5
                  "
                                >
                                    <span
                                        className="
                      h-2
                      w-2

                      rounded-full

                      bg-emerald-500
                    "
                                    />

                                    <span
                                        className="
                      text-[11px]
                      font-semibold
                      text-emerald-700
                    "
                                    >
                                        Open
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* =====================
            NAVIGATION
        ====================== */}

                <nav
                    className="
            flex-1

            space-y-1

            overflow-y-auto

            px-3
            py-3
          "
                >
                    <p
                        className="
              mb-2
              px-3

              text-[10px]
              font-black
              uppercase
              tracking-[0.16em]
              text-slate-400
            "
                    >
                        Management
                    </p>


                    {restaurantNavigation.map(
                        (item) => {
                            const Icon =
                                item.icon;

                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={onClose}
                                    className={({
                                        isActive,
                                    }) => `
                    flex
                    min-h-12
                    items-center
                    gap-3

                    rounded-xl

                    px-3.5

                    text-sm
                    font-bold

                    transition-all

                    ${isActive
                                            ? `
                          bg-gradient-to-r
                          from-orange-500
                          to-rose-500

                          text-white

                          shadow-md
                          shadow-orange-500/15
                        `
                                            : `
                          text-slate-600

                          hover:bg-orange-50
                          hover:text-orange-600
                        `
                                        }
                  `}
                                >
                                    <Icon
                                        className="
                      h-5
                      w-5
                      shrink-0
                    "
                                    />

                                    <span>
                                        {item.label}
                                    </span>
                                </NavLink>
                            );
                        }
                    )}
                </nav>


                {/* =====================
            LOGOUT
        ====================== */}

                <div
                    className="
            border-t
            border-slate-100

            p-3
          "
                >
                    <button
                        type="button"
                        onClick={onLogout}
                        className="
              flex
              min-h-12
              w-full
              items-center
              gap-3

              rounded-xl

              px-3.5

              text-sm
              font-bold
              text-rose-600

              transition

              hover:bg-rose-50
            "
                    >
                        <LogOut
                            className="
                h-5
                w-5
              "
                        />

                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};


export default RestaurantSidebar;