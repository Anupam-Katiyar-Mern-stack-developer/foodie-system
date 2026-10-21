import {
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import PageHeader
    from "../../../components/common/PageHeader/PageHeader";

import EmptyState
    from "../../../components/common/EmptyState/EmptyState";

import ErrorState
    from "../../../components/common/ErrorState/ErrorState";

import Skeleton
    from "../../../components/common/Skeleton/Skeleton";

import OptimizedImage
    from "../../../components/common/OptimizedImage/OptimizedImage";

import StatusBadge
    from "../../../components/common/StatusBadge/StatusBadge";

import {
    getCategories,
} from "../../../redux/thunks/public/category.thunk";


const RestaurantCategories = () => {
    const dispatch =
        useDispatch();


    const {
        categories = [],
        fetchLoading,
        error,
    } = useSelector(
        (state) =>
            state.publicCategory
    ) || {};


    // =========================
    // FETCH CATEGORIES
    // =========================

    useEffect(() => {
        dispatch(
            getCategories({
                page: 1,
                limit: 50,
            })
        );
    }, [dispatch]);


    // =========================
    // LOADING
    // =========================

    if (fetchLoading) {
        return (
            <div className="space-y-6">
                <Skeleton
                    width="w-72"
                    height="h-10"
                />

                <div
                    className="
            grid
            gap-5

            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
                >
                    {Array.from({
                        length: 8,
                    }).map((_, index) => (
                        <Skeleton
                            key={index}
                            width="w-full"
                            height="h-64"
                            rounded="rounded-2xl"
                        />
                    ))}
                </div>
            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <ErrorState
                title="Unable to load categories"
                description={error}
                onRetry={() =>
                    dispatch(
                        getCategories({
                            page: 1,
                            limit: 50,
                        })
                    )
                }
            />
        );
    }


    return (
        <div className="space-y-7">

            {/* HEADER */}

            <PageHeader
                title="Categories"
                description="View food categories available for your restaurant menu."
            />


            {/* EMPTY */}

            {categories.length === 0 ? (
                <EmptyState
                    title="No categories available"
                    description="Categories created by Admin will appear here."
                />
            ) : (

                /* CATEGORY GRID */

                <div
                    className="
            grid
            gap-5

            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
                >
                    {categories.map(
                        (category) => (
                            <div
                                key={
                                    category.slug
                                }
                                className="
                  overflow-hidden
                  rounded-2xl

                  border
                  border-slate-200

                  bg-white

                  shadow-sm

                  transition

                  hover:-translate-y-1
                  hover:shadow-md
                "
                            >

                                {/* IMAGE */}

                                <div
                                    className="
                    h-40
                    overflow-hidden
                    bg-slate-100
                  "
                                >
                                    <OptimizedImage
                                        src={
                                            category.image
                                        }
                                        alt={
                                            category.name
                                        }
                                        className="
                      h-full
                      w-full
                      object-cover
                    "
                                    />
                                </div>


                                {/* CONTENT */}

                                <div className="p-5">

                                    <div
                                        className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                                    >
                                        <div>
                                            <h3
                                                className="
                          text-base
                          font-black
                          text-slate-900
                        "
                                            >
                                                {
                                                    category.name
                                                }
                                            </h3>

                                            <p
                                                className="
                          mt-1
                          text-xs
                          text-slate-400
                        "
                                            >
                                                {
                                                    category.slug
                                                }
                                            </p>
                                        </div>


                                        <StatusBadge
                                            variant={
                                                category.isActive
                                                    ? "success"
                                                    : "danger"
                                            }
                                        >
                                            {
                                                category.isActive
                                                    ? "Active"
                                                    : "Inactive"
                                            }
                                        </StatusBadge>
                                    </div>


                                    <div
                                        className="
                      mt-5
                      border-t
                      border-slate-100
                      pt-4
                    "
                                    >
                                        <p
                                            className="
                        text-xs
                        font-semibold
                        text-slate-500
                      "
                                        >
                                            Display Order:{" "}
                                            <span
                                                className="
                          font-black
                          text-slate-800
                        "
                                            >
                                                {
                                                    category.displayOrder ??
                                                    "-"
                                                }
                                            </span>
                                        </p>
                                    </div>

                                </div>
                            </div>
                        )
                    )}
                </div>
            )}

        </div>
    );
};


export default RestaurantCategories;