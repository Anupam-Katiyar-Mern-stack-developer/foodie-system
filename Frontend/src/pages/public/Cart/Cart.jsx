import {
  useMemo,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  FaArrowRight,
  FaExclamationTriangle,
  FaShoppingBag,
  FaStore,
  FaTrash,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import Button from "../../../components/common/Button/Button";

import CartItem from "../../../components/public/CartItem/CartItem";

import {
  clearCartLocal,
  removeCartItemLocal,
  updateCartQuantityLocal,
} from "../../../redux/slices/public/cart.slice";


const Cart = () => {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();


  // =========================
  // REDUX
  // =========================

  const {
    cartGroups,
    fetchLoading,
    updatingSlug,
    deletingSlug,
    clearLoading,
  } = useSelector(
    (state) =>
      state.publicCart
  );


  // =========================
  // DERIVED CART DATA
  // =========================

  const cartSummary =
    useMemo(() => {
      let totalItems = 0;

      let totalAmount = 0;

      let unavailableItems = 0;


      cartGroups.forEach(
        (group) => {
          group.items.forEach(
            (item) => {
              const hasDiscount =
                item.discountPrice &&
                Number(
                  item.discountPrice
                ) <
                  Number(
                    item.price
                  );


              const price =
                hasDiscount
                  ? Number(
                      item.discountPrice
                    )
                  : Number(
                      item.price
                    );


              totalItems +=
                Number(
                  item.quantity
                );


              totalAmount +=
                price *
                Number(
                  item.quantity
                );


              if (
                !item.isAvailable
              ) {
                unavailableItems +=
                  1;
              }
            }
          );
        }
      );


      return {
        totalItems,
        totalAmount,
        unavailableItems,
        restaurantCount:
          cartGroups.length,
      };
    }, [
      cartGroups,
    ]);


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


  // =========================
  // QUANTITY
  // =========================

  const handleQuantityChange = ({
    restaurantSlug,
    foodSlug,
    quantity,
  }) => {
    /*
      Later:
      dispatch(
        updateCartQuantityThunk(...)
      )
    */

    dispatch(
      updateCartQuantityLocal({
        restaurantSlug,
        foodSlug,
        quantity,
      })
    );
  };


  // =========================
  // REMOVE
  // =========================

  const handleRemove = ({
    restaurantSlug,
    foodSlug,
  }) => {
    /*
      Later:
      dispatch(
        removeCartItemThunk(...)
      )
    */

    dispatch(
      removeCartItemLocal({
        restaurantSlug,
        foodSlug,
      })
    );
  };


  // =========================
  // CLEAR
  // =========================

  const handleClearCart =
    () => {
      /*
        Later clear cart thunk.
      */

      dispatch(
        clearCartLocal()
      );
    };


  // =========================
  // CHECKOUT
  // =========================

  const handleCheckout =
    () => {
      if (
        cartSummary
          .unavailableItems >
        0
      ) {
        return;
      }


      navigate("/checkout");
    };


  // =========================
  // LOADING
  // =========================

  if (fetchLoading) {
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
            width="w-60"
            height="h-10"
          />

          <div
            className="
              mt-8

              grid
              gap-6

              lg:grid-cols-[1fr_360px]
            "
          >
            <Skeleton
              width="w-full"
              height="h-[520px]"
              rounded="rounded-[2rem]"
            />

            <Skeleton
              width="w-full"
              height="h-[360px]"
              rounded="rounded-[2rem]"
            />
          </div>
        </Container>
      </div>
    );
  }


  // =========================
  // EMPTY
  // =========================

  if (
    cartGroups.length === 0
  ) {
    return (
      <div
        className="
          min-h-[70vh]

          bg-[#fffaf5]

          py-14
        "
      >
        <Container>
          <EmptyState
            icon={
              FaShoppingBag
            }

            title="Your cart is empty"

            description="Add delicious food from your favourite restaurants and it will appear here."

            action={
              <Button
                type="button"

                onClick={() =>
                  navigate(
                    "/restaurants"
                  )
                }
              >
                Explore Restaurants
              </Button>
            }
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
          HEADER
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
              py-9

              sm:py-11
            "
          >
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
                  <FaShoppingBag />

                  Your cart
                </div>


                <h1
                  className="
                    mt-2

                    text-3xl
                    font-black
                    tracking-tight
                    text-slate-950

                    sm:text-4xl
                  "
                >
                  Ready to
                  <span
                    className="
                      text-orange-500
                    "
                  >
                    {" "}
                    checkout?
                  </span>
                </h1>


                <p
                  className="
                    mt-2

                    text-sm
                    text-slate-500

                    sm:text-base
                  "
                >
                  {
                    cartSummary.totalItems
                  }{" "}
                  item
                  {
                    cartSummary.totalItems !==
                    1
                      ? "s"
                      : ""
                  }{" "}
                  from{" "}
                  {
                    cartSummary.restaurantCount
                  }{" "}
                  restaurant
                  {
                    cartSummary.restaurantCount !==
                    1
                      ? "s"
                      : ""
                  }.
                </p>
              </div>


              <button
                type="button"

                onClick={
                  handleClearCart
                }

                disabled={
                  clearLoading
                }

                className="
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  border
                  border-rose-200

                  bg-rose-50

                  px-4

                  text-sm
                  font-bold
                  text-rose-600

                  transition

                  hover:bg-rose-100

                  disabled:opacity-50
                "
              >
                <FaTrash
                  className="
                    h-3
                    w-3
                  "
                />

                Clear cart
              </button>
            </div>
          </div>
        </Container>
      </section>


      {/* =========================
          CART CONTENT
      ========================== */}

      <section
        className="
          py-8

          sm:py-10

          lg:py-12
        "
      >
        <Container>
          <div
            className="
              grid
              gap-6

              lg:grid-cols-[minmax(0,1fr)_360px]
              lg:items-start
            "
          >
            {/* =====================
                RESTAURANT GROUPS
            ====================== */}

            <div
              className="
                space-y-5
              "
            >
              {cartGroups.map(
                (group) => {
                  const {
                    restaurant,
                    items,
                  } = group;


                  return (
                    <div
                      key={
                        restaurant.slug
                      }

                      className="
                        overflow-hidden

                        rounded-[1.75rem]

                        border
                        border-slate-200

                        bg-white

                        shadow-sm
                      "
                    >
                      {/* RESTAURANT HEADER */}

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3

                          border-b
                          border-slate-100

                          bg-slate-50/70

                          px-4
                          py-4

                          sm:px-5
                        "
                      >
                        <Link
                          to={`/restaurants/${restaurant.slug}`}

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
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center

                              rounded-xl

                              bg-orange-100

                              text-orange-600
                            "
                          >
                            <FaStore
                              className="
                                h-4
                                w-4
                              "
                            />
                          </span>


                          <div
                            className="
                              min-w-0
                            "
                          >
                            <p
                              className="
                                truncate

                                text-sm
                                font-black
                                text-slate-950

                                sm:text-base
                              "
                            >
                              {
                                restaurant.restaurantName
                              }
                            </p>

                            <p
                              className="
                                mt-0.5

                                text-xs
                                text-slate-400
                              "
                            >
                              {
                                items.length
                              }{" "}
                              item
                              {
                                items.length !==
                                1
                                  ? "s"
                                  : ""
                              }
                            </p>
                          </div>
                        </Link>


                        <span
                          className={`
                            shrink-0

                            rounded-full

                            px-2.5
                            py-1

                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wide

                            ${
                              restaurant.isOpen
                                ? `
                                  bg-emerald-50
                                  text-emerald-700
                                `
                                : `
                                  bg-rose-50
                                  text-rose-700
                                `
                            }
                          `}
                        >
                          {
                            restaurant.isOpen
                              ? "Open"
                              : "Closed"
                          }
                        </span>
                      </div>


                      {/* ITEMS */}

                      <div
                        className="
                          px-4

                          sm:px-5
                        "
                      >
                        {items.map(
                          (item) => (
                            <CartItem
                              key={
                                item.slug
                              }

                              item={
                                item
                              }

                              updating={
                                updatingSlug ===
                                item.slug
                              }

                              deleting={
                                deletingSlug ===
                                item.slug
                              }

                              onIncrease={() =>
                                handleQuantityChange(
                                  {
                                    restaurantSlug:
                                      restaurant.slug,

                                    foodSlug:
                                      item.slug,

                                    quantity:
                                      item.quantity +
                                      1,
                                  }
                                )
                              }

                              onDecrease={() =>
                                handleQuantityChange(
                                  {
                                    restaurantSlug:
                                      restaurant.slug,

                                    foodSlug:
                                      item.slug,

                                    quantity:
                                      item.quantity -
                                      1,
                                  }
                                )
                              }

                              onRemove={() =>
                                handleRemove(
                                  {
                                    restaurantSlug:
                                      restaurant.slug,

                                    foodSlug:
                                      item.slug,
                                  }
                                )
                              }
                            />
                          )
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>


            {/* =====================
                ORDER SUMMARY
            ====================== */}

            <aside
              className="
                lg:sticky
                lg:top-28
              "
            >
              <div
                className="
                  overflow-hidden

                  rounded-[1.75rem]

                  border
                  border-slate-200

                  bg-white

                  shadow-lg
                  shadow-slate-950/5
                "
              >
                <div
                  className="
                    border-b
                    border-slate-100

                    p-5
                  "
                >
                  <h2
                    className="
                      text-xl
                      font-black
                      text-slate-950
                    "
                  >
                    Order summary
                  </h2>

                  <p
                    className="
                      mt-1

                      text-xs
                      text-slate-500
                    "
                  >
                    Review before checkout.
                  </p>
                </div>


                <div
                  className="
                    space-y-4

                    p-5
                  "
                >
                  {/* ITEMS */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4

                      text-sm
                    "
                  >
                    <span
                      className="
                        text-slate-500
                      "
                    >
                      Total items
                    </span>

                    <span
                      className="
                        font-bold
                        text-slate-900
                      "
                    >
                      {
                        cartSummary.totalItems
                      }
                    </span>
                  </div>


                  {/* RESTAURANTS */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4

                      text-sm
                    "
                  >
                    <span
                      className="
                        text-slate-500
                      "
                    >
                      Restaurants
                    </span>

                    <span
                      className="
                        font-bold
                        text-slate-900
                      "
                    >
                      {
                        cartSummary.restaurantCount
                      }
                    </span>
                  </div>


                  <div
                    className="
                      h-px
                      bg-slate-100
                    "
                  />


                  {/* FOOD TOTAL */}

                  <div
                    className="
                      flex
                      items-end
                      justify-between
                      gap-4
                    "
                  >
                    <div>
                      <p
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-wide
                          text-slate-400
                        "
                      >
                        Food total
                      </p>

                      <p
                        className="
                          mt-1

                          text-xs
                          text-slate-400
                        "
                      >
                        Final amount is
                        validated during
                        checkout.
                      </p>
                    </div>


                    <p
                      className="
                        shrink-0

                        text-2xl
                        font-black
                        text-slate-950
                      "
                    >
                      {formatPrice(
                        cartSummary.totalAmount
                      )}
                    </p>
                  </div>


                  {/* MULTI RESTAURANT INFO */}

                  {cartSummary.restaurantCount >
                    1 && (
                    <div
                      className="
                        rounded-2xl

                        border
                        border-orange-200

                        bg-orange-50

                        p-3.5
                      "
                    >
                      <div
                        className="
                          flex
                          gap-2.5
                        "
                      >
                        <FaStore
                          className="
                            mt-0.5
                            shrink-0

                            text-orange-500
                          "
                        />

                        <p
                          className="
                            text-xs
                            leading-5
                            text-orange-800
                          "
                        >
                          Your cart contains
                          food from multiple
                          restaurants.
                          Checkout will
                          create separate
                          restaurant orders.
                        </p>
                      </div>
                    </div>
                  )}


                  {/* UNAVAILABLE */}

                  {cartSummary.unavailableItems >
                    0 && (
                    <div
                      className="
                        rounded-2xl

                        border
                        border-rose-200

                        bg-rose-50

                        p-3.5
                      "
                    >
                      <div
                        className="
                          flex
                          gap-2.5
                        "
                      >
                        <FaExclamationTriangle
                          className="
                            mt-0.5
                            shrink-0

                            text-rose-500
                          "
                        />

                        <p
                          className="
                            text-xs
                            leading-5
                            text-rose-700
                          "
                        >
                          Remove unavailable
                          items before
                          checkout.
                        </p>
                      </div>
                    </div>
                  )}


                  {/* CHECKOUT */}

                  <button
                    type="button"

                    onClick={
                      handleCheckout
                    }

                    disabled={
                      cartSummary.unavailableItems >
                      0
                    }

                    className="
                      inline-flex
                      min-h-12
                      w-full
                      items-center
                      justify-center
                      gap-2

                      rounded-2xl

                      bg-gradient-to-r
                      from-orange-500
                      to-rose-500

                      px-5

                      text-sm
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
                    "
                  >
                    Continue to Checkout

                    <FaArrowRight
                      className="
                        h-3
                        w-3
                      "
                    />
                  </button>


                  <Link
                    to="/restaurants"

                    className="
                      inline-flex
                      min-h-11
                      w-full
                      items-center
                      justify-center

                      rounded-xl

                      text-sm
                      font-bold
                      text-slate-500

                      transition

                      hover:bg-slate-50
                      hover:text-orange-600
                    "
                  >
                    Add more food
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </div>
  );
};


export default Cart;