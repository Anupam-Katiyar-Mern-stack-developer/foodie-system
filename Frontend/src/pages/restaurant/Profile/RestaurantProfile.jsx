import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Camera,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  Store,
  User,
  X,
} from "lucide-react";

import {
  getRestaurantProfile,
  updateRestaurantProfile,
} from "../../../redux/thunks/restaurant/restaurantProfile.thunk";

import PageHeader from "../../../components/common/PageHeader/PageHeader";
import CommonForm from "../../../components/common/CommonForm/CommonForm";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Button from "../../../components/common/Button/Button";

import { restaurantProfileFields } from "../../../forms/restaurant/profile.form";
import { restaurantProfileSchema } from "../../../validations/restaurant/profile.validation";
import getImageUrl from "../../../utils/getImageUrl";

const RestaurantProfile = () => {
  const dispatch = useDispatch();
  const logoInputRef = useRef(null);

  const { profile, fetchLoading, updateLoading, error } = useSelector(
    (state) => state.restaurantProfile,
  ) || {};

  const [editMode, setEditMode] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  // =========================
  // GET PROFILE
  // =========================

  useEffect(() => {
    dispatch(getRestaurantProfile());
  }, [dispatch]);

  // =========================
  // FORM VALUES
  // =========================

  const formValues = useMemo(
    () => ({
      ownerName: profile?.ownerName ?? "",
      restaurantName: profile?.restaurantName ?? "",
      phone: profile?.phone ?? "",
      description: profile?.description ?? "",
      addressLine: profile?.addressLine ?? "",
      city: profile?.city ?? "",
      state: profile?.state ?? "",
      pincode:
        profile?.pincode !== null && profile?.pincode !== undefined
          ? String(profile.pincode)
          : "",
    }),
    [profile],
  );

  // Logo CommonForm me nahi dikhana
  const editableProfileFields = useMemo(
    () =>
      restaurantProfileFields.filter(
        (field) => !["logo", "image"].includes(field.name),
      ),
    [],
  );

  // =========================
  // EDIT
  // =========================

  const handleEdit = () => {
    setLogoFile(null);
    setLogoPreview("");
    setEditMode(true);
  };

  const handleCancel = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoFile(null);
    setLogoPreview("");
    setEditMode(false);
  };

  // =========================
  // LOGO SELECT
  // =========================

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));

    event.target.value = "";
  };

  // =========================
  // UPDATE
  // SAME EXISTING API
  // =========================

  const handleUpdate = async (values) => {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        const normalizedValue =
          typeof value === "string" ? value.trim() : value;

        if (normalizedValue === "") return;

        formData.append(key, String(normalizedValue));
      });

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await dispatch(updateRestaurantProfile(formData)).unwrap();
      await dispatch(getRestaurantProfile()).unwrap();

      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }

      setLogoFile(null);
      setLogoPreview("");
      setEditMode(false);
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (fetchLoading && !profile) {
    return (
      <div className="space-y-6">
        <Skeleton width="w-72" height="h-10" rounded="rounded-xl" />
        <Skeleton
          width="w-full"
          height="h-[220px]"
          rounded="rounded-[1.75rem]"
        />
        <Skeleton
          width="w-full"
          height="h-[350px]"
          rounded="rounded-[1.75rem]"
        />
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error && !profile) {
    return (
      <ErrorState
        title="Unable to load profile"
        description={
          typeof error === "string"
            ? error
            : "Something went wrong while loading restaurant profile."
        }
      />
    );
  }

  if (!profile) {
    return (
      <ErrorState
        title="Restaurant profile not found"
        description="Restaurant profile information is currently unavailable."
      />
    );
  }

  const restaurant = profile;

  const restaurantLogo =
    logoPreview || (restaurant.logo ? getImageUrl(restaurant.logo) : "");

  return (
    <div className="space-y-7">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Restaurant Profile"
          description="Manage your restaurant information, contact details and location."
        />

        {!editMode ? (
          <Button type="button" onClick={handleEdit}>
            <span className="inline-flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit Profile
            </span>
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={handleCancel}>
            <span className="inline-flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancel
            </span>
          </Button>
        )}
      </div>

      {/* PROFILE SUMMARY */}

      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="h-24 bg-gradient-to-r from-orange-100 via-orange-50 to-rose-100" />

        <div className="px-5 pb-6 sm:px-6">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              {/* LOGO */}

              <div className="relative h-24 w-24 shrink-0">
                <div className="h-full w-full overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-md">
                  {restaurantLogo ? (
                    <img
                      src={restaurantLogo}
                      alt={restaurant.restaurantName || "Restaurant"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Store className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                </div>

                {editMode && (
                  <>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleLogoChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-white shadow-md transition hover:bg-orange-600"
                      title="Change restaurant logo"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {/* NAME */}

              <div className="pb-1">
                <h2 className="text-2xl font-black text-slate-950">
                  {restaurant.restaurantName}
                </h2>

                <p className="mt-1 text-sm font-semibold text-slate-400">
                  /{restaurant.slug}
                </p>

                {editMode && logoFile && (
                  <p className="mt-1 max-w-[220px] truncate text-xs font-bold text-orange-500">
                    New logo: {logoFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* STATUS */}

            <div className="flex flex-wrap gap-2 pb-1">
              <StatusBadge
                variant={
                  restaurant.approvalStatus === "APPROVED"
                    ? "success"
                    : restaurant.approvalStatus === "REJECTED"
                      ? "danger"
                      : "warning"
                }
                size="sm"
                dot
              >
                {restaurant.approvalStatus}
              </StatusBadge>

              <StatusBadge
                variant={restaurant.emailVerified ? "success" : "warning"}
                size="sm"
                dot
              >
                {restaurant.emailVerified
                  ? "Email Verified"
                  : "Email Not Verified"}
              </StatusBadge>

              {restaurant.isBlocked && (
                <StatusBadge variant="danger" size="sm" dot>
                  Blocked
                </StatusBadge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* NORMAL VIEW */}

      {!editMode && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              icon={User}
              label="Owner"
              value={restaurant.ownerName}
              iconClass="bg-orange-50 text-orange-600"
            />

            <InfoCard
              icon={Mail}
              label="Login Email"
              value={restaurant.email}
              iconClass="bg-blue-50 text-blue-600"
            />

            <InfoCard
              icon={MapPin}
              label="Location"
              value={
                [restaurant.city, restaurant.state]
                  .filter(Boolean)
                  .join(", ") || "-"
              }
              iconClass="bg-purple-50 text-purple-600"
            />

            <InfoCard
              icon={ShieldCheck}
              label="Account"
              value={restaurant.isBlocked ? "Blocked" : "Active"}
              iconClass="bg-emerald-50 text-emerald-600"
            />
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle
              icon={Store}
              title="Restaurant Information"
              description="Your restaurant profile information."
            />

            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <ProfileField
                label="Restaurant Name"
                value={restaurant.restaurantName}
              />
              <ProfileField label="Owner Name" value={restaurant.ownerName} />
              <ProfileField label="Phone Number" value={restaurant.phone} />
              <ProfileField label="Address" value={restaurant.addressLine} />
              <ProfileField label="City" value={restaurant.city} />
              <ProfileField label="State" value={restaurant.state} />
              <ProfileField label="Pincode" value={restaurant.pincode} />
              <ProfileField
                label="Description"
                value={restaurant.description}
                className="sm:col-span-2"
              />
            </div>
          </section>
        </>
      )}

      {/* EDIT VIEW */}

      {editMode && (
        <section className="rounded-[1.75rem] border border-orange-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionTitle
            icon={Pencil}
            title="Edit Restaurant Profile"
            description="Change your details or logo and save everything together."
          />

          <CommonForm
            key={profile?.updatedAt || profile?.slug || "restaurant-profile"}
            fields={editableProfileFields}
            schema={restaurantProfileSchema}
            defaultValues={formValues}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
            loading={updateLoading}
            submitText="Save Changes"
            columns={2}
          />
        </section>
      )}
    </div>
  );
};

// =========================
// INFO CARD
// =========================

const InfoCard = ({ icon: Icon, label, value, iconClass }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
        <p className="truncate text-sm font-black text-slate-900">
          {value || "-"}
        </p>
      </div>
    </div>
  </div>
);

// =========================
// SECTION TITLE
// =========================

const SectionTitle = ({ icon: Icon, title, description }) => (
  <div className="mb-6 flex items-center gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
      <Icon className="h-5 w-5" />
    </div>

    <div>
      <h2 className="text-lg font-black text-slate-950">{title}</h2>
      <p className="mt-0.5 text-sm text-slate-500">{description}</p>
    </div>
  </div>
);

// =========================
// PROFILE FIELD
// =========================

const ProfileField = ({ label, value, className = "" }) => (
  <div className={className}>
    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <p className="mt-1.5 text-sm font-semibold leading-6 text-slate-800">
      {value || "-"}
    </p>
  </div>
);

export default RestaurantProfile;