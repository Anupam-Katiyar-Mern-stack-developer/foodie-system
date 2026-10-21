import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    FaSearch,
    FaSlidersH,
    FaStore,
    FaTimes,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";

import RestaurantCard from "../../../components/public/RestaurantCard/RestaurantCard";

import Button from "../../../components/common/Button/Button";
import {
    getRestaurants,
} from "../../../redux/thunks/public/restaurant.thunk";

const Restaurants = () => {

    const dispatch =
        useDispatch();
    // =========================
    // REDUX
    // =========================

    const {
        restaurants,
        fetchLoading,
        error,
    } = useSelector(
        (state) =>
            state.publicRestaurant
    );


    // =========================
    // LOCAL UI FILTER STATE
    // =========================

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");


    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");


    useEffect(() => {
        dispatch(
            getRestaurants({
                page: 1,
                limit: 20,
            })
        );
    }, [dispatch]);

    // =========================
    // TEMPORARY UI FILTERING
    // =========================
    /*
      Abhi Redux me preview data hai,
      isliye filtering frontend par.
  
      Later backend integration:
  
      dispatch(
        fetchPublicRestaurants({
          search: searchTerm,
          status: statusFilter,
        })
      );
  
      hoga.
    */

    const filteredRestaurants =
        restaurants.filter(
            (restaurant) => {
                const search =
                    searchTerm
                        .trim()
                        .toLowerCase();


                const matchesSearch =
                    !search ||
                    restaurant.restaurantName
                        ?.toLowerCase()
                        .includes(search) ||
                    restaurant.city
                        ?.toLowerCase()
                        .includes(search) ||
                    restaurant.addressLine
                        ?.toLowerCase()
                        .includes(search);


                const matchesStatus =
                    statusFilter === "all" ||
                    (
                        statusFilter === "open" &&
                        restaurant.isOpen
                    ) ||
                    (
                        statusFilter === "closed" &&
                        !restaurant.isOpen
                    );


                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );


    const hasFilters =
        Boolean(searchTerm.trim()) ||
        statusFilter !== "all";


    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
    };


    return (
        <div
            className="
        min-h-screen
        bg-[#fffaf5]
      "
        >
            {/* =========================
          HERO / PAGE INTRO
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
                {/* GLOW */}

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


                <div
                    className="
            pointer-events-none

            absolute
            -right-28
            bottom-0

            h-64
            w-64

            rounded-full

            bg-rose-300/15

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

              lg:py-16
            "
                    >
                        <div
                            className="
                max-w-3xl
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

                  px-3.5
                  py-2

                  text-xs
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-orange-600
                "
                            >
                                <FaStore
                                    className="
                    h-3.5
                    w-3.5
                  "
                                />

                                Restaurants
                            </div>


                            <PageHeader
                                title="Find your next favourite restaurant"

                                description="Browse approved restaurants, explore their menus and order food that matches your craving."
                            />
                        </div>
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
              FILTER TOOLBAR
          ====================== */}

                    <div
                        className="
              mb-7

              rounded-[1.6rem]

              border
              border-slate-200/80

              bg-white

              p-3

              shadow-sm

              sm:p-4
            "
                    >
                        <div
                            className="
                flex
                flex-col
                gap-3

                md:flex-row
                md:items-center
              "
                        >
                            {/* SEARCH */}

                            <div
                                className="
                  relative
                  flex-1
                "
                            >
                                <FaSearch
                                    className="
                    pointer-events-none

                    absolute
                    left-4
                    top-1/2

                    h-4
                    w-4

                    -translate-y-1/2

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

                                    placeholder="Search restaurant or area..."

                                    aria-label="Search restaurants"

                                    className="
                    min-h-12
                    w-full

                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50/70

                    pl-11
                    pr-11

                    text-sm
                    text-slate-900

                    outline-none

                    transition

                    placeholder:text-slate-400

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

                                        aria-label="Clear restaurant search"

                                        className="
                      absolute
                      right-3
                      top-1/2

                      flex
                      h-8
                      w-8

                      -translate-y-1/2

                      items-center
                      justify-center

                      rounded-lg

                      text-slate-400

                      transition

                      hover:bg-slate-100
                      hover:text-slate-700
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


                            {/* STATUS FILTER */}

                            <div
                                className="
                  relative

                  w-full

                  md:w-[190px]
                "
                            >
                                <FaSlidersH
                                    className="
                    pointer-events-none

                    absolute
                    left-4
                    top-1/2

                    h-3.5
                    w-3.5

                    -translate-y-1/2

                    text-slate-400
                  "
                                />


                                <select
                                    value={
                                        statusFilter
                                    }

                                    onChange={(
                                        event
                                    ) =>
                                        setStatusFilter(
                                            event.target.value
                                        )
                                    }

                                    aria-label="Filter restaurants by status"

                                    className="
                    min-h-12
                    w-full

                    appearance-none

                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50/70

                    pl-11
                    pr-4

                    text-sm
                    font-semibold
                    text-slate-700

                    outline-none

                    transition

                    focus:border-orange-300
                    focus:bg-white
                    focus:ring-4
                    focus:ring-orange-100
                  "
                                >
                                    <option value="all">
                                        All restaurants
                                    </option>

                                    <option value="open">
                                        Open now
                                    </option>

                                    <option value="closed">
                                        Closed
                                    </option>
                                </select>
                            </div>


                            {/* CLEAR */}

                            {hasFilters && (
                                <button
                                    type="button"

                                    onClick={
                                        clearFilters
                                    }

                                    className="
                    inline-flex
                    min-h-12
                    w-full
                    items-center
                    justify-center
                    gap-2

                    rounded-2xl

                    border
                    border-orange-200

                    bg-orange-50

                    px-4

                    text-sm
                    font-bold
                    text-orange-600

                    transition

                    hover:bg-orange-100

                    md:w-auto
                  "
                                >
                                    <FaTimes
                                        className="
                      h-3
                      w-3
                    "
                                    />

                                    Clear
                                </button>
                            )}
                        </div>


                        {/* RESULT COUNT */}

                        {!fetchLoading &&
                            !error && (
                                <div
                                    className="
                    mt-3

                    flex
                    items-center
                    justify-between
                    gap-3

                    border-t
                    border-slate-100

                    px-1
                    pt-3
                  "
                                >
                                    <p
                                        className="
                      text-xs
                      text-slate-500

                      sm:text-sm
                    "
                                    >
                                        Showing{" "}

                                        <span
                                            className="
                        font-bold
                        text-slate-900
                      "
                                        >
                                            {
                                                filteredRestaurants.length
                                            }
                                        </span>

                                        {" "}
                                        restaurant
                                        {
                                            filteredRestaurants.length !==
                                                1
                                                ? "s"
                                                : ""
                                        }
                                    </p>


                                    {hasFilters && (
                                        <span
                                            className="
                        rounded-full

                        bg-orange-100

                        px-2.5
                        py-1

                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-orange-700
                      "
                                        >
                                            Filtered
                                        </span>
                                    )}
                                </div>
                            )}
                    </div>


                    {/* =====================
              LOADING
          ====================== */}

                    {fetchLoading && (
                        <div
                            className="
                grid
                gap-5

                sm:grid-cols-2

                lg:grid-cols-3
              "
                        >
                            {Array.from({
                                length: 6,
                            }).map(
                                (_, index) => (
                                    <div
                                        key={index}

                                        className="
                      overflow-hidden

                      rounded-[1.75rem]

                      border
                      border-slate-200

                      bg-white
                    "
                                    >
                                        <Skeleton
                                            width="w-full"
                                            height="aspect-[16/11]"
                                            rounded="rounded-none"
                                        />


                                        <div
                                            className="
                        p-5
                      "
                                        >
                                            <Skeleton
                                                width="w-2/3"
                                                height="h-5"
                                            />


                                            <div className="mt-3">
                                                <Skeleton
                                                    width="w-1/2"
                                                    height="h-4"
                                                />
                                            </div>


                                            <div className="mt-5">
                                                <Skeleton
                                                    width="w-full"
                                                    height="h-4"
                                                />
                                            </div>


                                            <div className="mt-2">
                                                <Skeleton
                                                    width="w-3/4"
                                                    height="h-4"
                                                />
                                            </div>
                                        </div>
                                    </div>
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
                                title="Unable to load restaurants"

                                description={
                                    typeof error ===
                                        "string"
                                        ? error
                                        : "Something went wrong while loading restaurants."
                                }
                            />
                        )}


                    {/* =====================
              EMPTY / NO RESULT
          ====================== */}

                    {!fetchLoading &&
                        !error &&
                        filteredRestaurants.length ===
                        0 && (
                            <EmptyState
                                icon={FaStore}

                                title={
                                    hasFilters
                                        ? "No matching restaurants"
                                        : "No restaurants available"
                                }

                                description={
                                    hasFilters
                                        ? "Try another restaurant name, location or status filter."
                                        : "Restaurants will appear here when they become available."
                                }

                                action={
                                    hasFilters ? (
                                        <Button
                                            type="button"
                                            onClick={clearFilters}
                                        >
                                            Clear filters
                                        </Button>
                                    ) : null
                                }
                            />
                        )}


                    {/* =====================
              RESTAURANT GRID
          ====================== */}

                    {!fetchLoading &&
                        !error &&
                        filteredRestaurants.length >
                        0 && (
                            <div
                                className="
                  grid
                  gap-5

                  sm:grid-cols-2

                  lg:grid-cols-3
                "
                            >
                                {filteredRestaurants.map(
                                    (
                                        restaurant
                                    ) => (
                                        <RestaurantCard
                                            key={
                                                restaurant.slug
                                            }

                                            restaurant={
                                                restaurant
                                            }
                                        />
                                    )
                                )}
                            </div>
                        )}
                </Container>
            </section>
        </div>
    );
};


export default Restaurants;