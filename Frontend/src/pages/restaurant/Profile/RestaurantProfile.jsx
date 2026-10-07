import {
  useMemo,
  useState,
} from "react";

import {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getRestaurantProfile,
  updateRestaurantProfile,
} from "../../../redux/thunks/restaurant/restaurantProfile.thunk";

import {
  CheckCircle2,
  Mail,
  MapPin,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";


import PageHeader
  from "../../../components/common/PageHeader/PageHeader";

import CommonForm
  from "../../../components/common/CommonForm/CommonForm";

import OptimizedImage
  from "../../../components/common/OptimizedImage/OptimizedImage";

import StatusBadge
  from "../../../components/common/StatusBadge/StatusBadge";

import Skeleton
  from "../../../components/common/Skeleton/Skeleton";

import ErrorState
  from "../../../components/common/ErrorState/ErrorState";


import {
  restaurantProfileFields,
} from "../../../forms/restaurant/profile.form";

import {
  restaurantProfileSchema,
} from "../../../validations/restaurant/profile.validation";


const RestaurantProfile = () => {

  // =========================================
  // DUMMY PROFILE
  //
  // Later:
  // state.restaurantProfile.profile
  // =========================================

  const dispatch =
    useDispatch();


  const {
    profile,
    fetchLoading,
    updateLoading,
    error,
  } = useSelector(
    (state) =>
      state.restaurantProfile
  ) || {
      profile: null,
      fetchLoading: false,
      updateLoading: false,
      error: null,
    };

  // =========================
  // RESTAURANT DATA
  // =========================

  const restaurant =
    profile;

  // =========================================
  // UI/API-LIKE STATE
  //
  // Later Redux state se replace
  // =========================================

  useEffect(() => {
    dispatch(
      getRestaurantProfile()
    );
  }, [dispatch]);

  // =========================================
  // DEFAULT FORM VALUES
  // =========================================

  const formValues =
    useMemo(
      () => ({
        ownerName:
          profile?.ownerName ||
          "",

        restaurantName:
          profile?.restaurantName ||
          "",

        phone:
          profile?.phone ||
          "",

        description:
          profile?.description ||
          "",

        addressLine:
          profile?.addressLine ||
          "",

        city:
          profile?.city ||
          "",

        state:
          profile?.state ||
          "",

        pincode:
          profile?.pincode ||
          "",
      }),
      [profile]
    );


  // =========================================
  // UPDATE
  //
  // Later:
  //
  // await dispatch(
  //   updateRestaurantProfile(payload)
  // ).unwrap()
  // =========================================

  const handleUpdate =
    async (values) => {
      try {
        await dispatch(
          updateRestaurantProfile(
            values
          )
        ).unwrap();

      } catch (error) {
        console.error(
          "PROFILE UPDATE ERROR:",
          error
        );
      }
    };


  // =========================================
  // LOADING
  // =========================================

  if (fetchLoading) {
    return (
      <div
        className="
          space-y-6
        "
      >
        <Skeleton
          width="w-72"
          height="h-10"
          rounded="rounded-xl"
        />


        <Skeleton
          width="w-full"
          height="h-[220px]"
          rounded="rounded-[1.75rem]"
        />


        <Skeleton
          width="w-full"
          height="h-[650px]"
          rounded="rounded-[1.75rem]"
        />
      </div>
    );
  }


  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <ErrorState
        title="Unable to load profile"

        description={
          typeof error ===
            "string"
            ? error
            : "Something went wrong while loading restaurant profile."
        }
      />
    );
  }


  if (!restaurant) {
    return (
      <ErrorState
        title="Restaurant profile not found"

        description="Restaurant profile information is currently unavailable."
      />
    );
  }


  return (
    <div
      className="
        space-y-7
      "
    >
      {/* =========================
          HEADER
      ========================== */}

      <PageHeader
        title="Restaurant Profile"

        description="Manage your restaurant information, contact details and location."
      />


      {/* =========================
          PROFILE SUMMARY
      ========================== */}

      <section
        className="
          overflow-hidden

          rounded-[1.75rem]

          border
          border-slate-200

          bg-white

          shadow-sm
        "
      >
        <div
          className="
            h-24

            bg-gradient-to-r
            from-orange-100
            via-orange-50
            to-rose-100
          "
        />


        <div
          className="
            px-5
            pb-6

            sm:px-6
          "
        >
          <div
            className="
              -mt-12

              flex
              flex-col
              gap-5

              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4

                sm:flex-row
                sm:items-end
              "
            >
              {/* LOGO */}

              <div
                className="
                  h-24
                  w-24

                  overflow-hidden

                  rounded-2xl

                  border-4
                  border-white

                  bg-slate-100

                  shadow-md
                "
              >
                <OptimizedImage
                  src={
                    restaurant.logo
                  }

                  alt={
                    restaurant.restaurantName
                  }

                  className="
                    h-full
                    w-full

                    object-cover
                  "
                />
              </div>


              {/* NAME */}

              <div
                className="
                  pb-1
                "
              >
                <h2
                  className="
                    text-2xl
                    font-black
                    text-slate-950
                  "
                >
                  {
                    restaurant.restaurantName
                  }
                </h2>


                <p
                  className="
                    mt-1

                    text-sm
                    font-semibold
                    text-slate-400
                  "
                >
                  /{
                    restaurant.slug
                  }
                </p>
              </div>
            </div>


            {/* STATUS */}

            <div
              className="
                flex
                flex-wrap
                gap-2

                pb-1
              "
            >
              <StatusBadge
                variant={
                  restaurant.approvalStatus ===
                    "APPROVED"
                    ? "success"
                    : restaurant.approvalStatus ===
                      "REJECTED"
                      ? "danger"
                      : "warning"
                }

                size="sm"

                dot
              >
                {
                  restaurant.approvalStatus
                }
              </StatusBadge>


              <StatusBadge
                variant={
                  restaurant.emailVerified
                    ? "success"
                    : "warning"
                }

                size="sm"

                dot
              >
                {restaurant.emailVerified
                  ? "Email Verified"
                  : "Email Not Verified"}
              </StatusBadge>


              {restaurant.isBlocked && (
                <StatusBadge
                  variant="danger"

                  size="sm"

                  dot
                >
                  Blocked
                </StatusBadge>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* =========================
          ACCOUNT INFORMATION
      ========================== */}

      <section
        className="
          grid
          gap-4

          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {/* OWNER */}

        <div
          className="
            rounded-2xl

            border
            border-slate-200

            bg-white

            p-5

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
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-xl

                bg-orange-50

                text-orange-600
              "
            >
              <User
                className="
                  h-5
                  w-5
                "
              />
            </div>


            <div
              className="
                min-w-0
              "
            >
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  text-slate-400
                "
              >
                Owner
              </p>

              <p
                className="
                  truncate

                  text-sm
                  font-black
                  text-slate-900
                "
              >
                {
                  restaurant.ownerName
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
            border-slate-200

            bg-white

            p-5

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
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-xl

                bg-blue-50

                text-blue-600
              "
            >
              <Mail
                className="
                  h-5
                  w-5
                "
              />
            </div>


            <div
              className="
                min-w-0
              "
            >
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  text-slate-400
                "
              >
                Login Email
              </p>

              <p
                className="
                  truncate

                  text-sm
                  font-black
                  text-slate-900
                "
              >
                {
                  restaurant.email
                }
              </p>
            </div>
          </div>
        </div>


        {/* LOCATION */}

        <div
          className="
            rounded-2xl

            border
            border-slate-200

            bg-white

            p-5

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
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-xl

                bg-purple-50

                text-purple-600
              "
            >
              <MapPin
                className="
                  h-5
                  w-5
                "
              />
            </div>


            <div
              className="
                min-w-0
              "
            >
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  text-slate-400
                "
              >
                Location
              </p>

              <p
                className="
                  truncate

                  text-sm
                  font-black
                  text-slate-900
                "
              >
                {restaurant.city},
                {" "}
                {restaurant.state}
              </p>
            </div>
          </div>
        </div>


        {/* ACCOUNT STATUS */}

        <div
          className="
            rounded-2xl

            border
            border-slate-200

            bg-white

            p-5

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
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-xl

                bg-emerald-50

                text-emerald-600
              "
            >
              <ShieldCheck
                className="
                  h-5
                  w-5
                "
              />
            </div>


            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  text-slate-400
                "
              >
                Account
              </p>

              <p
                className="
                  text-sm
                  font-black
                  text-slate-900
                "
              >
                {restaurant.isBlocked
                  ? "Blocked"
                  : "Active"}
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =========================
          PROFILE FORM
      ========================== */}

      <section
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
        <div
          className="
            mb-6

            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center

              rounded-xl

              bg-orange-50

              text-orange-600
            "
          >
            <Store
              className="
                h-5
                w-5
              "
            />
          </div>


          <div>
            <h2
              className="
                text-lg
                font-black
                text-slate-950
              "
            >
              Restaurant Information
            </h2>

            <p
              className="
                mt-0.5

                text-sm
                text-slate-500
              "
            >
              Update information shown
              across your restaurant profile.
            </p>
          </div>
        </div>


        <CommonForm
          key={
            profile?.updatedAt ||
            profile?.slug ||
            "restaurant-profile"
          }

          fields={
            restaurantProfileFields
          }

          schema={
            restaurantProfileSchema
          }

          defaultValues={
            formValues
          }

          onSubmit={
            handleUpdate
          }

          loading={
            updateLoading
          }

          submitText="Update Profile"

          columns={2}
        />
      </section>
    </div>
  );
};


export default RestaurantProfile;