import {
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  FaLeaf,
  FaSearch,
  FaTimes,
  FaUtensils,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import OptimizedImage from "../../../components/common/OptimizedImage/OptimizedImage";
import Button from "../../../components/common/Button/Button";

import FoodCard from "../../../components/public/FoodCard/FoodCard";

import {
  addCartItem,
} from "../../../redux/thunks/public/cart.thunk";

const CategoryFoods = () => {

  const dispatch =
    useDispatch();

  const {
    slug,
  } = useParams();


  // =========================
  // REDUX CATEGORY
  // =========================

  const {
    categories,
    fetchLoading:
    categoryLoading,
    error:
    categoryError,
  } = useSelector(
    (state) =>
      state.publicCategory
  );


  // =========================
  // REDUX FOOD
  // =========================

  const {
    foods,
    fetchLoading:
    foodLoading,
  } = useSelector(
    (state) =>
      state.publicFood
  );


  // =========================
  // LOCAL FILTER STATE
  // =========================

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");


  const [
    foodType,
    setFoodType,
  ] = useState("all");


  // =========================
  // CURRENT CATEGORY
  // =========================

  const category =
    useMemo(
      () =>
        categories.find(
          (item) =>
            item.slug === slug
        ),

      [
        categories,
        slug,
      ]
    );


  // =========================
  // CATEGORY FOODS
  // =========================

  const categoryFoods =
    useMemo(
      () =>
        foods.filter(
          (food) =>
            food.categorySlug ===
            slug
        ),

      [
        foods,
        slug,
      ]
    );


  // =========================
  // FILTERED FOODS
  // =========================

  const filteredFoods =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();


      return categoryFoods.filter(
        (food) => {
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
            matchesSearch &&
            matchesType
          );
        }
      );
    }, [
      categoryFoods,
      searchTerm,
      foodType,
    ]);


  const hasFilters =
    Boolean(
      searchTerm.trim()
    ) ||
    foodType !== "all";


  // =========================
  // CLEAR FILTER
  // =========================

  const clearFilters = () => {
    setSearchTerm("");
    setFoodType("all");
  };


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
  // restaurant in redux
  const {
    restaurants,
  } = useSelector(
    (state) =>
      state.publicRestaurant
  );

  // =========================
  // LOADING
  // =========================

  if (categoryLoading) {
    return (
      <div
        className="
          min-h-screen
          bg-[#fffaf5]
          py-8
        "
      >
        <Container>
          <Skeleton
            width="w-full"
            height="h-[260px] sm:h-[320px]"
            rounded="rounded-[2rem]"
          />


          <div
            className="
              mt-8

              grid
              gap-5

              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {Array.from({
              length: 8,
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
        </Container>
      </div>
    );
  }


  // =========================
  // ERROR
  // =========================

  if (categoryError) {
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
            title="Unable to load category"

            description={
              typeof categoryError ===
                "string"
                ? categoryError
                : "Something went wrong while loading this category."
            }
          />
        </Container>
      </div>
    );
  }


  // =========================
  // CATEGORY NOT FOUND
  // =========================

  if (!category) {
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
            icon={FaUtensils}

            title="Category not found"

            description="The food category you are looking for is unavailable."
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
          CATEGORY HERO
      ========================== */}

      <section
        className="
          pb-8
          pt-6

          sm:pb-10
          sm:pt-8
        "
      >
        <Container>
          <div
            className="
              relative

              min-h-[260px]

              overflow-hidden

              rounded-[2rem]

              bg-slate-950

              shadow-xl
              shadow-slate-950/10

              sm:min-h-[320px]
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
                  category.image
                }

                alt={
                  category.name
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
                  via-slate-950/80
                  to-slate-950/20
                "
              />


              <div
                className="
                  absolute
                  inset-0

                  bg-gradient-to-t
                  from-slate-950/80
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
                min-h-[260px]
                items-end

                p-5

                sm:min-h-[320px]
                sm:p-8

                lg:p-10
              "
            >
              <div
                className="
                  max-w-2xl
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2

                    rounded-full

                    border
                    border-orange-400/20

                    bg-orange-400/15

                    px-3
                    py-1.5

                    text-xs
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-orange-300

                    backdrop-blur
                  "
                >
                  <FaUtensils
                    className="
                      h-3
                      w-3
                    "
                  />

                  Food category
                </span>


                <h1
                  className="
                    mt-4

                    text-3xl
                    font-black
                    tracking-tight
                    text-white

                    sm:text-4xl

                    lg:text-5xl
                  "
                >
                  {category.name}
                </h1>


                <p
                  className="
                    mt-3

                    max-w-xl

                    text-sm
                    leading-7
                    text-slate-300

                    sm:text-base
                  "
                >
                  Discover{" "}
                  {category.name}
                  {" "}
                  dishes from different
                  restaurants and choose
                  what you love.
                </p>


                <div
                  className="
                    mt-5

                    inline-flex
                    items-center
                    gap-2

                    rounded-xl

                    bg-white/10

                    px-3
                    py-2

                    text-xs
                    font-semibold
                    text-white

                    backdrop-blur

                    sm:text-sm
                  "
                >
                  <span
                    className="
                      font-black
                      text-orange-300
                    "
                  >
                    {
                      categoryFoods.length
                    }
                  </span>

                  food
                  {
                    categoryFoods.length !==
                      1
                      ? "s"
                      : ""
                  }{" "}
                  available
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>


      {/* =========================
          FOODS
      ========================== */}

      <section
        className="
          pb-16

          lg:pb-20
        "
      >
        <Container>
          {/* =====================
              HEADER
          ====================== */}

          <div
            className="
              mb-6
            "
          >
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.15em]
                text-orange-500
              "
            >
              Explore dishes
            </p>


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
              Best of{" "}

              <span
                className="
                  text-orange-500
                "
              >
                {category.name}
              </span>
            </h2>
          </div>


          {/* =====================
              FILTER AREA
          ====================== */}

          <div
            className="
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
                    searchTerm
                  }

                  onChange={(
                    event
                  ) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }

                  placeholder={`Search ${category.name}...`}

                  aria-label={`Search ${category.name} food`}

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


                {searchTerm && (
                  <button
                    type="button"

                    onClick={() =>
                      setSearchTerm("")
                    }

                    aria-label="Clear search"

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


              {/* =====================
                  FOOD TYPE
              ====================== */}

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

                    px-4

                    text-xs
                    font-black

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

                          hover:bg-slate-200
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

                    px-4

                    text-xs
                    font-black

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
                  <FaLeaf
                    className="
                      h-3
                      w-3
                    "
                  />

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

                    px-4

                    text-xs
                    font-black

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


            {/* FILTER META */}

            {!foodLoading && (
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
                      font-black
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
                  }
                </p>


                {hasFilters && (
                  <button
                    type="button"

                    onClick={
                      clearFilters
                    }

                    className="
                      text-xs
                      font-black
                      text-orange-600

                      transition

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
              LOADING
          ====================== */}

          {foodLoading && (
            <div
              className="
                mt-7

                grid
                gap-5

                sm:grid-cols-2

                lg:grid-cols-3

                xl:grid-cols-4
              "
            >
              {Array.from({
                length: 8,
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
              EMPTY
          ====================== */}

          {!foodLoading &&
            filteredFoods.length ===
            0 && (
              <div
                className="
                  mt-7
                "
              >
                <EmptyState
                  icon={
                    FaUtensils
                  }

                  title={
                    hasFilters
                      ? "No matching food found"
                      : `No ${category.name} food available`
                  }

                  description={
                    hasFilters
                      ? "Try another food name or change the food type filter."
                      : "Food items from this category will appear here when restaurants add them."
                  }

                  action={
                    hasFilters ? (
                      <Button
                        type="button"

                        onClick={
                          clearFilters
                        }
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

          {!foodLoading &&
            filteredFoods.length >
            0 && (
              <div
                className="
                  mt-7

                  grid
                  gap-5

                  sm:grid-cols-2

                  lg:grid-cols-3

                  xl:grid-cols-4
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


export default CategoryFoods;