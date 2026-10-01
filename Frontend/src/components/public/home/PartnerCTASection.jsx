import {
  FaArrowRight,
  FaMotorcycle,
  FaStore,
  FaCheckCircle,
} from "react-icons/fa";

import {
  Link,
} from "react-router-dom";

import Container from "../../common/Container/Container";


const PartnerCTASection = () => {
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
      {/* BACKGROUND DECORATION */}

      <div
        className="
          pointer-events-none

          absolute
          -left-24
          top-10

          h-72
          w-72

          rounded-full

          bg-orange-300/15

          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none

          absolute
          -right-24
          bottom-0

          h-72
          w-72

          rounded-full

          bg-rose-300/15

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

            mx-auto
            max-w-2xl

            text-center
          "
        >
          <span
            className="
              inline-flex

              rounded-full

              border
              border-orange-200

              bg-white

              px-4
              py-2

              text-xs
              font-black
              uppercase
              tracking-[0.14em]
              text-orange-500

              shadow-sm
            "
          >
            Grow with Foodie
          </span>


          <h2
            className="
              mt-4

              text-3xl
              font-black
              tracking-tight
              text-slate-950

              sm:text-4xl

              lg:text-5xl
            "
          >
            Be part of the
            <span
              className="
                bg-gradient-to-r
                from-orange-500
                to-rose-500

                bg-clip-text
                text-transparent
              "
            >
              {" "}
              Foodie network
            </span>
          </h2>


          <p
            className="
              mx-auto
              mt-4
              max-w-xl

              text-sm
              leading-7
              text-slate-500

              sm:text-base
            "
          >
            Whether you run a restaurant or
            want to deliver orders, Foodie
            gives you a simple way to grow
            with the platform.
          </p>
        </div>


        {/* =====================
            CTA CARDS
        ====================== */}

        <div
          className="
            relative
            z-10

            mt-10

            grid
            gap-5

            lg:mt-12
            lg:grid-cols-2
            lg:gap-6
          "
        >
          {/* =====================
              RESTAURANT CARD
          ====================== */}

          <article
            className="
              group

              relative
              overflow-hidden

              rounded-[2rem]

              bg-slate-950

              p-6

              text-white

              shadow-xl
              shadow-slate-900/10

              sm:p-8

              lg:p-10
            "
          >
            {/* GLOW */}

            <div
              className="
                pointer-events-none

                absolute
                -right-16
                -top-16

                h-52
                w-52

                rounded-full

                bg-orange-500/20

                blur-[80px]
              "
            />


            <div
              className="
                relative
                z-10
              "
            >
              {/* ICON */}

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center

                  rounded-2xl

                  bg-gradient-to-br
                  from-orange-500
                  to-rose-500

                  text-white

                  shadow-lg
                  shadow-orange-950/30

                  transition
                  duration-300

                  group-hover:rotate-3
                  group-hover:scale-105
                "
              >
                <FaStore
                  className="
                    h-5
                    w-5
                  "
                />
              </div>


              <div
                className="
                  mt-6
                "
              >
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-orange-300
                  "
                >
                  For Restaurants
                </p>


                <h3
                  className="
                    mt-2

                    text-2xl
                    font-black
                    tracking-tight

                    sm:text-3xl
                  "
                >
                  Bring your restaurant
                  online.
                </h3>


                <p
                  className="
                    mt-3

                    max-w-lg

                    text-sm
                    leading-7
                    text-slate-400
                  "
                >
                  Manage your menu, receive
                  customer orders and handle
                  the complete order flow
                  from one restaurant panel.
                </p>
              </div>


              {/* BENEFITS */}

              <div
                className="
                  mt-6

                  space-y-3
                "
              >
                {[
                  "Manage foods and availability",
                  "Receive and update orders",
                  "Control restaurant profile",
                ].map(
                  (item) => (
                    <div
                      key={item}

                      className="
                        flex
                        items-center
                        gap-2.5

                        text-sm
                        text-slate-300
                      "
                    >
                      <FaCheckCircle
                        className="
                          h-4
                          w-4
                          shrink-0

                          text-orange-400
                        "
                      />

                      {item}
                    </div>
                  )
                )}
              </div>


              {/* ACTION */}

              <Link
                to="/restaurant/register"

                className="
                  mt-8

                  inline-flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  gap-2

                  rounded-2xl

                  bg-white

                  px-5

                  text-sm
                  font-black
                  text-slate-950

                  transition
                  duration-200

                  hover:-translate-y-0.5
                  hover:bg-orange-500
                  hover:text-white

                  sm:w-auto
                "
              >
                Register Restaurant

                <FaArrowRight
                  className="
                    h-3
                    w-3
                  "
                />
              </Link>
            </div>
          </article>


          {/* =====================
              DELIVERY CARD
          ====================== */}

          <article
            className="
              group

              relative
              overflow-hidden

              rounded-[2rem]

              border
              border-orange-200

              bg-white

              p-6

              shadow-xl
              shadow-orange-900/5

              sm:p-8

              lg:p-10
            "
          >
            {/* GLOW */}

            <div
              className="
                pointer-events-none

                absolute
                -bottom-20
                -right-20

                h-56
                w-56

                rounded-full

                bg-rose-300/20

                blur-[90px]
              "
            />


            <div
              className="
                relative
                z-10
              "
            >
              {/* ICON */}

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center

                  rounded-2xl

                  bg-orange-100

                  text-orange-600

                  transition
                  duration-300

                  group-hover:-rotate-3
                  group-hover:scale-105
                "
              >
                <FaMotorcycle
                  className="
                    h-6
                    w-6
                  "
                />
              </div>


              <div
                className="
                  mt-6
                "
              >
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-orange-500
                  "
                >
                  For Delivery Partners
                </p>


                <h3
                  className="
                    mt-2

                    text-2xl
                    font-black
                    tracking-tight
                    text-slate-950

                    sm:text-3xl
                  "
                >
                  Deliver orders on your
                  schedule.
                </h3>


                <p
                  className="
                    mt-3

                    max-w-lg

                    text-sm
                    leading-7
                    text-slate-500
                  "
                >
                  Go online when you are
                  available, accept delivery
                  offers and complete orders
                  through your delivery
                  dashboard.
                </p>
              </div>


              {/* BENEFITS */}

              <div
                className="
                  mt-6

                  space-y-3
                "
              >
                {[
                  "Online and offline control",
                  "Receive delivery offers",
                  "Manage active deliveries",
                ].map(
                  (item) => (
                    <div
                      key={item}

                      className="
                        flex
                        items-center
                        gap-2.5

                        text-sm
                        text-slate-600
                      "
                    >
                      <FaCheckCircle
                        className="
                          h-4
                          w-4
                          shrink-0

                          text-emerald-500
                        "
                      />

                      {item}
                    </div>
                  )
                )}
              </div>


              {/* ACTION */}

              <Link
                to="/delivery/register"

                className="
                  mt-8

                  inline-flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  gap-2

                  rounded-2xl

                  bg-gradient-to-r
                  from-orange-500
                  to-rose-500

                  px-5

                  text-sm
                  font-black
                  text-white

                  shadow-lg
                  shadow-orange-500/20

                  transition
                  duration-200

                  hover:-translate-y-0.5
                  hover:shadow-xl

                  sm:w-auto
                "
              >
                Join as Delivery Partner

                <FaArrowRight
                  className="
                    h-3
                    w-3
                  "
                />
              </Link>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
};


export default PartnerCTASection;