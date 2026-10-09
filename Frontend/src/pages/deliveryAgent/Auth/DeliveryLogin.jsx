import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    Bike,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
} from "lucide-react";


import Button
    from "../../../components/common/Button/Button";


const DeliveryLogin = () => {

    const navigate =
        useNavigate();


    // =========================================
    // FORM
    // =========================================

    const [
        formData,
        setFormData,
    ] = useState({
        email: "",
        password: "",
    });


    const [
        errors,
        setErrors,
    ] = useState({});


    const [
        showPassword,
        setShowPassword,
    ] = useState(false);


    const [
        loading,
        setLoading,
    ] = useState(false);


    // =========================================
    // CHANGE
    // =========================================

    const handleChange =
        (event) => {

            const {
                name,
                value,
            } =
                event.target;


            setFormData(
                (
                    previous
                ) => ({
                    ...previous,

                    [name]:
                        value,
                })
            );


            if (
                errors[name]
            ) {
                setErrors(
                    (
                        previous
                    ) => ({
                        ...previous,

                        [name]:
                            "",
                    })
                );
            }

        };


    // =========================================
    // VALIDATION
    // =========================================

    const validateForm =
        () => {

            const newErrors = {};


            if (
                !formData.email.trim()
            ) {

                newErrors.email =
                    "Email is required";

            } else if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    formData.email
                )
            ) {

                newErrors.email =
                    "Enter a valid email address";

            }


            if (
                !formData.password
            ) {

                newErrors.password =
                    "Password is required";

            }


            setErrors(
                newErrors
            );


            return (
                Object.keys(
                    newErrors
                ).length === 0
            );

        };


    // =========================================
    // SUBMIT
    // =========================================

    const handleSubmit =
        async (
            event
        ) => {

            event.preventDefault();


            if (
                !validateForm()
            ) {
                return;
            }


            try {

                setLoading(
                    true
                );


                /*
                 * FRONTEND ONLY
                 *
                 * Later:
                 *
                 * await dispatch(
                 *   loginDeliveryAgent({
                 *     email:
                 *       formData.email,
                 *
                 *     password:
                 *       formData.password,
                 *   })
                 * ).unwrap();
                 */


                await new Promise(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            500
                        )
                );


                navigate(
                    "/delivery/dashboard"
                );

            } finally {

                setLoading(
                    false
                );

            }

        };


    return (

        <main
            className="
        min-h-screen

        bg-[#fffaf5]

        px-4
        py-10

        sm:px-6
        lg:px-8
      "
        >

            <div
                className="
          mx-auto

          grid
          min-h-[calc(100vh-80px)]
          max-w-6xl

          overflow-hidden

          rounded-[2rem]

          border
          border-slate-200

          bg-white

          shadow-xl
          shadow-slate-200/50

          lg:grid-cols-[1fr_0.9fr]
        "
            >

                {/* =================================
            LEFT
        ================================= */}

                <section
                    className="
            relative

            hidden
            overflow-hidden

            bg-gradient-to-br
            from-orange-500
            via-rose-500
            to-orange-600

            p-10

            text-white

            lg:flex
            lg:flex-col
            lg:justify-between
          "
                >

                    <div
                        className="
              absolute
              -left-20
              -top-20

              h-72
              w-72

              rounded-full

              bg-white/10

              blur-3xl
            "
                    />


                    <div
                        className="
              absolute
              -bottom-24
              -right-16

              h-80
              w-80

              rounded-full

              bg-amber-300/20

              blur-3xl
            "
                    />


                    {/* BRAND */}

                    <div
                        className="
              relative
              z-10
            "
                    >

                        <div
                            className="
                inline-flex
                items-center
                gap-3
              "
                        >

                            <div
                                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center

                  rounded-2xl

                  bg-white/15

                  backdrop-blur
                "
                            >
                                <Bike
                                    className="
                    h-6
                    w-6
                  "
                                />
                            </div>


                            <div>

                                <p
                                    className="
                    text-xl
                    font-black
                  "
                                >
                                    Foodie
                                </p>


                                <p
                                    className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-white/70
                  "
                                >
                                    Delivery Partner
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* CONTENT */}

                    <div
                        className="
              relative
              z-10
            "
                    >

                        <p
                            className="
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
                text-orange-100
              "
                        >
                            Delivery Partner Portal
                        </p>


                        <h1
                            className="
                mt-4

                max-w-lg

                text-4xl
                font-black
                leading-tight

                xl:text-5xl
              "
                        >
                            Deliver orders.
                            Track routes.
                            Earn better.
                        </h1>


                        <p
                            className="
                mt-5

                max-w-md

                text-sm
                leading-7
                text-white/80
              "
                        >
                            Manage your delivery
                            assignments, track active
                            orders and stay available
                            for new opportunities.
                        </p>

                    </div>


                    <p
                        className="
              relative
              z-10

              text-xs
              text-white/60
            "
                    >
                        Foodie Delivery Partner Panel
                    </p>

                </section>


                {/* =================================
            FORM SIDE
        ================================= */}

                <section
                    className="
            flex
            items-center
            justify-center

            p-6

            sm:p-10
            lg:p-12
          "
                >

                    <div
                        className="
              w-full
              max-w-md
            "
                    >

                        {/* MOBILE BRAND */}

                        <div
                            className="
                mb-8

                flex
                items-center
                gap-3

                lg:hidden
              "
                        >

                            <div
                                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center

                  rounded-2xl

                  bg-orange-500

                  text-white
                "
                            >
                                <Bike
                                    className="
                    h-5
                    w-5
                  "
                                />
                            </div>


                            <div>

                                <p
                                    className="
                    font-black
                    text-slate-950
                  "
                                >
                                    Foodie
                                </p>

                                <p
                                    className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-orange-500
                  "
                                >
                                    Delivery Partner
                                </p>

                            </div>

                        </div>


                        {/* TITLE */}

                        <div>

                            <p
                                className="
                  text-sm
                  font-black
                  text-orange-500
                "
                            >
                                Welcome Back
                            </p>


                            <h2
                                className="
                  mt-2

                  text-3xl
                  font-black
                  tracking-tight
                  text-slate-950
                "
                            >
                                Delivery Partner Login
                            </h2>


                            <p
                                className="
                  mt-2

                  text-sm
                  leading-6
                  text-slate-500
                "
                            >
                                Sign in to manage your
                                delivery assignments.
                            </p>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmit
                            }

                            className="
                mt-8
                space-y-5
              "
                        >

                            {/* EMAIL */}

                            <div>

                                <label
                                    className="
                    mb-2
                    block

                    text-sm
                    font-bold
                    text-slate-700
                  "
                                >
                                    Email Address
                                </label>


                                <div
                                    className={`
                    flex
                    h-12
                    items-center
                    gap-3

                    rounded-xl

                    border

                    bg-white

                    px-4

                    transition

                    focus-within:ring-4
                    focus-within:ring-orange-100

                    ${errors.email
                                            ? "border-rose-300"
                                            : "border-slate-200 focus-within:border-orange-300"
                                        }
                  `}
                                >

                                    <Mail
                                        className="
                      h-4
                      w-4
                      shrink-0
                      text-slate-400
                    "
                                    />


                                    <input
                                        type="email"

                                        name="email"

                                        value={
                                            formData.email
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        placeholder="partner@example.com"

                                        autoComplete="email"

                                        className="
                      min-w-0
                      flex-1

                      bg-transparent

                      text-sm
                      text-slate-900

                      outline-none

                      placeholder:text-slate-400
                    "
                                    />

                                </div>


                                {errors.email && (

                                    <p
                                        className="
                      mt-1.5

                      text-xs
                      font-semibold
                      text-rose-500
                    "
                                    >
                                        {
                                            errors.email
                                        }
                                    </p>

                                )}

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <div
                                    className="
                    mb-2

                    flex
                    items-center
                    justify-between
                  "
                                >

                                    <label
                                        className="
                      text-sm
                      font-bold
                      text-slate-700
                    "
                                    >
                                        Password
                                    </label>


                                    <button
                                        type="button"

                                        className="
                      text-xs
                      font-bold
                      text-orange-600

                      hover:text-orange-700
                    "
                                    >
                                        Forgot Password?
                                    </button>

                                </div>


                                <div
                                    className={`
                    flex
                    h-12
                    items-center
                    gap-3

                    rounded-xl

                    border

                    bg-white

                    px-4

                    transition

                    focus-within:ring-4
                    focus-within:ring-orange-100

                    ${errors.password
                                            ? "border-rose-300"
                                            : "border-slate-200 focus-within:border-orange-300"
                                        }
                  `}
                                >

                                    <LockKeyhole
                                        className="
                      h-4
                      w-4
                      shrink-0
                      text-slate-400
                    "
                                    />


                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }

                                        name="password"

                                        value={
                                            formData.password
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        placeholder="Enter password"

                                        autoComplete="current-password"

                                        className="
                      min-w-0
                      flex-1

                      bg-transparent

                      text-sm
                      text-slate-900

                      outline-none

                      placeholder:text-slate-400
                    "
                                    />


                                    <button
                                        type="button"

                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }

                                        className="
                      text-slate-400

                      transition

                      hover:text-slate-700
                    "
                                    >

                                        {showPassword ? (

                                            <EyeOff
                                                className="
                          h-4
                          w-4
                        "
                                            />

                                        ) : (

                                            <Eye
                                                className="
                          h-4
                          w-4
                        "
                                            />

                                        )}

                                    </button>

                                </div>


                                {errors.password && (

                                    <p
                                        className="
                      mt-1.5

                      text-xs
                      font-semibold
                      text-rose-500
                    "
                                    >
                                        {
                                            errors.password
                                        }
                                    </p>

                                )}

                            </div>


                            {/* SUBMIT */}

                            <Button
                                type="submit"

                                loading={
                                    loading
                                }

                                disabled={
                                    loading
                                }

                                className="
                  w-full
                "
                            >
                                Login to Dashboard
                            </Button>

                        </form>


                        {/* REGISTER */}

                        <div
                            className="
                mt-6

                border-t
                border-slate-100

                pt-6

                text-center
              "
                        >

                            <p
                                className="
                  text-sm
                  text-slate-500
                "
                            >
                                Want to become a
                                delivery partner?{" "}

                                <button
                                    type="button"

                                    onClick={() =>
                                        navigate(
                                            "/delivery/register"
                                        )
                                    }

                                    className="
                    font-black
                    text-orange-600

                    hover:text-orange-700
                  "
                                >
                                    Register Now
                                </button>

                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </main>

    );

};


export default DeliveryLogin;