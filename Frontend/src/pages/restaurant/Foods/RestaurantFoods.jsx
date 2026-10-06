import {
    useMemo,
    useState,
} from "react";

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


    // =========================================
    // DUMMY STATE
    // Later Redux state se replace hoga
    // =========================================

    const [
        foods,
        setFoods,
    ] = useState([
        {
            slug:
                "paneer-burger",

            name:
                "Paneer Burger",

            description:
                "Crispy paneer burger with fresh vegetables and signature sauce.",

            image:
                "/uploads/foods/paneer-burger.jpg",

            price:
                199,

            discountPrice:
                179,

            preparationTime:
                20,

            isVeg:
                true,

            isAvailable:
                true,

            categorySlug:
                "burgers",

            categoryName:
                "Burgers",
        },

        {
            slug:
                "veg-pizza",

            name:
                "Veg Pizza",

            description:
                "Loaded vegetable pizza with mozzarella cheese.",

            image:
                "/uploads/foods/veg-pizza.jpg",

            price:
                299,

            discountPrice:
                249,

            preparationTime:
                25,

            isVeg:
                true,

            isAvailable:
                true,

            categorySlug:
                "pizza",

            categoryName:
                "Pizza",
        },

        {
            slug:
                "chicken-burger",

            name:
                "Chicken Burger",

            description:
                "Juicy chicken patty with lettuce and house sauce.",

            image:
                "/uploads/foods/chicken-burger.jpg",

            price:
                249,

            discountPrice:
                null,

            preparationTime:
                20,

            isVeg:
                false,

            isAvailable:
                true,

            categorySlug:
                "burgers",

            categoryName:
                "Burgers",
        },

        {
            slug:
                "white-sauce-pasta",

            name:
                "White Sauce Pasta",

            description:
                "Creamy white sauce pasta with vegetables.",

            image:
                "/uploads/foods/white-sauce-pasta.jpg",

            price:
                229,

            discountPrice:
                199,

            preparationTime:
                18,

            isVeg:
                true,

            isAvailable:
                false,

            categorySlug:
                "pasta",

            categoryName:
                "Pasta",
        },

        {
            slug:
                "chicken-pizza",

            name:
                "Chicken Pizza",

            description:
                "Chicken pizza topped with cheese and signature seasoning.",

            image:
                "/uploads/foods/chicken-pizza.jpg",

            price:
                349,

            discountPrice:
                319,

            preparationTime:
                30,

            isVeg:
                false,

            isAvailable:
                true,

            categorySlug:
                "pizza",

            categoryName:
                "Pizza",
        },
    ]);


    const [
        pagination,
        setPagination,
    ] = useState({
        page: 1,
        limit: 10,
        total: 5,
        totalPages: 1,
    });


    const [
        fetchLoading,
        setFetchLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState(null);


    const [
        togglingSlug,
        setTogglingSlug,
    ] = useState(null);


    const [
        deletingSlug,
        setDeletingSlug,
    ] = useState(null);


    const [
        selectedFood,
        setSelectedFood,
    ] = useState(null);


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
        (food) => {
            setTogglingSlug(
                food.slug
            );


            setFoods(
                (previous) =>
                    previous.map(
                        (item) =>
                            item.slug ===
                                food.slug
                                ? {
                                    ...item,

                                    isAvailable:
                                        !item.isAvailable,
                                }
                                : item
                    )
            );


            setTogglingSlug(
                null
            );
        };


    // =========================================
    // DELETE
    // =========================================

    const handleDeleteConfirm =
        () => {
            if (!selectedFood) {
                return;
            }


            setDeletingSlug(
                selectedFood.slug
            );


            setFoods(
                (previous) =>
                    previous.filter(
                        (food) =>
                            food.slug !==
                            selectedFood.slug
                    )
            );


            setPagination(
                (previous) => ({
                    ...previous,

                    total:
                        Math.max(
                            0,
                            previous.total -
                            1
                        ),
                })
            );


            setDeletingSlug(
                null
            );

            setSelectedFood(
                null
            );
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
                    >
                        <Button
                            type="button"

                            variant="ghost"

                            loading={
                                togglingSlug ===
                                food.slug
                            }

                            onClick={() =>
                                handleToggleAvailability(
                                    food
                                )
                            }
                        >
                            {food.isAvailable
                                ? "Disable"
                                : "Enable"}
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
                    icon={
                        ChefHat
                    }

                    title="No foods found"

                    description={
                        hasFilters
                            ? "Try changing or clearing your filters."
                            : "Add your first food item to start building your menu."
                    }

                    action={
                        hasFilters
                            ? {
                                label:
                                    "Clear Filters",

                                onClick:
                                    clearFilters,
                            }
                            : {
                                label:
                                    "Add Food",

                                onClick:
                                    () =>
                                        navigate(
                                            "/restaurant/foods/add"
                                        ),
                            }
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

                title="Delete food?"

                description={
                    selectedFood
                        ? `${selectedFood.name} will be permanently removed from your menu.`
                        : ""
                }

                confirmText="Delete Food"

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