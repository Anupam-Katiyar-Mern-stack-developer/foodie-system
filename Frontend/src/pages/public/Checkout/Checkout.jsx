import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";



import {
    FaArrowLeft,
    FaCheck,
    FaExclamationTriangle,
    FaHome,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaPlus,
    FaShoppingBag,
    FaStore,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import {
    placeOrder,
} from "../../../redux/thunks/public/order.thunk";
import {
    useDispatch,
    useSelector,
} from "react-redux";

const Checkout = () => {
    const navigate =
        useNavigate();

    const dispatch =
        useDispatch();
    // =========================
    // REDUX
    // =========================

    const {
        cartGroups,
        fetchLoading:
        cartLoading,
    } = useSelector(
        (state) =>
            state.publicCart
    );


    const {
        addresses,
        fetchLoading:
        addressLoading,
    } = useSelector(
        (state) =>
            state.publicAddress
    );


    const {
        placeOrderLoading,
        placeOrderError,
    } = useSelector(
        (state) =>
            state.publicOrder
    );

    // =========================
    // LOCAL STATE
    // =========================

    const [
        selectedAddressId,
        setSelectedAddressId,
    ] = useState(null);


    // =========================
    // DEFAULT ADDRESS
    // =========================

    useEffect(() => {
        if (
            selectedAddressId ||
            addresses.length === 0
        ) {
            return;
        }


        const defaultAddress =
            addresses.find(
                (address) =>
                    address.isDefault
            );


        setSelectedAddressId(
            defaultAddress?.id ||
            addresses[0]?.id
        );
    }, [
        addresses,
        selectedAddressId,
    ]);


    // =========================
    // SELECTED ADDRESS
    // =========================

    const selectedAddress =
        useMemo(
            () =>
                addresses.find(
                    (address) =>
                        address.id ===
                        selectedAddressId
                ),

            [
                addresses,
                selectedAddressId,
            ]
        );


    // =========================
    // CHECKOUT SUMMARY
    // =========================

    const summary =
        useMemo(() => {
            let totalItems = 0;

            let foodTotal = 0;

            let unavailableItems = 0;

            let closedRestaurants = 0;


            cartGroups.forEach(
                (group) => {
                    if (
                        group.restaurant
                            .isOpen === false
                    ) {
                        closedRestaurants +=
                            1;
                    }


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


                            const unitPrice =
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


                            foodTotal +=
                                unitPrice *
                                Number(
                                    item.quantity
                                );


                            if (
                                item.isAvailable ===
                                false
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

                foodTotal,

                restaurantCount:
                    cartGroups.length,

                unavailableItems,

                closedRestaurants,
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
    // VALIDATION
    // =========================

    const canPlaceOrder =
        Boolean(
            selectedAddress
        ) &&
        cartGroups.length > 0 &&
        summary.unavailableItems ===
        0 &&
        summary.closedRestaurants ===
        0;


    // =========================
    // PLACE ORDER
    // =========================

    const handlePlaceOrder =
        async () => {
            if (
                !canPlaceOrder ||
                !selectedAddress?.id ||
                placeOrderLoading
            ) {
                return;
            }

            try {
                const result =
                    await dispatch(
                        placeOrder({
                            addressId:
                                selectedAddress.id,

                            paymentMethod:
                                "COD",
                        })
                    ).unwrap();


                console.log(
                    "ORDER CREATED:",
                    result
                );


                navigate(
                    "/orders",
                    {
                        replace: true,
                    }
                );

            } catch (error) {
                console.error(
                    "PLACE ORDER ERROR:",
                    error
                );
            }
        };

    // =========================
    // LOADING
    // =========================

    if (
        cartLoading ||
        addressLoading
    ) {
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
                        width="w-52"
                        height="h-9"
                    />


                    <div
                        className="
              mt-8

              grid
              gap-6

              lg:grid-cols-[minmax(0,1fr)_380px]
            "
                    >
                        <div
                            className="
                space-y-5
              "
                        >
                            <Skeleton
                                width="w-full"
                                height="h-[300px]"
                                rounded="rounded-[2rem]"
                            />

                            <Skeleton
                                width="w-full"
                                height="h-[320px]"
                                rounded="rounded-[2rem]"
                            />
                        </div>


                        <Skeleton
                            width="w-full"
                            height="h-[420px]"
                            rounded="rounded-[2rem]"
                        />
                    </div>
                </Container>
            </div>
        );
    }


    // =========================
    // EMPTY CART
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

                        title="Nothing to checkout"

                        description="Your cart is empty. Add some food before continuing to checkout."

                        action={
                            <button
                                type="button"

                                onClick={() =>
                                    navigate(
                                        "/restaurants"
                                    )
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
                                Explore Restaurants
                            </button>
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
          PAGE HEADER
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
              py-8

              sm:py-10
            "
                    >
                        <button
                            type="button"

                            onClick={() =>
                                navigate("/cart")
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
                            <FaArrowLeft
                                className="
                  h-3
                  w-3
                "
                            />

                            Back to cart
                        </button>


                        <div
                            className="
                mt-5
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
                                Final step
                            </p>


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
                                Complete your
                                <span
                                    className="
                    text-orange-500
                  "
                                >
                                    {" "}
                                    order
                                </span>
                            </h1>


                            <p
                                className="
                  mt-2

                  max-w-2xl

                  text-sm
                  leading-6
                  text-slate-500

                  sm:text-base
                "
                            >
                                Select a delivery
                                address, review your
                                restaurants and confirm
                                your order.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>


            {/* =========================
          CHECKOUT CONTENT
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

              lg:grid-cols-[minmax(0,1fr)_380px]
              lg:items-start
            "
                    >
                        {/* =====================
                LEFT
            ====================== */}

                        <div
                            className="
                space-y-6
              "
                        >
                            {/* =====================
                  ADDRESS
              ====================== */}

                            <div
                                className="
                  rounded-[1.75rem]

                  border
                  border-slate-200

                  bg-white

                  p-5

                  shadow-sm

                  sm:p-6
                "
                            >
                                <div
                                    className="
                    flex
                    items-start
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
                          h-10
                          w-10
                          items-center
                          justify-center

                          rounded-xl

                          bg-orange-100

                          text-orange-600
                        "
                                            >
                                                <FaMapMarkerAlt
                                                    className="
                            h-4
                            w-4
                          "
                                                />
                                            </span>


                                            <div>
                                                <h2
                                                    className="
                            text-lg
                            font-black
                            text-slate-950

                            sm:text-xl
                          "
                                                >
                                                    Delivery address
                                                </h2>

                                                <p
                                                    className="
                            mt-0.5

                            text-xs
                            text-slate-500
                          "
                                                >
                                                    Where should we
                                                    deliver your food?
                                                </p>
                                            </div>
                                        </div>
                                    </div>


                                    <Link
                                        to="/addresses"

                                        className="
                      hidden
                      shrink-0
                      items-center
                      gap-1.5

                      rounded-xl

                      bg-orange-50

                      px-3
                      py-2

                      text-xs
                      font-bold
                      text-orange-600

                      sm:inline-flex
                    "
                                    >
                                        <FaPlus
                                            className="
                        h-2.5
                        w-2.5
                      "
                                        />

                                        Manage
                                    </Link>
                                </div>


                                {/* ADDRESSES */}

                                {addresses.length >
                                    0 ? (
                                    <div
                                        className="
                      mt-5

                      grid
                      gap-3
                    "
                                    >
                                        {addresses.map(
                                            (
                                                address
                                            ) => {
                                                const selected =
                                                    selectedAddressId ===
                                                    address.id;


                                                return (
                                                    <button
                                                        key={
                                                            address.id
                                                        }

                                                        type="button"

                                                        onClick={() =>
                                                            setSelectedAddressId(
                                                                address.id
                                                            )
                                                        }

                                                        className={`
                              relative

                              w-full

                              rounded-2xl

                              border-2

                              p-4

                              text-left

                              transition

                              ${selected
                                                                ? `
                                    border-orange-400
                                    bg-orange-50/70
                                  `
                                                                : `
                                    border-slate-100
                                    bg-slate-50/50

                                    hover:border-orange-200
                                    hover:bg-orange-50/30
                                  `
                                                            }
                            `}
                                                    >
                                                        <div
                                                            className="
                                flex
                                items-start
                                gap-3
                              "
                                                        >
                                                            <span
                                                                className={`
                                  flex
                                  h-10
                                  w-10
                                  shrink-0
                                  items-center
                                  justify-center

                                  rounded-xl

                                  ${selected
                                                                        ? `
                                        bg-orange-500
                                        text-white
                                      `
                                                                        : `
                                        bg-white
                                        text-slate-500
                                      `
                                                                    }
                                `}
                                                            >
                                                                <FaHome
                                                                    className="
                                    h-4
                                    w-4
                                  "
                                                                />
                                                            </span>


                                                            <div
                                                                className="
                                  min-w-0
                                  flex-1
                                "
                                                            >
                                                                <div
                                                                    className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                  "
                                                                >
                                                                    <p
                                                                        className="
                                      text-sm
                                      font-black
                                      text-slate-950
                                    "
                                                                    >
                                                                        {address.isDefault
                                                                            ? "Default Address"
                                                                            : "Saved Address"}
                                                                    </p>


                                                                    {address.isDefault && (
                                                                        <span
                                                                            className="
                                        rounded-full

                                        bg-emerald-100

                                        px-2
                                        py-0.5

                                        text-[9px]
                                        font-black
                                        uppercase
                                        tracking-wide
                                        text-emerald-700
                                      "
                                                                        >
                                                                            Default
                                                                        </span>
                                                                    )}
                                                                </div>


                                                                <p
                                                                    className="
                                    mt-1.5

                                    text-sm
                                    leading-6
                                    text-slate-600
                                  "
                                                                >
                                                                    {
                                                                        address.addressLine
                                                                    }
                                                                    ,{" "}
                                                                    {
                                                                        address.city
                                                                    }
                                                                    ,{" "}
                                                                    {
                                                                        address.state
                                                                    }
                                                                    {" - "}
                                                                    {
                                                                        address.pincode
                                                                    }
                                                                </p>
                                                            </div>


                                                            {/* SELECT */}

                                                            <span
                                                                className={`
                                  mt-1

                                  flex
                                  h-6
                                  w-6
                                  shrink-0
                                  items-center
                                  justify-center

                                  rounded-full

                                  border-2

                                  ${selected
                                                                        ? `
                                        border-orange-500
                                        bg-orange-500
                                        text-white
                                      `
                                                                        : `
                                        border-slate-300
                                        bg-white
                                      `
                                                                    }
                                `}
                                                            >
                                                                {selected && (
                                                                    <FaCheck
                                                                        className="
                                      h-2.5
                                      w-2.5
                                    "
                                                                    />
                                                                )}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            }
                                        )}


                                        <Link
                                            to="/addresses"

                                            className="
                        inline-flex
                        min-h-11
                        items-center
                        justify-center
                        gap-2

                        rounded-xl

                        border
                        border-dashed
                        border-orange-300

                        bg-orange-50/50

                        px-4

                        text-sm
                        font-bold
                        text-orange-600

                        sm:hidden
                      "
                                        >
                                            <FaPlus />

                                            Manage addresses
                                        </Link>
                                    </div>
                                ) : (
                                    <div
                                        className="
                      mt-5

                      rounded-2xl

                      border
                      border-dashed
                      border-orange-300

                      bg-orange-50

                      p-5

                      text-center
                    "
                                    >
                                        <FaMapMarkerAlt
                                            className="
                        mx-auto

                        text-xl
                        text-orange-500
                      "
                                        />

                                        <p
                                            className="
                        mt-3

                        text-sm
                        font-black
                        text-slate-900
                      "
                                        >
                                            No saved address
                                        </p>


                                        <p
                                            className="
                        mt-1

                        text-xs
                        text-slate-500
                      "
                                        >
                                            Add an address before
                                            placing your order.
                                        </p>


                                        <Link
                                            to="/addresses"

                                            className="
                        mt-4

                        inline-flex
                        min-h-10
                        items-center
                        justify-center

                        rounded-xl

                        bg-orange-500

                        px-4

                        text-xs
                        font-bold
                        text-white
                      "
                                        >
                                            Add Address
                                        </Link>
                                    </div>
                                )}
                            </div>


                            {/* =====================
                  PAYMENT
              ====================== */}

                            <div
                                className="
                  rounded-[1.75rem]

                  border
                  border-slate-200

                  bg-white

                  p-5

                  shadow-sm

                  sm:p-6
                "
                            >
                                <div
                                    className="
                    flex
                    items-center
                    gap-3
                  "
                                >
                                    <span
                                        className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center

                      rounded-xl

                      bg-emerald-100

                      text-emerald-600
                    "
                                    >
                                        <FaMoneyBillWave
                                            className="
                        h-4
                        w-4
                      "
                                        />
                                    </span>


                                    <div>
                                        <h2
                                            className="
                        text-lg
                        font-black
                        text-slate-950

                        sm:text-xl
                      "
                                        >
                                            Payment
                                        </h2>

                                        <p
                                            className="
                        mt-0.5

                        text-xs
                        text-slate-500
                      "
                                        >
                                            Available payment
                                            method
                                        </p>
                                    </div>
                                </div>


                                <div
                                    className="
                    mt-5

                    rounded-2xl

                    border-2
                    border-emerald-400

                    bg-emerald-50/60

                    p-4
                  "
                                >
                                    <div
                                        className="
                      flex
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

                        bg-emerald-500

                        text-white
                      "
                                        >
                                            <FaMoneyBillWave />
                                        </span>


                                        <div
                                            className="
                        min-w-0
                        flex-1
                      "
                                        >
                                            <p
                                                className="
                          text-sm
                          font-black
                          text-slate-950
                        "
                                            >
                                                Cash on Delivery
                                            </p>

                                            <p
                                                className="
                          mt-0.5

                          text-xs
                          text-slate-500
                        "
                                            >
                                                Pay when your order
                                                arrives.
                                            </p>
                                        </div>


                                        <span
                                            className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center

                        rounded-full

                        bg-emerald-500

                        text-white
                      "
                                        >
                                            <FaCheck
                                                className="
                          h-2.5
                          w-2.5
                        "
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>


                            {/* =====================
                  RESTAURANT REVIEW
              ====================== */}

                            <div
                                className="
                  rounded-[1.75rem]

                  border
                  border-slate-200

                  bg-white

                  p-5

                  shadow-sm

                  sm:p-6
                "
                            >
                                <div>
                                    <h2
                                        className="
                      text-lg
                      font-black
                      text-slate-950

                      sm:text-xl
                    "
                                    >
                                        Review your order
                                    </h2>

                                    <p
                                        className="
                      mt-1

                      text-xs
                      text-slate-500
                    "
                                    >
                                        Your checkout contains{" "}

                                        {
                                            summary.restaurantCount
                                        }{" "}

                                        restaurant
                                        {
                                            summary.restaurantCount !==
                                                1
                                                ? "s"
                                                : ""
                                        }.
                                    </p>
                                </div>


                                <div
                                    className="
                    mt-5
                    space-y-4
                  "
                                >
                                    {cartGroups.map(
                                        (group) => (
                                            <div
                                                key={
                                                    group
                                                        .restaurant
                                                        .slug
                                                }

                                                className="
                          rounded-2xl

                          border
                          border-slate-100

                          bg-slate-50/60

                          p-4
                        "
                                            >
                                                {/* RESTAURANT */}

                                                <div
                                                    className="
                            flex
                            items-center
                            justify-between
                            gap-3
                          "
                                                >
                                                    <div
                                                        className="
                              flex
                              min-w-0
                              items-center
                              gap-2.5
                            "
                                                    >
                                                        <span
                                                            className="
                                flex
                                h-9
                                w-9
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
                                  h-3.5
                                  w-3.5
                                "
                                                            />
                                                        </span>


                                                        <p
                                                            className="
                                truncate

                                text-sm
                                font-black
                                text-slate-950
                              "
                                                        >
                                                            {
                                                                group
                                                                    .restaurant
                                                                    .restaurantName
                                                            }
                                                        </p>
                                                    </div>


                                                    <span
                                                        className={`
                              shrink-0

                              rounded-full

                              px-2
                              py-1

                              text-[9px]
                              font-black
                              uppercase
                              tracking-wide

                              ${group
                                                                .restaurant
                                                                .isOpen
                                                                ? `
                                    bg-emerald-100
                                    text-emerald-700
                                  `
                                                                : `
                                    bg-rose-100
                                    text-rose-700
                                  `
                                                            }
                            `}
                                                    >
                                                        {group
                                                            .restaurant
                                                            .isOpen
                                                            ? "Open"
                                                            : "Closed"}
                                                    </span>
                                                </div>


                                                {/* FOODS */}

                                                <div
                                                    className="
                            mt-4
                            space-y-2
                          "
                                                >
                                                    {group.items.map(
                                                        (item) => (
                                                            <div
                                                                key={
                                                                    item.slug
                                                                }

                                                                className="
                                  flex
                                  items-center
                                  justify-between
                                  gap-3

                                  text-xs
                                "
                                                            >
                                                                <p
                                                                    className="
                                    min-w-0
                                    truncate
                                    text-slate-600
                                  "
                                                                >
                                                                    {
                                                                        item.name
                                                                    }

                                                                    <span
                                                                        className="
                                      ml-1

                                      font-bold
                                      text-slate-900
                                    "
                                                                    >
                                                                        ×{" "}
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </span>
                                                                </p>


                                                                {!item.isAvailable && (
                                                                    <span
                                                                        className="
                                      shrink-0

                                      font-bold
                                      text-rose-600
                                    "
                                                                    >
                                                                        Unavailable
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* =====================
                RIGHT SUMMARY
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

                  shadow-xl
                  shadow-slate-950/5
                "
                            >
                                {/* HEADER */}

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
                                        Checkout summary
                                    </h2>

                                    <p
                                        className="
                      mt-1

                      text-xs
                      text-slate-500
                    "
                                    >
                                        Final values are
                                        validated by the server.
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
                                            Items
                                        </span>

                                        <span
                                            className="
                        font-bold
                        text-slate-900
                      "
                                        >
                                            {
                                                summary.totalItems
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
                                                summary.restaurantCount
                                            }
                                        </span>
                                    </div>


                                    {/* PAYMENT */}

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
                                            Payment
                                        </span>

                                        <span
                                            className="
                        font-bold
                        text-emerald-600
                      "
                                        >
                                            COD
                                        </span>
                                    </div>


                                    <div
                                        className="
                      h-px
                      bg-slate-100
                    "
                                    />


                                    {/* TOTAL */}

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

                          text-[11px]
                          text-slate-400
                        "
                                            >
                                                Backend recalculates
                                                before order creation.
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
                                                summary.foodTotal
                                            )}
                                        </p>
                                    </div>


                                    {/* MULTI RESTAURANT */}

                                    {summary.restaurantCount >
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
                                                <p
                                                    className="
                          text-xs
                          leading-5
                          text-orange-800
                        "
                                                >
                                                    One checkout will
                                                    create separate orders
                                                    for each restaurant.
                                                </p>
                                            </div>
                                        )}


                                    {/* CLOSED */}

                                    {summary.closedRestaurants >
                                        0 && (
                                            <div
                                                className="
                        flex
                        gap-2.5

                        rounded-2xl

                        border
                        border-rose-200

                        bg-rose-50

                        p-3.5
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
                                                    A restaurant in your
                                                    cart is currently
                                                    closed.
                                                </p>
                                            </div>
                                        )}


                                    {/* UNAVAILABLE */}

                                    {summary.unavailableItems >
                                        0 && (
                                            <div
                                                className="
                        flex
                        gap-2.5

                        rounded-2xl

                        border
                        border-rose-200

                        bg-rose-50

                        p-3.5
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
                                                    food before placing
                                                    the order.
                                                </p>
                                            </div>
                                        )}


                                    {/* NO ADDRESS */}

                                    {!selectedAddress && (
                                        <div
                                            className="
                        flex
                        gap-2.5

                        rounded-2xl

                        border
                        border-amber-200

                        bg-amber-50

                        p-3.5
                      "
                                        >
                                            <FaMapMarkerAlt
                                                className="
                          mt-0.5
                          shrink-0

                          text-amber-500
                        "
                                            />

                                            <p
                                                className="
                          text-xs
                          leading-5
                          text-amber-800
                        "
                                            >
                                                Select a delivery
                                                address to continue.
                                            </p>
                                        </div>
                                    )}


                                    {/* PLACE ORDER */}

                                    <button
                                        type="button"

                                        onClick={
                                            handlePlaceOrder
                                        }

                                        disabled={
                                            !canPlaceOrder ||
                                            placeOrderLoading
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
                                        <FaShoppingBag
                                            className="
      h-3.5
      w-3.5
    "
                                        />

                                        {placeOrderLoading
                                            ? "Placing Order..."
                                            : "Place Order"}
                                    </button>


                                    {/* PREVIEW MESSAGE */}

                                    {placeOrderError && (
                                        <div
                                            className="
      rounded-xl

      border
      border-rose-200

      bg-rose-50

      p-3

      text-xs
      font-semibold
      leading-5
      text-rose-700
    "
                                        >
                                            {placeOrderError}
                                        </div>
                                    )}

                                    <p
                                        className="
                      text-center

                      text-[10px]
                      leading-4
                      text-slate-400
                    "
                                    >
                                        By placing the order,
                                        the final food prices,
                                        availability and
                                        restaurant status will
                                        be verified again.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </Container>
            </section>
        </div>
    );
};


export default Checkout;