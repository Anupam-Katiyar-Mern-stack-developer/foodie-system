import {
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
} from "lucide-react";


import PageHeader
    from "../../../components/common/PageHeader/PageHeader";

import Button
    from "../../../components/common/Button/Button";

import CommonForm
    from "../../../components/common/CommonForm/CommonForm";

import Skeleton
    from "../../../components/common/Skeleton/Skeleton";

import ErrorState
    from "../../../components/common/ErrorState/ErrorState";

import OptimizedImage
    from "../../../components/common/OptimizedImage/OptimizedImage";

import StatusBadge
    from "../../../components/common/StatusBadge/StatusBadge";


import {
    foodDefaultValues,
    getFoodFields,
} from "../../../forms/restaurant/food.form";

import {
    getFoodSchema,
} from "../../../validations/restaurant/food.validation";


const RestaurantFoodForm = () => {
    const navigate =
        useNavigate();

    const {
        foodSlug,
    } = useParams();


    // =========================================
    // MODE
    // =========================================

    const isEditMode =
        Boolean(
            foodSlug
        );


    // =========================================
    // DUMMY CATEGORIES
    //
    // Later:
    // state.restaurantCategory.categories
    // =========================================

    const [
        categories,
        setCategories,
    ] = useState([
        {
            name:
                "Burgers",

            slug:
                "burgers",

            isActive:
                true,
        },

        {
            name:
                "Pizza",

            slug:
                "pizza",

            isActive:
                true,
        },

        {
            name:
                "Pasta",

            slug:
                "pasta",

            isActive:
                true,
        },

        {
            name:
                "Beverages",

            slug:
                "beverages",

            isActive:
                true,
        },

        {
            name:
                "Desserts",

            slug:
                "desserts",

            isActive:
                true,
        },
    ]);


    // =========================================
    // DUMMY SELECTED FOOD
    //
    // Later:
    // state.restaurantFood.selectedFood
    // =========================================

    const [
        selectedFood,
        setSelectedFood,
    ] = useState(
        isEditMode
            ? {
                slug:
                    foodSlug,

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
            }
            : null
    );


    // =========================================
    // API-LIKE UI STATE
    //
    // Later Redux state se replace hoga
    // =========================================

    const [
        detailLoading,
        setDetailLoading,
    ] = useState(false);


    const [
        createLoading,
        setCreateLoading,
    ] = useState(false);


    const [
        updateLoading,
        setUpdateLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState(null);


    // =========================================
    // FORM FIELDS
    // =========================================

    const fields =
        useMemo(
            () =>
                getFoodFields(
                    categories
                ),

            [
                categories,
            ]
        );


    // =========================================
    // VALIDATION
    // =========================================

    const schema =
        useMemo(
            () =>
                getFoodSchema({
                    isEditMode,
                }),

            [
                isEditMode,
            ]
        );


    // =========================================
    // DEFAULT VALUES
    // =========================================

    const formValues =
        useMemo(() => {
            if (
                !isEditMode ||
                !selectedFood
            ) {
                return (
                    foodDefaultValues
                );
            }


            return {
                name:
                    selectedFood.name ||
                    "",

                description:
                    selectedFood
                        .description ||
                    "",

                categorySlug:
                    selectedFood
                        .categorySlug ||
                    "",

                price:
                    selectedFood.price ??
                    "",

                discountPrice:
                    selectedFood
                        .discountPrice ??
                    "",

                preparationTime:
                    selectedFood
                        .preparationTime ??
                    "",

                isVeg:
                    Boolean(
                        selectedFood.isVeg
                    ),

                isAvailable:
                    Boolean(
                        selectedFood
                            .isAvailable
                    ),

                /*
                 * Existing URL ko file
                 * input me nahi dena.
                 */
                image:
                    null,
            };
        }, [
            isEditMode,
            selectedFood,
        ]);


    // =========================================
    // SUBMIT
    // =========================================

    const handleSubmit =
        async (
            values
        ) => {
            const payload = {
                ...values,

                discountPrice:
                    values.discountPrice ??
                    null,
            };


            /*
             * EDIT
             */

            if (
                isEditMode
            ) {
                setUpdateLoading(
                    true
                );


                /*
                 * Later:
                 *
                 * await dispatch(
                 *   updateRestaurantFood({
                 *     foodSlug,
                 *     payload,
                 *   })
                 * ).unwrap();
                 */


                console.log(
                    "UPDATE FOOD PAYLOAD:",
                    {
                        foodSlug,
                        payload,
                    }
                );


                setSelectedFood(
                    (
                        previous
                    ) => ({
                        ...previous,
                        ...payload,

                        /*
                         * image File ko fake
                         * URL me convert nahi karna.
                         */
                        image:
                            previous?.image,
                    })
                );


                setUpdateLoading(
                    false
                );


                navigate(
                    "/restaurant/foods"
                );

                return;
            }


            /*
             * ADD
             */

            setCreateLoading(
                true
            );


            /*
             * Later:
             *
             * await dispatch(
             *   createRestaurantFood(
             *     payload
             *   )
             * ).unwrap();
             */


            console.log(
                "CREATE FOOD PAYLOAD:",
                payload
            );


            setCreateLoading(
                false
            );


            navigate(
                "/restaurant/foods"
            );
        };


    // =========================================
    // CANCEL
    // =========================================

    const handleCancel =
        () => {
            navigate(
                "/restaurant/foods"
            );
        };


    // =========================================
    // EDIT LOADING
    // =========================================

    if (
        isEditMode &&
        detailLoading
    ) {
        return (
            <div
                className="
          space-y-6
        "
            >
                <Skeleton
                    width="w-72"
                    height="h-10"
                    rounded="rounded-xl"
                />


                <Skeleton
                    width="w-full"
                    height="h-[620px]"
                    rounded="rounded-[1.75rem]"
                />
            </div>
        );
    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {
        return (
            <ErrorState
                title={
                    isEditMode
                        ? "Unable to load food"
                        : "Unable to create food"
                }

                description={
                    typeof error ===
                        "string"
                        ? error
                        : "Something went wrong. Please try again."
                }
            />
        );
    }


    // =========================================
    // EDIT FOOD NOT FOUND
    // =========================================

    if (
        isEditMode &&
        !selectedFood
    ) {
        return (
            <ErrorState
                title="Food not found"

                description="The requested food item could not be found."
            />
        );
    }


    return (
        <div
            className="
        space-y-6
      "
        >
            {/* =========================
          BACK
      ========================== */}

            <Button
                type="button"

                variant="ghost"

                onClick={
                    handleCancel
                }
            >
                <span
                    className="
            inline-flex
            items-center
            gap-2
          "
                >
                    <ArrowLeft
                        className="
              h-4
              w-4
            "
                    />

                    Back to Foods
                </span>
            </Button>


            {/* =========================
          HEADER
      ========================== */}

            <PageHeader
                title={
                    isEditMode
                        ? "Edit Food"
                        : "Add Food"
                }

                description={
                    isEditMode
                        ? "Update food information, pricing and availability."
                        : "Add a new food item to your restaurant menu."
                }
            />


            {/* =========================
          EXISTING FOOD PREVIEW
      ========================== */}

            {isEditMode &&
                selectedFood && (
                    <section
                        className="
              flex
              flex-col
              gap-4

              rounded-[1.5rem]

              border
              border-slate-200

              bg-white

              p-4

              shadow-sm

              sm:flex-row
              sm:items-center
            "
                    >
                        <OptimizedImage
                            src={
                                selectedFood.image
                            }

                            alt={
                                selectedFood.name
                            }

                            className="
                h-28
                w-full

                rounded-xl

                object-cover

                sm:h-24
                sm:w-28
              "
                        />


                        <div
                            className="
                min-w-0
                flex-1
              "
                        >
                            <h2
                                className="
                  text-lg
                  font-black
                  text-slate-950
                "
                            >
                                {
                                    selectedFood.name
                                }
                            </h2>


                            <p
                                className="
                  mt-1

                  text-sm
                  font-semibold
                  text-slate-500
                "
                            >
                                {
                                    selectedFood
                                        .categoryName
                                }
                            </p>


                            <div
                                className="
                  mt-3

                  flex
                  flex-wrap
                  gap-2
                "
                            >
                                <StatusBadge
                                    variant={
                                        selectedFood.isVeg
                                            ? "success"
                                            : "danger"
                                    }

                                    size="sm"

                                    dot
                                >
                                    {selectedFood.isVeg
                                        ? "Veg"
                                        : "Non Veg"}
                                </StatusBadge>


                                <StatusBadge
                                    variant={
                                        selectedFood
                                            .isAvailable
                                            ? "success"
                                            : "danger"
                                    }

                                    size="sm"

                                    dot
                                >
                                    {selectedFood
                                        .isAvailable
                                        ? "Available"
                                        : "Unavailable"}
                                </StatusBadge>
                            </div>
                        </div>


                        <p
                            className="
                text-xs
                leading-5
                text-slate-400

                sm:max-w-[210px]
              "
                        >
                            Upload a new image
                            only if you want to
                            replace the current
                            food image.
                        </p>
                    </section>
                )}


            {/* =========================
          COMMON FORM
      ========================== */}

            <section
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
                <CommonForm
                    key={
                        isEditMode
                            ? selectedFood?.slug
                            : "new-food"
                    }

                    fields={
                        fields
                    }

                    schema={
                        schema
                    }

                    defaultValues={
                        formValues
                    }

                    onSubmit={
                        handleSubmit
                    }

                    onCancel={
                        handleCancel
                    }

                    loading={
                        isEditMode
                            ? updateLoading
                            : createLoading
                    }

                    submitText={
                        isEditMode
                            ? "Update Food"
                            : "Add Food"
                    }

                    columns={2}
                />
            </section>
        </div>
    );
};


export default RestaurantFoodForm;