import {
    useMemo,
    useState,
    useEffect,
    
} from "react";

import {
    useParams,
    useNavigate,
    useLocation,
} from "react-router-dom";


import {
    FaClock,
    FaLeaf,
    FaMapMarkerAlt,
    FaSearch,
    FaStore,
    FaTimes,
    FaUtensils,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import OptimizedImage from "../../../components/common/OptimizedImage/OptimizedImage";

import FoodCard from "../../../components/public/FoodCard/FoodCard";

import Button from "../../../components/common/Button/Button";
import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    addCartItem,
} from "../../../redux/thunks/public/cart.thunk";

import {
    getRestaurantBySlug,
} from "../../../redux/thunks/public/restaurant.thunk";

import {
    getRestaurantFoods,
} from "../../../redux/thunks/public/food.thunk";

const RestaurantDetails = () => {
    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        slug,
    } = useParams();


    // =========================
    // REDUX
    // =========================

    const {
        selectedRestaurant,

        detailLoading:
        restaurantLoading,

        detailError:
        restaurantError,
    } = useSelector(
        (state) =>
            state.publicRestaurant
    );


    const {
        restaurantFoods = [],

        restaurantFoodsLoading,

        restaurantFoodsError,
    } = useSelector(
        (state) =>
            state.publicFood
    );


    const {
        isAuthenticated,
    } = useSelector(
        (state) =>
            state.publicAuth
    );


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {
        if (!slug) return;

        dispatch(
            getRestaurantBySlug(
                slug
            )
        );

        dispatch(
            getRestaurantFoods({
                restaurantSlug:
                    slug,

                page: 1,

                limit: 20,
            })
        );

    }, [
        dispatch,
        slug,
    ]);

    // =========================
    // LOCAL STATE
    // =========================

    const [
        activeCategory,
        setActiveCategory,
    ] = useState("all");


    const [
        foodSearch,
        setFoodSearch,
    ] = useState("");


    const [
        foodType,
        setFoodType,
    ] = useState("all");


    // =========================
    // CURRENT RESTAURANT
    // =========================

    const restaurant =
        selectedRestaurant;

    // =========================
    // RESTAURANT FOODS
    // =========================



    // =========================
    // AVAILABLE CATEGORIES
    // =========================

    const menuCategories =
        useMemo(() => {
            const categoryMap =
                new Map();


            restaurantFoods.forEach(
                (food) => {
                    if (
                        !food.categorySlug
                    ) {
                        return;
                    }


                    if (
                        !categoryMap.has(
                            food.categorySlug
                        )
                    ) {
                        categoryMap.set(
                            food.categorySlug,
                            {
                                slug:
                                    food.categorySlug,

                                name:
                                    food.categoryName ||
                                    food.categorySlug,
                            }
                        );
                    }
                }
            );


            return Array.from(
                categoryMap.values()
            );
        }, [
            restaurantFoods,
        ]);


    // =========================
    // FILTER FOOD
    // =========================

    const filteredFoods =
        useMemo(() => {
            const search =
                foodSearch
                    .trim()
                    .toLowerCase();


            return restaurantFoods.filter(
                (food) => {
                    const matchesCategory =
                        activeCategory ===
                        "all" ||
                        food.categorySlug ===
                        activeCategory;


                    const matchesSearch =
                        !search ||
                        food.name
                            ?.toLowerCase()
                            .includes(search) ||
                        food.description
                            ?.toLowerCase()
                            .includes(search);


                    const matchesType =
                        foodType === "all" ||
                        (
                            foodType === "veg" &&
                            food.isVeg
                        ) ||
                        (
                            foodType ===
                            "non-veg" &&
                            !food.isVeg
                        );


                    return (
                        matchesCategory &&
                        matchesSearch &&
                        matchesType
                    );
                }
            );
        }, [
            restaurantFoods,
            activeCategory,
            foodSearch,
            foodType,
        ]);


    const hasFoodFilters =
        activeCategory !==
        "all" ||
        Boolean(
            foodSearch.trim()
        ) ||
        foodType !== "all";


    // =========================
    // CLEAR FILTERS
    // =========================

    const clearFoodFilters =
        () => {
            setActiveCategory(
                "all"
            );

            setFoodSearch("");

            setFoodType("all");
        };


    // =========================
    // ADD TO CART
    // =========================

    const handleAddToCart =
        async (food) => {

            if (!food?.slug) {
                return;
            }


            if (!food.isAvailable) {
                return;
            }


            if (!isAuthenticated) {
                navigate(
                    "/login",
                    {
                        state: {
                            from:
                                location.pathname +
                                location.search,
                        },
                    }
                );

                return;
            }


            try {
                await dispatch(
                    addCartItem({
                        foodSlug:
                            food.slug,

                        quantity: 1,
                    })
                ).unwrap();

            } catch (error) {
                console.error(
                    "ADD CART ERROR:",
                    error
                );
            }
        };


    // =========================
    // LOADING RESTAURANT
    // =========================

    if (restaurantLoading) {
        return (
            <div
                className="
          min-h-screen
          bg-[#fffaf5]

          py-10
        "
            >
                <Container>
                    <Skeleton
                        width="w-full"
                        height="h-[300px] sm:h-[380px]"
                        rounded="rounded-[2rem]"
                    />

                    <div
                        className="
              mt-8
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
                                <Skeleton
                                    key={index}

                                    width="w-full"
                                    height="h-[360px]"
                                    rounded="rounded-[1.75rem]"
                                />
                            )
                        )}
                    </div>
                </Container>
            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (restaurantError) {
        return (
            <div
                className="
          min-h-[60vh]

          bg-[#fffaf5]

          py-14
        "
            >
                <Container>
                    <ErrorState
                        title="Unable to load restaurant"

                        description={
                            typeof restaurantError ===
                                "string"
                                ? restaurantError
                                : "Something went wrong while loading this restaurant."
                        }
                    />
                </Container>
            </div>
        );
    }


    // =========================
    // NOT FOUND
    // =========================

    if (!restaurant) {
        return (
            <div
                className="
          min-h-[60vh]

          bg-[#fffaf5]

          py-14
        "
            >
                <Container>
                    <EmptyState
                        icon={FaStore}

                        title="Restaurant not found"

                        description="The restaurant you are looking for is unavailable or no longer exists."
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
          RESTAURANT HERO
      ========================== */}

            <section
                className="
          relative

          pb-8
          pt-6

          sm:pb-10
          sm:pt-8

          lg:pb-12
        "
            >
                <Container>
                    <div
                        className="
              relative

              overflow-hidden

              rounded-[2rem]

              bg-slate-950

              shadow-2xl
              shadow-slate-950/10
            "
                    >
                        {/* IMAGE */}

                        <div
                            className="
                absolute
                inset-0
              "
                        >
                            <OptimizedImage
                                src={
                                    restaurant.image
                                }

                                alt={
                                    restaurant.restaurantName
                                }

                                rounded="rounded-none"

                                className="
                  h-full
                  w-full
                  object-cover
                "
                            />

                            <div
                                className="
                  absolute
                  inset-0

                  bg-gradient-to-r
                  from-slate-950
                  via-slate-950/85
                  to-slate-950/30
                "
                            />

                            <div
                                className="
                  absolute
                  inset-0

                  bg-gradient-to-t
                  from-slate-950/70
                  via-transparent
                  to-transparent
                "
                            />
                        </div>


                        {/* CONTENT */}

                        <div
                            className="
                relative
                z-10

                flex
                min-h-[330px]
                items-end

                p-5

                sm:min-h-[380px]
                sm:p-8

                lg:min-h-[430px]
                lg:p-10
              "
                        >
                            <div
                                className="
                  w-full
                  max-w-3xl
                "
                            >
                                {/* STATUS */}

                                <div
                                    className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                                >
                                    <span
                                        className={`
                      inline-flex
                      items-center
                      gap-2

                      rounded-full

                      border

                      px-3
                      py-1.5

                      text-xs
                      font-black
                      uppercase
                      tracking-[0.1em]

                      backdrop-blur-md

                      ${restaurant.isOpen
                                                ? `
                            border-emerald-400/20
                            bg-emerald-400/15
                            text-emerald-300
                          `
                                                : `
                            border-rose-400/20
                            bg-rose-400/15
                            text-rose-300
                          `
                                            }
                    `}
                                    >
                                        <span
                                            className={`
                        h-2
                        w-2

                        rounded-full

                        ${restaurant.isOpen
                                                    ? "bg-emerald-400"
                                                    : "bg-rose-400"
                                                }
                      `}
                                        />

                                        {restaurant.isOpen
                                            ? "Open now"
                                            : "Currently closed"}
                                    </span>


                                    <span
                                        className="
                      inline-flex
                      items-center
                      gap-2

                      rounded-full

                      border
                      border-white/10

                      bg-white/10

                      px-3
                      py-1.5

                      text-xs
                      font-bold
                      text-white

                      backdrop-blur
                    "
                                    >
                                        <FaUtensils
                                            className="
                        h-3
                        w-3

                        text-orange-300
                      "
                                        />

                                        Restaurant
                                    </span>
                                </div>


                                {/* NAME */}

                                <h1
                                    className="
                    mt-5

                    text-3xl
                    font-black
                    leading-tight
                    tracking-tight
                    text-white

                    sm:text-4xl

                    lg:text-5xl
                  "
                                >
                                    {
                                        restaurant.restaurantName
                                    }
                                </h1>


                                {/* DESCRIPTION */}

                                {restaurant.description && (
                                    <p
                                        className="
                      mt-3
                      max-w-2xl

                      text-sm
                      leading-7
                      text-slate-300

                      sm:text-base
                    "
                                    >
                                        {
                                            restaurant.description
                                        }
                                    </p>
                                )}


                                {/* META */}

                                <div
                                    className="
                    mt-5

                    flex
                    flex-wrap
                    gap-3
                  "
                                >
                                    <div
                                        className="
                      inline-flex
                      items-center
                      gap-2

                      rounded-xl

                      bg-white/10

                      px-3
                      py-2

                      text-xs
                      font-semibold
                      text-slate-200

                      backdrop-blur

                      sm:text-sm
                    "
                                    >
                                        <FaMapMarkerAlt
                                            className="
                        h-3.5
                        w-3.5

                        text-orange-400
                      "
                                        />

                                        <span>
                                            {
                                                restaurant.addressLine
                                            }

                                            {restaurant.addressLine &&
                                                restaurant.city &&
                                                ", "}

                                            {
                                                restaurant.city
                                            }
                                        </span>
                                    </div>


                                    <div
                                        className="
                      inline-flex
                      items-center
                      gap-2

                      rounded-xl

                      bg-white/10

                      px-3
                      py-2

                      text-xs
                      font-semibold
                      text-slate-200

                      backdrop-blur

                      sm:text-sm
                    "
                                    >
                                        <FaStore
                                            className="
                        h-3.5
                        w-3.5

                        text-orange-400
                      "
                                        />

                                        {
                                            restaurantFoods.length
                                        }{" "}
                                        menu items
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>


            {/* =========================
          MENU SECTION
      ========================== */}

            <section
                className="
          pb-16

          lg:pb-20
        "
            >
                <Container>
                    {/* =====================
              MENU HEADER
          ====================== */}

                    <div
                        className="
              flex
              flex-col
              gap-4

              sm:flex-row
              sm:items-end
              sm:justify-between
            "
                    >
                        <div>
                            <div
                                className="
                  inline-flex
                  items-center
                  gap-2

                  text-xs
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-orange-500
                "
                            >
                                <FaUtensils
                                    className="
                    h-3
                    w-3
                  "
                                />

                                Restaurant menu
                            </div>


                            <h2
                                className="
                  mt-2

                  text-2xl
                  font-black
                  tracking-tight
                  text-slate-950

                  sm:text-3xl
                "
                            >
                                Pick something
                                <span
                                    className="
                    text-orange-500
                  "
                                >
                                    {" "}
                                    delicious
                                </span>
                            </h2>


                            <p
                                className="
                  mt-2

                  text-sm
                  text-slate-500
                "
                            >
                                Browse available food from{" "}
                                {
                                    restaurant.restaurantName
                                }.
                            </p>
                        </div>
                    </div>


                    {/* =====================
              CATEGORY TABS
          ====================== */}

                    {menuCategories.length >
                        0 && (
                            <div
                                className="
                mt-6

                flex
                gap-2

                overflow-x-auto

                pb-2

                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
                            >
                                <button
                                    type="button"

                                    onClick={() =>
                                        setActiveCategory(
                                            "all"
                                        )
                                    }

                                    className={`
                  min-h-10
                  shrink-0

                  rounded-xl

                  px-4

                  text-sm
                  font-bold

                  transition

                  ${activeCategory ===
                                            "all"
                                            ? `
                        bg-slate-950
                        text-white
                      `
                                            : `
                        border
                        border-slate-200

                        bg-white

                        text-slate-600

                        hover:border-orange-200
                        hover:text-orange-600
                      `
                                        }
                `}
                                >
                                    All
                                </button>


                                {menuCategories.map(
                                    (category) => (
                                        <button
                                            key={
                                                category.slug
                                            }

                                            type="button"

                                            onClick={() =>
                                                setActiveCategory(
                                                    category.slug
                                                )
                                            }

                                            className={`
                      min-h-10
                      shrink-0

                      rounded-xl

                      px-4

                      text-sm
                      font-bold

                      transition

                      ${activeCategory ===
                                                    category.slug
                                                    ? `
                            bg-slate-950
                            text-white
                          `
                                                    : `
                            border
                            border-slate-200

                            bg-white

                            text-slate-600

                            hover:border-orange-200
                            hover:text-orange-600
                          `
                                                }
                    `}
                                        >
                                            {
                                                category.name
                                            }
                                        </button>
                                    )
                                )}
                            </div>
                        )}


                    {/* =====================
              SEARCH + FOOD TYPE
          ====================== */}

                    <div
                        className="
              mt-5

              rounded-[1.5rem]

              border
              border-slate-200

              bg-white

              p-3

              shadow-sm
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

                    h-3.5
                    w-3.5

                    -translate-y-1/2

                    text-orange-500
                  "
                                />


                                <input
                                    type="search"

                                    value={
                                        foodSearch
                                    }

                                    onChange={(
                                        event
                                    ) =>
                                        setFoodSearch(
                                            event.target.value
                                        )
                                    }

                                    placeholder={`Search ${restaurant.restaurantName} menu...`}

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


                                {foodSearch && (
                                    <button
                                        type="button"

                                        onClick={() =>
                                            setFoodSearch(
                                                ""
                                            )
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


                            {/* FOOD TYPE */}

                            <div
                                className="
                  grid
                  grid-cols-3
                  gap-2

                  md:w-auto
                "
                            >
                                <button
                                    type="button"

                                    onClick={() =>
                                        setFoodType(
                                            "all"
                                        )
                                    }

                                    className={`
                    min-h-11

                    rounded-xl

                    px-3

                    text-xs
                    font-bold

                    transition

                    ${foodType ===
                                            "all"
                                            ? `
                          bg-slate-950
                          text-white
                        `
                                            : `
                          bg-slate-100
                          text-slate-600
                        `
                                        }
                  `}
                                >
                                    All
                                </button>


                                <button
                                    type="button"

                                    onClick={() =>
                                        setFoodType(
                                            "veg"
                                        )
                                    }

                                    className={`
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    gap-1.5

                    rounded-xl

                    px-3

                    text-xs
                    font-bold

                    transition

                    ${foodType ===
                                            "veg"
                                            ? `
                          bg-emerald-600
                          text-white
                        `
                                            : `
                          bg-emerald-50
                          text-emerald-700
                        `
                                        }
                  `}
                                >
                                    <FaLeaf />

                                    Veg
                                </button>


                                <button
                                    type="button"

                                    onClick={() =>
                                        setFoodType(
                                            "non-veg"
                                        )
                                    }

                                    className={`
                    min-h-11

                    rounded-xl

                    px-3

                    text-xs
                    font-bold

                    transition

                    ${foodType ===
                                            "non-veg"
                                            ? `
                          bg-rose-600
                          text-white
                        `
                                            : `
                          bg-rose-50
                          text-rose-700
                        `
                                        }
                  `}
                                >
                                    Non Veg
                                </button>
                            </div>
                        </div>


                        {/* RESULT INFO */}

                        {!restaurantFoodsLoading && (
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
                                    <span
                                        className="
                      font-bold
                      text-slate-900
                    "
                                    >
                                        {
                                            filteredFoods.length
                                        }
                                    </span>

                                    {" "}
                                    item
                                    {
                                        filteredFoods.length !==
                                            1
                                            ? "s"
                                            : ""
                                    }{" "}
                                    found
                                </p>


                                {hasFoodFilters && (
                                    <button
                                        type="button"

                                        onClick={
                                            clearFoodFilters
                                        }

                                        className="
                      text-xs
                      font-bold
                      text-orange-600

                      hover:text-orange-700
                    "
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>


                    {/* =====================
              FOOD LOADING
          ====================== */}

                    {restaurantFoodsLoading && (
                        <div
                            className="
                mt-7

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
                                    <Skeleton
                                        key={index}

                                        width="w-full"
                                        height="h-[390px]"
                                        rounded="rounded-[1.75rem]"
                                    />
                                )
                            )}
                        </div>
                    )}


                    {/* =====================
              EMPTY FOOD
          ====================== */}

                    {!restaurantFoodsLoading &&
                        filteredFoods.length ===
                        0 && (
                            <div className="mt-7">
                                <EmptyState
                                    icon={FaUtensils}

                                    title={
                                        hasFoodFilters
                                            ? "No matching food found"
                                            : "Menu is currently empty"
                                    }

                                    description={
                                        hasFoodFilters
                                            ? "Try another search, category or food type."
                                            : "Food items will appear here when this restaurant adds its menu."
                                    }

                                    action={
                                        hasFoodFilters ? (
                                            <Button
                                                type="button"
                                                onClick={clearFoodFilters}
                                            >
                                                Clear filters
                                            </Button>
                                        ) : null
                                    }
                                />
                            </div>
                        )}


                    {/* =====================
              FOOD GRID
          ====================== */}

                    {!restaurantFoodsLoading &&
                        filteredFoods.length >
                        0 && (
                            <div
                                className="
                  mt-7

                  grid
                  gap-5

                  sm:grid-cols-2

                  lg:grid-cols-3
                "
                            >
                                {filteredFoods.map(
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
                        )}
                </Container>
            </section>
        </div>
    );
};


export default RestaurantDetails;