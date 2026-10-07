import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

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


import {
    createFood,
    getMyFoods,
    updateFood,
} from "../../../redux/thunks/restaurant/restaurantFood.thunk";


// =========================================
// BUILD FORM DATA
// =========================================

const buildFoodFormData = (
    values
) => {
    const formData =
        new FormData();


    formData.append(
        "name",
        values.name?.trim() || ""
    );


    formData.append(
        "description",
        values.description?.trim() || ""
    );


    formData.append(
        "categorySlug",
        values.categorySlug || ""
    );


    formData.append(
        "price",
        String(
            values.price ?? ""
        )
    );


    formData.append(
        "discountPrice",
        values.discountPrice === "" ||
        values.discountPrice === null ||
        values.discountPrice === undefined
            ? ""
            : String(
                values.discountPrice
            )
    );


    formData.append(
        "preparationTime",
        String(
            values.preparationTime ?? ""
        )
    );


    formData.append(
        "isVeg",
        String(
            Boolean(
                values.isVeg
            )
        )
    );


    formData.append(
        "isAvailable",
        String(
            values.isAvailable !== false
        )
    );


    // =========================================
    // IMAGE
    // =========================================

    let imageFile = null;


    if (
        values.image instanceof File
    ) {
        imageFile =
            values.image;
    }


    if (
        !imageFile &&
        values.image instanceof FileList
    ) {
        imageFile =
            values.image[0];
    }


    if (
        !imageFile &&
        Array.isArray(
            values.image
        )
    ) {
        imageFile =
            values.image[0];
    }


    if (
        imageFile instanceof File
    ) {
        formData.append(
            "image",
            imageFile
        );
    }


    return formData;
};


// =========================================
// COMPONENT
// =========================================

const RestaurantFoodForm = () => {

    const dispatch =
        useDispatch();

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
    // REDUX FOOD
    // =========================================

    const {
        foods = [],

        fetchLoading,

        createLoading,

        updateLoading,

        error,
    } = useSelector(
        (state) =>
            state.restaurantFood
    ) || {};


    // =========================================
    // REDUX CATEGORY
    // =========================================

    const {
        categories = [],
    } = useSelector(
        (state) =>
            state.publicCategory
    ) || {};


    // =========================================
    // DIRECT EDIT PAGE LOAD STATE
    // =========================================

    const [
        hasRequestedFoods,
        setHasRequestedFoods,
    ] = useState(false);


    // =========================================
    // LOAD FOODS FOR EDIT
    // =========================================

    useEffect(() => {

        if (
            !isEditMode
        ) {
            return;
        }


        if (
            foods.length > 0
        ) {
            return;
        }


        setHasRequestedFoods(
            true
        );


        dispatch(
            getMyFoods()
        );

    }, [
        dispatch,
        isEditMode,
        foods.length,
    ]);


    // =========================================
    // CURRENT FOOD
    // =========================================

    const editingFood =
        useMemo(
            () => {

                if (
                    !isEditMode
                ) {
                    return null;
                }


                return (
                    foods.find(
                        (food) =>
                            food.slug ===
                            foodSlug
                    ) ||
                    null
                );

            },
            [
                foods,
                foodSlug,
                isEditMode,
            ]
        );


    // =========================================
    // ACTIVE CATEGORIES
    // =========================================

    const activeCategories =
        useMemo(
            () =>
                categories.filter(
                    (category) =>
                        category.isActive !==
                        false
                ),
            [
                categories,
            ]
        );


    // =========================================
    // CURRENT CATEGORY
    // =========================================

    const editingCategory =
        useMemo(
            () => {

                if (
                    !editingFood
                ) {
                    return null;
                }


                return (
                    activeCategories.find(
                        (category) =>
                            category.slug ===
                            editingFood.categorySlug
                    ) ||
                    null
                );

            },
            [
                activeCategories,
                editingFood,
            ]
        );


    // =========================================
    // FORM FIELDS
    // =========================================

    const fields =
        useMemo(
            () =>
                getFoodFields(
                    activeCategories
                ),
            [
                activeCategories,
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
    // FORM DEFAULT VALUES
    // =========================================

    const formValues =
        useMemo(
            () => {

                // =============================
                // ADD MODE
                // =============================

                if (
                    !isEditMode
                ) {
                    return {
                        ...foodDefaultValues,
                    };
                }


                // =============================
                // EDIT DATA NOT LOADED
                // =============================

                if (
                    !editingFood
                ) {
                    return {
                        ...foodDefaultValues,
                    };
                }


                // =============================
                // EDIT MODE
                // =============================

                return {
                    name:
                        editingFood.name ||
                        "",

                    description:
                        editingFood.description ||
                        "",

                    categorySlug:
                        editingFood.categorySlug ||
                        "",

                    price:
                        editingFood.price ??
                        "",

                    discountPrice:
                        editingFood.discountPrice ??
                        "",

                    preparationTime:
                        editingFood.preparationTime ??
                        "",

                    isVeg:
                        Boolean(
                            editingFood.isVeg
                        ),

                    isAvailable:
                        editingFood.isAvailable !==
                        false,

                    /*
                     * Existing image URL
                     * file input me nahi deni.
                     *
                     * New image select hogi
                     * tabhi backend ko jayegi.
                     */
                    image: "",
                };

            },
            [
                isEditMode,
                editingFood,
            ]
        );


    // =========================================
    // SUBMIT
    // =========================================

    const handleSubmit =
        async (
            values
        ) => {

            try {

                const formData =
                    buildFoodFormData(
                        values
                    );


                // =============================
                // UPDATE
                // =============================

                if (
                    isEditMode
                ) {

                    await dispatch(
                        updateFood({
                            foodSlug,

                            formData,
                        })
                    ).unwrap();


                    navigate(
                        "/restaurant/foods",
                        {
                            replace: true,
                        }
                    );


                    return;
                }


                // =============================
                // CREATE
                // =============================

                await dispatch(
                    createFood(
                        formData
                    )
                ).unwrap();


                navigate(
                    "/restaurant/foods",
                    {
                        replace: true,
                    }
                );

            } catch (submitError) {

                console.error(
                    "FOOD SUBMIT ERROR:",
                    submitError
                );

            }

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

    const editLoading =
        isEditMode &&
        foods.length === 0 &&
        (
            !hasRequestedFoods ||
            fetchLoading
        );


    if (
        editLoading
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

    if (
        error
    ) {

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
    // FOOD NOT FOUND
    // =========================================

    if (
        isEditMode &&
        hasRequestedFoods &&
        !fetchLoading &&
        !editingFood
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

            {/* =================================
                BACK
            ================================= */}

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


            {/* =================================
                HEADER
            ================================= */}

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


            {/* =================================
                EXISTING FOOD PREVIEW
            ================================= */}

            {isEditMode &&
                editingFood && (

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
                                editingFood.image
                            }

                            alt={
                                editingFood.name
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
                                    editingFood.name
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
                                    editingFood.categoryName ||
                                    editingCategory?.name ||
                                    "Category"
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
                                        editingFood.isVeg
                                            ? "success"
                                            : "danger"
                                    }

                                    size="sm"

                                    dot
                                >
                                    {
                                        editingFood.isVeg
                                            ? "Veg"
                                            : "Non Veg"
                                    }
                                </StatusBadge>


                                <StatusBadge
                                    variant={
                                        editingFood.isAvailable
                                            ? "success"
                                            : "danger"
                                    }

                                    size="sm"

                                    dot
                                >
                                    {
                                        editingFood.isAvailable
                                            ? "Available"
                                            : "Unavailable"
                                    }
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


            {/* =================================
                FORM
            ================================= */}

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
                            ? editingFood?.slug ||
                              foodSlug
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