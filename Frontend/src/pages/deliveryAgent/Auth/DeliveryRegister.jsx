import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    Bike,
    Camera,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    MapPin,
    Phone,
    UserRound,
} from "lucide-react";


import Button
    from "../../../components/common/Button/Button";


const DeliveryRegister = () => {

    const navigate =
        useNavigate();


    // =========================================
    // FORM
    // =========================================

    const [
        formData,
        setFormData,
    ] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        vehicleType: "BIKE",
        vehicleNumber: "",
        password: "",
        confirmPassword: "",
        image: null,
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
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);


    const [
        imagePreview,
        setImagePreview,
    ] = useState("");


    const [
        loading,
        setLoading,
    ] = useState(false);


    // =========================================
    // CLEAN IMAGE URL
    // =========================================

    useEffect(() => {

        return () => {

            if (
                imagePreview &&
                imagePreview.startsWith(
                    "blob:"
                )
            ) {
                URL.revokeObjectURL(
                    imagePreview
                );
            }

        };

    }, [
        imagePreview,
    ]);


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
    // IMAGE
    // =========================================

    const handleImageChange =
        (event) => {

            const file =
                event.target
                    .files?.[0];


            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                setErrors(
                    (
                        previous
                    ) => ({
                        ...previous,

                        image:
                            "Please select a valid image",
                    })
                );

                return;
            }


            if (
                file.size >
                5 * 1024 * 1024
            ) {

                setErrors(
                    (
                        previous
                    ) => ({
                        ...previous,

                        image:
                            "Image must be less than 5MB",
                    })
                );

                return;
            }


            if (
                imagePreview &&
                imagePreview.startsWith(
                    "blob:"
                )
            ) {
                URL.revokeObjectURL(
                    imagePreview
                );
            }


            const previewUrl =
                URL.createObjectURL(
                    file
                );


            setImagePreview(
                previewUrl
            );


            setFormData(
                (
                    previous
                ) => ({
                    ...previous,

                    image:
                        file,
                })
            );


            setErrors(
                (
                    previous
                ) => ({
                    ...previous,

                    image:
                        "",
                })
            );

        };


    // =========================================
    // VALIDATION
    // =========================================

    const validateForm =
        () => {

            const newErrors = {};


            if (
                !formData.name.trim()
            ) {

                newErrors.name =
                    "Full name is required";

            }


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
                !formData.phone.trim()
            ) {

                newErrors.phone =
                    "Phone number is required";

            } else if (
                !/^[6-9]\d{9}$/.test(
                    formData.phone
                        .trim()
                )
            ) {

                newErrors.phone =
                    "Enter a valid 10 digit phone number";

            }


            if (
                !formData.address.trim()
            ) {

                newErrors.address =
                    "Address is required";

            }


            if (
                !formData.vehicleType
            ) {

                newErrors.vehicleType =
                    "Vehicle type is required";

            }


            if (
                formData.vehicleType !==
                "BICYCLE" &&
                !formData.vehicleNumber
                    .trim()
            ) {

                newErrors.vehicleNumber =
                    "Vehicle number is required";

            }


            if (
                !formData.password
            ) {

                newErrors.password =
                    "Password is required";

            } else if (
                formData.password
                    .length < 6
            ) {

                newErrors.password =
                    "Password must be at least 6 characters";

            }


            if (
                !formData.confirmPassword
            ) {

                newErrors.confirmPassword =
                    "Confirm password is required";

            } else if (
                formData.password !==
                formData.confirmPassword
            ) {

                newErrors.confirmPassword =
                    "Passwords do not match";

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
                 * Later backend integration:
                 *
                 * const payload =
                 *   new FormData();
                 *
                 * payload.append(
                 *   "name",
                 *   formData.name
                 * );
                 *
                 * ...
                 *
                 * dispatch(
                 *   registerDeliveryAgent(
                 *     payload
                 *   )
                 * )
                 */


                await new Promise(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            600
                        )
                );


                console.log(
                    "DELIVERY REGISTER DATA:",
                    formData
                );


                navigate(
                    "/delivery/login",
                    {
                        replace: true,
                    }
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
        py-8

        sm:px-6
        lg:px-8
      "
        >

            <div
                className="
          mx-auto

          grid
          max-w-7xl

          overflow-hidden

          rounded-[2rem]

          border
          border-slate-200

          bg-white

          shadow-xl
          shadow-slate-200/50

          lg:grid-cols-[0.85fr_1.15fr]
        "
            >

                {/* =================================
            LEFT SIDE
        ================================= */}

                <section
                    className="
            relative

            hidden
            min-h-[850px]
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
              -left-24
              -top-24

              h-80
              w-80

              rounded-full

              bg-white/10

              blur-3xl
            "
                    />


                    <div
                        className="
              absolute
              -bottom-24
              -right-20

              h-96
              w-96

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

              flex
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
                            Join Foodie
                        </p>


                        <h1
                            className="
                mt-4

                text-4xl
                font-black
                leading-tight

                xl:text-5xl
              "
                        >
                            Start delivering
                            with Foodie.
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
                            Create your delivery
                            partner account, manage
                            deliveries and stay
                            connected with customers
                            and restaurants.
                        </p>


                        <div
                            className="
                mt-8
                space-y-4
              "
                        >

                            {[
                                "Manage delivery assignments",
                                "Navigate to pickup and customer locations",
                                "Track completed deliveries",
                                "Control your online availability",
                            ].map(
                                (item) => (

                                    <div
                                        key={
                                            item
                                        }

                                        className="
                      flex
                      items-center
                      gap-3
                    "
                                    >

                                        <span
                                            className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center

                        rounded-full

                        bg-white/15

                        text-xs
                        font-black
                      "
                                        >
                                            ✓
                                        </span>


                                        <span
                                            className="
                        text-sm
                        font-semibold
                        text-white/90
                      "
                                        >
                                            {item}
                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    <p
                        className="
              relative
              z-10

              text-xs
              text-white/60
            "
                    >
                        Foodie Delivery Partner
                    </p>

                </section>


                {/* =================================
            FORM SIDE
        ================================= */}

                <section
                    className="
            p-6

            sm:p-10
            lg:p-12
          "
                >

                    <div
                        className="
              mx-auto
              max-w-2xl
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
                                Become a Partner
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
                                Create Delivery Account
                            </h2>


                            <p
                                className="
                  mt-2

                  text-sm
                  leading-6
                  text-slate-500
                "
                            >
                                Enter your personal and
                                vehicle information to
                                register as a delivery
                                partner.
                            </p>

                        </div>


                        {/* =================================
                FORM
            ================================= */}

                        <form
                            onSubmit={
                                handleSubmit
                            }

                            className="
                mt-8
                space-y-7
              "
                        >

                            {/* =============================
                  PROFILE IMAGE
              ============================== */}

                            <div
                                className="
                  flex
                  items-center
                  gap-4
                "
                            >

                                <div
                                    className="
                    relative
                  "
                                >

                                    {imagePreview ? (

                                        <img
                                            src={
                                                imagePreview
                                            }

                                            alt="Profile preview"

                                            className="
                        h-20
                        w-20

                        rounded-2xl

                        object-cover

                        ring-4
                        ring-orange-50
                      "
                                        />

                                    ) : (

                                        <div
                                            className="
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center

                        rounded-2xl

                        bg-orange-50

                        text-orange-500

                        ring-4
                        ring-orange-50
                      "
                                        >
                                            <UserRound
                                                className="
                          h-7
                          w-7
                        "
                                            />
                                        </div>

                                    )}


                                    <label
                                        className="
                      absolute
                      -bottom-2
                      -right-2

                      flex
                      h-9
                      w-9
                      cursor-pointer
                      items-center
                      justify-center

                      rounded-xl

                      bg-orange-500

                      text-white

                      shadow-md

                      transition

                      hover:bg-orange-600
                    "
                                    >

                                        <Camera
                                            className="
                        h-4
                        w-4
                      "
                                        />


                                        <input
                                            type="file"

                                            accept="image/*"

                                            onChange={
                                                handleImageChange
                                            }

                                            className="hidden"
                                        />

                                    </label>

                                </div>


                                <div>

                                    <p
                                        className="
                      text-sm
                      font-black
                      text-slate-900
                    "
                                    >
                                        Profile Photo
                                    </p>


                                    <p
                                        className="
                      mt-1

                      text-xs
                      text-slate-400
                    "
                                    >
                                        Optional • Max 5MB
                                    </p>


                                    {errors.image && (

                                        <p
                                            className="
                        mt-1

                        text-xs
                        font-semibold
                        text-rose-500
                      "
                                        >
                                            {
                                                errors.image
                                            }
                                        </p>

                                    )}

                                </div>

                            </div>


                            {/* =============================
                  PERSONAL DETAILS
              ============================== */}

                            <div>

                                <h3
                                    className="
                    text-base
                    font-black
                    text-slate-950
                  "
                                >
                                    Personal Information
                                </h3>


                                <div
                                    className="
                    mt-4

                    grid
                    gap-5

                    sm:grid-cols-2
                  "
                                >

                                    {/* NAME */}

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
                                            Full Name
                                        </label>


                                        <div
                                            className="
                        flex
                        h-12
                        items-center
                        gap-3

                        rounded-xl

                        border
                        border-slate-200

                        px-4

                        focus-within:border-orange-300
                        focus-within:ring-4
                        focus-within:ring-orange-100
                      "
                                        >

                                            <UserRound
                                                className="
                          h-4
                          w-4
                          text-slate-400
                        "
                                            />


                                            <input
                                                type="text"

                                                name="name"

                                                value={
                                                    formData.name
                                                }

                                                onChange={
                                                    handleChange
                                                }

                                                placeholder="Your full name"

                                                className="
                          min-w-0
                          flex-1

                          bg-transparent

                          text-sm

                          outline-none
                        "
                                            />

                                        </div>


                                        {errors.name && (

                                            <p
                                                className="
                          mt-1.5
                          text-xs
                          font-semibold
                          text-rose-500
                        "
                                            >
                                                {errors.name}
                                            </p>

                                        )}

                                    </div>


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
                                            className="
                        flex
                        h-12
                        items-center
                        gap-3

                        rounded-xl

                        border
                        border-slate-200

                        px-4

                        focus-within:border-orange-300
                        focus-within:ring-4
                        focus-within:ring-orange-100
                      "
                                        >

                                            <Mail
                                                className="
                          h-4
                          w-4
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

                                                className="
                          min-w-0
                          flex-1

                          bg-transparent

                          text-sm

                          outline-none
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
                                                {errors.email}
                                            </p>

                                        )}

                                    </div>


                                    {/* PHONE */}

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
                                            Phone Number
                                        </label>


                                        <div
                                            className="
                        flex
                        h-12
                        items-center
                        gap-3

                        rounded-xl

                        border
                        border-slate-200

                        px-4

                        focus-within:border-orange-300
                        focus-within:ring-4
                        focus-within:ring-orange-100
                      "
                                        >

                                            <Phone
                                                className="
                          h-4
                          w-4
                          text-slate-400
                        "
                                            />


                                            <input
                                                type="tel"

                                                name="phone"

                                                value={
                                                    formData.phone
                                                }

                                                onChange={
                                                    handleChange
                                                }

                                                maxLength={10}

                                                placeholder="9876543210"

                                                className="
                          min-w-0
                          flex-1

                          bg-transparent

                          text-sm

                          outline-none
                        "
                                            />

                                        </div>


                                        {errors.phone && (

                                            <p
                                                className="
                          mt-1.5
                          text-xs
                          font-semibold
                          text-rose-500
                        "
                                            >
                                                {errors.phone}
                                            </p>

                                        )}

                                    </div>


                                    {/* ADDRESS */}

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
                                            Address
                                        </label>


                                        <div
                                            className="
                        flex
                        h-12
                        items-center
                        gap-3

                        rounded-xl

                        border
                        border-slate-200

                        px-4

                        focus-within:border-orange-300
                        focus-within:ring-4
                        focus-within:ring-orange-100
                      "
                                        >

                                            <MapPin
                                                className="
                          h-4
                          w-4
                          text-slate-400
                        "
                                            />


                                            <input
                                                type="text"

                                                name="address"

                                                value={
                                                    formData.address
                                                }

                                                onChange={
                                                    handleChange
                                                }

                                                placeholder="Your address"

                                                className="
                          min-w-0
                          flex-1

                          bg-transparent

                          text-sm

                          outline-none
                        "
                                            />

                                        </div>


                                        {errors.address && (

                                            <p
                                                className="
                          mt-1.5
                          text-xs
                          font-semibold
                          text-rose-500
                        "
                                            >
                                                {errors.address}
                                            </p>

                                        )}

                                    </div>

                                </div>

                            </div>


                            {/* =============================
                  VEHICLE DETAILS
              ============================== */}

                            <div
                                className="
                  border-t
                  border-slate-100

                  pt-6
                "
                            >

                                <h3
                                    className="
                    text-base
                    font-black
                    text-slate-950
                  "
                                >
                                    Vehicle Information
                                </h3>


                                <div
                                    className="
                    mt-4

                    grid
                    gap-5

                    sm:grid-cols-2
                  "
                                >

                                    {/* TYPE */}

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
                                            Vehicle Type
                                        </label>


                                        <select
                                            name="vehicleType"

                                            value={
                                                formData.vehicleType
                                            }

                                            onChange={
                                                handleChange
                                            }

                                            className="
                        h-12
                        w-full

                        rounded-xl

                        border
                        border-slate-200

                        bg-white

                        px-4

                        text-sm

                        outline-none

                        focus:border-orange-300
                        focus:ring-4
                        focus:ring-orange-100
                      "
                                        >

                                            <option value="BIKE">
                                                Bike
                                            </option>

                                            <option value="SCOOTER">
                                                Scooter
                                            </option>

                                            <option value="BICYCLE">
                                                Bicycle
                                            </option>

                                        </select>

                                    </div>


                                    {/* NUMBER */}

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
                                            Vehicle Number
                                        </label>


                                        <input
                                            type="text"

                                            name="vehicleNumber"

                                            value={
                                                formData.vehicleNumber
                                            }

                                            onChange={
                                                handleChange
                                            }

                                            disabled={
                                                formData.vehicleType ===
                                                "BICYCLE"
                                            }

                                            placeholder={
                                                formData.vehicleType ===
                                                    "BICYCLE"
                                                    ? "Not required"
                                                    : "UP78 AB 1234"
                                            }

                                            className="
                        h-12
                        w-full

                        rounded-xl

                        border
                        border-slate-200

                        px-4

                        text-sm
                        uppercase

                        outline-none

                        transition

                        focus:border-orange-300
                        focus:ring-4
                        focus:ring-orange-100

                        disabled:cursor-not-allowed
                        disabled:bg-slate-100
                        disabled:text-slate-400
                      "
                                        />


                                        {errors.vehicleNumber && (

                                            <p
                                                className="
                          mt-1.5
                          text-xs
                          font-semibold
                          text-rose-500
                        "
                                            >
                                                {
                                                    errors.vehicleNumber
                                                }
                                            </p>

                                        )}

                                    </div>

                                </div>

                            </div>


                            {/* =============================
                  PASSWORD
              ============================== */}

                            <div
                                className="
                  border-t
                  border-slate-100

                  pt-6
                "
                            >

                                <h3
                                    className="
                    text-base
                    font-black
                    text-slate-950
                  "
                                >
                                    Account Security
                                </h3>


                                <div
                                    className="
                    mt-4

                    grid
                    gap-5

                    sm:grid-cols-2
                  "
                                >

                                    {/* PASSWORD */}

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
                                            Password
                                        </label>


                                        <div
                                            className="
                        flex
                        h-12
                        items-center
                        gap-3

                        rounded-xl

                        border
                        border-slate-200

                        px-4

                        focus-within:border-orange-300
                        focus-within:ring-4
                        focus-within:ring-orange-100
                      "
                                        >

                                            <LockKeyhole
                                                className="
                          h-4
                          w-4
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

                                                placeholder="Create password"

                                                className="
                          min-w-0
                          flex-1

                          bg-transparent

                          text-sm

                          outline-none
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


                                    {/* CONFIRM */}

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
                                            Confirm Password
                                        </label>


                                        <div
                                            className="
                        flex
                        h-12
                        items-center
                        gap-3

                        rounded-xl

                        border
                        border-slate-200

                        px-4

                        focus-within:border-orange-300
                        focus-within:ring-4
                        focus-within:ring-orange-100
                      "
                                        >

                                            <LockKeyhole
                                                className="
                          h-4
                          w-4
                          text-slate-400
                        "
                                            />


                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }

                                                name="confirmPassword"

                                                value={
                                                    formData.confirmPassword
                                                }

                                                onChange={
                                                    handleChange
                                                }

                                                placeholder="Confirm password"

                                                className="
                          min-w-0
                          flex-1

                          bg-transparent

                          text-sm

                          outline-none
                        "
                                            />


                                            <button
                                                type="button"

                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (previous) =>
                                                            !previous
                                                    )
                                                }

                                                className="
                          text-slate-400

                          hover:text-slate-700
                        "
                                            >

                                                {showConfirmPassword ? (

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


                                        {errors.confirmPassword && (

                                            <p
                                                className="
                          mt-1.5
                          text-xs
                          font-semibold
                          text-rose-500
                        "
                                            >
                                                {
                                                    errors.confirmPassword
                                                }
                                            </p>

                                        )}

                                    </div>

                                </div>

                            </div>


                            {/* =============================
                  SUBMIT
              ============================== */}

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
                                Create Delivery Partner Account
                            </Button>

                        </form>


                        {/* LOGIN */}

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
                                Already registered?{" "}

                                <button
                                    type="button"

                                    onClick={() =>
                                        navigate(
                                            "/delivery/login"
                                        )
                                    }

                                    className="
                    font-black
                    text-orange-600

                    hover:text-orange-700
                  "
                                >
                                    Login
                                </button>

                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </main>

    );

};


export default DeliveryRegister;