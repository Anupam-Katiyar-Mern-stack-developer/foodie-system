import {
  useMemo,
} from "react";

import {
  useSelector,
} from "react-redux";

import {
  FaLayerGroup,
} from "react-icons/fa";

import Container
  from "../../../components/common/Container/Container";

import PageHeader
  from "../../../components/common/PageHeader/PageHeader";

import Skeleton
  from "../../../components/common/Skeleton/Skeleton";

import EmptyState
  from "../../../components/common/EmptyState/EmptyState";

import ErrorState
  from "../../../components/common/ErrorState/ErrorState";

import OptimizedImage
  from "../../../components/common/OptimizedImage/OptimizedImage";


const RestaurantCategories = () => {

  // =============================
  // REDUX
  // =============================

  const {
    categories = [],
    fetchLoading = false,
    error = null,
  } = useSelector(
    (state) =>
      state.publicCategory
  ) || {};


  // =============================
  // ACTIVE CATEGORIES
  // =============================

  const activeCategories =
    useMemo(
      () =>
        categories.filter(
          (category) =>
            category.isActive !==
            false
        ),
      [categories]
    );


  // =============================
  // LOADING
  // =============================

  if (fetchLoading) {
    return (
      <div
        className="
          min-h-screen
          bg-[#fffaf5]
          py-8
        "
      >
        <Container>

          <Skeleton
            width="w-72"
            height="h-10"
          />

          <div
            className="
              mt-8
              grid
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {Array.from({
              length: 8,
            }).map(
              (_, index) => (
                <Skeleton
                  key={index}
                  width="w-full"
                  height="h-64"
                  rounded="rounded-2xl"
                />
              )
            )}
          </div>

        </Container>
      </div>
    );
  }


  // =============================
  // ERROR
  // =============================

  if (error) {
    return (
      <div
        className="
          min-h-screen
          bg-[#fffaf5]
          py-8
        "
      >
        <Container>

          <ErrorState
            title="Unable to load categories"
            description={
              typeof error ===
              "string"
                ? error
                : "Something went wrong while loading categories."
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
        py-8
      "
    >
      <Container>

        {/* HEADER */}

        <PageHeader
          title="Categories"
          description="Browse categories created and managed by the Foodie admin."
        />


        {/* INFO */}

        <div
          className="
            mt-6

            rounded-2xl

            border
            border-orange-200

            bg-orange-50

            px-5
            py-4
          "
        >
          <p
            className="
              text-sm
              leading-6
              text-orange-800
            "
          >
            Categories are managed by
            Foodie Admin. You can use
            active categories while
            adding or editing food
            items.
          </p>
        </div>


        {/* EMPTY */}

        {activeCategories.length ===
        0 ? (
          <div className="mt-10">

            <EmptyState
              icon={FaLayerGroup}
              title="No categories available"
              description="There are currently no active food categories available."
            />

          </div>
        ) : (

          /* CATEGORY GRID */

          <div
            className="
              mt-8

              grid
              gap-5

              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {activeCategories.map(
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
                    hover:shadow-lg
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
                    {category.image ? (
                      <OptimizedImage
                        src={
                          category.image
                        }
                        alt={
                          category.name
                        }
                        rounded="rounded-none"
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

                          text-3xl
                          text-slate-300
                        "
                      >
                        <FaLayerGroup />
                      </div>
                    )}
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
                      <div
                        className="
                          min-w-0
                        "
                      >
                        <h3
                          className="
                            truncate

                            text-base
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

                            truncate

                            text-xs
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
                          shrink-0

                          rounded-full

                          bg-emerald-50

                          px-2.5
                          py-1

                          text-[10px]
                          font-black
                          uppercase

                          text-emerald-700
                        "
                      >
                        Active
                      </span>

                    </div>

                  </div>

                </div>
              )
            )}
          </div>
        )}

      </Container>
    </div>
  );
};


export default RestaurantCategories;