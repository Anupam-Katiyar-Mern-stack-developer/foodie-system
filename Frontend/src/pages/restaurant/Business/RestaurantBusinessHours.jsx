import {
    useState,
} from "react";

import {
    CircleOff,
    Clock3,
    ShoppingBag,
    Store,
} from "lucide-react";

import {
    useEffect,

} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    getRestaurantProfile,
    updateRestaurantOpenStatus,
} from "../../../redux/thunks/restaurant/restaurantProfile.thunk";

import PageHeader
    from "../../../components/common/PageHeader/PageHeader";

import StatCard
    from "../../../components/common/StatCard/StatCard";

import StatusBadge
    from "../../../components/common/StatusBadge/StatusBadge";

import Button
    from "../../../components/common/Button/Button";

import Skeleton
    from "../../../components/common/Skeleton/Skeleton";

import ErrorState
    from "../../../components/common/ErrorState/ErrorState";

import ConfirmModal
    from "../../../components/common/ConfirmModal/ConfirmModal";


const RestaurantBusinessHours = () => {

    // =========================================
    // DUMMY RESTAURANT AVAILABILITY
    //
    // Later Redux profile/availability
    // state se replace hoga
    // =========================================

    const dispatch =
        useDispatch();


    const {
        profile: restaurant,
        fetchLoading,
        statusLoading,
        error,
    } = useSelector(
        (state) =>
            state.restaurantProfile
    );

    // =========================================
    // API-LIKE STATE
    // =========================================

    useEffect(() => {
        if (!restaurant) {
            dispatch(
                getRestaurantProfile()
            );
        }
    }, [
        dispatch,
        restaurant,
    ]);

    const [
        pendingStatus,
        setPendingStatus,
    ] = useState(null);


    // =========================================
    // CAN OPEN
    // =========================================

    const canOpen =
        restaurant.approvalStatus ===
        "APPROVED" &&
        !restaurant.isBlocked;


    // =========================================
    // REQUEST STATUS CHANGE
    // =========================================

    const handleStatusRequest =
        (nextStatus) => {
            if (
                nextStatus === true &&
                !canOpen
            ) {
                return;
            }


            setPendingStatus(
                nextStatus
            );
        };


    // =========================================
    // CONFIRM STATUS
    //
    // Later:
    //
    // await dispatch(
    //   updateRestaurantOpenStatus({
    //     isOpen: pendingStatus
    //   })
    // ).unwrap();
    // =========================================

    const handleConfirmStatus =
        async () => {
            if (
                pendingStatus ===
                null
            ) {
                return;
            }


            try {
                await dispatch(
                    updateRestaurantOpenStatus(
                        pendingStatus
                    )
                ).unwrap();


                setPendingStatus(
                    null
                );
            } catch (error) {
                console.error(
                    "RESTAURANT STATUS ERROR:",
                    error
                );
            }
        };


    // =========================================
    // LOADING
    // =========================================
    if (fetchLoading) {
        return (
            <div className="space-y-6 p-6">
                <Skeleton
                    height="h-10"
                    width="w-72"
                />

                <Skeleton
                    height="h-56"
                    width="w-full"
                    rounded="rounded-2xl"
                />
            </div>
        );
    }

    // =========================================
    // ERROR
    // =========================================
    if (
        error &&
        !restaurant
    ) {
        return (
            <ErrorState
                title="Unable to load restaurant"
                description={error}
                onRetry={() =>
                    dispatch(
                        getRestaurantProfile()
                    )
                }
            />
        );
    }


    return (
        <div
            className="
        space-y-7
      "
        >
            {/* =========================
          HEADER
      ========================== */}

            <PageHeader
                title="Restaurant Availability"

                description="Control whether your restaurant is currently accepting customer orders."
            />


            {/* =========================
          STATS
      ========================== */}

            <section
                className="
          grid
          gap-4

          md:grid-cols-3
        "
            >
                <StatCard
                    title="Restaurant Status"

                    value={
                        restaurant.isOpen
                            ? "Open"
                            : "Closed"
                    }

                    description={
                        restaurant.isOpen
                            ? "Customers can place orders"
                            : "New orders are currently disabled"
                    }

                    icon={
                        Store
                    }

                    variant={
                        restaurant.isOpen
                            ? "success"
                            : "danger"
                    }
                />


                <StatCard
                    title="Approval"

                    value={
                        restaurant.approvalStatus
                    }

                    description="Restaurant account approval"

                    icon={
                        Clock3
                    }

                    variant={
                        restaurant.approvalStatus ===
                            "APPROVED"
                            ? "success"
                            : "warning"
                    }
                />


                <StatCard
                    title="Order Acceptance"

                    value={
                        restaurant.isOpen &&
                            canOpen
                            ? "Enabled"
                            : "Disabled"
                    }

                    description="Customer checkout availability"

                    icon={
                        ShoppingBag
                    }

                    variant={
                        restaurant.isOpen &&
                            canOpen
                            ? "success"
                            : "warning"
                    }
                />
            </section>


            {/* =========================
          STATUS CONTROL
      ========================== */}

            <section
                className="
          overflow-hidden

          rounded-[1.75rem]

          border
          border-slate-200

          bg-white

          shadow-sm
        "
            >
                <div
                    className={`
            border-b
            p-5

            sm:p-6

            ${restaurant.isOpen
                            ? `
                  border-emerald-100
                  bg-emerald-50
                `
                            : `
                  border-rose-100
                  bg-rose-50
                `
                        }
          `}
                >
                    <div
                        className="
              flex
              flex-col
              gap-5

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
                    >
                        <div
                            className="
                flex
                items-start
                gap-4
              "
                        >
                            <div
                                className={`
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  ${restaurant.isOpen
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
                                {restaurant.isOpen ? (
                                    <Store
                                        className="
                      h-5
                      w-5
                    "
                                    />
                                ) : (
                                    <CircleOff
                                        className="
                      h-5
                      w-5
                    "
                                    />
                                )}
                            </div>


                            <div>
                                <div
                                    className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                                >
                                    <h2
                                        className="
                      text-xl
                      font-black
                      text-slate-950
                    "
                                    >
                                        {
                                            restaurant.restaurantName
                                        }
                                    </h2>


                                    <StatusBadge
                                        variant={
                                            restaurant.isOpen
                                                ? "success"
                                                : "danger"
                                        }

                                        size="sm"

                                        dot
                                    >
                                        {restaurant.isOpen
                                            ? "Open"
                                            : "Closed"}
                                    </StatusBadge>
                                </div>


                                <p
                                    className="
                    mt-2

                    max-w-2xl

                    text-sm
                    leading-6
                    text-slate-500
                  "
                                >
                                    {restaurant.isOpen
                                        ? "Your restaurant is currently accepting new customer orders."
                                        : "Your restaurant is closed. Customers cannot place new orders until you open it again."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                {/* =========================
            ACTION AREA
        ========================== */}

                <div
                    className="
            p-5

            sm:p-6
          "
                >
                    <div
                        className="
              flex
              flex-col
              gap-5

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
                    >
                        <div>
                            <h3
                                className="
                  font-black
                  text-slate-950
                "
                            >
                                Change restaurant status
                            </h3>


                            <p
                                className="
                  mt-1

                  max-w-xl

                  text-sm
                  leading-6
                  text-slate-500
                "
                            >
                                Open the restaurant when
                                you are ready to receive
                                orders. Close it when you
                                temporarily want to stop
                                new orders.
                            </p>
                        </div>


                        <div
                            className="
                flex
                flex-wrap
                gap-3
              "
                        >
                            <Button
                                onClick={() =>
                                    handleStatusRequest(
                                        true
                                    )
                                }
                                disabled={
                                    restaurant?.isOpen ||
                                    statusLoading ||
                                    !canOpen
                                }
                            >
                                Open Restaurant
                            </Button>


                            <Button
                                onClick={() =>
                                    handleStatusRequest(
                                        false
                                    )
                                }
                                disabled={
                                    !restaurant?.isOpen ||
                                    statusLoading
                                }
                            >
                                Close Restaurant
                            </Button>
                        </div>
                    </div>


                    {/* =========================
              ACCOUNT RESTRICTION
          ========================== */}

                    {!canOpen && (
                        <div
                            className="
                mt-6

                rounded-xl

                border
                border-amber-200

                bg-amber-50

                p-4
              "
                        >
                            <p
                                className="
                  text-sm
                  font-black
                  text-amber-800
                "
                            >
                                Restaurant cannot be opened
                            </p>


                            <p
                                className="
                  mt-1

                  text-sm
                  leading-6
                  text-amber-700
                "
                            >
                                {restaurant.isBlocked
                                    ? "Your restaurant account is blocked. Contact Admin before accepting orders."
                                    : "Your restaurant must be approved by Admin before accepting orders."}
                            </p>
                        </div>
                    )}
                </div>
            </section>


            {/* =========================
          INFO
      ========================== */}

            <section
                className="
          rounded-[1.5rem]

          border
          border-orange-100

          bg-orange-50/60

          p-5

          sm:p-6
        "
            >
                <h3
                    className="
            font-black
            text-slate-950
          "
                >
                    How availability works
                </h3>


                <p
                    className="
            mt-2

            max-w-3xl

            text-sm
            leading-6
            text-slate-600
          "
                >
                    When the restaurant is closed,
                    customers can still see restaurant
                    information, but they should not be
                    able to complete a new order from
                    this restaurant.
                </p>
            </section>


            {/* =========================
          CONFIRM STATUS
      ========================== */}

            <ConfirmModal
                open={
                    pendingStatus !==
                    null
                }

                onClose={() =>
                    setPendingStatus(
                        null
                    )
                }

                title={
                    pendingStatus
                        ? "Open Restaurant?"
                        : "Close Restaurant?"
                }

                description={
                    pendingStatus
                        ? "Your restaurant will become available for customers to place orders."
                        : "Customers will not be able to place new orders while your restaurant is closed."
                }

                confirmText={
                    pendingStatus
                        ? "Open Restaurant"
                        : "Close Restaurant"
                }

                loading={
                    statusLoading
                }

                onConfirm={
                    handleConfirmStatus
                }
            />
        </div>
    );
};


export default RestaurantBusinessHours;