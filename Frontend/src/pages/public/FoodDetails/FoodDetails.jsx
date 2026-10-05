import {
  useEffect,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaLeaf,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaStore,
  FaTimesCircle,
  FaUtensils,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import OptimizedImage from "../../../components/common/OptimizedImage/OptimizedImage";

import {
  getFoodBySlug,
} from "../../../redux/thunks/public/food.thunk";

import {
  addCartItem,
} from "../../../redux/thunks/public/cart.thunk";


const FoodDetails = () => {
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
    selectedFood:
      food,

    detailLoading,

    detailError,
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
  // LOAD FOOD
  // =========================

  useEffect(() => {
    if (!slug) {
      return;
    }

    dispatch(
      getFoodBySlug(
        slug
      )
    );
  }, [
    dispatch,
    slug,
  ]);


  // =========================
  // PRICE
  // =========================

  const hasDiscount =
    food?.discountPrice !==
      null &&
    food?.discountPrice !==
      undefined &&
    Number(
      food.discountPrice
    ) <
      Number(
        food?.price || 0
      );


  const finalPrice =
    hasDiscount
      ? Number(
          food.discountPrice
        )
      : Number(
          food?.price || 0
        );


  const discountPercent =
    hasDiscount &&
    Number(food.price) > 0
      ? Math.round(
          ((Number(
            food.price
          ) -
            Number(
              food.discountPrice
            )) /
            Number(
              food.price
            )) *
            100
        )
      : 0;


  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart =
    async () => {
      if (
        !food?.slug ||
        food?.isAvailable ===
          false
      ) {
        return;
      }


      if (
        !isAuthenticated
      ) {
        navigate(
          "/login",
          {
            state: {
              from:
                location.pathname,
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
          "ADD TO CART ERROR:",
          error
        );
      }
    };


  // =========================
  // LOADING
  // =========================

  if (detailLoading) {
    return (
      <main
        className="
          min-h-screen
          bg-[#fffaf5]
          py-10
        "
      >
        <Container>
          <Skeleton
            width="w-32"
            height="h-8"
          />

          <div
            className="
              mt-7

              grid
              gap-8

              lg:grid-cols-2
            "
          >
            <Skeleton
              width="w-full"
              height="h-[500px]"
              rounded="rounded-[2rem]"
            />

            <div
              className="
                space-y-4
              "
            >
              <Skeleton
                width="w-24"
                height="h-7"
              />

              <Skeleton
                width="w-3/4"
                height="h-12"
              />

              <Skeleton
                width="w-full"
                height="h-24"
              />

              <Skeleton
                width="w-full"
                height="h-16"
              />
            </div>
          </div>
        </Container>
      </main>
    );
  }


  // =========================
  // ERROR
  // =========================

  if (detailError) {
    return (
      <main
        className="
          min-h-[70vh]
          bg-[#fffaf5]
          py-14
        "
      >
        <Container>
          <ErrorState
            title="Unable to load food"

            description={
              typeof detailError ===
              "string"
                ? detailError
                : "Something went wrong while loading this food."
            }
          />
        </Container>
      </main>
    );
  }


  // =========================
  // NOT FOUND
  // =========================

  if (!food) {
    return (
      <main
        className="
          min-h-[70vh]
          bg-[#fffaf5]
          py-14
        "
      >
        <Container>
          <EmptyState
            icon={
              FaUtensils
            }

            title="Food not found"

            description="This food item is unavailable or no longer exists."
          />
        </Container>
      </main>
    );
  }


  return (
    <main
      className="
        min-h-screen
        bg-[#fffaf5]

        pb-16
      "
    >
      {/* =========================
          TOP
      ========================== */}

      <section
        className="
          border-b
          border-orange-100

          bg-white
        "
      >
        <Container>
          <div
            className="
              py-5
            "
          >
            <button
              type="button"

              onClick={() =>
                navigate(-1)
              }

              className="
                inline-flex
                items-center
                gap-2

                text-sm
                font-bold
                text-slate-500

                transition

                hover:text-orange-600
              "
            >
              <FaArrowLeft />

              Back
            </button>
          </div>
        </Container>
      </section>


      {/* =========================
          FOOD DETAILS
      ========================== */}

      <section
        className="
          py-8

          sm:py-10

          lg:py-14
        "
      >
        <Container>
          <div
            className="
              grid
              gap-8

              lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]
              lg:items-start

              xl:gap-12
            "
          >
            {/* =====================
                IMAGE
            ====================== */}

            <div
              className="
                relative

                overflow-hidden

                rounded-[2rem]

                bg-white

                shadow-xl
                shadow-slate-950/5
              "
            >
              <div
                className="
                  aspect-[4/3]
                  w-full
                "
              >
                <OptimizedImage
                  src={
                    food.image
                  }

                  alt={
                    food.name
                  }

                  className="
                    h-full
                    w-full
                    object-cover
                  "

                  rounded="rounded-none"
                />
              </div>


              {/* VEG / NON VEG */}

              <div
                className="
                  absolute
                  left-4
                  top-4
                "
              >
                <span
                  className={`
                    inline-flex
                    items-center
                    gap-2

                    rounded-full

                    px-3
                    py-2

                    text-xs
                    font-black

                    shadow-lg
                    backdrop-blur

                    ${
                      food.isVeg
                        ? `
                          bg-emerald-500
                          text-white
                        `
                        : `
                          bg-rose-500
                          text-white
                        `
                    }
                  `}
                >
                  {food.isVeg && (
                    <FaLeaf />
                  )}

                  {food.isVeg
                    ? "Veg"
                    : "Non Veg"}
                </span>
              </div>


              {/* DISCOUNT */}

              {discountPercent >
                0 && (
                <div
                  className="
                    absolute
                    right-4
                    top-4

                    rounded-full

                    bg-orange-500

                    px-3
                    py-2

                    text-xs
                    font-black
                    text-white

                    shadow-lg
                  "
                >
                  {
                    discountPercent
                  }
                  % OFF
                </div>
              )}
            </div>


            {/* =====================
                CONTENT
            ====================== */}

            <div>
              {/* CATEGORY */}

              {food.categoryName && (
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-orange-500
                  "
                >
                  {
                    food.categoryName
                  }
                </p>
              )}


              {/* NAME */}

              <h1
                className="
                  mt-2

                  text-3xl
                  font-black
                  leading-tight
                  tracking-tight
                  text-slate-950

                  sm:text-4xl

                  lg:text-5xl
                "
              >
                {
                  food.name
                }
              </h1>


              {/* DESCRIPTION */}

              {food.description && (
                <p
                  className="
                    mt-4

                    max-w-2xl

                    text-sm
                    leading-7
                    text-slate-500

                    sm:text-base
                  "
                >
                  {
                    food.description
                  }
                </p>
              )}


              {/* =====================
                  META
              ====================== */}

              <div
                className="
                  mt-6

                  flex
                  flex-wrap
                  gap-3
                "
              >
                {food.preparationTime && (
                  <div
                    className="
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
                      font-bold
                      text-slate-700
                    "
                  >
                    <FaClock
                      className="
                        text-orange-500
                      "
                    />

                    {
                      food.preparationTime
                    }{" "}
                    min
                  </div>
                )}


                <div
                  className={`
                    inline-flex
                    items-center
                    gap-2

                    rounded-xl

                    border

                    px-3
                    py-2

                    text-sm
                    font-bold

                    ${
                      food.isAvailable
                        ? `
                          border-emerald-200
                          bg-emerald-50
                          text-emerald-700
                        `
                        : `
                          border-rose-200
                          bg-rose-50
                          text-rose-700
                        `
                    }
                  `}
                >
                  {food.isAvailable ? (
                    <FaCheckCircle />
                  ) : (
                    <FaTimesCircle />
                  )}

                  {food.isAvailable
                    ? "Available"
                    : "Unavailable"}
                </div>
              </div>


              {/* =====================
                  PRICE
              ====================== */}

              <div
                className="
                  mt-7

                  rounded-[1.5rem]

                  border
                  border-orange-100

                  bg-orange-50/60

                  p-5
                "
              >
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Price
                </p>


                <div
                  className="
                    mt-2

                    flex
                    flex-wrap
                    items-end
                    gap-3
                  "
                >
                  <span
                    className="
                      text-3xl
                      font-black
                      text-slate-950
                    "
                  >
                    ₹
                    {finalPrice.toFixed(
                      2
                    )}
                  </span>


                  {hasDiscount && (
                    <>
                      <span
                        className="
                          pb-1

                          text-base
                          font-bold
                          text-slate-400

                          line-through
                        "
                      >
                        ₹
                        {Number(
                          food.price
                        ).toFixed(
                          2
                        )}
                      </span>


                      <span
                        className="
                          mb-1

                          rounded-full

                          bg-emerald-100

                          px-2
                          py-1

                          text-xs
                          font-black
                          text-emerald-700
                        "
                      >
                        Save{" "}
                        {
                          discountPercent
                        }
                        %
                      </span>
                    </>
                  )}
                </div>
              </div>


              {/* =====================
                  RESTAURANT
              ====================== */}

              {food.restaurantName && (
                <Link
                  to={`/restaurants/${food.restaurantSlug}`}

                  className="
                    mt-6

                    flex
                    items-center
                    gap-4

                    rounded-[1.5rem]

                    border
                    border-slate-200

                    bg-white

                    p-4

                    transition

                    hover:border-orange-200
                    hover:shadow-md
                  "
                >
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center

                      overflow-hidden

                      rounded-xl

                      bg-orange-50

                      text-orange-500
                    "
                  >
                    {food.restaurantLogo ? (
                      <img
                        src={
                          food.restaurantLogo
                        }

                        alt={
                          food.restaurantName
                        }

                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    ) : (
                      <FaStore />
                    )}
                  </div>


                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <p
                      className="
                        text-xs
                        font-semibold
                        text-slate-400
                      "
                    >
                      Restaurant
                    </p>

                    <p
                      className="
                        mt-0.5

                        truncate

                        font-black
                        text-slate-950
                      "
                    >
                      {
                        food.restaurantName
                      }
                    </p>

                    {(food.restaurantCity ||
                      food.city) && (
                      <p
                        className="
                          mt-1

                          flex
                          items-center
                          gap-1.5

                          text-xs
                          text-slate-500
                        "
                      >
                        <FaMapMarkerAlt />

                        {food.restaurantCity ||
                          food.city}
                      </p>
                    )}
                  </div>
                </Link>
              )}


              {/* =====================
                  ADD CART
              ====================== */}

              <div
                className="
                  mt-7
                "
              >
                <button
                  type="button"

                  disabled={
                    food.isAvailable ===
                    false
                  }

                  onClick={
                    handleAddToCart
                  }

                  className="
                    inline-flex
                    min-h-14
                    w-full
                    items-center
                    justify-center
                    gap-3

                    rounded-2xl

                    bg-gradient-to-r
                    from-orange-500
                    to-rose-500

                    px-6

                    text-base
                    font-black
                    text-white

                    shadow-lg
                    shadow-orange-500/20

                    transition

                    hover:-translate-y-0.5
                    hover:shadow-xl

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    disabled:hover:translate-y-0

                    sm:w-auto
                    sm:min-w-[240px]
                  "
                >
                  <FaShoppingBag />

                  {food.isAvailable ===
                  false
                    ? "Currently Unavailable"
                    : `Add to Cart • ₹${finalPrice.toFixed(
                        2
                      )}`}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
};


export default FoodDetails;