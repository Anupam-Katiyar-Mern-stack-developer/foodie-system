import {
    useMemo,
    useState,
} from "react";

import {
    useSelector,
} from "react-redux";

import {
    FaBoxOpen,
    FaSearch,
    FaShoppingBag,
    FaTimes,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";

import OrderCard from "../../../components/public/OrderCard/OrderCard";

import {
    ACTIVE_ORDER_STATUSES,
    ORDER_STATUS,
} from "../../../constants/orderStatus";


const Orders = () => {
    // =========================
    // REDUX
    // =========================

    const {
        orders,
        fetchLoading,
        error,
    } = useSelector(
        (state) =>
            state.publicOrder
    );


    // =========================
    // UI STATE
    // =========================

    const [
        activeFilter,
        setActiveFilter,
    ] = useState("all");


    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");


    // =========================
    // FILTER
    // =========================

    const filteredOrders =
        useMemo(() => {
            const search =
                searchTerm
                    .trim()
                    .toLowerCase();


            return orders.filter(
                (order) => {
                    const matchesSearch =
                        !search ||
                        order.orderNumber
                            ?.toLowerCase()
                            .includes(search) ||
                        order.restaurantName
                            ?.toLowerCase()
                            .includes(search);


                    let matchesStatus =
                        true;


                    if (
                        activeFilter ===
                        "active"
                    ) {
                        matchesStatus =
                            ACTIVE_ORDER_STATUSES.includes(
                                order.status
                            );
                    }


                    if (
                        activeFilter ===
                        "delivered"
                    ) {
                        matchesStatus =
                            order.status ===
                            ORDER_STATUS.DELIVERED;
                    }


                    if (
                        activeFilter ===
                        "cancelled"
                    ) {
                        matchesStatus =
                            order.status ===
                            ORDER_STATUS.CANCELLED;
                    }


                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            orders,
            searchTerm,
            activeFilter,
        ]);


    const activeCount =
        orders.filter(
            (order) =>
                ACTIVE_ORDER_STATUSES.includes(
                    order.status
                )
        ).length;


    const deliveredCount =
        orders.filter(
            (order) =>
                order.status ===
                ORDER_STATUS.DELIVERED
        ).length;


    const cancelledCount =
        orders.filter(
            (order) =>
                order.status ===
                ORDER_STATUS.CANCELLED
        ).length;


    const clearFilters = () => {
        setSearchTerm("");

        setActiveFilter(
            "all"
        );
    };


    const hasFilters =
        Boolean(
            searchTerm.trim()
        ) ||
        activeFilter !==
        "all";


    return (
        <div
            className="
        min-h-screen
        bg-[#fffaf5]
      "
        >
            {/* =========================
          HEADER
      ========================== */}

            <section
                className="
          relative
          overflow-hidden

          border-b
          border-orange-100

          bg-white
        "
            >
                <div
                    className="
            pointer-events-none

            absolute
            -left-28
            top-0

            h-64
            w-64

            rounded-full

            bg-orange-300/15

            blur-[90px]
          "
                />


                <Container>
                    <div
                        className="
              relative
              z-10

              py-10

              sm:py-12

              lg:py-14
            "
                    >
                        <div
                            className="
                inline-flex
                items-center
                gap-2

                rounded-full

                border
                border-orange-200

                bg-orange-50

                px-3
                py-1.5

                text-xs
                font-black
                uppercase
                tracking-[0.14em]
                text-orange-600
              "
                        >
                            <FaShoppingBag />

                            Order history
                        </div>


                        <h1
                            className="
                mt-4

                text-3xl
                font-black
                tracking-tight
                text-slate-950

                sm:text-4xl
              "
                        >
                            My
                            <span
                                className="
                  text-orange-500
                "
                            >
                                {" "}
                                Orders
                            </span>
                        </h1>


                        <p
                            className="
                mt-2

                max-w-xl

                text-sm
                leading-6
                text-slate-500

                sm:text-base
              "
                        >
                            Track active orders and
                            view your previous Foodie
                            orders.
                        </p>
                    </div>
                </Container>
            </section>


            {/* =========================
          CONTENT
      ========================== */}

            <section
                className="
          py-8

          sm:py-10

          lg:py-12
        "
            >
                <Container>
                    {/* =====================
              FILTER BOX
          ====================== */}

                    <div
                        className="
              mb-7

              rounded-[1.5rem]

              border
              border-slate-200

              bg-white

              p-3

              shadow-sm
            "
                    >
                        {/* SEARCH */}

                        <div
                            className="
                relative
              "
                        >
                            <FaSearch
                                className="
                  pointer-events-none

                  absolute
                  left-4
                  top-1/2

                  -translate-y-1/2

                  text-sm
                  text-orange-500
                "
                            />


                            <input
                                type="search"

                                value={
                                    searchTerm
                                }

                                onChange={(
                                    event
                                ) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }

                                placeholder="Search by order number or restaurant..."

                                className="
                  min-h-11
                  w-full

                  rounded-xl

                  border
                  border-slate-200

                  bg-slate-50

                  pl-10
                  pr-10

                  text-sm

                  outline-none

                  transition

                  focus:border-orange-300
                  focus:bg-white
                  focus:ring-4
                  focus:ring-orange-100
                "
                            />


                            {searchTerm && (
                                <button
                                    type="button"

                                    onClick={() =>
                                        setSearchTerm("")
                                    }

                                    className="
                    absolute
                    right-2
                    top-1/2

                    flex
                    h-8
                    w-8

                    -translate-y-1/2

                    items-center
                    justify-center

                    rounded-lg

                    text-slate-400

                    hover:bg-slate-100
                  "
                                >
                                    <FaTimes
                                        className="
                      h-3
                      w-3
                    "
                                    />
                                </button>
                            )}
                        </div>


                        {/* STATUS TABS */}

                        <div
                            className="
                mt-3

                flex
                gap-2

                overflow-x-auto

                border-t
                border-slate-100

                pt-3

                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
                        >
                            {[
                                {
                                    value: "all",

                                    label: "All",

                                    count:
                                        orders.length,
                                },

                                {
                                    value:
                                        "active",

                                    label:
                                        "Active",

                                    count:
                                        activeCount,
                                },

                                {
                                    value:
                                        "delivered",

                                    label:
                                        "Delivered",

                                    count:
                                        deliveredCount,
                                },

                                {
                                    value:
                                        "cancelled",

                                    label:
                                        "Cancelled",

                                    count:
                                        cancelledCount,
                                },
                            ].map(
                                (filter) => (
                                    <button
                                        key={
                                            filter.value
                                        }

                                        type="button"

                                        onClick={() =>
                                            setActiveFilter(
                                                filter.value
                                            )
                                        }

                                        className={`
                      min-h-10
                      shrink-0

                      rounded-xl

                      px-4

                      text-xs
                      font-black

                      transition

                      ${activeFilter ===
                                                filter.value
                                                ? `
                            bg-slate-950
                            text-white
                          `
                                                : `
                            bg-slate-50
                            text-slate-500

                            hover:bg-orange-50
                            hover:text-orange-600
                          `
                                            }
                    `}
                                    >
                                        {
                                            filter.label
                                        }

                                        <span
                                            className="
                        ml-1.5
                        opacity-60
                      "
                                        >
                                            {
                                                filter.count
                                            }
                                        </span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>


                    {/* =====================
              LOADING
          ====================== */}

                    {fetchLoading && (
                        <div
                            className="
                grid
                gap-5

                lg:grid-cols-2
              "
                        >
                            {Array.from({
                                length: 4,
                            }).map(
                                (_, index) => (
                                    <Skeleton
                                        key={index}

                                        width="w-full"
                                        height="h-[330px]"
                                        rounded="rounded-[1.75rem]"
                                    />
                                )
                            )}
                        </div>
                    )}


                    {/* =====================
              ERROR
          ====================== */}

                    {!fetchLoading &&
                        error && (
                            <ErrorState
                                title="Unable to load orders"

                                description={
                                    typeof error ===
                                        "string"
                                        ? error
                                        : "Something went wrong while loading your orders."
                                }
                            />
                        )}


                    {/* =====================
              EMPTY
          ====================== */}

                    {!fetchLoading &&
                        !error &&
                        filteredOrders.length ===
                        0 && (
                            <EmptyState
                                icon={
                                    FaBoxOpen
                                }

                                title={
                                    hasFilters
                                        ? "No matching orders"
                                        : "No orders yet"
                                }

                                description={
                                    hasFilters
                                        ? "Try another order number, restaurant or status."
                                        : "Your Foodie orders will appear here after you place your first order."
                                }

                                action={
                                    hasFilters ? (
                                        <button
                                            type="button"

                                            onClick={
                                                clearFilters
                                            }

                                            className="
                        min-h-11

                        rounded-xl

                        bg-orange-500

                        px-5

                        text-sm
                        font-bold
                        text-white
                      "
                                        >
                                            Clear Filters
                                        </button>
                                    ) : null
                                }
                            />
                        )}


                    {/* =====================
              ORDER GRID
          ====================== */}

                    {!fetchLoading &&
                        !error &&
                        filteredOrders.length >
                        0 && (
                            <>
                                <div
                                    className="
                    mb-4

                    text-sm
                    text-slate-500
                  "
                                >
                                    Showing{" "}

                                    <span
                                        className="
                      font-black
                      text-slate-900
                    "
                                    >
                                        {
                                            filteredOrders.length
                                        }
                                    </span>

                                    {" "}
                                    order
                                    {
                                        filteredOrders.length !==
                                            1
                                            ? "s"
                                            : ""
                                    }
                                </div>


                                <div
                                    className="
                    grid
                    gap-5

                    lg:grid-cols-2
                  "
                                >
                                    {filteredOrders.map(
                                        (order) => (
                                            <OrderCard
                                                key={
                                                    order.orderNumber
                                                }

                                                order={
                                                    order
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </>
                        )}
                </Container>
            </section>
        </div>
    );
};


export default Orders;