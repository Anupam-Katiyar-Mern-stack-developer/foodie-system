import {
  Link,
} from "react-router-dom";

import {
  FaArrowRight,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTwitter,
  FaUtensils,
} from "react-icons/fa";

import Container from "../../common/Container/Container";

import {
  footerSections,
} from "../../../data/public/footer";


const PublicFooter = () => {
  const currentYear =
    new Date().getFullYear();


  const socialLinks = [
    {
      label: "Instagram",
      icon: FaInstagram,
      href: "#",
    },

    {
      label: "Facebook",
      icon: FaFacebookF,
      href: "#",
    },

    {
      label: "Twitter",
      icon: FaTwitter,
      href: "#",
    },

    {
      label: "LinkedIn",
      icon: FaLinkedinIn,
      href: "#",
    },
  ];


  return (
    <footer
      className="
        relative
        overflow-hidden
        bg-slate-950
        text-white
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
          top-0

          h-80
          w-80

          rounded-full

          bg-orange-500/10

          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          bottom-0

          h-80
          w-80

          rounded-full

          bg-rose-500/10

          blur-[100px]
        "
      />


      {/* =========================
          TOP CTA
      ========================== */}

      <Container>
        <div
          className="
            relative
            z-10

            border-b
            border-white/10

            py-8
            sm:py-10
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5

              rounded-3xl

              border
              border-white/10

              bg-white/[0.04]

              p-5

              backdrop-blur-sm

              sm:p-6

              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:p-8
            "
          >
            {/* LEFT CONTENT */}

            <div className="max-w-2xl">
              <span
                className="
                  inline-flex
                  items-center

                  rounded-full

                  border
                  border-orange-400/20

                  bg-orange-400/10

                  px-3
                  py-1

                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-orange-300
                "
              >
                Hungry already?
              </span>


              <h2
                className="
                  mt-3

                  text-2xl
                  font-black
                  tracking-tight

                  sm:text-3xl
                "
              >
                Great food is only a few
                clicks away.
              </h2>


              <p
                className="
                  mt-2

                  text-sm
                  leading-6
                  text-slate-400

                  sm:text-base
                "
              >
                Discover restaurants,
                choose your favourites and
                follow your order from the
                kitchen to your door.
              </p>
            </div>


            {/* CTA */}

            <Link
              to="/restaurants"

              className="
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
                font-bold
                text-white

                shadow-lg
                shadow-orange-950/20

                transition
                duration-200

                hover:-translate-y-0.5
                hover:shadow-xl

                sm:w-auto
              "
            >
              Explore Restaurants

              <FaArrowRight
                className="
                  h-4
                  w-4
                "
              />
            </Link>
          </div>
        </div>
      </Container>


      {/* =========================
          MAIN FOOTER
      ========================== */}

      <Container>
        <div
          className="
            relative
            z-10

            grid
            gap-10

            py-10

            sm:grid-cols-2

            lg:grid-cols-[1.3fr_repeat(3,0.7fr)]
            lg:gap-12
            lg:py-14
          "
        >
          {/* =====================
              BRAND
          ====================== */}

          <div>
            <Link
              to="/"

              className="
                inline-flex
                items-center
                gap-3
              "
            >
              {/* LOGO */}

              <span
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center

                  rounded-2xl

                  bg-gradient-to-br
                  from-orange-500
                  to-rose-500

                  text-white

                  shadow-lg
                  shadow-orange-950/30
                "
              >
                <FaUtensils
                  className="
                    h-5
                    w-5
                  "
                />
              </span>


              {/* NAME */}

              <div>
                <p
                  className="
                    text-2xl
                    font-black
                    tracking-tight
                  "
                >
                  Food

                  <span
                    className="
                      text-orange-400
                    "
                  >
                    ie
                  </span>
                </p>

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.24em]
                    text-slate-500
                  "
                >
                  eat better
                </p>
              </div>
            </Link>


            {/* DESCRIPTION */}

            <p
              className="
                mt-5
                max-w-sm

                text-sm
                leading-7
                text-slate-400
              "
            >
              A modern food delivery
              experience connecting
              customers, restaurants and
              delivery partners in one
              seamless platform.
            </p>


            {/* =====================
                CONTACT
            ====================== */}

            <div
              className="
                mt-6
                space-y-3
              "
            >
              {/* EMAIL */}

              <a
                href="mailto:support@foodie.com"

                className="
                  flex
                  items-center
                  gap-3

                  text-sm
                  text-slate-400

                  transition

                  hover:text-orange-300
                "
              >
                <FaEnvelope
                  className="
                    h-4
                    w-4
                    shrink-0
                    text-orange-400
                  "
                />

                support@foodie.com
              </a>


              {/* PHONE */}

              <a
                href="tel:+910000000000"

                className="
                  flex
                  items-center
                  gap-3

                  text-sm
                  text-slate-400

                  transition

                  hover:text-orange-300
                "
              >
                <FaPhoneAlt
                  className="
                    h-4
                    w-4
                    shrink-0
                    text-orange-400
                  "
                />

                +91 00000 00000
              </a>


              {/* LOCATION */}

              <div
                className="
                  flex
                  items-center
                  gap-3

                  text-sm
                  text-slate-400
                "
              >
                <FaMapMarkerAlt
                  className="
                    h-4
                    w-4
                    shrink-0
                    text-orange-400
                  "
                />

                Serving delicious food
                around you
              </div>
            </div>
          </div>


          {/* =====================
              LINK SECTIONS
          ====================== */}

          {footerSections.map(
            (section) => (
              <div
                key={section.title}
              >
                <h3
                  className="
                    text-sm
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-white
                  "
                >
                  {section.title}
                </h3>


                <ul
                  className="
                    mt-5
                    space-y-3
                  "
                >
                  {section.links.map(
                    (link) => (
                      <li
                        key={`${section.title}-${link.to}`}
                      >
                        <Link
                          to={link.to}

                          className="
                            inline-flex

                            text-sm
                            text-slate-400

                            transition

                            hover:translate-x-1
                            hover:text-orange-300
                          "
                        >
                          {link.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )
          )}
        </div>
      </Container>


      {/* =========================
          BOTTOM BAR
      ========================== */}

      <div
        className="
          relative
          z-10

          border-t
          border-white/10
        "
      >
        <Container>
          <div
            className="
              flex
              flex-col
              gap-5

              py-6

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* COPYRIGHT */}

            <p
              className="
                text-center

                text-xs
                leading-5
                text-slate-500

                sm:text-left
              "
            >
              © {currentYear} Foodie.
              All rights reserved.
            </p>


            {/* =====================
                SOCIAL LINKS
            ====================== */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-2
              "
            >
              {socialLinks.map(
                (social) => {
                  const Icon =
                    social.icon;


                  return (
                    <a
                      key={
                        social.label
                      }

                      href={
                        social.href
                      }

                      aria-label={
                        social.label
                      }

                      className="
                        inline-flex
                        h-9
                        w-9
                        items-center
                        justify-center

                        rounded-xl

                        border
                        border-white/10

                        bg-white/[0.04]

                        text-slate-400

                        transition
                        duration-200

                        hover:-translate-y-0.5
                        hover:border-orange-400/30
                        hover:bg-orange-400/10
                        hover:text-orange-300
                      "
                    >
                      <Icon
                        className="
                          h-4
                          w-4
                        "
                      />
                    </a>
                  );
                }
              )}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};


export default PublicFooter;