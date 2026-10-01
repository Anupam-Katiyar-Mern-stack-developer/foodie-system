import {
    Link,
} from "react-router-dom";

import {
    FaArrowRight,
    FaMapMarkerAlt,
    FaStore,
} from "react-icons/fa";

import OptimizedImage from "../../common/OptimizedImage/OptimizedImage";


const RestaurantCard = ({
    restaurant,
}) => {
    if (!restaurant) {
        return null;
    }


    const {
        slug,
        restaurantName,
        description,
        image,
        addressLine,
        city,
        isOpen,
    } = restaurant;


    return (
        <Link
            to={`/restaurants/${slug}`}

            className="
        group
        block
        h-full

        rounded-[1.75rem]

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-orange-500/40
        focus-visible:ring-offset-2
      "
        >
            <article
                className="
          flex
          h-full
          flex-col

          overflow-hidden

          rounded-[1.75rem]

          border
          border-slate-200/80

          bg-white

          shadow-sm

          transition
          duration-300

          group-hover:-translate-y-1
          group-hover:border-orange-200
          group-hover:shadow-xl
          group-hover:shadow-orange-900/10
        "
            >
                {/* =====================
            IMAGE
        ====================== */}

                <div
                    className="
            relative

            aspect-[16/11]

            overflow-hidden

            bg-slate-100
          "
                >
                    <OptimizedImage
                        src={image}

                        alt={restaurantName}

                        aspectRatio="aspect-[16/11]"

                        rounded="rounded-none"

                        className="
              transition
              duration-500

              group-hover:scale-105
            "
                    />


                    {/* OVERLAY */}

                    <div
                        className="
              pointer-events-none

              absolute
              inset-0

              bg-gradient-to-t

              from-slate-950/40
              via-transparent
              to-transparent
            "
                    />


                    {/* STATUS */}

                    <span
                        className={`
              absolute
              left-3
              top-3

              inline-flex
              items-center
              gap-1.5

              rounded-full

              border

              px-2.5
              py-1.5

              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.1em]

              shadow-sm
              backdrop-blur-md

              ${isOpen
                                ? `
                    border-emerald-200
                    bg-emerald-50/95
                    text-emerald-700
                  `
                                : `
                    border-rose-200
                    bg-rose-50/95
                    text-rose-700
                  `
                            }
            `}
                    >
                        <span
                            className={`
                h-1.5
                w-1.5

                rounded-full

                ${isOpen
                                    ? "bg-emerald-500"
                                    : "bg-rose-500"
                                }
              `}
                        />

                        {isOpen
                            ? "Open"
                            : "Closed"}
                    </span>


                    {/* STORE ICON */}

                    <span
                        className="
              absolute
              bottom-3
              right-3

              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-xl

              border
              border-white/50

              bg-white/90

              text-orange-500

              shadow-lg
              backdrop-blur-md

              transition
              duration-300

              group-hover:bg-orange-500
              group-hover:text-white
            "
                    >
                        <FaStore
                            className="
                h-4
                w-4
              "
                        />
                    </span>
                </div>


                {/* =====================
            CONTENT
        ====================== */}

                <div
                    className="
            flex
            flex-1
            flex-col

            p-4

            sm:p-5
          "
                >
                    {/* TITLE */}

                    <div
                        className="
              flex
              items-start
              justify-between
              gap-3
            "
                    >
                        <div className="min-w-0">
                            <h3
                                className="
                  truncate

                  text-lg
                  font-black
                  tracking-tight
                  text-slate-950

                  transition

                  group-hover:text-orange-600

                  sm:text-xl
                "
                            >
                                {restaurantName}
                            </h3>


                            {/* LOCATION */}

                            <div
                                className="
                  mt-2

                  flex
                  min-w-0
                  items-center
                  gap-2

                  text-xs
                  text-slate-500

                  sm:text-sm
                "
                            >
                                <FaMapMarkerAlt
                                    className="
                    h-3.5
                    w-3.5
                    shrink-0

                    text-orange-500
                  "
                                />

                                <span
                                    className="
                    truncate
                  "
                                >
                                    {addressLine}

                                    {addressLine &&
                                        city &&
                                        ", "}

                                    {city}
                                </span>
                            </div>
                        </div>
                    </div>


                    {/* DESCRIPTION */}

                    {description && (
                        <p
                            className="
                mt-4

                line-clamp-2

                text-sm
                leading-6
                text-slate-500
              "
                        >
                            {description}
                        </p>
                    )}


                    {/* FOOTER */}

                    <div
                        className="
              mt-auto
              pt-5
            "
                    >
                        <div
                            className="
                flex
                items-center
                justify-between

                border-t
                border-slate-100

                pt-4
              "
                        >
                            <span
                                className="
                  text-xs
                  font-semibold
                  text-slate-400
                "
                            >
                                View menu
                            </span>


                            <span
                                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center

                  rounded-xl

                  bg-orange-50

                  text-orange-600

                  transition
                  duration-300

                  group-hover:bg-orange-500
                  group-hover:text-white
                "
                            >
                                <FaArrowRight
                                    className="
                    h-3
                    w-3
                  "
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
};


export default RestaurantCard;