import {
  FaArrowRight,
  FaFireAlt,
  FaUtensils,
} from "react-icons/fa";

import {
  Link,
} from "react-router-dom";

import Container from "../../common/Container/Container";
import Skeleton from "../../common/Skeleton/Skeleton";
import EmptyState from "../../common/EmptyState/EmptyState";

import FoodCard from "../FoodCard/FoodCard";


const PopularFoodsSection = ({
  foods = [],

  loading = false,

  onAddToCart,
}) => {
  return (
    <section
      className="
        relative

        overflow-hidden

        bg-white

        py-14

        sm:py-16

        lg:py-20
      "
    >
      {/* =========================
          DECORATIVE BACKGROUND
      ========================== */}

      <div
        className="
          pointer-events-none

          absolute
          -left-32
          bottom-0

          h-80
          w-80

          rounded-full

          bg-rose-300/10

          blur-[100px]
        "
      />


      <Container>
        {/* =====================
            SECTION HEADER
        ====================== */}

        <div
          className="
            relative
            z-10

            mb-8

            flex
            items-end
            justify-between
            gap-4

            sm:mb-10
          "
        >
          <div
            className="
              max-w-2xl
            "
          >
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
                    h-3
                    w-3
                  "
                />
              </span>

              Fresh picks
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
              Delicious food waiting
              <span
                className="
                  text-orange-500
                "
              >
                {" "}
                for you
              </span>
            </h2>


            <p
              className="
                mt-2

                max-w-xl

                text-sm
                leading-6
                text-slate-500

                sm:text-base
              "
            >
              Explore freshly prepared
              dishes and add your favourites
              to the cart.
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
            Explore menus

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

        {loading && (
          <div
            className="
              grid
              grid-flow-col

              auto-cols-[82%]

              gap-4

              overflow-hidden

              sm:grid-flow-row
              sm:auto-cols-auto
              sm:grid-cols-2

              lg:grid-cols-3

              xl:grid-cols-4
            "
          >
            {Array.from({
              length: 4,
            }).map(
              (_, index) => (
                <div
                  key={index}

                  className="
                    overflow-hidden

                    rounded-[1.75rem]

                    border
                    border-slate-200

                    bg-white
                  "
                >
                  <Skeleton
                    width="w-full"
                    height="aspect-[4/3]"
                    rounded="rounded-none"
                  />


                  <div className="p-5">
                    <Skeleton
                      width="w-3/4"
                      height="h-5"
                    />


                    <div className="mt-3">
                      <Skeleton
                        width="w-full"
                        height="h-4"
                      />
                    </div>


                    <div className="mt-2">
                      <Skeleton
                        width="w-2/3"
                        height="h-4"
                      />
                    </div>


                    <div className="mt-6">
                      <Skeleton
                        width="w-full"
                        height="h-10"
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}


        {/* =====================
            EMPTY
        ====================== */}

        {!loading &&
          foods.length === 0 && (
            <EmptyState
              icon={FaUtensils}

              title="No food available"

              description="Available dishes will appear here once restaurants add their menu."
            />
          )}


        {/* =====================
            FOOD LIST
        ====================== */}

        {!loading &&
          foods.length > 0 && (
            <div
              className="
                grid
                grid-flow-col

                auto-cols-[82%]

                gap-4

                overflow-x-auto

                pb-4

                snap-x
                snap-mandatory

                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden

                min-[480px]:auto-cols-[60%]

                sm:grid-flow-row
                sm:auto-cols-auto
                sm:grid-cols-2
                sm:overflow-visible
                sm:pb-0

                lg:grid-cols-3

                xl:grid-cols-4
              "
            >
              {foods
                .slice(0, 4)
                .map(
                  (food) => (
                    <div
                      key={
                        food.slug
                      }

                      className="
                        min-w-0
                        snap-start
                      "
                    >
                      <FoodCard
                        food={
                          food
                        }

                        onAddToCart={
                          onAddToCart
                        }
                      />
                    </div>
                  )
                )}
            </div>
          )}


        {/* MOBILE ACTION */}

        {!loading &&
          foods.length > 0 && (
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
                Explore more food

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


export default PopularFoodsSection;