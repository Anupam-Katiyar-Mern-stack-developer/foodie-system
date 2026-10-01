import {
    FaCheckCircle,
    FaMapMarkerAlt,
    FaMotorcycle,
    FaShoppingBag,
    FaStore,
} from "react-icons/fa";

import Container from "../../common/Container/Container";


const steps = [
    {
        number: "01",
        title: "Choose your food",
        description:
            "Explore restaurants, browse their menus and choose what you are craving.",
        icon: FaShoppingBag,
    },

    {
        number: "02",
        title: "Restaurant prepares",
        description:
            "Your order reaches the restaurant and fresh preparation starts immediately.",
        icon: FaStore,
    },

    {
        number: "03",
        title: "Delivery partner picks up",
        description:
            "An available delivery partner is assigned and picks up your order.",
        icon: FaMotorcycle,
    },

    {
        number: "04",
        title: "Track & receive",
        description:
            "Follow your delivery in real time and receive your order securely.",
        icon: FaMapMarkerAlt,
    },
];


const HowItWorksSection = () => {
    return (
        <section
            className="
        relative
        overflow-hidden

        bg-slate-950

        py-14
        text-white

        sm:py-16
        lg:py-24
      "
        >
            {/* =========================
          BACKGROUND DECORATION
      ========================== */}

            <div
                className="
          pointer-events-none

          absolute
          -left-28
          top-10

          h-80
          w-80

          rounded-full

          bg-orange-500/10

          blur-[110px]
        "
            />

            <div
                className="
          pointer-events-none

          absolute
          -right-32
          bottom-0

          h-80
          w-80

          rounded-full

          bg-rose-500/10

          blur-[110px]
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
                    <div
                        className="
              inline-flex
              items-center
              gap-2

              rounded-full

              border
              border-orange-400/20

              bg-orange-400/10

              px-3.5
              py-2

              text-xs
              font-black
              uppercase
              tracking-[0.15em]
              text-orange-300
            "
                    >
                        <FaCheckCircle
                            className="
                h-3.5
                w-3.5
              "
                        />

                        Simple ordering
                    </div>


                    <h2
                        className="
              mt-4

              text-3xl
              font-black
              tracking-tight

              sm:text-4xl

              lg:text-5xl
            "
                    >
                        From craving to
                        <span
                            className="
                bg-gradient-to-r
                from-orange-400
                to-rose-400

                bg-clip-text
                text-transparent
              "
                        >
                            {" "}
                            doorstep
                        </span>
                    </h2>


                    <p
                        className="
              mx-auto
              mt-4
              max-w-xl

              text-sm
              leading-7
              text-slate-400

              sm:text-base
            "
                    >
                        Foodie keeps the entire ordering
                        journey simple, transparent and
                        easy to follow.
                    </p>
                </div>


                {/* =====================
            STEPS
        ====================== */}

                <div
                    className="
            relative
            z-10

            mt-10

            grid
            gap-4

            sm:mt-12
            sm:grid-cols-2
            sm:gap-5

            lg:mt-16
            lg:grid-cols-4
          "
                >
                    {steps.map(
                        (
                            step,
                            index
                        ) => {
                            const Icon =
                                step.icon;


                            return (
                                <div
                                    key={
                                        step.number
                                    }

                                    className="
                    group
                    relative
                  "
                                >
                                    {/* DESKTOP CONNECTING LINE */}

                                    {index <
                                        steps.length -
                                        1 && (
                                            <div
                                                className="
                        pointer-events-none

                        absolute
                        left-[72%]
                        top-[34px]

                        hidden

                        h-px
                        w-[60%]

                        bg-gradient-to-r
                        from-orange-400/50
                        to-white/10

                        lg:block
                      "
                                            />
                                        )}


                                    <article
                                        className="
                      relative

                      h-full

                      overflow-hidden

                      rounded-[1.75rem]

                      border
                      border-white/10

                      bg-white/[0.045]

                      p-5

                      backdrop-blur

                      transition
                      duration-300

                      hover:-translate-y-1
                      hover:border-orange-400/30
                      hover:bg-white/[0.07]

                      sm:p-6
                    "
                                    >
                                        {/* TOP */}

                                        <div
                                            className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                                        >
                                            {/* ICON */}

                                            <div
                                                className="
                          flex
                          h-14
                          w-14
                          shrink-0
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
                                                <Icon
                                                    className="
                            h-5
                            w-5
                          "
                                                />
                                            </div>


                                            {/* NUMBER */}

                                            <span
                                                className="
                          text-4xl
                          font-black
                          leading-none
                          text-white/[0.07]

                          transition

                          group-hover:text-orange-400/15
                        "
                                            >
                                                {step.number}
                                            </span>
                                        </div>


                                        {/* CONTENT */}

                                        <div
                                            className="
                        mt-6
                      "
                                        >
                                            <h3
                                                className="
                          text-lg
                          font-black
                          tracking-tight
                          text-white

                          sm:text-xl
                        "
                                            >
                                                {step.title}
                                            </h3>


                                            <p
                                                className="
                          mt-3

                          text-sm
                          leading-6
                          text-slate-400
                        "
                                            >
                                                {
                                                    step.description
                                                }
                                            </p>
                                        </div>


                                        {/* BOTTOM INDICATOR */}

                                        <div
                                            className="
                        mt-6

                        flex
                        items-center
                        gap-2
                      "
                                        >
                                            <span
                                                className="
                          h-1.5
                          w-8

                          rounded-full

                          bg-gradient-to-r
                          from-orange-500
                          to-rose-500
                        "
                                            />

                                            <span
                                                className="
                          h-1.5
                          w-2

                          rounded-full

                          bg-white/10
                        "
                                            />
                                        </div>
                                    </article>
                                </div>
                            );
                        }
                    )}
                </div>


                {/* =====================
            FINAL STATUS STRIP
        ====================== */}

                <div
                    className="
            relative
            z-10

            mt-8

            rounded-2xl

            border
            border-white/10

            bg-white/[0.04]

            px-4
            py-4

            sm:mt-10
            sm:px-6
          "
                >
                    <div
                        className="
              flex
              flex-col
              gap-3

              sm:flex-row
              sm:items-center
              sm:justify-center
              sm:gap-6
            "
                    >
                        <div
                            className="
                flex
                items-center
                justify-center
                gap-2

                text-xs
                font-semibold
                text-slate-400

                sm:text-sm
              "
                        >
                            <span
                                className="
                  h-2
                  w-2

                  rounded-full

                  bg-orange-500
                "
                            />

                            Order placed
                        </div>


                        <div
                            className="
                hidden
                h-px
                w-10

                bg-white/10

                sm:block
              "
                        />


                        <div
                            className="
                flex
                items-center
                justify-center
                gap-2

                text-xs
                font-semibold
                text-slate-400

                sm:text-sm
              "
                        >
                            <span
                                className="
                  h-2
                  w-2

                  rounded-full

                  bg-amber-400
                "
                            />

                            Preparing
                        </div>


                        <div
                            className="
                hidden
                h-px
                w-10

                bg-white/10

                sm:block
              "
                        />


                        <div
                            className="
                flex
                items-center
                justify-center
                gap-2

                text-xs
                font-semibold
                text-slate-400

                sm:text-sm
              "
                        >
                            <span
                                className="
                  h-2
                  w-2

                  rounded-full

                  bg-blue-400
                "
                            />

                            Out for delivery
                        </div>


                        <div
                            className="
                hidden
                h-px
                w-10

                bg-white/10

                sm:block
              "
                        />


                        <div
                            className="
                flex
                items-center
                justify-center
                gap-2

                text-xs
                font-semibold
                text-slate-400

                sm:text-sm
              "
                        >
                            <span
                                className="
                  h-2
                  w-2

                  rounded-full

                  bg-emerald-400
                "
                            />

                            Delivered
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};


export default HowItWorksSection;