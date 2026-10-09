import {
  useState,
} from "react";

import {
  Bike,
  Camera,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";


import PageHeader
  from "../../../components/common/PageHeader/PageHeader";

import Button
  from "../../../components/common/Button/Button";

import StatusBadge
  from "../../../components/common/StatusBadge/StatusBadge";


const DeliveryProfile = () => {

  // =========================================
  // DUMMY PROFILE
  //
  // Later Redux/API se aayega
  // =========================================

  const [
    profile,
    setProfile,
  ] = useState({

    name:
      "Aman Kumar",

    email:
      "aman@example.com",

    phone:
      "9876543210",

    address:
      "Kakadeo, Kanpur, Uttar Pradesh",

    vehicleType:
      "BIKE",

    vehicleNumber:
      "UP78 AB 1234",

    image:
      "",

    isOnline:
      true,

    isAvailable:
      true,

  });


  // =========================================
  // EDIT MODE
  // =========================================

  const [
    editMode,
    setEditMode,
  ] = useState(false);


  const [
    formData,
    setFormData,
  ] = useState(profile);


  const [
    imagePreview,
    setImagePreview,
  ] = useState(
    profile.image
  );


  const [
    saving,
    setSaving,
  ] = useState(false);


  // =========================================
  // INPUT CHANGE
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


      setFormData(
        (
          previous
        ) => ({
          ...previous,

          image:
            file,
        })
      );


      const previewUrl =
        URL.createObjectURL(
          file
        );


      setImagePreview(
        previewUrl
      );

    };


  // =========================================
  // EDIT
  // =========================================

  const handleEdit =
    () => {

      setFormData({
        ...profile,
      });


      setImagePreview(
        profile.image
      );


      setEditMode(
        true
      );

    };


  // =========================================
  // CANCEL
  // =========================================

  const handleCancel =
    () => {

      setFormData({
        ...profile,
      });


      setImagePreview(
        profile.image
      );


      setEditMode(
        false
      );

    };


  // =========================================
  // SAVE
  // =========================================

  const handleSubmit =
    async (
      event
    ) => {

      event.preventDefault();


      try {

        setSaving(
          true
        );


        /*
         * FRONTEND ONLY
         *
         * Later:
         *
         * const formDataPayload =
         *   new FormData();
         *
         * dispatch(
         *   updateDeliveryProfile(
         *     formDataPayload
         *   )
         * )
         */


        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              500
            )
        );


        setProfile(
          (
            previous
          ) => ({
            ...previous,

            ...formData,

            image:
              imagePreview ||
              previous.image,
          })
        );


        setEditMode(
          false
        );

      } finally {

        setSaving(
          false
        );

      }

    };


  // =========================================
  // STATUS
  // =========================================

  const handleOnlineToggle =
    () => {

      setProfile(
        (
          previous
        ) => ({
          ...previous,

          isOnline:
            !previous.isOnline,

          isAvailable:
            previous.isOnline
              ? false
              : previous.isAvailable,
        })
      );

  };


  const handleAvailabilityToggle =
    () => {

      if (
        !profile.isOnline
      ) {
        return;
      }


      setProfile(
        (
          previous
        ) => ({
          ...previous,

          isAvailable:
            !previous.isAvailable,
        })
      );

  };


  return (

    <div
      className="
        space-y-7
      "
    >

      {/* =================================
          HEADER
      ================================= */}

      <div
        className="
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >

        <PageHeader
          title="Delivery Profile"

          description="Manage your personal information, vehicle details and delivery availability."
        />


        {!editMode && (

          <Button
            type="button"

            onClick={
              handleEdit
            }
          >
            Edit Profile
          </Button>

        )}

      </div>


      {/* =================================
          PROFILE HERO
      ================================= */}

      <section
        className="
          rounded-[1.5rem]

          border
          border-orange-100

          bg-gradient-to-r
          from-orange-50
          via-white
          to-rose-50

          p-5

          shadow-sm

          sm:p-6
        "
      >

        <div
          className="
            flex
            flex-col
            gap-5

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            {/* AVATAR */}

            <div
              className="
                relative
              "
            >

              {imagePreview ||
              profile.image ? (

                <img
                  src={
                    imagePreview ||
                    profile.image
                  }

                  alt={
                    profile.name
                  }

                  className="
                    h-20
                    w-20

                    rounded-2xl

                    object-cover

                    ring-4
                    ring-white

                    shadow-sm
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

                    bg-white

                    text-2xl
                    font-black
                    text-orange-600

                    ring-4
                    ring-white

                    shadow-sm
                  "
                >
                  {
                    profile.name
                      ?.charAt(0)
                      ?.toUpperCase() ||
                    "D"
                  }
                </div>

              )}


              {editMode && (

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

              )}

            </div>


            <div
              className="
                min-w-0
              "
            >

              <h2
                className="
                  truncate

                  text-xl
                  font-black
                  text-slate-950
                "
              >
                {
                  profile.name
                }
              </h2>


              <p
                className="
                  mt-1

                  text-sm
                  text-slate-500
                "
              >
                Delivery Partner
              </p>


              <div
                className="
                  mt-3

                  flex
                  flex-wrap
                  gap-2
                "
              >

                <StatusBadge
                  variant={
                    profile.isOnline
                      ? "success"
                      : "danger"
                  }

                  size="sm"

                  dot
                >
                  {
                    profile.isOnline
                      ? "Online"
                      : "Offline"
                  }
                </StatusBadge>


                <StatusBadge
                  variant={
                    profile.isAvailable
                      ? "success"
                      : "neutral"
                  }

                  size="sm"
                >
                  {
                    profile.isAvailable
                      ? "Available"
                      : "Unavailable"
                  }
                </StatusBadge>

              </div>

            </div>

          </div>


          <div
            className="
              flex
              flex-col
              gap-3

              sm:min-w-[220px]
            "
          >

            {/* ONLINE */}

            <div
              className="
                flex
                items-center
                justify-between

                rounded-xl

                border
                border-slate-200

                bg-white

                px-4
                py-3
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    font-black
                    text-slate-900
                  "
                >
                  Online Status
                </p>


                <p
                  className="
                    text-xs
                    text-slate-400
                  "
                >
                  Receive assignments
                </p>

              </div>


              <button
                type="button"

                onClick={
                  handleOnlineToggle
                }

                className={`
                  relative

                  h-7
                  w-14

                  rounded-full

                  transition-colors

                  ${
                    profile.isOnline
                      ? "bg-emerald-500"
                      : "bg-slate-300"
                  }
                `}
              >

                <span
                  className={`
                    absolute
                    top-1

                    h-5
                    w-5

                    rounded-full

                    bg-white

                    shadow-sm

                    transition-all

                    ${
                      profile.isOnline
                        ? "left-8"
                        : "left-1"
                    }
                  `}
                />

              </button>

            </div>


            {/* AVAILABLE */}

            <div
              className="
                flex
                items-center
                justify-between

                rounded-xl

                border
                border-slate-200

                bg-white

                px-4
                py-3
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    font-black
                    text-slate-900
                  "
                >
                  Availability
                </p>


                <p
                  className="
                    text-xs
                    text-slate-400
                  "
                >
                  Accept new delivery
                </p>

              </div>


              <button
                type="button"

                disabled={
                  !profile.isOnline
                }

                onClick={
                  handleAvailabilityToggle
                }

                className={`
                  relative

                  h-7
                  w-14

                  rounded-full

                  transition-colors

                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  ${
                    profile.isAvailable &&
                    profile.isOnline
                      ? "bg-emerald-500"
                      : "bg-slate-300"
                  }
                `}
              >

                <span
                  className={`
                    absolute
                    top-1

                    h-5
                    w-5

                    rounded-full

                    bg-white

                    shadow-sm

                    transition-all

                    ${
                      profile.isAvailable &&
                      profile.isOnline
                        ? "left-8"
                        : "left-1"
                    }
                  `}
                />

              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =================================
          EDIT FORM
      ================================= */}

      {editMode ? (

        <form
          onSubmit={
            handleSubmit
          }

          className="
            space-y-6
          "
        >

          {/* PERSONAL */}

          <section
            className="
              rounded-[1.5rem]

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
                mb-5
              "
            >

              <h2
                className="
                  text-lg
                  font-black
                  text-slate-950
                "
              >
                Personal Information
              </h2>


              <p
                className="
                  mt-1

                  text-sm
                  text-slate-500
                "
              >
                Update your basic
                delivery partner details.
              </p>

            </div>


            <div
              className="
                grid
                gap-5

                md:grid-cols-2
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


                <input
                  type="text"

                  name="name"

                  value={
                    formData.name
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

                    transition

                    focus:border-orange-300
                    focus:ring-4
                    focus:ring-orange-100
                  "
                />

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


                <input
                  type="email"

                  name="email"

                  value={
                    formData.email
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

                    px-4

                    text-sm

                    outline-none

                    focus:border-orange-300
                    focus:ring-4
                    focus:ring-orange-100
                  "
                />

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


                <input
                  type="tel"

                  name="phone"

                  value={
                    formData.phone
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

                    px-4

                    text-sm

                    outline-none

                    focus:border-orange-300
                    focus:ring-4
                    focus:ring-orange-100
                  "
                />

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


                <input
                  type="text"

                  name="address"

                  value={
                    formData.address
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

                    px-4

                    text-sm

                    outline-none

                    focus:border-orange-300
                    focus:ring-4
                    focus:ring-orange-100
                  "
                />

              </div>

            </div>

          </section>


          {/* VEHICLE */}

          <section
            className="
              rounded-[1.5rem]

              border
              border-slate-200

              bg-white

              p-5

              shadow-sm

              sm:p-6
            "
          >

            <h2
              className="
                text-lg
                font-black
                text-slate-950
              "
            >
              Vehicle Information
            </h2>


            <div
              className="
                mt-5

                grid
                gap-5

                md:grid-cols-2
              "
            >

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

                    focus:border-orange-300
                    focus:ring-4
                    focus:ring-orange-100
                  "
                />

              </div>

            </div>

          </section>


          {/* ACTIONS */}

          <div
            className="
              flex
              justify-end
              gap-3
            "
          >

            <Button
              type="button"

              variant="outline"

              disabled={
                saving
              }

              onClick={
                handleCancel
              }
            >
              Cancel
            </Button>


            <Button
              type="submit"

              loading={
                saving
              }

              disabled={
                saving
              }
            >

              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                "
              >

                <Save
                  className="
                    h-4
                    w-4
                  "
                />

                Save Changes

              </span>

            </Button>

          </div>

        </form>

      ) : (

        /* =================================
           PROFILE DETAILS
        ================================= */

        <div
          className="
            grid
            gap-6

            lg:grid-cols-2
          "
        >

          {/* PERSONAL */}

          <section
            className="
              rounded-[1.5rem]

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

                  bg-orange-100

                  text-orange-600
                "
              >
                <UserRound
                  className="
                    h-5
                    w-5
                  "
                />
              </div>


              <h2
                className="
                  text-lg
                  font-black
                  text-slate-950
                "
              >
                Personal Information
              </h2>

            </div>


            <div
              className="
                mt-6

                space-y-5
              "
            >

              <div
                className="
                  flex
                  gap-3
                "
              >

                <Mail
                  className="
                    mt-0.5
                    h-4
                    w-4

                    shrink-0

                    text-slate-400
                  "
                />


                <div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      text-slate-400
                    "
                  >
                    Email
                  </p>

                  <p
                    className="
                      mt-1

                      text-sm
                      font-bold
                      text-slate-900
                    "
                  >
                    {
                      profile.email
                    }
                  </p>

                </div>

              </div>


              <div
                className="
                  flex
                  gap-3
                "
              >

                <Phone
                  className="
                    mt-0.5
                    h-4
                    w-4

                    text-slate-400
                  "
                />


                <div>

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Phone
                  </p>

                  <p
                    className="
                      mt-1

                      text-sm
                      font-bold
                      text-slate-900
                    "
                  >
                    {
                      profile.phone
                    }
                  </p>

                </div>

              </div>


              <div
                className="
                  flex
                  gap-3
                "
              >

                <MapPin
                  className="
                    mt-0.5
                    h-4
                    w-4
                    shrink-0

                    text-slate-400
                  "
                />


                <div>

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Address
                  </p>

                  <p
                    className="
                      mt-1

                      text-sm
                      font-bold
                      leading-6
                      text-slate-900
                    "
                  >
                    {
                      profile.address
                    }
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* VEHICLE */}

          <section
            className="
              rounded-[1.5rem]

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

                  bg-emerald-100

                  text-emerald-600
                "
              >
                <Bike
                  className="
                    h-5
                    w-5
                  "
                />
              </div>


              <h2
                className="
                  text-lg
                  font-black
                  text-slate-950
                "
              >
                Vehicle Information
              </h2>

            </div>


            <div
              className="
                mt-6

                space-y-5
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    font-semibold
                    text-slate-400
                  "
                >
                  Vehicle Type
                </p>


                <p
                  className="
                    mt-1

                    text-sm
                    font-black
                    text-slate-900
                  "
                >
                  {
                    profile.vehicleType
                  }
                </p>

              </div>


              <div>

                <p
                  className="
                    text-xs
                    font-semibold
                    text-slate-400
                  "
                >
                  Vehicle Number
                </p>


                <p
                  className="
                    mt-1

                    text-lg
                    font-black
                    tracking-wide
                    text-slate-950
                  "
                >
                  {
                    profile.vehicleNumber
                  }
                </p>

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2

                  rounded-xl

                  bg-emerald-50

                  p-3
                "
              >

                <CheckCircle2
                  className="
                    h-4
                    w-4
                    text-emerald-600
                  "
                />


                <span
                  className="
                    text-xs
                    font-bold
                    text-emerald-700
                  "
                >
                  Vehicle details added
                </span>

              </div>

            </div>

          </section>

        </div>

      )}

    </div>

  );

};


export default DeliveryProfile;