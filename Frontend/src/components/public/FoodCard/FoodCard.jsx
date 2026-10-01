import {
    Link,
} from "react-router-dom";

import {
    FaClock,
    FaLeaf,
    FaPlus,
    FaUtensils,
} from "react-icons/fa";

import OptimizedImage from "../../common/OptimizedImage/OptimizedImage";


const FoodCard = ({
    food,

    onAddToCart,
}) => {
    if (!food) {
        return null;
    }


    const {
        slug,
        name,
        description,
        image,
        price,
        discountPrice,
        preparationTime,
        isVeg,
        isAvailable,
    } = food;


    const hasDiscount =
        discountPrice &&
        Number(discountPrice) <
        Number(price);


    const displayPrice =
        hasDiscount
            ? discountPrice
            : price;


    const formatPrice = (
        amount
    ) => {
        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(amount || 0);
    };


    const handleAddToCart = (
        event
    ) => {
        /*
          Card click se route open na ho
          jab Add button press karein.
        */
        event.preventDefault();

        event.stopPropagation();


        if (!isAvailable) {
            return;
        }


        onAddToCart?.(food);
    };


    return (
        <Link
            to={`/foods/${slug}`}

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
          group-hover:shadow-orange-950/10
        "
            >
                {/* =====================
            IMAGE
        ====================== */}

                <div
                    className="
            relative

            aspect-[4/3]

            overflow-hidden

            bg-orange-50
          "
                >
                    <OptimizedImage
                        src={image}

                        alt={name}

                        aspectRatio="aspect-[4/3]"

                        rounded="rounded-none"

                        className="
              transition
              duration-500

              group-hover:scale-105
            "
                    />


                    {/* IMAGE GRADIENT */}

                    <div
                        className="
              pointer-events-none

              absolute
              inset-0

              bg-gradient-to-t
              from-slate-950/25
              via-transparent
              to-transparent
            "
                    />


                    {/* VEG / NON VEG */}

                    <span
                        className="
              absolute
              left-3
              top-3

              inline-flex
              items-center
              gap-1.5

              rounded-full

              border
              border-white/70

              bg-white/90

              px-2.5
              py-1.5

              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.08em]

              shadow-sm
              backdrop-blur-md
            "
                    >
                        <span
                            className={`
                flex
                h-4
                w-4
                items-center
                justify-center

                rounded

                border

                ${isVeg
                                    ? `
                      border-emerald-500
                      text-emerald-600
                    `
                                    : `
                      border-rose-500
                      text-rose-600
                    `
                                }
              `}
                        >
                            <span
                                className={`
                  h-1.5
                  w-1.5

                  rounded-full

                  ${isVeg
                                        ? "bg-emerald-500"
                                        : "bg-rose-500"
                                    }
                `}
                            />
                        </span>

                        {isVeg
                            ? "Veg"
                            : "Non Veg"}
                    </span>


                    {/* AVAILABILITY */}

                    {!isAvailable && (
                        <span
                            className="
                absolute
                right-3
                top-3

                rounded-full

                bg-slate-950/90

                px-3
                py-1.5

                text-[10px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-white

                backdrop-blur
              "
                        >
                            Unavailable
                        </span>
                    )}


                    {/* PREPARATION TIME */}

                    {preparationTime && (
                        <span
                            className="
                absolute
                bottom-3
                left-3

                inline-flex
                items-center
                gap-1.5

                rounded-xl

                bg-white/90

                px-2.5
                py-1.5

                text-xs
                font-bold
                text-slate-700

                shadow-sm
                backdrop-blur-md
              "
                        >
                            <FaClock
                                className="
                  h-3
                  w-3

                  text-orange-500
                "
                            />

                            {preparationTime} min
                        </span>
                    )}
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
                    {/* NAME */}

                    <div
                        className="
              flex
              items-start
              gap-3
            "
                    >
                        <div
                            className="
                min-w-0
                flex-1
              "
                        >
                            <h3
                                className="
                  line-clamp-1

                  text-lg
                  font-black
                  tracking-tight
                  text-slate-950

                  transition

                  group-hover:text-orange-600
                "
                            >
                                {name}
                            </h3>


                            {description && (
                                <p
                                    className="
                    mt-2

                    line-clamp-2

                    text-sm
                    leading-6
                    text-slate-500
                  "
                                >
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>


                    {/* =====================
              PRICE + CART
          ====================== */}

                    <div
                        className="
              mt-auto
              pt-5
            "
                    >
                        <div
                            className="
                flex
                items-end
                justify-between
                gap-3

                border-t
                border-slate-100

                pt-4
              "
                        >
                            {/* PRICE */}

                            <div>
                                <p
                                    className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-slate-400
                  "
                                >
                                    Price
                                </p>


                                <div
                                    className="
                    mt-1

                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                                >
                                    <span
                                        className="
                      text-lg
                      font-black
                      text-slate-950
                    "
                                    >
                                        {formatPrice(
                                            displayPrice
                                        )}
                                    </span>


                                    {hasDiscount && (
                                        <span
                                            className="
                        text-xs
                        font-semibold
                        text-slate-400

                        line-through
                      "
                                        >
                                            {formatPrice(
                                                price
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>


                            {/* ADD BUTTON */}

                            <button
                                type="button"

                                onClick={
                                    handleAddToCart
                                }

                                disabled={
                                    !isAvailable
                                }

                                aria-label={
                                    isAvailable
                                        ? `Add ${name} to cart`
                                        : `${name} unavailable`
                                }

                                className="
                  inline-flex
                  h-11
                  min-w-11
                  shrink-0
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  bg-slate-950

                  px-3.5

                  text-xs
                  font-bold
                  text-white

                  shadow-sm

                  transition
                  duration-200

                  hover:bg-orange-500
                  hover:shadow-md

                  active:scale-95

                  disabled:cursor-not-allowed
                  disabled:bg-slate-200
                  disabled:text-slate-400
                  disabled:shadow-none
                "
                            >
                                <FaPlus
                                    className="
                    h-3
                    w-3
                  "
                                />

                                <span
                                    className="
                    hidden
                    sm:inline
                  "
                                >
                                    Add
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
};


export default FoodCard;