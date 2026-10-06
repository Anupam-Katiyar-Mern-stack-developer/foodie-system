import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  Store,
} from "lucide-react";

import Avatar from "../../common/Avatar/Avatar";


const RestaurantNavbar = ({
  onMenuOpen,
}) => {
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
      {/* TOP ACCENT */}

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
        {/* =====================
            LEFT
        ====================== */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          <button
            type="button"
            onClick={onMenuOpen}
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
              Foodie Kitchen
            </h2>
          </div>
        </div>


        {/* =====================
            SEARCH
        ====================== */}

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


        {/* =====================
            RIGHT
        ====================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
          "
        >
          {/* STATUS */}

          <div
            className="
              hidden
              items-center
              gap-2

              rounded-xl

              border
              border-emerald-200

              bg-emerald-50

              px-3
              py-2

              lg:flex
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
                text-xs
                font-black
                text-emerald-700
              "
            >
              Open
            </span>
          </div>


          {/* NOTIFICATION */}

          <button
            type="button"
            aria-label="Notifications"
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

            <span
              className="
                absolute
                right-2.5
                top-2.5

                h-2
                w-2

                rounded-full

                bg-rose-500

                ring-2
                ring-[#fffaf5]
              "
            />
          </button>


          {/* PROFILE */}

          <button
            type="button"
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
              src=""
              name="Foodie Kitchen"
              size="sm"
            />


            <div
              className="
                hidden
                max-w-[130px]
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
                Foodie Kitchen
              </p>

              <p
                className="
                  mt-0.5

                  text-[10px]
                  text-slate-400
                "
              >
                Restaurant
              </p>
            </div>


            <ChevronDown
              className="
                hidden
                h-4
                w-4
                text-slate-400

                xl:block
              "
            />
          </button>
        </div>
      </div>
    </header>
  );
};


export default RestaurantNavbar;