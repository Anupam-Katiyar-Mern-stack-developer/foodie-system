import {
    FaArrowRight,
    FaClock,
    FaMapMarkerAlt,
    FaMotorcycle,
    FaPizzaSlice,
    FaStar,
    FaUtensils,
} from "react-icons/fa";

import {
    Link,
} from "react-router-dom";

import Container from "../../common/Container/Container";

import homeData from "../../../data/public/home.json";


const HeroSection = () => {
    const {
        hero,
    } = homeData;


    return (
        <section
            className="
        relative
        overflow-hidden

        bg-[#fffaf5]

        pb-14
        pt-8

        sm:pb-16
        sm:pt-12

        lg:pb-24
        lg:pt-16
      "
        >
            {/* =========================
          BACKGROUND DECORATION
      ========================== */}

            <div
                className="
          pointer-events-none
          absolute
          -left-32
          top-16

          h-72
          w-72

          rounded-full

          bg-orange-300/20

          blur-[90px]

          sm:h-96
          sm:w-96
        "
            />

            <div
                className="
          pointer-events-none
          absolute
          -right-32
          bottom-10

          h-72
          w-72

          rounded-full

          bg-rose-300/20

          blur-[100px]

          sm:h-96
          sm:w-96
        "
            />


            {/* subtle dots */}

            <div
                className="
          pointer-events-none
          absolute
          right-[8%]
          top-16

          hidden
          grid-cols-4
          gap-3

          opacity-30

          lg:grid
        "
            >
                {Array.from({
                    length: 16,
                }).map(
                    (_, index) => (
                        <span
                            key={index}
                            className="
                h-1.5
                w-1.5

                rounded-full

                bg-orange-400
              "
                        />
                    )
                )}
            </div>


            <Container>
                <div
                    className="
            relative
            z-10

            grid
            items-center
            gap-12

            lg:grid-cols-[1.02fr_0.98fr]
            lg:gap-14

            xl:gap-20
          "
                >
                    {/* =====================
              LEFT CONTENT
          ====================== */}

                    <div
                        className="
              mx-auto
              max-w-2xl

              text-center

              lg:mx-0
              lg:text-left
            "
                    >
                        {/* EYEBROW */}

                        <div
                            className="
                inline-flex
                items-center
                gap-2

                rounded-full

                border
                border-orange-200

                bg-white/80

                px-3.5
                py-2

                text-xs
                font-bold
                uppercase
                tracking-[0.12em]
                text-orange-600

                shadow-sm
                backdrop-blur

                sm:text-sm
              "
                        >
                            <span
                                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center

                  rounded-full

                  bg-orange-100
                "
                            >
                                <FaUtensils
                                    className="
                    h-3
                    w-3
                  "
                                />
                            </span>

                            {hero.eyebrow}
                        </div>


                        {/* HEADING */}

                        <h1
                            className="
                mt-6

                text-[2.55rem]
                font-black
                leading-[1.05]
                tracking-[-0.045em]
                text-slate-950

                sm:text-5xl

                md:text-6xl

                lg:text-[4rem]

                xl:text-[4.6rem]
              "
                        >
                            {hero.titleStart}

                            <span
                                className="
                  relative
                  mt-1
                  block

                  bg-gradient-to-r
                  from-orange-500
                  via-rose-500
                  to-orange-500

                  bg-clip-text

                  text-transparent
                "
                            >
                                {hero.titleHighlight}

                                <span
                                    className="
                    absolute
                    -bottom-2
                    left-1/2

                    h-2
                    w-32

                    -translate-x-1/2

                    rounded-full

                    bg-gradient-to-r
                    from-orange-400/0
                    via-orange-400/40
                    to-orange-400/0

                    blur-sm

                    lg:left-0
                    lg:translate-x-0
                  "
                                />
                            </span>
                        </h1>


                        {/* DESCRIPTION */}

                        <p
                            className="
                mx-auto
                mt-6
                max-w-xl

                text-base
                leading-7
                text-slate-600

                sm:text-lg
                sm:leading-8

                lg:mx-0
              "
                        >
                            {hero.description}
                        </p>


                        {/* CTA */}

                        <div
                            className="
                mt-8

                flex
                flex-col
                gap-3

                sm:flex-row
                sm:justify-center

                lg:justify-start
              "
                        >
                            <Link
                                to="/restaurants"

                                className="
                  inline-flex
                  min-h-12
                  items-center
                  justify-center
                  gap-2

                  rounded-2xl

                  bg-gradient-to-r
                  from-orange-500
                  to-rose-500

                  px-6

                  text-sm
                  font-bold
                  text-white

                  shadow-lg
                  shadow-orange-500/20

                  transition
                  duration-200

                  hover:-translate-y-0.5
                  hover:shadow-xl

                  active:translate-y-0
                "
                            >
                                {hero.primaryButton}

                                <FaArrowRight
                                    className="
                    h-3.5
                    w-3.5
                  "
                                />
                            </Link>


                            <Link
                                to="/restaurant/register"

                                className="
                  inline-flex
                  min-h-12
                  items-center
                  justify-center
                  gap-2

                  rounded-2xl

                  border
                  border-slate-200

                  bg-white

                  px-6

                  text-sm
                  font-bold
                  text-slate-800

                  shadow-sm

                  transition
                  duration-200

                  hover:-translate-y-0.5
                  hover:border-orange-200
                  hover:text-orange-600
                  hover:shadow-md
                "
                            >
                                {hero.secondaryButton}
                            </Link>
                        </div>


                        {/* QUICK TRUST INFO */}

                        <div
                            className="
                mt-8

                grid
                grid-cols-3

                divide-x
                divide-slate-200

                rounded-2xl

                border
                border-slate-200/70

                bg-white/70

                px-2
                py-4

                shadow-sm
                backdrop-blur

                sm:max-w-xl
                sm:px-4

                lg:mx-0
              "
                        >
                            <div
                                className="
                  flex
                  flex-col
                  items-center

                  px-2

                  lg:items-start
                  lg:px-3
                "
                            >
                                <div
                                    className="
                    flex
                    items-center
                    gap-1.5

                    text-sm
                    font-black
                    text-slate-900

                    sm:text-base
                  "
                                >
                                    <FaClock
                                        className="
                      text-orange-500
                    "
                                    />

                                    {hero.deliveryTime}
                                </div>

                                <span
                                    className="
                    mt-1

                    text-[10px]
                    font-medium
                    text-slate-400

                    sm:text-xs
                  "
                                >
                                    Avg. delivery
                                </span>
                            </div>


                            <div
                                className="
                  flex
                  flex-col
                  items-center

                  px-2

                  lg:items-start
                  lg:px-3
                "
                            >
                                <div
                                    className="
                    flex
                    items-center
                    gap-1.5

                    text-sm
                    font-black
                    text-slate-900

                    sm:text-base
                  "
                                >
                                    <FaStar
                                        className="
                      text-amber-400
                    "
                                    />

                                    {hero.rating}
                                </div>

                                <span
                                    className="
                    mt-1

                    text-[10px]
                    font-medium
                    text-slate-400

                    sm:text-xs
                  "
                                >
                                    Loved experience
                                </span>
                            </div>


                            <div
                                className="
                  flex
                  flex-col
                  items-center

                  px-2

                  lg:items-start
                  lg:px-3
                "
                            >
                                <div
                                    className="
                    flex
                    items-center
                    gap-1.5

                    text-sm
                    font-black
                    text-slate-900

                    sm:text-base
                  "
                                >
                                    <FaMapMarkerAlt
                                        className="
                      text-rose-500
                    "
                                    />

                                    Live
                                </div>

                                <span
                                    className="
                    mt-1

                    text-[10px]
                    font-medium
                    text-slate-400

                    sm:text-xs
                  "
                                >
                                    {hero.tracking}
                                </span>
                            </div>
                        </div>
                    </div>


                    {/* =====================
              RIGHT VISUAL
          ====================== */}

                    <div
                        className="
              relative

              mx-auto
              w-full
              max-w-[520px]

              lg:mx-0
              lg:max-w-none
            "
                    >
                        {/* MAIN VISUAL */}

                        <div
                            className="
                relative

                mx-auto

                aspect-square

                w-[88%]
                max-w-[480px]

                sm:w-[82%]

                lg:w-full
              "
                        >
                            {/* OUTER CIRCLE */}

                            <div
                                className="
                  absolute
                  inset-[4%]

                  rounded-full

                  border
                  border-orange-200/70

                  bg-gradient-to-br
                  from-orange-100
                  via-white
                  to-rose-100

                  shadow-[0_30px_100px_rgba(249,115,22,0.15)]
                "
                            />


                            {/* ROTATING-LIKE DASHED RING */}

                            <div
                                className="
                  absolute
                  inset-[10%]

                  rounded-full

                  border-2
                  border-dashed
                  border-orange-300/50
                "
                            />


                            {/* CENTRAL FOOD PLATE */}

                            <div
                                className="
                  absolute
                  left-1/2
                  top-1/2

                  flex
                  h-[56%]
                  w-[56%]

                  -translate-x-1/2
                  -translate-y-1/2

                  items-center
                  justify-center

                  rounded-full

                  border-[10px]
                  border-white

                  bg-gradient-to-br
                  from-orange-500
                  to-rose-500

                  shadow-2xl
                  shadow-orange-500/25

                  sm:border-[14px]
                "
                            >
                                <div
                                    className="
                    flex
                    h-[75%]
                    w-[75%]
                    items-center
                    justify-center

                    rounded-full

                    bg-white/95

                    shadow-inner
                  "
                                >
                                    <FaPizzaSlice
                                        className="
                      h-[46%]
                      w-[46%]

                      -rotate-12

                      text-orange-500

                      drop-shadow-lg
                    "
                                    />
                                </div>
                            </div>


                            {/* FLOATING FOOD ICON */}

                            <div
                                className="
                  absolute
                  right-[8%]
                  top-[15%]

                  flex
                  h-14
                  w-14
                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-orange-100

                  bg-white

                  text-orange-500

                  shadow-xl
                  shadow-slate-900/10

                  sm:h-16
                  sm:w-16
                "
                            >
                                <FaUtensils
                                    className="
                    h-5
                    w-5

                    sm:h-6
                    sm:w-6
                  "
                                />
                            </div>


                            {/* DELIVERY CARD */}

                            <div
                                className="
                  absolute
                  bottom-[10%]
                  left-0

                  w-[72%]

                  rounded-2xl

                  border
                  border-white/80

                  bg-white/95

                  p-3

                  shadow-2xl
                  shadow-slate-900/10

                  backdrop-blur

                  sm:w-[66%]
                  sm:p-4
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

                      bg-gradient-to-br
                      from-orange-500
                      to-rose-500

                      text-white

                      shadow-md
                    "
                                    >
                                        <FaMotorcycle
                                            className="
                        h-5
                        w-5
                      "
                                        />
                                    </span>


                                    <div
                                        className="
                      min-w-0
                      flex-1
                    "
                                    >
                                        <div
                                            className="
                        flex
                        items-center
                        justify-between
                        gap-2
                      "
                                        >
                                            <p
                                                className="
                          truncate

                          text-xs
                          font-bold
                          text-slate-900

                          sm:text-sm
                        "
                                            >
                                                {hero.orderTitle}
                                            </p>

                                            <span
                                                className="
                          h-2
                          w-2
                          shrink-0

                          rounded-full

                          bg-green-500

                          ring-4
                          ring-green-100
                        "
                                            />
                                        </div>

                                        <p
                                            className="
                        mt-1

                        line-clamp-1

                        text-[10px]
                        text-slate-500

                        sm:text-xs
                      "
                                        >
                                            {hero.orderDescription}
                                        </p>
                                    </div>
                                </div>


                                {/* PROGRESS */}

                                <div
                                    className="
                    mt-3

                    flex
                    items-center
                    gap-2
                  "
                                >
                                    <span
                                        className="
                      h-1.5
                      flex-1

                      rounded-full

                      bg-orange-500
                    "
                                    />

                                    <span
                                        className="
                      h-1.5
                      flex-1

                      rounded-full

                      bg-orange-500
                    "
                                    />

                                    <span
                                        className="
                      h-1.5
                      flex-1

                      rounded-full

                      bg-orange-200
                    "
                                    />

                                    <span
                                        className="
                      h-1.5
                      flex-1

                      rounded-full

                      bg-slate-100
                    "
                                    />
                                </div>
                            </div>


                            {/* TIME CARD */}

                            <div
                                className="
                  absolute
                  left-[5%]
                  top-[18%]

                  rounded-2xl

                  border
                  border-white

                  bg-white/95

                  px-3
                  py-2.5

                  shadow-xl
                  shadow-slate-900/10

                  sm:px-4
                  sm:py-3
                "
                            >
                                <div
                                    className="
                    flex
                    items-center
                    gap-2
                  "
                                >
                                    <span
                                        className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center

                      rounded-lg

                      bg-amber-100

                      text-amber-600
                    "
                                    >
                                        <FaClock
                                            className="
                        h-3.5
                        w-3.5
                      "
                                        />
                                    </span>

                                    <div>
                                        <p
                                            className="
                        text-[10px]
                        font-medium
                        text-slate-400

                        sm:text-xs
                      "
                                        >
                                            Arriving in
                                        </p>

                                        <p
                                            className="
                        text-xs
                        font-black
                        text-slate-900

                        sm:text-sm
                      "
                                        >
                                            12 min
                                        </p>
                                    </div>
                                </div>
                            </div>


                            {/* LOCATION PIN */}

                            <div
                                className="
                  absolute
                  bottom-[27%]
                  right-[3%]

                  flex
                  h-11
                  w-11
                  items-center
                  justify-center

                  rounded-2xl

                  bg-slate-950

                  text-white

                  shadow-xl

                  sm:h-12
                  sm:w-12
                "
                            >
                                <FaMapMarkerAlt
                                    className="
                    h-4
                    w-4

                    text-orange-400
                  "
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};


export default HeroSection;