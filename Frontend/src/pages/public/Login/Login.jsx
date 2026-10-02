import {
    useState,
} from "react";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    useSelector,
} from "react-redux";

import {
    FaArrowRight,
    FaCheckCircle,
    FaLock,
    FaShoppingBag,
    FaStore,
    FaTruck,
    FaUtensils,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import CommonForm from "../../../components/common/CommonForm/CommonForm";

import {
    loginSchema,
} from "../../../validations/public/login.validation";

import {
    loginFields,
    loginDefaultValues,
} from "../../../forms/public/login.form";


const Login = () => {
    const navigate =
        useNavigate();

    const location =
        useLocation();


    const {
        loginLoading,
        error,
    } = useSelector(
        (state) =>
            state.publicAuth
    );


    const [
        previewMessage,
        setPreviewMessage,
    ] = useState("");


    // =========================
    // LOGIN
    // =========================

    const handleLogin = (
        values
    ) => {
        /*
          BACKEND INTEGRATION:
    
          dispatch(
            loginUser(values)
          )
            .unwrap()
            .then(() => {
              const redirectTo =
                location.state?.from ||
                "/";
    
              navigate(
                redirectTo,
                {
                  replace: true,
                }
              );
            });
        */


        console.log(
            "Login values:",
            values
        );


        setPreviewMessage(
            "Login UI is ready. Actual authentication will be connected to your existing backend login API."
        );
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
            LEFT BRAND PANEL
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
                    {/* GLOWS */}

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
                        {/* BRAND */}

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
                                Welcome back
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
                                Your favourite food
                                is only a few clicks
                                away.
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
                                Sign in to manage
                                addresses, place orders
                                and track your delivery
                                in real time.
                            </p>
                        </div>


                        {/* FEATURES */}

                        <div
                            className="
                mt-10

                grid
                gap-3

                sm:grid-cols-3
              "
                        >
                            {[
                                {
                                    icon:
                                        FaStore,

                                    title:
                                        "Restaurants",
                                },

                                {
                                    icon:
                                        FaShoppingBag,

                                    title:
                                        "Easy Orders",
                                },

                                {
                                    icon:
                                        FaTruck,

                                    title:
                                        "Live Delivery",
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
                        rounded-2xl

                        border
                        border-white/10

                        bg-white/5

                        p-4

                        backdrop-blur
                      "
                                        >
                                            <Icon
                                                className="
                          text-lg
                          text-orange-300
                        "
                                            />

                                            <p
                                                className="
                          mt-3

                          text-xs
                          font-black
                          text-white
                        "
                                            >
                                                {
                                                    feature.title
                                                }
                                            </p>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </section>


                {/* =========================
            LOGIN SIDE
        ========================== */}

                <section
                    className="
            flex
            min-h-screen
            items-center

            bg-[#fffaf5]

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
                            {/* MOBILE BRAND */}

                            <Link
                                to="/"

                                className="
                  mb-10

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
                                    <FaLock />

                                    Secure Login
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
                                    Welcome
                                    <span
                                        className="
                      text-orange-500
                    "
                                    >
                                        {" "}
                                        back
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
                                    Enter your account
                                    details to continue
                                    ordering with Foodie.
                                </p>
                            </div>


                            {/* FORM CARD */}

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
                                        loginFields
                                    }

                                    schema={
                                        loginSchema
                                    }

                                    defaultValues={
                                        loginDefaultValues
                                    }

                                    onSubmit={
                                        handleLogin
                                    }

                                    loading={
                                        loginLoading
                                    }

                                    submitText="Sign In"

                                    columns={1}
                                />


                                {/* ERROR */}

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
                                            : "Unable to login. Please try again."}
                                    </div>
                                )}


                                {/* PREVIEW MESSAGE */}

                                {previewMessage && (
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
                                )}


                                {/* FORGOT PASSWORD */}

                                <div
                                    className="
                    mt-5

                    border-t
                    border-slate-100

                    pt-5
                  "
                                >
                                    <button
                                        type="button"

                                        className="
                      text-sm
                      font-bold
                      text-orange-600

                      transition

                      hover:text-orange-700
                    "
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>


                            {/* REGISTER */}

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
                                    New to Foodie?{" "}

                                    <Link
                                        to="/register"

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
                                        Create account

                                        <FaArrowRight
                                            className="
                        h-2.5
                        w-2.5
                      "
                                        />
                                    </Link>
                                </p>
                            </div>


                            {/* BACK HOME */}

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


export default Login;