import {
    FaMinus,
    FaPlus,
    FaTrash,
} from "react-icons/fa";

import OptimizedImage from "../../common/OptimizedImage/OptimizedImage";


const CartItem = ({
    item,

    onIncrease,

    onDecrease,

    onRemove,

    updating = false,

    deleting = false,
}) => {
    if (!item) {
        return null;
    }


    const {
        name,
        image,
        price,
        discountPrice,
        quantity,
        isAvailable,
    } = item;


    const hasDiscount =
        discountPrice &&
        Number(discountPrice) <
        Number(price);


    const unitPrice =
        hasDiscount
            ? Number(discountPrice)
            : Number(price);


    const totalPrice =
        unitPrice *
        Number(quantity);


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


    return (
        <div
            className="
        flex
        gap-3

        border-b
        border-slate-100

        py-4

        last:border-b-0

        sm:gap-4
        sm:py-5
      "
        >
            {/* IMAGE */}

            <div
                className="
          h-20
          w-20
          shrink-0

          overflow-hidden

          rounded-2xl

          bg-orange-50

          sm:h-24
          sm:w-24
        "
            >
                <OptimizedImage
                    src={image}

                    alt={name}

                    rounded="rounded-2xl"

                    className="
            h-full
            w-full
            object-cover
          "
                />
            </div>


            {/* CONTENT */}

            <div
                className="
          min-w-0
          flex-1
        "
            >
                <div
                    className="
            flex
            items-start
            justify-between
            gap-3
          "
                >
                    <div
                        className="
              min-w-0
            "
                    >
                        <h3
                            className="
                line-clamp-2

                text-sm
                font-black
                text-slate-950

                sm:text-base
              "
                        >
                            {name}
                        </h3>


                        {!isAvailable && (
                            <span
                                className="
                  mt-1.5

                  inline-flex

                  rounded-full

                  bg-rose-50

                  px-2
                  py-1

                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-rose-600
                "
                            >
                                Unavailable
                            </span>
                        )}


                        <div
                            className="
                mt-2

                flex
                flex-wrap
                items-center
                gap-2
              "
                        >
                            <span
                                className="
                  text-sm
                  font-black
                  text-slate-900
                "
                            >
                                {formatPrice(
                                    unitPrice
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


                    {/* REMOVE */}

                    <button
                        type="button"

                        onClick={
                            onRemove
                        }

                        disabled={
                            deleting
                        }

                        aria-label={`Remove ${name}`}

                        className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center

              rounded-xl

              text-slate-400

              transition

              hover:bg-rose-50
              hover:text-rose-600

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
                    >
                        <FaTrash
                            className="
                h-3.5
                w-3.5
              "
                        />
                    </button>
                </div>


                {/* BOTTOM */}

                <div
                    className="
            mt-4

            flex
            flex-wrap
            items-center
            justify-between
            gap-3
          "
                >
                    {/* QUANTITY */}

                    <div
                        className="
              inline-flex
              items-center

              rounded-xl

              border
              border-slate-200

              bg-white

              p-1
            "
                    >
                        <button
                            type="button"

                            onClick={
                                onDecrease
                            }

                            disabled={
                                quantity <= 1 ||
                                updating
                            }

                            aria-label={`Decrease ${name} quantity`}

                            className="
                flex
                h-8
                w-8
                items-center
                justify-center

                rounded-lg

                text-slate-600

                transition

                hover:bg-orange-50
                hover:text-orange-600

                disabled:cursor-not-allowed
                disabled:opacity-30
              "
                        >
                            <FaMinus
                                className="
                  h-2.5
                  w-2.5
                "
                            />
                        </button>


                        <span
                            className="
                min-w-8

                text-center

                text-sm
                font-black
                text-slate-900
              "
                        >
                            {quantity}
                        </span>


                        <button
                            type="button"

                            onClick={
                                onIncrease
                            }

                            disabled={
                                updating ||
                                !isAvailable
                            }

                            aria-label={`Increase ${name} quantity`}

                            className="
                flex
                h-8
                w-8
                items-center
                justify-center

                rounded-lg

                text-slate-600

                transition

                hover:bg-orange-50
                hover:text-orange-600

                disabled:cursor-not-allowed
                disabled:opacity-30
              "
                        >
                            <FaPlus
                                className="
                  h-2.5
                  w-2.5
                "
                            />
                        </button>
                    </div>


                    {/* ITEM TOTAL */}

                    <div
                        className="
              text-right
            "
                    >
                        <p
                            className="
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-slate-400
              "
                        >
                            Total
                        </p>

                        <p
                            className="
                mt-0.5

                text-base
                font-black
                text-slate-950
              "
                        >
                            {formatPrice(
                                totalPrice
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CartItem;