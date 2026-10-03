import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useSearchParams,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    FaSearch,
    FaStore,
    FaUtensils,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";

import RestaurantCard from "../../../components/public/RestaurantCard/RestaurantCard";
import FoodCard from "../../../components/public/FoodCard/FoodCard";
import {
    addCartItem,
} from "../../../redux/thunks/public/cart.thunk";

const Search = () => {

    const dispatch =
        useDispatch();
    // =========================
    // URL QUERY
    // =========================

    const [
        searchParams,
    ] = useSearchParams();


    const query =
        searchParams.get("q")?.trim() || "";


    // =========================
    // REDUX
    // =========================

    const {
        restaurants,
        fetchLoading:
        restaurantLoading,
        error:
        restaurantError,
    } = useSelector(
        (state) =>
            state.publicRestaurant
    );


    const {
        foods,
        fetchLoading:
        foodLoading,
        error:
        foodError,
    } = useSelector(
        (state) =>
            state.publicFood
    );


    // =========================
    // UI STATE
    // =========================

    const [
        activeTab,
        setActiveTab,
    ] = useState("all");


    /*
      Navbar se new query search
      hone par result tab wapas
      All par aa jaye.
    */

    useEffect(() => {
        setActiveTab("all");
    }, [query]);


    // =========================
    // SEARCH RESTAURANTS
    // =========================

    const matchedRestaurants =
        useMemo(() => {
            if (!query) {
                return [];
            }


            const search =
                query.toLowerCase();


            return restaurants.filter(
                (restaurant) => {
                    return (
                        restaurant.restaurantName
                            ?.toLowerCase()
                            .includes(search) ||

                        restaurant.description
                            ?.toLowerCase()
                            .includes(search) ||

                        restaurant.addressLine
                            ?.toLowerCase()
                            .includes(search) ||

                        restaurant.city
                            ?.toLowerCase()
                            .includes(search) ||

                        restaurant.state
                            ?.toLowerCase()
                            .includes(search)
                    );
                }
            );
        }, [
            restaurants,
            query,
        ]);


    // =========================
    // SEARCH FOODS
    // =========================

    const matchedFoods =
        useMemo(() => {
            if (!query) {
                return [];
            }


            const search =
                query.toLowerCase();


            return foods.filter(
                (food) => {
                    return (
                        food.name
                            ?.toLowerCase()
                            .includes(search) ||

                        food.description
                            ?.toLowerCase()
                            .includes(search) ||

                        food.categoryName
                            ?.toLowerCase()
                            .includes(search) ||

                        food.categorySlug
                            ?.toLowerCase()
                            .includes(search)
                    );
                }
            );
        }, [
            foods,
            query,
        ]);


    // =========================
    // TOTAL
    // =========================

    const totalResults =
        matchedRestaurants.length +
        matchedFoods.length;


    const loading =
        restaurantLoading ||
        foodLoading;


    const error =
        restaurantError ||
        foodError;


    // =========================
    // ADD TO CART
    // =========================

    const handleAddToCart = async (food) => {
        try {
            await dispatch(
                addCartItem({
                    foodSlug: food.slug,
                    quantity: 1,
                })
            ).unwrap();

            console.log(
                "Added to cart"
            );
        } catch (error) {
            console.error(
                "ADD CART ERROR:",
                error
            );
        }
    };


    // =========================
    // NO QUERY
    // =========================

    if (!query) {
        return (
            <div
                className="
          min-h-[65vh]

          bg-[#fffaf5]

          py-14
        "
            >
                <Container>
                    <EmptyState
                        icon={FaSearch}

                        title="Search for something delicious"

                        description="Use the search box in the navbar to find food or restaurants."
                    />
                </Container>
            </div>
        );
    }


    return (
        <div
            className="
        min-h-screen

        bg-[#fffaf5]
      "
        >
            {/* =========================
          PAGE HEADER
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
                {/* BACKGROUND GLOW */}

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

              lg:py-14
            "
                    >
                        <div
                            className="
                max-w-3xl
              "
                        >
                            {/* EYEBROW */}

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
                                <FaSearch
                                    className="
                    h-3
                    w-3
                  "
                                />

                                Search results
                            </div>


                            {/* TITLE */}

                            <h1
                                className="
                  mt-4

                  text-3xl
                  font-black
                  tracking-tight
                  text-slate-950

                  sm:text-4xl

                  lg:text-5xl
                "
                            >
                                Results for{" "}

                                <span
                                    className="
                    bg-gradient-to-r
                    from-orange-500
                    to-rose-500

                    bg-clip-text
                    text-transparent
                  "
                                >
                                    “{query}”
                                </span>
                            </h1>


                            <p
                                className="
                  mt-3

                  text-sm
                  leading-7
                  text-slate-500

                  sm:text-base
                "
                            >
                                Find matching foods and
                                restaurants from your
                                search.
                            </p>


                            {/* RESULT COUNT */}

                            {!loading &&
                                !error && (
                                    <div
                                        className="
                      mt-5

                      inline-flex
                      items-center
                      gap-2

                      rounded-xl

                      border
                      border-slate-200

                      bg-white

                      px-3
                      py-2

                      text-sm
                      text-slate-500

                      shadow-sm
                    "
                                    >
                                        <span
                                            className="
                        font-black
                        text-slate-950
                      "
                                        >
                                            {totalResults}
                                        </span>

                                        result
                                        {totalResults !== 1
                                            ? "s"
                                            : ""}
                                        found
                                    </div>
                                )}
                        </div>
                    </div>
                </Container>
            </section>


            {/* =========================
          RESULTS
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
              TABS
          ====================== */}

                    {!loading &&
                        !error &&
                        totalResults > 0 && (
                            <div
                                className="
                  mb-8

                  flex
                  gap-2

                  overflow-x-auto

                  rounded-2xl

                  border
                  border-slate-200

                  bg-white

                  p-1.5

                  shadow-sm

                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden

                  sm:inline-flex
                "
                            >
                                {/* ALL */}

                                <button
                                    type="button"

                                    onClick={() =>
                                        setActiveTab("all")
                                    }

                                    className={`
                    min-h-10
                    shrink-0

                    rounded-xl

                    px-4

                    text-sm
                    font-black

                    transition

                    ${activeTab === "all"
                                            ? `
                          bg-slate-950
                          text-white
                        `
                                            : `
                          text-slate-500

                          hover:bg-slate-50
                          hover:text-slate-900
                        `
                                        }
                  `}
                                >
                                    All

                                    <span
                                        className="
                      ml-2
                      opacity-60
                    "
                                    >
                                        {totalResults}
                                    </span>
                                </button>


                                {/* FOODS */}

                                <button
                                    type="button"

                                    onClick={() =>
                                        setActiveTab("foods")
                                    }

                                    className={`
                    min-h-10
                    shrink-0

                    rounded-xl

                    px-4

                    text-sm
                    font-black

                    transition

                    ${activeTab === "foods"
                                            ? `
                          bg-orange-500
                          text-white
                        `
                                            : `
                          text-slate-500

                          hover:bg-orange-50
                          hover:text-orange-600
                        `
                                        }
                  `}
                                >
                                    Foods

                                    <span
                                        className="
                      ml-2
                      opacity-70
                    "
                                    >
                                        {
                                            matchedFoods.length
                                        }
                                    </span>
                                </button>


                                {/* RESTAURANTS */}

                                <button
                                    type="button"

                                    onClick={() =>
                                        setActiveTab(
                                            "restaurants"
                                        )
                                    }

                                    className={`
                    min-h-10
                    shrink-0

                    rounded-xl

                    px-4

                    text-sm
                    font-black

                    transition

                    ${activeTab ===
                                            "restaurants"
                                            ? `
                          bg-orange-500
                          text-white
                        `
                                            : `
                          text-slate-500

                          hover:bg-orange-50
                          hover:text-orange-600
                        `
                                        }
                  `}
                                >
                                    Restaurants

                                    <span
                                        className="
                      ml-2
                      opacity-70
                    "
                                    >
                                        {
                                            matchedRestaurants.length
                                        }
                                    </span>
                                </button>
                            </div>
                        )}


                    {/* =====================
              LOADING
          ====================== */}

                    {loading && (
                        <div>
                            {/* FOOD SKELETON */}

                            <div
                                className="
                  grid
                  gap-5

                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4
                "
                            >
                                {Array.from({
                                    length: 4,
                                }).map(
                                    (_, index) => (
                                        <Skeleton
                                            key={index}

                                            width="w-full"
                                            height="h-[390px]"
                                            rounded="rounded-[1.75rem]"
                                        />
                                    )
                                )}
                            </div>


                            {/* RESTAURANT SKELETON */}

                            <div
                                className="
                  mt-10

                  grid
                  gap-5

                  sm:grid-cols-2
                  lg:grid-cols-3
                "
                            >
                                {Array.from({
                                    length: 3,
                                }).map(
                                    (_, index) => (
                                        <Skeleton
                                            key={index}

                                            width="w-full"
                                            height="h-[380px]"
                                            rounded="rounded-[1.75rem]"
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    )}


                    {/* =====================
              ERROR
          ====================== */}

                    {!loading &&
                        error && (
                            <ErrorState
                                title="Search failed"

                                description={
                                    typeof error ===
                                        "string"
                                        ? error
                                        : "Something went wrong while searching."
                                }
                            />
                        )}


                    {/* =====================
              NO RESULTS
          ====================== */}

                    {!loading &&
                        !error &&
                        totalResults === 0 && (
                            <EmptyState
                                icon={FaSearch}

                                title={`No results for "${query}"`}

                                description="Try searching with another food name, category, restaurant or location."
                            />
                        )}


                    {/* =========================
              FOOD RESULTS
          ========================== */}

                    {!loading &&
                        !error &&
                        matchedFoods.length >
                        0 &&
                        (
                            activeTab === "all" ||
                            activeTab === "foods"
                        ) && (
                            <div>
                                {/* HEADER */}

                                <div
                                    className="
                    mb-5

                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                                >
                                    <div>
                                        <div
                                            className="
                        flex
                        items-center
                        gap-2
                      "
                                        >
                                            <span
                                                className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center

                          rounded-xl

                          bg-orange-100

                          text-orange-600
                        "
                                            >
                                                <FaUtensils
                                                    className="
                            h-4
                            w-4
                          "
                                                />
                                            </span>


                                            <h2
                                                className="
                          text-xl
                          font-black
                          tracking-tight
                          text-slate-950

                          sm:text-2xl
                        "
                                            >
                                                Foods
                                            </h2>
                                        </div>


                                        <p
                                            className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                                        >
                                            {
                                                matchedFoods.length
                                            }{" "}
                                            matching food
                                            {
                                                matchedFoods.length !==
                                                    1
                                                    ? "s"
                                                    : ""
                                            }
                                        </p>
                                    </div>
                                </div>


                                {/* FOOD GRID */}

                                <div
                                    className="
                    grid
                    gap-5

                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                  "
                                >
                                    {matchedFoods.map(
                                        (food) => (
                                            <FoodCard
                                                key={
                                                    food.slug
                                                }

                                                food={
                                                    food
                                                }

                                                onAddToCart={
                                                    handleAddToCart
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        )}


                    {/* =====================
              SEPARATOR
          ====================== */}

                    {!loading &&
                        !error &&
                        activeTab === "all" &&
                        matchedFoods.length > 0 &&
                        matchedRestaurants.length >
                        0 && (
                            <div
                                className="
                  my-10

                  h-px

                  bg-gradient-to-r
                  from-transparent
                  via-slate-200
                  to-transparent

                  sm:my-12
                "
                            />
                        )}


                    {/* =========================
              RESTAURANT RESULTS
          ========================== */}

                    {!loading &&
                        !error &&
                        matchedRestaurants.length >
                        0 &&
                        (
                            activeTab === "all" ||
                            activeTab ===
                            "restaurants"
                        ) && (
                            <div>
                                {/* HEADER */}

                                <div
                                    className="
                    mb-5
                  "
                                >
                                    <div
                                        className="
                      flex
                      items-center
                      gap-2
                    "
                                    >
                                        <span
                                            className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center

                        rounded-xl

                        bg-rose-100

                        text-rose-600
                      "
                                        >
                                            <FaStore
                                                className="
                          h-4
                          w-4
                        "
                                            />
                                        </span>


                                        <h2
                                            className="
                        text-xl
                        font-black
                        tracking-tight
                        text-slate-950

                        sm:text-2xl
                      "
                                        >
                                            Restaurants
                                        </h2>
                                    </div>


                                    <p
                                        className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                                    >
                                        {
                                            matchedRestaurants.length
                                        }{" "}
                                        matching restaurant
                                        {
                                            matchedRestaurants.length !==
                                                1
                                                ? "s"
                                                : ""
                                        }
                                    </p>
                                </div>


                                {/* RESTAURANT GRID */}

                                <div
                                    className="
                    grid
                    gap-5

                    sm:grid-cols-2

                    lg:grid-cols-3
                  "
                                >
                                    {matchedRestaurants.map(
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
                            </div>
                        )}


                    {/* =========================
              SELECTED TAB EMPTY
          ========================== */}

                    {!loading &&
                        !error &&
                        totalResults > 0 &&
                        (
                            (
                                activeTab ===
                                "foods" &&
                                matchedFoods.length ===
                                0
                            ) ||
                            (
                                activeTab ===
                                "restaurants" &&
                                matchedRestaurants.length ===
                                0
                            )
                        ) && (
                            <EmptyState
                                icon={
                                    activeTab ===
                                        "foods"
                                        ? FaUtensils
                                        : FaStore
                                }

                                title={
                                    activeTab ===
                                        "foods"
                                        ? "No matching food"
                                        : "No matching restaurant"
                                }

                                description={
                                    activeTab ===
                                        "foods"
                                        ? `No food matched "${query}". Restaurants may still match your search.`
                                        : `No restaurant matched "${query}". Food items may still match your search.`
                                }
                            />
                        )}
                </Container>
            </section>
        </div>
    );
};


export default Search;