import {
    useMemo,
    useState,
} from "react";

import {
    FolderOpen,
    ImageIcon,
    Search,
} from "lucide-react";


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


const RestaurantCategories = () => {

    // =========================================
    // DUMMY DATA
    //
    // Later:
    // state.restaurantCategory.categories
    // =========================================

    const [
        categories,
        setCategories,
    ] = useState([
        {
            name: "Burgers",
            slug: "burgers",

            image:
                "/uploads/categories/burgers.jpg",

            displayOrder: 1,

            isActive: true,
        },

        {
            name: "Pizza",
            slug: "pizza",

            image:
                "/uploads/categories/pizza.jpg",

            displayOrder: 2,

            isActive: true,
        },

        {
            name: "Pasta",
            slug: "pasta",

            image:
                "/uploads/categories/pasta.jpg",

            displayOrder: 3,

            isActive: true,
        },

        {
            name: "Beverages",
            slug: "beverages",

            image:
                "/uploads/categories/beverages.jpg",

            displayOrder: 4,

            isActive: true,
        },

        {
            name: "Desserts",
            slug: "desserts",

            image:
                "/uploads/categories/desserts.jpg",

            displayOrder: 5,

            isActive: false,
        },
    ]);


    const [
        fetchLoading,
        setFetchLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState(null);


    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");


    // =========================================
    // FILTER
    // =========================================

    const filteredCategories =
        useMemo(() => {
            const search =
                searchTerm
                    .trim()
                    .toLowerCase();


            return [...categories]
                .filter(
                    (category) =>
                        !search ||
                        category.name
                            ?.toLowerCase()
                            .includes(search)
                )
                .sort(
                    (a, b) =>
                        Number(
                            a.displayOrder || 0
                        ) -
                        Number(
                            b.displayOrder || 0
                        )
                );
        }, [
            categories,
            searchTerm,
        ]);


    // =========================================
    // ERROR
    // =========================================

    if (error) {
        return (
            <ErrorState
                title="Unable to load categories"

                description={
                    typeof error ===
                        "string"
                        ? error
                        : "Something went wrong while loading categories."
                }
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
          HEADER
      ========================== */}

            <PageHeader
                title="Categories"

                description="Categories are managed by Admin. Use these categories when adding or editing food items."
            />


            {/* =========================
          SEARCH
      ========================== */}

            <div
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
            relative

            max-w-md
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
                                event.target.value
                            )
                        }

                        placeholder="Search category..."

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
              text-slate-900

              outline-none

              placeholder:text-slate-400

              transition

              focus:border-orange-300
              focus:bg-white
              focus:ring-4
              focus:ring-orange-50
            "
                    />
                </div>
            </div>


            {/* =========================
          LOADING
      ========================== */}

            {fetchLoading && (
                <div
                    className="
            grid
            gap-5

            sm:grid-cols-2
            xl:grid-cols-3
          "
                >
                    {Array.from({
                        length: 6,
                    }).map(
                        (
                            _,
                            index
                        ) => (
                            <Skeleton
                                key={
                                    index
                                }

                                width="w-full"

                                height="h-[230px]"

                                rounded="rounded-[1.5rem]"
                            />
                        )
                    )}
                </div>
            )}


            {/* =========================
          EMPTY
      ========================== */}

            {!fetchLoading &&
                filteredCategories.length ===
                0 && (
                    <EmptyState
                        icon={
                            FolderOpen
                        }

                        title={
                            searchTerm
                                ? "No category found"
                                : "No categories available"
                        }

                        description={
                            searchTerm
                                ? "Try searching with another category name."
                                : "Admin-created categories will appear here."
                        }
                    />
                )}


            {/* =========================
          CATEGORY GRID
      ========================== */}

            {!fetchLoading &&
                filteredCategories.length >
                0 && (
                    <div
                        className="
              grid
              gap-5

              sm:grid-cols-2
              xl:grid-cols-3
            "
                    >
                        {filteredCategories.map(
                            (
                                category
                            ) => (
                                <article
                                    key={
                                        category.slug
                                    }

                                    className="
                    overflow-hidden

                    rounded-[1.5rem]

                    border
                    border-slate-200

                    bg-white

                    shadow-sm

                    transition

                    hover:-translate-y-0.5
                    hover:shadow-md
                  "
                                >
                                    {/* IMAGE */}

                                    <div
                                        className="
                      relative

                      h-40

                      overflow-hidden

                      bg-slate-100
                    "
                                    >
                                        {category.image ? (
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
                                        ) : (
                                            <div
                                                className="
                          flex
                          h-full
                          items-center
                          justify-center

                          text-slate-300
                        "
                                            >
                                                <ImageIcon
                                                    className="
                            h-10
                            w-10
                          "
                                                />
                                            </div>
                                        )}


                                        <div
                                            className="
                        absolute
                        right-3
                        top-3
                      "
                                        >
                                            <StatusBadge
                                                variant={
                                                    category.isActive
                                                        ? "success"
                                                        : "danger"
                                                }

                                                size="sm"

                                                dot
                                            >
                                                {category.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </StatusBadge>
                                        </div>
                                    </div>


                                    {/* CONTENT */}

                                    <div
                                        className="
                      p-5
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
                                                <h3
                                                    className="
                            text-lg
                            font-black
                            text-slate-950
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
                            font-semibold
                            text-slate-400
                          "
                                                >
                                                    {
                                                        category.slug
                                                    }
                                                </p>
                                            </div>


                                            <span
                                                className="
                          rounded-lg

                          bg-orange-50

                          px-2.5
                          py-1

                          text-xs
                          font-bold
                          text-orange-600
                        "
                                            >
                                                #{
                                                    category.displayOrder
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                )}
        </div>
    );
};


export default RestaurantCategories;