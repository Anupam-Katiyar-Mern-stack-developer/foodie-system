import {
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    FaEdit,
    FaEnvelope,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaShoppingBag,
    FaUser,
} from "react-icons/fa";

import {
    useNavigate,
} from "react-router-dom";

import Container from "../../../components/common/Container/Container";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Modal from "../../../components/common/Modal/Modal";
import CommonForm from "../../../components/common/CommonForm/CommonForm";
import Avatar from "../../../components/common/Avatar/Avatar";

import {
    updateProfileLocal,
} from "../../../redux/slices/public/profile.slice";

import {
    profileSchema,
} from "../../../validations/public/profile.validation";

import {
    profileFields,
} from "../../../forms/public/profile.form";


const Profile = () => {
    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();


    // =========================
    // REDUX
    // =========================

    const {
        profile,
        fetchLoading,
        updateLoading,
        error,
    } = useSelector(
        (state) =>
            state.publicProfile
    );


    // =========================
    // UI
    // =========================

    const [
        editOpen,
        setEditOpen,
    ] = useState(false);


    // =========================
    // SUBMIT
    // =========================

    const handleUpdateProfile = (
        values
    ) => {
        /*
          Later:
    
          dispatch(
            updateProfileThunk(values)
          )
        */

        dispatch(
            updateProfileLocal(
                values
            )
        );


        setEditOpen(false);
    };


    // =========================
    // LOADING
    // =========================

    if (fetchLoading) {
        return (
            <div
                className="
          min-h-screen
          bg-[#fffaf5]
          py-10
        "
            >
                <Container>
                    <Skeleton
                        width="w-full"
                        height="h-[290px]"
                        rounded="rounded-[2rem]"
                    />

                    <div
                        className="
              mt-6

              grid
              gap-5

              md:grid-cols-2
            "
                    >
                        <Skeleton
                            width="w-full"
                            height="h-[200px]"
                            rounded="rounded-[1.75rem]"
                        />

                        <Skeleton
                            width="w-full"
                            height="h-[200px]"
                            rounded="rounded-[1.75rem]"
                        />
                    </div>
                </Container>
            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <div
                className="
          min-h-[60vh]

          bg-[#fffaf5]

          py-14
        "
            >
                <Container>
                    <ErrorState
                        title="Unable to load profile"

                        description={
                            typeof error ===
                                "string"
                                ? error
                                : "Something went wrong while loading your profile."
                        }
                    />
                </Container>
            </div>
        );
    }


    if (!profile) {
        return null;
    }


    return (
        <div
            className="
        min-h-screen
        bg-[#fffaf5]
      "
        >
            {/* =========================
          PROFILE HERO
      ========================== */}

            <section
                className="
          relative
          overflow-hidden

          bg-slate-950

          py-10
          text-white

          sm:py-12

          lg:py-16
        "
            >
                {/* GLOW */}

                <div
                    className="
            pointer-events-none

            absolute
            -left-20
            top-0

            h-72
            w-72

            rounded-full

            bg-orange-500/15

            blur-[100px]
          "
                />

                <div
                    className="
            pointer-events-none

            absolute
            -right-20
            bottom-0

            h-72
            w-72

            rounded-full

            bg-rose-500/10

            blur-[100px]
          "
                />


                <Container>
                    <div
                        className="
              relative
              z-10

              flex
              flex-col
              gap-6

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
                    >
                        {/* USER */}

                        <div
                            className="
                flex
                flex-col
                items-center
                gap-4

                text-center

                sm:flex-row
                sm:text-left
              "
                        >
                            <div
                                className="
                  rounded-[1.7rem]

                  border
                  border-white/10

                  bg-white/10

                  p-1.5

                  backdrop-blur
                "
                            >
                                <Avatar
                                    name={
                                        profile.name
                                    }

                                    size="xl"
                                />
                            </div>


                            <div>
                                <p
                                    className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-orange-300
                  "
                                >
                                    Foodie Customer
                                </p>


                                <h1
                                    className="
                    mt-2

                    text-3xl
                    font-black
                    tracking-tight

                    sm:text-4xl
                  "
                                >
                                    {profile.name}
                                </h1>


                                <p
                                    className="
                    mt-2

                    text-sm
                    text-slate-400
                  "
                                >
                                    Manage your profile,
                                    addresses and orders
                                    from one place.
                                </p>
                            </div>
                        </div>


                        {/* EDIT */}

                        <button
                            type="button"

                            onClick={() =>
                                setEditOpen(true)
                            }

                            className="
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                gap-2

                rounded-2xl

                border
                border-white/10

                bg-white/10

                px-5

                text-sm
                font-black
                text-white

                backdrop-blur

                transition

                hover:bg-white
                hover:text-slate-950

                sm:w-auto
              "
                        >
                            <FaEdit
                                className="
                  h-3.5
                  w-3.5
                "
                            />

                            Edit Profile
                        </button>
                    </div>
                </Container>
            </section>


            {/* =========================
          DETAILS
      ========================== */}

            <section
                className="
          py-8

          sm:py-10

          lg:py-12
        "
            >
                <Container>
                    <div
                        className="
              grid
              gap-6

              lg:grid-cols-[minmax(0,1fr)_340px]
              lg:items-start
            "
                    >
                        {/* =====================
                PROFILE INFORMATION
            ====================== */}

                        <div
                            className="
                rounded-[1.75rem]

                border
                border-slate-200

                bg-white

                p-5

                shadow-sm

                sm:p-6
              "
                        >
                            <div>
                                <p
                                    className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-orange-500
                  "
                                >
                                    Personal details
                                </p>


                                <h2
                                    className="
                    mt-2

                    text-xl
                    font-black
                    text-slate-950

                    sm:text-2xl
                  "
                                >
                                    Your information
                                </h2>


                                <p
                                    className="
                    mt-1

                    text-sm
                    text-slate-500
                  "
                                >
                                    These details are used
                                    for your Foodie account.
                                </p>
                            </div>


                            {/* INFO */}

                            <div
                                className="
                  mt-6

                  grid
                  gap-4

                  sm:grid-cols-2
                "
                            >
                                {/* NAME */}

                                <div
                                    className="
                    rounded-2xl

                    border
                    border-slate-100

                    bg-slate-50/70

                    p-4
                  "
                                >
                                    <div
                                        className="
                      flex
                      items-start
                      gap-3
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
                                            <FaUser />
                                        </span>


                                        <div
                                            className="
                        min-w-0
                      "
                                        >
                                            <p
                                                className="
                          text-[10px]
                          font-black
                          uppercase
                          tracking-wide
                          text-slate-400
                        "
                                            >
                                                Full Name
                                            </p>

                                            <p
                                                className="
                          mt-1

                          break-words

                          text-sm
                          font-black
                          text-slate-950
                        "
                                            >
                                                {
                                                    profile.name
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>


                                {/* EMAIL */}

                                <div
                                    className="
                    rounded-2xl

                    border
                    border-slate-100

                    bg-slate-50/70

                    p-4
                  "
                                >
                                    <div
                                        className="
                      flex
                      items-start
                      gap-3
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
                                            <FaEnvelope />
                                        </span>


                                        <div
                                            className="
                        min-w-0
                      "
                                        >
                                            <p
                                                className="
                          text-[10px]
                          font-black
                          uppercase
                          tracking-wide
                          text-slate-400
                        "
                                            >
                                                Email Address
                                            </p>

                                            <p
                                                className="
                          mt-1

                          break-all

                          text-sm
                          font-black
                          text-slate-950
                        "
                                            >
                                                {
                                                    profile.email
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>


                                {/* PHONE */}

                                <div
                                    className="
                    rounded-2xl

                    border
                    border-slate-100

                    bg-slate-50/70

                    p-4
                  "
                                >
                                    <div
                                        className="
                      flex
                      items-start
                      gap-3
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

                        bg-emerald-100

                        text-emerald-600
                      "
                                        >
                                            <FaPhoneAlt />
                                        </span>


                                        <div
                                            className="
                        min-w-0
                      "
                                        >
                                            <p
                                                className="
                          text-[10px]
                          font-black
                          uppercase
                          tracking-wide
                          text-slate-400
                        "
                                            >
                                                Phone Number
                                            </p>

                                            <p
                                                className="
                          mt-1

                          text-sm
                          font-black
                          text-slate-950
                        "
                                            >
                                                +91{" "}
                                                {
                                                    profile.phone
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* =====================
                QUICK ACTIONS
            ====================== */}

                        <aside
                            className="
                lg:sticky
                lg:top-28
              "
                        >
                            <div
                                className="
                  rounded-[1.75rem]

                  border
                  border-slate-200

                  bg-white

                  p-5

                  shadow-sm
                "
                            >
                                <h2
                                    className="
                    text-lg
                    font-black
                    text-slate-950
                  "
                                >
                                    Quick actions
                                </h2>


                                <p
                                    className="
                    mt-1

                    text-xs
                    text-slate-500
                  "
                                >
                                    Jump to the things you
                                    use most.
                                </p>


                                <div
                                    className="
                    mt-5
                    space-y-3
                  "
                                >
                                    {/* ORDERS */}

                                    <button
                                        type="button"

                                        onClick={() =>
                                            navigate(
                                                "/orders"
                                            )
                                        }

                                        className="
                      group

                      flex
                      min-h-14
                      w-full
                      items-center
                      gap-3

                      rounded-2xl

                      border
                      border-slate-100

                      bg-slate-50/70

                      px-4

                      text-left

                      transition

                      hover:border-orange-200
                      hover:bg-orange-50
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
                                            <FaShoppingBag />
                                        </span>


                                        <div>
                                            <p
                                                className="
                          text-sm
                          font-black
                          text-slate-900
                        "
                                            >
                                                My Orders
                                            </p>

                                            <p
                                                className="
                          mt-0.5

                          text-xs
                          text-slate-500
                        "
                                            >
                                                View order history
                                            </p>
                                        </div>
                                    </button>


                                    {/* ADDRESSES */}

                                    <button
                                        type="button"

                                        onClick={() =>
                                            navigate(
                                                "/addresses"
                                            )
                                        }

                                        className="
                      flex
                      min-h-14
                      w-full
                      items-center
                      gap-3

                      rounded-2xl

                      border
                      border-slate-100

                      bg-slate-50/70

                      px-4

                      text-left

                      transition

                      hover:border-orange-200
                      hover:bg-orange-50
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
                                            <FaMapMarkerAlt />
                                        </span>


                                        <div>
                                            <p
                                                className="
                          text-sm
                          font-black
                          text-slate-900
                        "
                                            >
                                                Saved Addresses
                                            </p>

                                            <p
                                                className="
                          mt-0.5

                          text-xs
                          text-slate-500
                        "
                                            >
                                                Manage delivery
                                                locations
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </Container>
            </section>


            {/* =========================
          EDIT PROFILE MODAL
      ========================== */}

            <Modal
                open={
                    editOpen
                }

                onClose={() =>
                    setEditOpen(false)
                }

                title="Edit Profile"

                description="Update your personal account information."
            >
                <CommonForm
                    key={
                        profile.email
                    }

                    fields={
                        profileFields
                    }

                    schema={
                        profileSchema
                    }

                    defaultValues={{
                        name:
                            profile.name || "",

                        phone:
                            profile.phone || "",
                    }}

                    onSubmit={
                        handleUpdateProfile
                    }

                    onCancel={() =>
                        setEditOpen(false)
                    }

                    loading={
                        updateLoading
                    }

                    submitText="Save Changes"

                    columns={1}
                />


                {/* EMAIL INFO */}

                <div
                    className="
            mt-4

            rounded-xl

            bg-slate-50

            p-3

            text-xs
            leading-5
            text-slate-500
          "
                >
                    <strong
                        className="
              text-slate-700
            "
                    >
                        Account email:
                    </strong>{" "}
                    {profile.email}
                </div>
            </Modal>
        </div>
    );
};


export default Profile;