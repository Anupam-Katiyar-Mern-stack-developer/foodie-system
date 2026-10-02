import {
    FaArrowRight,
    FaCheck,
    FaMapMarkerAlt,
    FaMotorcycle,
    FaRoute,
    FaStore,
    FaUtensils,
} from "react-icons/fa";

import {
    Link,
} from "react-router-dom";

import Container from "../../common/Container/Container";


const LiveTrackingSection = () => {
    return (
        <section
            className="
        relative
        overflow-hidden
        bg-white

        py-14
        sm:py-16
        lg:py-24
      "
        >
            {/* =========================
          BACKGROUND
      ========================== */}

            <div
                className="
          pointer-events-none

          absolute
          -left-40
          top-1/2

          h-96
          w-96

          -translate-y-1/2

          rounded-full
          bg-orange-300/10

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
          bg-rose-300/10

          blur-[100px]
        "
            />


            <Container>
                <div
                    className="
            relative
            z-10

            grid
            items-center
            gap-12

            lg:grid-cols-[0.95fr_1.05fr]
            lg:gap-16
          "
                >
                    {/* =====================
              VISUAL
          ====================== */}

                    <div
                        className="
              order-2
              mx-auto
              w-full
              max-w-[560px]

              lg:order-1
              lg:mx-0
            "
                    >
                        <div
                            className="
                relative

                overflow-hidden

                rounded-[2rem]

                border
                border-slate-200

                bg-[#fffaf5]

                p-4

                shadow-2xl
                shadow-orange-950/10

                sm:p-6
              "
                        >
                            {/* TOP BAR */}

                            <div
                                className="
                  flex
                  items-center
                  justify-between
                  gap-4

                  rounded-2xl

                  border
                  border-white

                  bg-white/90

                  p-4

                  shadow-sm
                "
                            >
                                <div
                                    className="
                    flex
                    items-center
                    gap-3
                  "
                                >
                                    <span
                                        className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center

                      rounded-xl

                      bg-orange-100

                      text-orange-600
                    "
                                    >
                                        <FaMotorcycle
                                            className="
                        h-5
                        w-5
                      "
                                        />
                                    </span>


                                    <div>
                                        <p
                                            className="
                        text-xs
                        font-medium
                        text-slate-400
                      "
                                        >
                                            Current status
                                        </p>

                                        <p
                                            className="
                        mt-0.5

                        text-sm
                        font-black
                        text-slate-950

                        sm:text-base
                      "
                                        >
                                            Out for delivery
                                        </p>
                                    </div>
                                </div>


                                <span
                                    className="
                    inline-flex
                    items-center
                    gap-1.5

                    rounded-full

                    bg-emerald-50

                    px-2.5
                    py-1.5

                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-emerald-700
                  "
                                >
                                    <span
                                        className="
                      h-2
                      w-2

                      rounded-full

                      bg-emerald-500

                      ring-4
                      ring-emerald-100
                    "
                                    />

                                    Live
                                </span>
                            </div>


                            {/* =====================
                  MAP STYLE AREA
              ====================== */}

                            <div
                                className="
                  relative

                  mt-4

                  min-h-[260px]

                  overflow-hidden

                  rounded-[1.7rem]

                  border
                  border-orange-100

                  bg-orange-50

                  sm:min-h-[320px]
                "
                            >
                                {/* GRID */}

                                <div
                                    className="
                    absolute
                    inset-0

                    opacity-40

                    [background-image:linear-gradient(to_right,#f1d5c2_1px,transparent_1px),linear-gradient(to_bottom,#f1d5c2_1px,transparent_1px)]
                    [background-size:36px_36px]
                  "
                                />


                                {/* ROAD 1 */}

                                <div
                                    className="
                    absolute
                    -left-20
                    top-[45%]

                    h-5
                    w-[130%]

                    rotate-[-8deg]

                    rounded-full

                    bg-white

                    shadow-sm
                  "
                                />


                                {/* ROAD 2 */}

                                <div
                                    className="
                    absolute
                    left-[45%]
                    top-[-20%]

                    h-[140%]
                    w-5

                    rotate-[20deg]

                    rounded-full

                    bg-white

                    shadow-sm
                  "
                                />


                                {/* RESTAURANT */}

                                <div
                                    className="
                    absolute
                    left-[12%]
                    top-[20%]

                    flex
                    flex-col
                    items-center
                    gap-1
                  "
                                >
                                    <span
                                        className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center

                      rounded-2xl

                      bg-slate-950

                      text-white

                      shadow-lg
                    "
                                    >
                                        <FaStore
                                            className="
                        h-4
                        w-4
                      "
                                        />
                                    </span>

                                    <span
                                        className="
                      rounded-lg

                      bg-white

                      px-2
                      py-1

                      text-[9px]
                      font-bold
                      text-slate-700

                      shadow-sm
                    "
                                    >
                                        Restaurant
                                    </span>
                                </div>


                                {/* DESTINATION */}

                                <div
                                    className="
                    absolute
                    bottom-[16%]
                    right-[10%]

                    flex
                    flex-col
                    items-center
                    gap-1
                  "
                                >
                                    <span
                                        className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center

                      rounded-2xl

                      bg-gradient-to-br
                      from-orange-500
                      to-rose-500

                      text-white

                      shadow-lg
                      shadow-orange-500/20
                    "
                                    >
                                        <FaMapMarkerAlt
                                            className="
                        h-4
                        w-4
                      "
                                        />
                                    </span>

                                    <span
                                        className="
                      rounded-lg

                      bg-white

                      px-2
                      py-1

                      text-[9px]
                      font-bold
                      text-slate-700

                      shadow-sm
                    "
                                    >
                                        Your address
                                    </span>
                                </div>


                                {/* ROUTE */}

                                <div
                                    className="
                    absolute
                    left-[25%]
                    top-[42%]

                    h-[2px]
                    w-[49%]

                    rotate-[18deg]

                    border-t-2
                    border-dashed
                    border-orange-400
                  "
                                />


                                {/* DELIVERY RIDER */}

                                <div
                                    className="
                    absolute
                    left-[50%]
                    top-[49%]

                    -translate-x-1/2
                    -translate-y-1/2
                  "
                                >
                                    <span
                                        className="
                      relative

                      flex
                      h-14
                      w-14
                      items-center
                      justify-center

                      rounded-full

                      bg-orange-500

                      text-white

                      shadow-xl
                      shadow-orange-500/30

                      ring-8
                      ring-orange-500/10
                    "
                                    >
                                        <FaMotorcycle
                                            className="
                        h-5
                        w-5
                      "
                                        />

                                        <span
                                            className="
                        absolute
                        -right-1
                        -top-1

                        h-3
                        w-3

                        rounded-full

                        bg-emerald-500

                        ring-2
                        ring-white
                      "
                                        />
                                    </span>
                                </div>


                                {/* ETA */}

                                <div
                                    className="
                    absolute
                    bottom-4
                    left-4

                    rounded-2xl

                    border
                    border-white

                    bg-white/95

                    px-4
                    py-3

                    shadow-lg
                    backdrop-blur
                  "
                                >
                                    <p
                                        className="
                      text-[10px]
                      font-medium
                      text-slate-400
                    "
                                    >
                                        Estimated arrival
                                    </p>

                                    <p
                                        className="
                      mt-0.5

                      text-lg
                      font-black
                      text-slate-950
                    "
                                    >
                                        12 min
                                    </p>
                                </div>
                            </div>


                            {/* =====================
                  ORDER TIMELINE
              ====================== */}

                            <div
                                className="
                  mt-4

                  grid
                  grid-cols-4
                  gap-2
                "
                            >
                                {[
                                    {
                                        label: "Placed",
                                        done: true,
                                    },
                                    {
                                        label: "Preparing",
                                        done: true,
                                    },
                                    {
                                        label: "On way",
                                        done: true,
                                    },
                                    {
                                        label: "Delivered",
                                        done: false,
                                    },
                                ].map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <div
                                            key={item.label}

                                            className="
                        min-w-0
                        text-center
                      "
                                        >
                                            <div
                                                className={`
                          mx-auto

                          flex
                          h-8
                          w-8
                          items-center
                          justify-center

                          rounded-full

                          ${item.done
                                                        ? `
                                bg-orange-500
                                text-white
                              `
                                                        : `
                                bg-slate-100
                                text-slate-400
                              `
                                                    }
                        `}
                                            >
                                                {item.done ? (
                                                    <FaCheck
                                                        className="
                              h-3
                              w-3
                            "
                                                    />
                                                ) : (
                                                    <span
                                                        className="
                              text-[10px]
                              font-black
                            "
                                                    >
                                                        {index + 1}
                                                    </span>
                                                )}
                                            </div>


                                            <p
                                                className="
                          mt-2

                          truncate

                          text-[9px]
                          font-bold
                          text-slate-500

                          sm:text-[11px]
                        "
                                            >
                                                {item.label}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>


                    {/* =====================
              CONTENT
          ====================== */}

                    <div
                        className="
              order-1

              mx-auto
              max-w-xl

              text-center

              lg:order-2
              lg:mx-0
              lg:text-left
            "
                    >
                        <div
                            className="
                inline-flex
                items-center
                gap-2

                rounded-full

                border
                border-orange-200

                bg-orange-50

                px-3.5
                py-2

                text-xs
                font-black
                uppercase
                tracking-[0.14em]
                text-orange-600
              "
                        >
                            <FaRoute
                                className="
                  h-3.5
                  w-3.5
                "
                            />

                            Know where your order is
                        </div>


                        <h2
                            className="
                mt-5

                text-3xl
                font-black
                tracking-tight
                text-slate-950

                sm:text-4xl

                lg:text-5xl
              "
                        >
                            Follow every step,
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
                                live.
                            </span>
                        </h2>


                        <p
                            className="
                mx-auto
                mt-4
                max-w-lg

                text-sm
                leading-7
                text-slate-500

                sm:text-base

                lg:mx-0
              "
                        >
                            From restaurant confirmation
                            to doorstep delivery, Foodie
                            keeps the order journey clear
                            so customers always know what
                            is happening.
                        </p>


                        {/* FEATURES */}

                        <div
                            className="
                mt-7

                grid
                gap-3

                sm:grid-cols-2
              "
                        >
                            <div
                                className="
                  flex
                  items-center
                  gap-3

                  rounded-2xl

                  border
                  border-slate-200

                  bg-white

                  p-3.5

                  text-left

                  shadow-sm
                "
                            >
                                <span
                                    className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center

                    rounded-xl

                    bg-orange-100

                    text-orange-600
                  "
                                >
                                    <FaUtensils
                                        className="
                      h-4
                      w-4
                    "
                                    />
                                </span>


                                <div>
                                    <p
                                        className="
                      text-sm
                      font-black
                      text-slate-900
                    "
                                    >
                                        Order updates
                                    </p>

                                    <p
                                        className="
                      mt-0.5
                      text-xs
                      text-slate-500
                    "
                                    >
                                        Follow every status
                                    </p>
                                </div>
                            </div>


                            <div
                                className="
                  flex
                  items-center
                  gap-3

                  rounded-2xl

                  border
                  border-slate-200

                  bg-white

                  p-3.5

                  text-left

                  shadow-sm
                "
                            >
                                <span
                                    className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center

                    rounded-xl

                    bg-rose-100

                    text-rose-600
                  "
                                >
                                    <FaMotorcycle
                                        className="
                      h-4
                      w-4
                    "
                                    />
                                </span>


                                <div>
                                    <p
                                        className="
                      text-sm
                      font-black
                      text-slate-900
                    "
                                    >
                                        Delivery journey
                                    </p>

                                    <p
                                        className="
                      mt-0.5
                      text-xs
                      text-slate-500
                    "
                                    >
                                        Track until arrival
                                    </p>
                                </div>
                            </div>
                        </div>


                        <Link
                            to="/orders"

                            className="
                mt-8

                inline-flex
                min-h-12
                w-full
                items-center
                justify-center
                gap-2

                rounded-2xl

                bg-slate-950

                px-6

                text-sm
                font-black
                text-white

                shadow-lg

                transition
                duration-200

                hover:-translate-y-0.5
                hover:bg-orange-500

                sm:w-auto
              "
                        >
                            View My Orders

                            <FaArrowRight
                                className="
                  h-3
                  w-3
                "
                            />
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
};


export default LiveTrackingSection;