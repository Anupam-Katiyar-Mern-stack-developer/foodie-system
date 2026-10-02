import {
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    useSelector,
    useDispatch,
} from "react-redux";

import {
    FaArrowRight,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaShieldAlt,
    FaShoppingBag,
    FaUserPlus,
    FaUtensils,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import CommonForm from "../../../components/common/CommonForm/CommonForm";

import {
    registerSchema,
} from "../../../validations/public/register.validation";

import {
    registerFields,
    registerDefaultValues,
} from "../../../forms/public/register.form";


const Register = () => {
    const navigate =
        useNavigate();
    const dispatch =
        useDispatch();


    // =========================
    // REDUX
    // =========================

    const {
        registerLoading,
        error,
    } = useSelector(
        (state) =>
            state.publicAuth
    );


    // =========================
    // UI
    // =========================




    // =========================
    // REGISTER
    // =========================

    const handleRegister =
        async (values) => {
            console.log("register button clicked");
            const {
                confirmPassword,
                ...payload
            } = values;


            try {
                await dispatch(
                    registerUser(
                        payload
                    )
                ).unwrap();


                navigate(
                    "/login",
                    {
                        replace: true,

                        state: {
                            registrationSuccess:
                                true,
                        },
                    }
                );
            } catch {
                /*
                  Redux error UI already
                  show karega.
                */
            }
        };

    return (
        <div
            className="
        min-h-screen
        bg-[#fffaf5]
      "
        >
            <div
                className="
          grid
          min-h-screen

          lg:grid-cols-2
        "
            >
                {/* =========================
            LEFT SIDE
        ========================== */}

                <section
                    className="
            relative
            hidden
            overflow-hidden

            bg-slate-950

            lg:flex
            lg:items-center
          "
                >
                    {/* GLOW */}

                    <div
                        className="
              pointer-events-none

              absolute
              -left-32
              top-10

              h-96
              w-96

              rounded-full

              bg-orange-500/20

              blur-[120px]
            "
                    />


                    <div
                        className="
              pointer-events-none

              absolute
              -right-28
              bottom-0

              h-96
              w-96

              rounded-full

              bg-rose-500/15

              blur-[120px]
            "
                    />


                    <div
                        className="
              relative
              z-10

              mx-auto
              w-full
              max-w-xl

              px-10
              py-16
            "
                    >
                        {/* LOGO */}

                        <Link
                            to="/"

                            className="
                inline-flex
                items-center
                gap-3
              "
                        >
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

                  shadow-xl
                  shadow-orange-500/20
                "
                            >
                                <FaUtensils />
                            </span>


                            <span
                                className="
                  text-2xl
                  font-black
                  tracking-tight
                  text-white
                "
                            >
                                Foodie
                            </span>
                        </Link>


                        {/* CONTENT */}

                        <div
                            className="
                mt-16
              "
                        >
                            <p
                                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-orange-300
                "
                            >
                                Join Foodie
                            </p>


                            <h1
                                className="
                  mt-4

                  text-4xl
                  font-black
                  leading-tight
                  tracking-tight
                  text-white

                  xl:text-5xl
                "
                            >
                                Delicious food,
                                delivered your way.
                            </h1>


                            <p
                                className="
                  mt-5

                  max-w-lg

                  text-base
                  leading-7
                  text-slate-400
                "
                            >
                                Create your account,
                                save delivery addresses,
                                order from restaurants
                                and track every order.
                            </p>
                        </div>


                        {/* FEATURES */}

                        <div
                            className="
                mt-10
                space-y-3
              "
                        >
                            {[
                                {
                                    icon:
                                        FaShoppingBag,

                                    title:
                                        "Easy ordering",

                                    description:
                                        "Browse restaurants and manage your cart easily.",
                                },

                                {
                                    icon:
                                        FaMapMarkerAlt,

                                    title:
                                        "Saved addresses",

                                    description:
                                        "Keep your delivery locations ready for checkout.",
                                },

                                {
                                    icon:
                                        FaShieldAlt,

                                    title:
                                        "Secure account",

                                    description:
                                        "Your orders and account are protected by authentication.",
                                },
                            ].map(
                                (feature) => {
                                    const Icon =
                                        feature.icon;


                                    return (
                                        <div
                                            key={
                                                feature.title
                                            }

                                            className="
                        flex
                        items-start
                        gap-3

                        rounded-2xl

                        border
                        border-white/10

                        bg-white/5

                        p-4

                        backdrop-blur
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

                          bg-orange-500/15

                          text-orange-300
                        "
                                            >
                                                <Icon />
                                            </span>


                                            <div>
                                                <p
                                                    className="
                            text-sm
                            font-black
                            text-white
                          "
                                                >
                                                    {
                                                        feature.title
                                                    }
                                                </p>

                                                <p
                                                    className="
                            mt-1

                            text-xs
                            leading-5
                            text-slate-400
                          "
                                                >
                                                    {
                                                        feature.description
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </section>


                {/* =========================
            REGISTER SIDE
        ========================== */}

                <section
                    className="
            flex
            min-h-screen
            items-center

            py-10

            sm:py-14
          "
                >
                    <Container
                        className="
              w-full

              lg:max-w-xl
            "
                    >
                        <div
                            className="
                mx-auto
                w-full
                max-w-md
              "
                        >
                            {/* MOBILE LOGO */}

                            <Link
                                to="/"

                                className="
                  mb-8

                  inline-flex
                  items-center
                  gap-2.5

                  lg:hidden
                "
                            >
                                <span
                                    className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center

                    rounded-xl

                    bg-gradient-to-br
                    from-orange-500
                    to-rose-500

                    text-white
                  "
                                >
                                    <FaUtensils />
                                </span>


                                <span
                                    className="
                    text-xl
                    font-black
                    text-slate-950
                  "
                                >
                                    Foodie
                                </span>
                            </Link>


                            {/* HEADER */}

                            <div>
                                <div
                                    className="
                    inline-flex
                    items-center
                    gap-2

                    rounded-full

                    border
                    border-orange-200

                    bg-orange-50

                    px-3
                    py-1.5

                    text-xs
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-orange-600
                  "
                                >
                                    <FaUserPlus />

                                    Create account
                                </div>


                                <h1
                                    className="
                    mt-4

                    text-3xl
                    font-black
                    tracking-tight
                    text-slate-950

                    sm:text-4xl
                  "
                                >
                                    Start with
                                    <span
                                        className="
                      text-orange-500
                    "
                                    >
                                        {" "}
                                        Foodie
                                    </span>
                                </h1>


                                <p
                                    className="
                    mt-2

                    text-sm
                    leading-6
                    text-slate-500
                  "
                                >
                                    Create your customer
                                    account to start
                                    ordering food.
                                </p>
                            </div>


                            {/* =====================
                  FORM
              ====================== */}

                            <div
                                className="
                  mt-8

                  rounded-[1.75rem]

                  border
                  border-slate-200

                  bg-white

                  p-5

                  shadow-xl
                  shadow-slate-950/5

                  sm:p-6
                "
                            >
                                <CommonForm
                                    fields={
                                        registerFields
                                    }

                                    schema={
                                        registerSchema
                                    }

                                    defaultValues={
                                        registerDefaultValues
                                    }

                                    onSubmit={
                                        handleRegister
                                    }

                                    loading={
                                        registerLoading
                                    }

                                    submitText="Create Account"

                                    columns={1}
                                />


                                {/* BACKEND ERROR */}

                                {error && (
                                    <div
                                        className="
                      mt-4

                      rounded-xl

                      border
                      border-rose-200

                      bg-rose-50

                      p-3

                      text-xs
                      leading-5
                      text-rose-700
                    "
                                    >
                                        {typeof error ===
                                            "string"
                                            ? error
                                            : "Unable to create account. Please try again."}
                                    </div>
                                )}


                                {/* PREVIEW */}

                                {/* {previewMessage && (
                                    <div
                                        className="
                      mt-4

                      flex
                      gap-2.5

                      rounded-xl

                      border
                      border-emerald-200

                      bg-emerald-50

                      p-3
                    "
                                    >
                                        <FaCheckCircle
                                            className="
                        mt-0.5
                        shrink-0

                        text-emerald-600
                      "
                                        />

                                        <p
                                            className="
                        text-xs
                        leading-5
                        text-emerald-700
                      "
                                        >
                                            {
                                                previewMessage
                                            }
                                        </p>
                                    </div>
                                )} */}
                            </div>


                            {/* =====================
                  LOGIN
              ====================== */}

                            <div
                                className="
                  mt-6

                  text-center
                "
                            >
                                <p
                                    className="
                    text-sm
                    text-slate-500
                  "
                                >
                                    Already have an
                                    account?{" "}

                                    <Link
                                        to="/login"

                                        className="
                      inline-flex
                      items-center
                      gap-1.5

                      font-black
                      text-orange-600

                      transition

                      hover:text-orange-700
                    "
                                    >
                                        Sign In

                                        <FaArrowRight
                                            className="
                        h-2.5
                        w-2.5
                      "
                                        />
                                    </Link>
                                </p>
                            </div>


                            {/* HOME */}

                            <div
                                className="
                  mt-8

                  text-center
                "
                            >
                                <button
                                    type="button"

                                    onClick={() =>
                                        navigate("/")
                                    }

                                    className="
                    text-xs
                    font-bold
                    text-slate-400

                    hover:text-slate-700
                  "
                                >
                                    ← Back to Foodie
                                </button>
                            </div>
                        </div>
                    </Container>
                </section>
            </div>
        </div>
    );
};


export default Register;