import {
  Link,
} from "react-router-dom";

import {
  FaArrowRight,
  FaStore,
} from "react-icons/fa";

import Container from "../../common/Container/Container";
import Skeleton from "../../common/Skeleton/Skeleton";
import EmptyState from "../../common/EmptyState/EmptyState";

import RestaurantCard from "../RestaurantCard/RestaurantCard";


const PopularRestaurantsSection = ({
  restaurants = [],

  loading = false,
}) => {
  return (
    <section
      className="
        relative

        overflow-hidden

        bg-[#fffaf5]

        py-14

        sm:py-16

        lg:py-20
      "
    >
      {/* BACKGROUND */}

      <div
        className="
          pointer-events-none

          absolute
          -right-36
          top-1/2

          h-80
          w-80

          -translate-y-1/2

          rounded-full

          bg-orange-300/10

          blur-[100px]
        "
      />


      <Container>
        {/* =====================
            HEADER
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
                <FaStore
                  className="
                    h-3
                    w-3
                  "
                />
              </span>

              Restaurants around you
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
              Discover places worth
              <span
                className="
                  text-orange-500
                "
              >
                {" "}
                ordering from
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
              Explore approved restaurants
              and discover their freshly
              prepared food.
            </p>
          </div>


          {/* DESKTOP VIEW ALL */}

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
            View all

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

              gap-5

              sm:grid-cols-2

              lg:grid-cols-3
            "
          >
            {Array.from({
              length: 3,
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
                    height="aspect-[16/11]"
                    rounded="rounded-none"
                  />

                  <div className="p-5">
                    <Skeleton
                      width="w-2/3"
                      height="h-5"
                    />

                    <div className="mt-3">
                      <Skeleton
                        width="w-1/2"
                        height="h-4"
                      />
                    </div>

                    <div className="mt-5">
                      <Skeleton
                        width="w-full"
                        height="h-4"
                      />
                    </div>

                    <div className="mt-2">
                      <Skeleton
                        width="w-3/4"
                        height="h-4"
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
          restaurants.length === 0 && (
            <EmptyState
              icon={FaStore}

              title="No restaurants available"

              description="Restaurants will appear here when they are available in your area."
            />
          )}


        {/* =====================
            RESTAURANTS
        ====================== */}

        {!loading &&
          restaurants.length > 0 && (
            <div
              className="
                grid

                gap-5

                sm:grid-cols-2

                lg:grid-cols-3
              "
            >
              {restaurants
                .slice(0, 3)
                .map(
                  (restaurant) => (
                    <RestaurantCard
                      key={
                        restaurant.slug
                      }

                      restaurant={
                        restaurant
                      }
                    />
                  )
                )}
            </div>
          )}


        {/* MOBILE ACTION */}

        {!loading &&
          restaurants.length > 0 && (
            <div
              className="
                mt-6

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
                View all restaurants

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


export default PopularRestaurantsSection;