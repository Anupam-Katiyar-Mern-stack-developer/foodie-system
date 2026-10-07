import {
    useMemo,
    useState,
} from "react";
import {
    useEffect,

} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    getMyFoods,
    deleteFood,
    toggleAvailability,
} from "../../../redux/thunks/restaurant/restaurantFood.thunk";

import {
    useNavigate,
} from "react-router-dom";

import {
    ChefHat,
    CircleOff,
    Leaf,
    PackageCheck,
    Plus,
    Search,
    Utensils,
} from "lucide-react";


import PageHeader
    from "../../../components/common/PageHeader/PageHeader";

import StatCard
    from "../../../components/common/StatCard/StatCard";

import StatusBadge
    from "../../../components/common/StatusBadge/StatusBadge";

import CommonTable
    from "../../../components/common/CommonTable/CommonTable";

import Button
    from "../../../components/common/Button/Button";

import EmptyState
    from "../../../components/common/EmptyState/EmptyState";

import ErrorState
    from "../../../components/common/ErrorState/ErrorState";

import OptimizedImage
    from "../../../components/common/OptimizedImage/OptimizedImage";

import ConfirmModal
    from "../../../components/common/ConfirmModal/ConfirmModal";


const RestaurantFoods = () => {
    const navigate =
        useNavigate();

    const [
        selectedFood,
        setSelectedFood,
    ] = useState(null);
    // =========================================
    // DUMMY STATE
    // Later Redux state se replace hoga
    // =========================================

    const dispatch =
        useDispatch();


    const {
        foods = [],
        fetchLoading,
        deletingSlug,
        togglingSlug,
        error,
    } = useSelector(
        (state) =>
            state.restaurantFood
    ) || {
            foods: [],
            fetchLoading: false,
            deletingSlug: null,
            togglingSlug: null,
            error: null,
        };


    const [
        pagination,
        setPagination,
    ] = useState({
        page: 1,
        limit: 10,
        total: 5,
        totalPages: 1,
    });




    useEffect(() => {
        dispatch(
            getMyFoods()
        );
    }, [dispatch]);


    // =========================================
    // FILTER STATE
    // Later backend query params banenge
    // =========================================

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");


    const [
        availabilityFilter,
        setAvailabilityFilter,
    ] = useState("ALL");


    const [
        foodType,
        setFoodType,
    ] = useState("ALL");


    // =========================================
    // PRICE FORMAT
    // =========================================

    const formatPrice = (
        amount
    ) => {
        return new Intl.NumberFormat(
            "en-IN",
            {
                style:
                    "currency",

                currency:
                    "INR",

                maximumFractionDigits:
                    0,
            }
        ).format(
            Number(
                amount || 0
            )
        );
    };


    // =========================================
    // FILTERED FOODS
    // =========================================

    const filteredFoods =
        useMemo(() => {
            const search =
                searchTerm
                    .trim()
                    .toLowerCase();


            return foods.filter(
                (food) => {
                    const matchesSearch =
                        !search ||
                        food.name
                            ?.toLowerCase()
                            .includes(
                                search
                            ) ||
                        food.categoryName
                            ?.toLowerCase()
                            .includes(
                                search
                            );


                    const matchesAvailability =
                        availabilityFilter ===
                        "ALL" ||
                        (
                            availabilityFilter ===
                            "AVAILABLE" &&
                            food.isAvailable
                        ) ||
                        (
                            availabilityFilter ===
                            "UNAVAILABLE" &&
                            !food.isAvailable
                        );


                    const matchesType =
                        foodType ===
                        "ALL" ||
                        (
                            foodType ===
                            "VEG" &&
                            food.isVeg
                        ) ||
                        (
                            foodType ===
                            "NON_VEG" &&
                            !food.isVeg
                        );


                    return (
                        matchesSearch &&
                        matchesAvailability &&
                        matchesType
                    );
                }
            );
        }, [
            foods,
            searchTerm,
            availabilityFilter,
            foodType,
        ]);


    // =========================================
    // DASHBOARD STATS
    // =========================================

    const stats =
        useMemo(() => {
            const availableFoods =
                foods.filter(
                    (food) =>
                        food.isAvailable
                ).length;


            const unavailableFoods =
                foods.filter(
                    (food) =>
                        !food.isAvailable
                ).length;


            const vegFoods =
                foods.filter(
                    (food) =>
                        food.isVeg
                ).length;


            return [
                {
                    title:
                        "Total Foods",

                    value:
                        foods.length,

                    description:
                        "All menu items",

                    icon:
                        Utensils,

                    variant:
                        "orange",
                },

                {
                    title:
                        "Available",

                    value:
                        availableFoods,

                    description:
                        "Visible to customers",

                    icon:
                        PackageCheck,

                    variant:
                        "success",
                },

                {
                    title:
                        "Unavailable",

                    value:
                        unavailableFoods,

                    description:
                        "Currently disabled",

                    icon:
                        CircleOff,

                    variant:
                        "danger",
                },

                {
                    title:
                        "Veg Foods",

                    value:
                        vegFoods,

                    description:
                        "Vegetarian items",

                    icon:
                        Leaf,

                    variant:
                        "success",
                },
            ];
        }, [foods]);


    // =========================================
    // TOGGLE AVAILABILITY
    //
    // Later:
    // dispatch(
    //   toggleFoodAvailability({
    //     foodSlug: slug
    //   })
    // )
    // =========================================
    const handleToggleAvailability =
        async (food) => {
            if (
                !food?.slug ||
                togglingSlug
            ) {
                return;
            }


            try {
                await dispatch(
                    toggleAvailability({
                        foodSlug:
                            food.slug,

                        isAvailable:
                            !food.isAvailable,
                    })
                ).unwrap();
            } catch (error) {
                console.error(
                    "FOOD AVAILABILITY ERROR:",
                    error
                );
            }
        };


    // =========================================
    // DELETE
    // =========================================
    const handleDeleteConfirm =
        async () => {
            if (
                !selectedFood?.slug
            ) {
                return;
            }


            try {
                await dispatch(
                    deleteFood(
                        selectedFood.slug
                    )
                ).unwrap();


                setSelectedFood(
                    null
                );
            } catch (error) {
                console.error(
                    "DELETE FOOD ERROR:",
                    error
                );
            }
        };


    // =========================================
    // CLEAR FILTERS
    // =========================================

    const clearFilters =
        () => {
            setSearchTerm("");

            setAvailabilityFilter(
                "ALL"
            );

            setFoodType(
                "ALL"
            );
        };


    const hasFilters =
        Boolean(
            searchTerm.trim()
        ) ||
        availabilityFilter !==
        "ALL" ||
        foodType !==
        "ALL";


    // =========================================
    // TABLE COLUMNS
    // =========================================

    const columns = [
        {
            key:
                "food",

            label:
                "Food",

            render:
                (food) => (
                    <div
                        className="
              flex
              min-w-[240px]
              items-center
              gap-3
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
                h-14
                w-14
                shrink-0

                rounded-xl

                object-cover
              "
                        />


                        <div
                            className="
                min-w-0
              "
                        >
                            <p
                                className="
                  truncate

                  font-black
                  text-slate-900
                "
                            >
                                {
                                    food.name
                                }
                            </p>


                            <p
                                className="
                  mt-1

                  text-xs
                  font-semibold
                  text-slate-400
                "
                            >
                                {
                                    food.categoryName
                                }
                            </p>
                        </div>
                    </div>
                ),
        },

        {
            key:
                "price",

            label:
                "Price",

            render:
                (food) => {
                    const hasDiscount =
                        food.discountPrice &&
                        Number(
                            food.discountPrice
                        ) <
                        Number(
                            food.price
                        );


                    return (
                        <div>
                            <p
                                className="
                  font-black
                  text-slate-900
                "
                            >
                                {formatPrice(
                                    hasDiscount
                                        ? food.discountPrice
                                        : food.price
                                )}
                            </p>


                            {hasDiscount && (
                                <p
                                    className="
                    mt-0.5

                    text-xs
                    text-slate-400
                    line-through
                  "
                                >
                                    {formatPrice(
                                        food.price
                                    )}
                                </p>
                            )}
                        </div>
                    );
                },
        },

        {
            key:
                "type",

            label:
                "Type",

            render:
                (food) => (
                    <StatusBadge
                        variant={
                            food.isVeg
                                ? "success"
                                : "danger"
                        }

                        size="sm"

                        dot
                    >
                        {food.isVeg
                            ? "Veg"
                            : "Non Veg"}
                    </StatusBadge>
                ),
        },

        {
            key:
                "preparationTime",

            label:
                "Prep Time",

            render:
                (food) => (
                    <span
                        className="
              text-sm
              font-bold
              text-slate-600
            "
                    >
                        {
                            food.preparationTime
                        }{" "}
                        min
                    </span>
                ),
        },

        {
            key:
                "availability",

            label:
                "Status",

            render:
                (food) => (
                    <StatusBadge
                        variant={
                            food.isAvailable
                                ? "success"
                                : "danger"
                        }

                        size="sm"

                        dot
                    >
                        {food.isAvailable
                            ? "Available"
                            : "Unavailable"}
                    </StatusBadge>
                ),
        },

        {
            key:
                "action",

            label:
                "Action",

            align:
                "right",

            render:
                (food) => (
                    <div
                        className="
              flex
              items-center
              justify-end
              gap-2
            "
                    ><Button
                        onClick={() =>
                            handleToggleAvailability(
                                food
                            )
                        }
                        disabled={
                            togglingSlug ===
                            food.slug
                        }
                    >
                            {togglingSlug ===
                                food.slug
                                ? "Updating..."
                                : food.isAvailable
                                    ? "Available"
                                    : "Unavailable"}
                        </Button>


                        <Button
                            type="button"

                            variant="outline"

                            onClick={() =>
                                navigate(
                                    `/restaurant/foods/${food.slug}/edit`
                                )
                            }
                        >
                            Edit
                        </Button>


                        <Button
                            type="button"

                            variant="danger"

                            onClick={() =>
                                setSelectedFood(
                                    food
                                )
                            }
                        >
                            Delete
                        </Button>
                    </div>
                ),
        },
    ];


    // =========================================
    // ERROR
    // =========================================

    if (error) {
        return (
            <ErrorState
                title="Unable to load foods"

                description={
                    typeof error ===
                        "string"
                        ? error
                        : "Something went wrong while loading restaurant foods."
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

            <div
                className="
          flex
          flex-col
          gap-4

          lg:flex-row
          lg:items-start
          lg:justify-between
        "
            >
                <PageHeader
                    title="Foods"

                    description="Manage your restaurant menu, availability, pricing and food items."
                />


                <Button
                    type="button"

                    onClick={() =>
                        navigate(
                            "/restaurant/foods/add"
                        )
                    }
                >
                    <span
                        className="
              inline-flex
              items-center
              gap-2
            "
                    >
                        <Plus
                            className="
                h-4
                w-4
              "
                        />

                        Add Food
                    </span>
                </Button>
            </div>


            {/* =========================
          STATS
      ========================== */}

            <section
                className="
          grid
          gap-4

          sm:grid-cols-2
          xl:grid-cols-4
        "
            >
                {stats.map(
                    (stat) => (
                        <StatCard
                            key={
                                stat.title
                            }

                            title={
                                stat.title
                            }

                            value={
                                stat.value
                            }

                            description={
                                stat.description
                            }

                            icon={
                                stat.icon
                            }

                            variant={
                                stat.variant
                            }

                            loading={
                                fetchLoading
                            }
                        />
                    )
                )}
            </section>


            {/* =========================
          FILTER TOOLBAR
      ========================== */}

            <section
                className="
          rounded-[1.5rem]

          border
          border-slate-200

          bg-white

          p-4

          shadow-sm
        "
            >
                <div
                    className="
            flex
            flex-col
            gap-3

            xl:flex-row
            xl:items-center
            xl:justify-between
          "
                >
                    {/* SEARCH */}

                    <div
                        className="
              relative
              w-full

              xl:max-w-md
            "
                    >
                        <Search
                            className="
                pointer-events-none

                absolute
                left-4
                top-1/2

                h-4
                w-4

                -translate-y-1/2

                text-slate-400
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
                                    event.target
                                        .value
                                )
                            }

                            placeholder="Search food or category..."

                            className="
                h-11
                w-full

                rounded-xl

                border
                border-slate-200

                bg-slate-50

                pl-11
                pr-4

                text-sm

                outline-none

                focus:border-orange-300
                focus:bg-white
                focus:ring-4
                focus:ring-orange-50
              "
                        />
                    </div>


                    <div
                        className="
              flex
              flex-wrap
              gap-2
            "
                    >
                        {/* TYPE */}

                        <select
                            value={
                                foodType
                            }

                            onChange={(
                                event
                            ) =>
                                setFoodType(
                                    event.target
                                        .value
                                )
                            }

                            className="
                h-11

                rounded-xl

                border
                border-slate-200

                bg-white

                px-4

                text-sm
                font-bold
                text-slate-700

                outline-none
              "
                        >
                            <option value="ALL">
                                All Types
                            </option>

                            <option value="VEG">
                                Veg
                            </option>

                            <option value="NON_VEG">
                                Non Veg
                            </option>
                        </select>


                        {/* AVAILABILITY */}

                        <select
                            value={
                                availabilityFilter
                            }

                            onChange={(
                                event
                            ) =>
                                setAvailabilityFilter(
                                    event.target
                                        .value
                                )
                            }

                            className="
                h-11

                rounded-xl

                border
                border-slate-200

                bg-white

                px-4

                text-sm
                font-bold
                text-slate-700

                outline-none
              "
                        >
                            <option value="ALL">
                                All Status
                            </option>

                            <option value="AVAILABLE">
                                Available
                            </option>

                            <option value="UNAVAILABLE">
                                Unavailable
                            </option>
                        </select>


                        {hasFilters && (
                            <Button
                                type="button"

                                variant="ghost"

                                onClick={
                                    clearFilters
                                }
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
            </section>


            {/* =========================
          RESULT COUNT
      ========================== */}

            <p
                className="
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
                        filteredFoods.length
                    }
                </span>{" "}
                foods
            </p>


            {/* =========================
          TABLE / EMPTY
      ========================== */}

            {!fetchLoading &&
                filteredFoods.length ===
                0 ? (
                <EmptyState
                    icon={ChefHat}

                    title="No foods found"

                    description={
                        hasFilters
                            ? "Try changing or clearing your filters."
                            : "Add your first food item to start building your menu."
                    }

                    action={
                        hasFilters ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={
                                    clearFilters
                                }
                            >
                                Clear Filters
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/restaurant/foods/add"
                                    )
                                }
                            >
                                <span
                                    className="
            inline-flex
            items-center
            gap-2
          "
                                >
                                    <Plus
                                        className="
              h-4
              w-4
            "
                                    />

                                    Add Food
                                </span>
                            </Button>
                        )
                    }
                />
            ) : (
                <CommonTable
                    columns={
                        columns
                    }

                    data={
                        filteredFoods
                    }

                    loading={
                        fetchLoading
                    }
                />
            )}


            {/* =========================
          DELETE CONFIRM
      ========================== */}

            <ConfirmModal
                open={
                    Boolean(
                        selectedFood
                    )
                }

                onClose={() =>
                    setSelectedFood(
                        null
                    )
                }

                title="Delete Food?"

                description={
                    selectedFood
                        ? `Are you sure you want to delete ${selectedFood.name}?`
                        : ""
                }

                confirmText="Delete"

                variant="danger"

                loading={
                    deletingSlug ===
                    selectedFood?.slug
                }

                onConfirm={
                    handleDeleteConfirm
                }
            />
        </div>
    );
};


export default RestaurantFoods;