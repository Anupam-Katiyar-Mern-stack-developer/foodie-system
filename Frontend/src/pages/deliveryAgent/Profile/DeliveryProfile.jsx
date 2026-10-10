import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Bike,
  Camera,
  CheckCircle2,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
  X,
} from "lucide-react";

import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Button from "../../../components/common/Button/Button";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";

import {
  getDeliveryProfile,
  updateDeliveryProfile,
  updateDeliveryOnlineStatus,
} from "../../../redux/thunks/deliveryAgent/deliveryProfile.thunk";

import getImageUrl from "../../../utils/getImageUrl";
// =========================================
// DEFAULT FORM
// =========================================

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  vehicleType: "BIKE",
  vehicleNumber: "",
  image: null,
};

// =========================================
// COMMON CLASSES
// =========================================

const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100";

const sectionClass =
  "rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6";

// =========================================
// COMPONENT
// =========================================

const DeliveryProfile = () => {
  const dispatch = useDispatch();

  // =========================================
  // REDUX
  // =========================================

  const {
    profile,
    fetchLoading,
    updateLoading,
    statusLoading,
    error,
    updateError,
    statusError,
  } = useSelector((state) => state.deliveryProfile) || {};

  // =========================================
  // LOCAL STATE
  // =========================================

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");

  // =========================================
  // GET PROFILE
  // =========================================

  useEffect(() => {
    dispatch(getDeliveryProfile());
  }, [dispatch]);

  // =========================================
  // SYNC IMAGE
  // =========================================

  useEffect(() => {
    if (!editMode && profile) {
      setImagePreview(profile.image || "");
    }
  }, [profile, editMode]);

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // IMAGE CHANGE
  // =========================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setFormData((previous) => ({
      ...previous,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  // =========================================
  // REMOVE NEW SELECTED IMAGE
  // =========================================

  const handleRemoveSelectedImage = () => {
    setFormData((previous) => ({
      ...previous,
      image: null,
    }));

    setImagePreview(profile?.image || "");
  };

  // =========================================
  // EDIT
  // =========================================

  const handleEdit = () => {
    if (!profile) return;

    setFormData({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      address: profile.address || "",
      vehicleType: profile.vehicleType || "BIKE",
      vehicleNumber: profile.vehicleNumber || "",
      image: null,
    });

    setImagePreview(profile.image || "");
    setEditMode(true);
  };

  // =========================================
  // CANCEL
  // =========================================

  const handleCancel = () => {
    setFormData(emptyForm);
    setImagePreview(profile?.image || "");
    setEditMode(false);
  };

  // =========================================
  // UPDATE PROFILE
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = new FormData();

    // Full profile data
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("address", formData.address);
    payload.append("vehicleType", formData.vehicleType);
    payload.append("vehicleNumber", formData.vehicleNumber);

    // Optional profile image
    if (formData.image instanceof File) {
      payload.append("image", formData.image);
    }

    // Debug
    for (const [key, value] of payload.entries()) {
      console.log(key, value);
    }

    try {
      await dispatch(
        updateDeliveryProfile(payload)
      ).unwrap();

      setFormData(emptyForm);
      setEditMode(false);

      // Fresh profile
      dispatch(getDeliveryProfile());
    } catch (error) {
      console.error(
        "UPDATE DELIVERY PROFILE ERROR:",
        error
      );
    }
  };

  // =========================================
  // ONLINE STATUS
  // =========================================

  const handleOnlineToggle = async () => {
    if (!profile || statusLoading) return;

    try {
      await dispatch(
        updateDeliveryOnlineStatus(
          !profile.isOnline
        )
      ).unwrap();
    } catch (error) {
      console.error(
        "DELIVERY STATUS ERROR:",
        error
      );
    }
  };

  // =========================================
  // RETRY
  // =========================================

  const handleRetry = () => {
    dispatch(getDeliveryProfile());
  };

  // =========================================
  // LOADING
  // =========================================

  if (fetchLoading && !profile) {
    return (
      <div className="space-y-5">
        <PageHeader
          title="Delivery Profile"
          description="Manage your personal information, vehicle details and delivery availability."
        />

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

          <p className="mt-3 text-sm font-bold text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error && !profile) {
    return (
      <div className="space-y-5">
        <PageHeader
          title="Delivery Profile"
          description="Manage your personal information, vehicle details and delivery availability."
        />

        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6">
          <p className="font-bold text-red-700">
            {error}
          </p>

          <Button
            type="button"
            className="mt-4"
            onClick={handleRetry}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const displayImage = imagePreview
    ? imagePreview
    : getImageUrl(profile.image);

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="space-y-7">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Delivery Profile"
          description="Manage your personal information, vehicle details and delivery availability."
        />

        {!editMode && (
          <Button
            type="button"
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* ERROR */}

      {(updateError || statusError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {updateError || statusError}
        </div>
      )}

      {/* PROFILE HERO */}

      <section className="rounded-[1.5rem] border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-rose-50 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* IMAGE */}

            <div className="relative">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={profile.name || "Delivery Partner"}
                  className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white shadow-sm"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-2xl font-black text-orange-600 ring-4 ring-white shadow-sm">
                  {profile.name
                    ?.charAt(0)
                    ?.toUpperCase() || "D"}
                </div>
              )}

              {editMode && (
                <label className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-orange-500 text-white shadow-md transition hover:bg-orange-600">
                  <Camera className="h-4 w-4" />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* BASIC INFO */}

            <div className="min-w-0">
              <h2 className="truncate text-xl font-black text-slate-950">
                {profile.name || "Delivery Partner"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Delivery Partner
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge
                  variant={
                    profile.isOnline
                      ? "success"
                      : "danger"
                  }
                  size="sm"
                  dot
                >
                  {profile.isOnline
                    ? "Online"
                    : "Offline"}
                </StatusBadge>

                <StatusBadge
                  variant={
                    profile.isAvailable
                      ? "success"
                      : "neutral"
                  }
                  size="sm"
                >
                  {profile.isAvailable
                    ? "Available"
                    : "Unavailable"}
                </StatusBadge>
              </div>
            </div>
          </div>

          {/* ONLINE STATUS */}

          <div className="sm:min-w-[230px]">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div>
                <p className="text-sm font-black text-slate-900">
                  Online Status
                </p>

                <p className="text-xs text-slate-400">
                  Receive delivery offers
                </p>
              </div>

              <Toggle
                enabled={Boolean(
                  profile.isOnline
                )}
                loading={statusLoading}
                onClick={handleOnlineToggle}
              />
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div>
                <p className="text-sm font-black text-slate-900">
                  Availability
                </p>

                <p className="text-xs text-slate-400">
                  Current assignment state
                </p>
              </div>

              <StatusBadge
                variant={
                  profile.isAvailable
                    ? "success"
                    : "neutral"
                }
                size="sm"
              >
                {profile.isAvailable
                  ? "Available"
                  : "Busy"}
              </StatusBadge>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          EDIT MODE
      ========================================= */}

      {editMode ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* PROFILE IMAGE */}

          <section className={sectionClass}>
            <SectionHeader
              title="Profile Image"
              description="Profile image is optional. Select a new image only if you want to change the current one."
            />

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* PREVIEW */}

              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UserRound className="h-9 w-9 text-slate-300" />
                  </div>
                )}
              </div>

              {/* UPLOAD */}

              <div>
                <p className="text-sm font-black text-slate-800">
                  Profile Photo
                  <span className="ml-2 font-semibold text-slate-400">
                    (Optional)
                  </span>
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  If you don't select a new image, your existing profile image will stay unchanged.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600">
                    <ImagePlus className="h-4 w-4" />

                    {formData.image instanceof File
                      ? "Change Image"
                      : "Choose Image"}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {formData.image instanceof File && (
                    <button
                      type="button"
                      onClick={handleRemoveSelectedImage}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      <X className="h-4 w-4" />
                      Remove Selected
                    </button>
                  )}
                </div>

                {formData.image instanceof File && (
                  <p className="mt-3 text-xs font-semibold text-emerald-600">
                    Selected: {formData.image.name}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* PERSONAL INFORMATION */}

          <section className={sectionClass}>
            <SectionHeader
              title="Personal Information"
              description="Update your basic delivery partner details."
            />

            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              <FormField
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <FormField
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <FormField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* VEHICLE INFORMATION */}

          <section className={sectionClass}>
            <SectionHeader
              title="Vehicle Information"
              description="Update the vehicle used for deliveries."
            />

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Vehicle Type
                </label>

                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className={inputClass}
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

              <FormField
                label="Vehicle Number"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="uppercase"
              />
            </div>
          </section>

          {/* ACTIONS */}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={updateLoading}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={updateLoading}
              disabled={updateLoading}
            >
              <span className="inline-flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </span>
            </Button>
          </div>
        </form>
      ) : (
        /* =========================================
           VIEW MODE
        ========================================= */

        <div className="grid gap-6 lg:grid-cols-2">
          {/* PERSONAL */}

          <section className={sectionClass}>
            <SectionTitle
              icon={UserRound}
              title="Personal Information"
              variant="orange"
            />

            <div className="mt-6 space-y-5">
              <InfoRow
                icon={UserRound}
                label="Full Name"
                value={profile.name}
              />

              <InfoRow
                icon={Mail}
                label="Email"
                value={profile.email}
              />

              <InfoRow
                icon={Phone}
                label="Phone"
                value={profile.phone}
              />

              <InfoRow
                icon={MapPin}
                label="Address"
                value={profile.address}
              />
            </div>
          </section>

          {/* VEHICLE */}

          <section className={sectionClass}>
            <SectionTitle
              icon={Bike}
              title="Vehicle Information"
              variant="green"
            />

            <div className="mt-6 space-y-5">
              <DetailItem
                label="Vehicle Type"
                value={profile.vehicleType}
              />

              <DetailItem
                label="Vehicle Number"
                value={profile.vehicleNumber}
                large
              />

              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                <span className="text-xs font-bold text-emerald-700">
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

// =========================================
// FORM FIELD
// =========================================

const FormField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className={`${inputClass} ${className}`}
      />
    </div>
  );
};

// =========================================
// SECTION HEADER
// =========================================

const SectionHeader = ({
  title,
  description,
}) => {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-black text-slate-950">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
};

// =========================================
// SECTION TITLE
// =========================================

const SectionTitle = ({
  icon: Icon,
  title,
  variant,
}) => {
  const iconStyle =
    variant === "green"
      ? "bg-emerald-100 text-emerald-600"
      : "bg-orange-100 text-orange-600";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <h2 className="text-lg font-black text-slate-950">
        {title}
      </h2>
    </div>
  );
};

// =========================================
// INFO ROW
// =========================================

const InfoRow = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

      <div>
        <p className="text-xs font-semibold text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-bold leading-6 text-slate-900">
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

// =========================================
// DETAIL ITEM
// =========================================

const DetailItem = ({
  label,
  value,
  large = false,
}) => {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 font-black text-slate-950 ${large
            ? "text-lg tracking-wide"
            : "text-sm"
          }`}
      >
        {value || "-"}
      </p>
    </div>
  );
};

// =========================================
// TOGGLE
// =========================================

const Toggle = ({
  enabled,
  loading,
  onClick,
}) => {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className={`relative h-7 w-14 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${enabled
          ? "bg-emerald-500"
          : "bg-slate-300"
        }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${enabled
            ? "left-8"
            : "left-1"
          }`}
      />
    </button>
  );
};

export default DeliveryProfile;