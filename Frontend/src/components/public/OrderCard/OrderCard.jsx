import {
    Link,
} from "react-router-dom";

import {
    FaArrowRight,
    FaCalendarAlt,
    FaReceipt,
    FaStore,
    FaUtensils,
} from "react-icons/fa";

import {
    getOrderStatusConfig,
} from "../../../constants/orderStatus";


const OrderCard = ({
    order,
}) => {
    if (!order) {
        return null;
    }


    const statusConfig =
        getOrderStatusConfig(
            order.status
        );


    const itemCount =
        order.items?.reduce(
            (
                total,
                item
            ) =>
                total +
                Number(
                    item.quantity || 0
                ),

            0
        ) || 0;


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


    const formatDate = (
        value
    ) => {
        if (!value) {
            return "";
        }


        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "2-digit",

                month: "short",

                year: "numeric",

                hour: "2-digit",

                minute: "2-digit",
            }
        ).format(
            new Date(value)
        );
    };


    return (
        <article
            className="
        overflow-hidden

        rounded-[1.75rem]

        border
        border-slate-200

        bg-white

        shadow-sm

        transition
        duration-300

        hover:-translate-y-0.5
        hover:shadow-lg
        hover:shadow-slate-950/5
      "
        >
            {/* =====================
          TOP
      ====================== */}

            <div
                className="
          flex
          flex-col
          gap-4

          border-b
          border-slate-100

          bg-slate-50/60

          p-4

          sm:flex-row
          sm:items-center
          sm:justify-between

          sm:p-5
        "
            >
                <div
                    className="
            flex
            min-w-0
            items-center
            gap-3
          "
                >
                    <span
                        className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center

              rounded-2xl

              bg-orange-100

              text-orange-600
            "
                    >
                        <FaReceipt />
                    </span>


                    <div
                        className="
              min-w-0
            "
                    >
                        <p
                            className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.12em]
                text-slate-400
              "
                        >
                            Order Number
                        </p>

                        <p
                            className="
                mt-1

                truncate

                text-sm
                font-black
                text-slate-950

                sm:text-base
              "
                        >
                            {order.orderNumber}
                        </p>
                    </div>
                </div>


                {/* STATUS */}

                <span
                    className={`
            inline-flex
            w-fit
            items-center

            rounded-full

            border

            px-3
            py-1.5

            text-[10px]
            font-black
            uppercase
            tracking-wide

            ${statusConfig.className}
          `}
                >
                    {statusConfig.label}
                </span>
            </div>


            {/* =====================
          BODY
      ====================== */}

            <div
                className="
          p-4

          sm:p-5
        "
            >
                {/* RESTAURANT */}

                <Link
                    to={`/restaurants/${order.restaurantSlug}`}

                    className="
            group

            inline-flex
            items-center
            gap-2

            text-sm
            font-black
            text-slate-900

            transition

            hover:text-orange-600
          "
                >
                    <FaStore
                        className="
              shrink-0
              text-orange-500
            "
                    />

                    <span
                        className="
              truncate
            "
                    >
                        {
                            order.restaurantName
                        }
                    </span>
                </Link>


                {/* META */}

                <div
                    className="
            mt-4

            grid
            gap-3

            sm:grid-cols-2
          "
                >
                    {/* ITEMS */}

                    <div
                        className="
              flex
              items-center
              gap-2

              text-xs
              text-slate-500
            "
                    >
                        <FaUtensils
                            className="
                shrink-0
                text-slate-400
              "
                        />

                        <span>
                            <strong
                                className="
                  text-slate-800
                "
                            >
                                {itemCount}
                            </strong>{" "}
                            item
                            {itemCount !== 1
                                ? "s"
                                : ""}
                        </span>
                    </div>


                    {/* DATE */}

                    <div
                        className="
              flex
              items-center
              gap-2

              text-xs
              text-slate-500
            "
                    >
                        <FaCalendarAlt
                            className="
                shrink-0
                text-slate-400
              "
                        />

                        <span>
                            {formatDate(
                                order.createdAt
                            )}
                        </span>
                    </div>
                </div>


                {/* ITEM NAMES */}

                {order.items?.length >
                    0 && (
                        <div
                            className="
              mt-4

              rounded-2xl

              bg-slate-50

              p-3.5
            "
                        >
                            <p
                                className="
                line-clamp-2

                text-xs
                leading-5
                text-slate-500
              "
                            >
                                {order.items
                                    .map(
                                        (item) =>
                                            `${item.name} × ${item.quantity}`
                                    )
                                    .join(", ")}
                            </p>
                        </div>
                    )}


                {/* BOTTOM */}

                <div
                    className="
            mt-5

            flex
            items-end
            justify-between
            gap-4

            border-t
            border-slate-100

            pt-4
          "
                >
                    {/* TOTAL */}

                    <div>
                        <p
                            className="
                text-[10px]
                font-black
                uppercase
                tracking-wide
                text-slate-400
              "
                        >
                            Order Total
                        </p>

                        <p
                            className="
                mt-1

                text-xl
                font-black
                text-slate-950
              "
                        >
                            {formatPrice(
                                order.total
                            )}
                        </p>
                    </div>


                    {/* VIEW */}

                    <Link
                        to={`/orders/${order.orderNumber}`}

                        className="
              inline-flex
              min-h-11
              items-center
              justify-center
              gap-2

              rounded-xl

              bg-slate-950

              px-4

              text-xs
              font-black
              text-white

              transition

              hover:bg-orange-500
            "
                    >
                        View Order

                        <FaArrowRight
                            className="
                h-3
                w-3
              "
                        />
                    </Link>
                </div>
            </div>
        </article>
    );
};


export default OrderCard;