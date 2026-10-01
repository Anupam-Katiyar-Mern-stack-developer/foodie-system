import {
  Link,
} from "react-router-dom";

import {
  FaArrowRight,
  FaFireAlt,
} from "react-icons/fa";

import Container from "../../common/Container/Container";
import Skeleton from "../../common/Skeleton/Skeleton";

import CategoryCard from "./CategoryCard";


const CategorySection = ({
  categories = [],

  loading = false,
}) => {
  return (
    <section
      className="
        relative

        bg-white

        py-14

        sm:py-16

        lg:py-20
      "
    >
      <Container>
        {/* =====================
            SECTION HEADER
        ====================== */}
        <div
          className="
            mb-7

            flex
            items-end
            justify-between
            gap-4

            sm:mb-9
          "
        >
          <div
            className="
              max-w-xl
            "
          >
            {/* EYEBROW */}
            <div
              className="
                inline-flex
                items-center
                gap-2

                text-xs
                font-black
                uppercase
                tracking-[0.15em]
                text-orange-500
              "
            >
              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center

                  rounded-lg

                  bg-orange-100
                "
              >
                <FaFireAlt
                  className="
                    h-3.5
                    w-3.5
                  "
                />
              </span>

              Find your craving
            </div>


            <h2
              className="
                mt-3

                text-2xl
                font-black
                tracking-tight
                text-slate-950

                sm:text-3xl

                lg:text-4xl
              "
            >
              What are you
              <span
                className="
                  text-orange-500
                "
              >
                {" "}
                craving
              </span>
              {" "}today?
            </h2>


            <p
              className="
                mt-2

                max-w-lg

                text-sm
                leading-6
                text-slate-500

                sm:text-base
              "
            >
              Pick a category and discover
              dishes from restaurants around
              you.
            </p>
          </div>


          {/* DESKTOP ACTION */}
          <Link
            to="/restaurants"

            className="
              hidden
              shrink-0
              items-center
              gap-2

              rounded-xl

              px-3
              py-2

              text-sm
              font-bold
              text-slate-600

              transition

              hover:bg-orange-50
              hover:text-orange-600

              sm:inline-flex
            "
          >
            Explore all

            <FaArrowRight
              className="
                h-3
                w-3
              "
            />
          </Link>
        </div>


        {/* =====================
            LOADING
        ====================== */}
        {loading ? (
          <div
            className="
              grid
              grid-flow-col
              auto-cols-[42%]
              gap-3

              overflow-hidden

              sm:auto-cols-auto
              sm:grid-flow-row
              sm:grid-cols-4
              sm:gap-4

              lg:grid-cols-6

              xl:grid-cols-8
            "
          >
            {Array.from({
              length: 8,
            }).map(
              (_, index) => (
                <div
                  key={index}

                  className="
                    rounded-[1.6rem]

                    border
                    border-slate-100

                    bg-white

                    p-2.5
                  "
                >
                  <Skeleton
                    width="w-full"
                    height="aspect-square"
                    rounded="rounded-[1.25rem]"
                  />

                  <div
                    className="
                      px-2
                      pb-2
                      pt-3
                    "
                  >
                    <Skeleton
                      width="w-20"
                      height="h-4"
                    />

                    <div className="mt-2">
                      <Skeleton
                        width="w-14"
                        height="h-3"
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          /* =====================
              ACTUAL CATEGORIES
          ====================== */
          <div
            className="
              grid
              grid-flow-col

              auto-cols-[42%]

              gap-3

              overflow-x-auto

              pb-3

              snap-x
              snap-mandatory

              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden

              min-[480px]:auto-cols-[31%]

              sm:grid-flow-row
              sm:auto-cols-auto
              sm:grid-cols-4
              sm:overflow-visible
              sm:pb-0

              lg:grid-cols-6

              xl:grid-cols-8
            "
          >
            {categories.map(
              (category) => (
                <div
                  key={category.slug}

                  className="
                    min-w-0
                    snap-start
                  "
                >
                  <CategoryCard
                    category={category}
                  />
                </div>
              )
            )}
          </div>
        )}


        {/* MOBILE ACTION */}
        {!loading &&
          categories.length > 0 && (
            <div
              className="
                mt-5
                sm:hidden
              "
            >
              <Link
                to="/restaurants"

                className="
                  inline-flex
                  min-h-11
                  w-full
                  items-center
                  justify-center
                  gap-2

                  rounded-2xl

                  border
                  border-orange-200

                  bg-orange-50

                  px-4

                  text-sm
                  font-bold
                  text-orange-600
                "
              >
                Explore all

                <FaArrowRight
                  className="
                    h-3
                    w-3
                  "
                />
              </Link>
            </div>
          )}
      </Container>
    </section>
  );
};


export default CategorySection;