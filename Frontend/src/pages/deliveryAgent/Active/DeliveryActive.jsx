import { useEffect, useMemo, useState } from "react";
import Checkbox from "../../../components/common/Checkbox/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Bike,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MapPin,
  Navigation,
  PackageCheck,
  Phone,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";

import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Button from "../../../components/common/Button/Button";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import Modal from "../../../components/common/Modal/Modal";
import CommonForm from "../../../components/common/CommonForm/CommonForm";

import {
  completeDelivery,
  getActiveDelivery,
  pickupDelivery,
  startDelivery,
} from "../../../redux/thunks/deliveryAgent/deliveryActiveOrders.thunk";

import {
  deliveryOtpDefaultValues,
  deliveryOtpFields,
} from "../../../forms/deliveryAgent/deliveryOtp.form";

import { deliveryOtpSchema } from "../../../validations/deliveryAgent/deliveryOtp.validation";
import { socket, connectSocket } from "../../../socket/socket";

import { STORAGE_KEYS } from "../../../constants/storageKeys";

import DeliveryTrackingMap from "../../../components/public/LiveTrackingMap/DeliveryTrackingMap";

const statusConfig = {
  DELIVERY_ASSIGNED: {
    label: "Go To Restaurant",
    variant: "warning",
    step: 1,
  },
  PICKED_UP: {
    label: "Picked Up",
    variant: "info",
    step: 2,
  },
  OUT_FOR_DELIVERY: {
    label: "Out For Delivery",
    variant: "purple",
    step: 3,
  },
};

const MapFocus = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { duration: 1 });
    }
  }, [position, map]);

  return null;
};

const getPosition = (latitude, longitude) => {
  if (
    latitude == null ||
    longitude == null ||
    String(latitude).trim() === "" ||
    String(longitude).trim() === ""
  ) {
    return null;
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return null;
  }

  return [lat, lng];
};

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const getAddress = (...parts) =>
  parts.filter((value) => value && String(value).trim()).join(", ");

const DeliveryActive = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    delivery,
    fetchLoading,
    actionLoading,
    actionType,
    error,
    actionError,
    otpSent,
    otpExpiresAt,
  } = useSelector((state) => state.deliveryActiveOrder) || {};
  const { location: agentLocation, error: locationError } =
    useSelector((state) => state.deliveryLocation) || {};
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [cashCollected, setCashCollected] = useState(false);

  useEffect(() => {
    dispatch(getActiveDelivery());
  }, [dispatch]);

  const restaurant = useMemo(() => {
    if (!delivery) return null;

    return {
      name: delivery.restaurantName,
      phone: delivery.restaurantPhone,
      address: getAddress(
        delivery.restaurantAddress,
        delivery.restaurantCity,
        delivery.restaurantState,
        delivery.restaurantPincode
      ),
      latitude: delivery.restaurantLatitude,
      longitude: delivery.restaurantLongitude,
    };
  }, [delivery]);

  const customer = useMemo(() => {
    if (!delivery) return null;

    return {
      name: delivery.customerName,
      phone: delivery.customerPhone,
      address: getAddress(
        delivery.deliveryAddress,
        delivery.landmark,
        delivery.deliveryCity,
        delivery.deliveryState,
        delivery.deliveryPincode
      ),
      latitude: delivery.deliveryLatitude,
      longitude: delivery.deliveryLongitude,
    };
  }, [delivery]);

  const goingToRestaurant = delivery?.status === "DELIVERY_ASSIGNED";

  const destination = goingToRestaurant ? restaurant : customer;

  const destinationPosition = destination
    ? getPosition(destination.latitude, destination.longitude)
    : null;

  const agentPosition = agentLocation
    ? getPosition(agentLocation.latitude, agentLocation.longitude)
    : null;

  const routeLine =
    agentPosition && destinationPosition
      ? [agentPosition, destinationPosition]
      : [];

  const totalItems =
    delivery?.items?.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    ) || 0;

  const status = statusConfig[delivery?.status] || {
    label: delivery?.status || "Active",
    variant: "neutral",
    step: 0,
  };

  const handleNavigation = () => {
    if (!destinationPosition) return;

    const [latitude, longitude] = destinationPosition;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCall = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handlePickup = async () => {
    if (!delivery?.orderNumber || actionLoading) return;

    try {
      await dispatch(pickupDelivery(delivery.orderNumber)).unwrap();
    } catch {
      // thunk already handles error/toast
    }
  };

  const handleStartDelivery = async () => {
    if (!delivery?.orderNumber || actionLoading) return;

    try {
      await dispatch(startDelivery(delivery.orderNumber)).unwrap();
    } catch {
      // thunk already handles error/toast
    }
  };

  const handleCompleteDelivery = async (values) => {
    if (!delivery?.orderNumber) return;

    try {
      await dispatch(
        completeDelivery({
          orderNumber: delivery.orderNumber,
          otp: values.otp,
          cashCollected,
        })
      ).unwrap();

      setOtpModalOpen(false);
      navigate("/delivery/history", { replace: true });
    } catch {
      // Wrong/expired OTP error thunk already show karega
    }
  };

  if (fetchLoading && !delivery) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Active Delivery"
          description="Manage your current delivery."
        />

        <Skeleton width="w-full" height="h-40" rounded="rounded-[1.5rem]" />

        <Skeleton
          width="w-full"
          height="h-[450px]"
          rounded="rounded-[1.5rem]"
        />
      </div>
    );
  }

  if (error && !delivery) {
    return (
      <ErrorState
        title="Unable to load active delivery"
        description={
          typeof error === "string"
            ? error
            : "Something went wrong while loading your delivery."
        }
        onRetry={() => dispatch(getActiveDelivery())}
      />
    );
  }

  if (!delivery) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Active Delivery"
          description="Manage your current delivery."
        />

        <EmptyState
          icon={Bike}
          title="No active delivery"
          description="You do not have an active order right now."
          action={
            <Button type="button" onClick={() => navigate("/delivery/offers")}>
              View Delivery Offers
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Active Delivery"
          description={`Complete order ${delivery.orderNumber} safely and update each delivery step.`}
        />

        <StatusBadge variant={status.variant} size="sm" dot>
          {status.label}
        </StatusBadge>
      </div>

      {(actionError || locationError) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          {actionError || locationError}
        </div>
      )}

      <DeliveryProgress currentStatus={delivery.status} />

      {delivery.status === "OUT_FOR_DELIVERY" && (
        <section className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

          <div>
            <p className="font-black text-emerald-900">
              Delivery OTP Verification
            </p>

            <p className="mt-1 text-sm leading-6 text-emerald-700">
              {otpSent
                ? "OTP has been sent to the customer's registered email."
                : "Ask the customer for the delivery OTP sent to their registered email."}
            </p>

            {otpExpiresAt && (
              <p className="mt-1 text-xs font-bold text-emerald-700">
                OTP expires at{" "}
                {new Date(otpExpiresAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard icon={PackageCheck} label="Items" value={totalItems} />

        <SummaryCard
          icon={IndianRupee}
          label="Order Amount"
          value={formatPrice(delivery.totalAmount)}
        />

        <SummaryCard
          icon={Clock3}
          label="Payment"
          value={delivery.paymentMethod || "-"}
        />
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-orange-500">
              Current Destination
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-950">
              {goingToRestaurant
                ? "Navigate to Restaurant"
                : "Navigate to Customer"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {destination?.address || "Address unavailable"}
            </p>
          </div>

          <Button
            type="button"
            onClick={handleNavigation}
            disabled={!destinationPosition}
          >
            <span className="inline-flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Start Navigation
            </span>
          </Button>
        </div>

        <div className="grid gap-3 border-t border-slate-100 px-5 py-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold text-slate-500">
              Your GPS coordinates
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {agentPosition
                ? `${agentPosition[0].toFixed(6)}, ${agentPosition[1].toFixed(
                    6
                  )}`
                : "Waiting for GPS location..."}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500">
              {goingToRestaurant
                ? "Restaurant coordinates"
                : "Customer delivery coordinates"}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {destinationPosition
                ? `${destinationPosition[0].toFixed(
                    6
                  )}, ${destinationPosition[1].toFixed(6)}`
                : "Destination coordinates unavailable"}
            </p>
          </div>
        </div>

        <DeliveryTrackingMap
          agent={agentPosition}
          destination={destinationPosition}
          destinationLabel={
            goingToRestaurant
              ? "Pickup restaurant"
              : "Customer delivery address"
          }
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ContactCard
          icon={Store}
          title="Pickup Restaurant"
          name={restaurant?.name}
          address={restaurant?.address}
          phone={restaurant?.phone}
          onCall={() => handleCall(restaurant?.phone)}
        />

        <ContactCard
          icon={UserRound}
          title="Customer"
          name={customer?.name}
          address={customer?.address}
          phone={customer?.phone}
          onCall={() => handleCall(customer?.phone)}
        />
      </section>

      {delivery.items?.length > 0 && (
        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-black text-slate-950">Order Items</h2>

          <div className="mt-4 divide-y divide-slate-100">
            {delivery.items.map((item) => (
              <div
                key={`${item.slug}-${item.name}`}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-900">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>

                <p className="shrink-0 font-black text-slate-900">
                  {formatPrice(item.itemTotal)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-950">
              Update Delivery
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete the current step before moving to the next one.
            </p>
          </div>

          {delivery.status === "DELIVERY_ASSIGNED" && (
            <Button
              type="button"
              onClick={handlePickup}
              disabled={actionLoading}
              loading={actionLoading && actionType === "PICKUP"}
            >
              <span className="inline-flex items-center gap-2">
                <PackageCheck className="h-4 w-4" />
                Confirm Pickup
              </span>
            </Button>
          )}

          {delivery.status === "PICKED_UP" && (
            <Button
              type="button"
              onClick={handleStartDelivery}
              disabled={actionLoading}
              loading={actionLoading && actionType === "START"}
            >
              <span className="inline-flex items-center gap-2">
                <Bike className="h-4 w-4" />
                Start Delivery
              </span>
            </Button>
          )}

          {delivery.status === "OUT_FOR_DELIVERY" && (
            <Button
              type="button"
              onClick={() => setOtpModalOpen(true)}
              disabled={actionLoading}
            >
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Verify OTP & Deliver
              </span>
            </Button>
          )}
        </div>
      </section>

      <Modal
        open={otpModalOpen}
        onClose={() => {
          if (!actionLoading) {
            setOtpModalOpen(false);
          }
        }}
        title="Verify Delivery OTP"
        description="Ask the customer for the OTP sent to their registered email. Delivery will complete only after successful verification."
      >
        <CommonForm
          key={delivery.orderNumber}
          beforeFields={
            delivery.paymentMethod === "COD" ? (
              <div className="mb-4 rounded-xl bg-orange-50 p-4">
                <Checkbox
                  checked={cashCollected}
                  onChange={(event) => setCashCollected(event.target.checked)}
                  label={`I collected ₹${Number(delivery.totalAmount).toFixed(
                    2
                  )} in cash`}
                  description="Confirm only after receiving the customer's cash payment."
                />
              </div>
            ) : null
          }
          fields={deliveryOtpFields}
          schema={deliveryOtpSchema}
          defaultValues={deliveryOtpDefaultValues}
          onSubmit={handleCompleteDelivery}
          onCancel={() => setOtpModalOpen(false)}
          loading={actionLoading && actionType === "COMPLETE"}
          submitText="Verify & Complete Delivery"
          columns={1}
        />
      </Modal>
    </div>
  );
};

const DeliveryProgress = ({ currentStatus }) => {
  const steps = [
    {
      status: "DELIVERY_ASSIGNED",
      title: "Assigned",
      icon: Store,
    },
    {
      status: "PICKED_UP",
      title: "Picked Up",
      icon: PackageCheck,
    },
    {
      status: "OUT_FOR_DELIVERY",
      title: "On The Way",
      icon: Bike,
    },
  ];

  const order = ["DELIVERY_ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY"];

  const currentIndex = order.indexOf(currentStatus);

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const completed = index <= currentIndex;

        return (
          <div
            key={step.status}
            className={`flex items-center gap-3 rounded-2xl border p-4 ${
              completed
                ? "border-orange-200 bg-orange-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                completed
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {index < currentIndex ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Icon className="h-5 w-5" />
              )}
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-slate-400">
                Step {index + 1}
              </p>

              <p className="font-black text-slate-900">{step.title}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
};

const SummaryCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-xs font-bold uppercase text-slate-400">{label}</p>

        <p className="mt-1 font-black text-slate-950">{value}</p>
      </div>
    </div>
  </div>
);

const ContactCard = ({ icon: Icon, title, name, address, phone, onCall }) => (
  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {title}
        </p>

        <h3 className="mt-1 text-lg font-black text-slate-950">
          {name || "-"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {address || "Address unavailable"}
        </p>

        {phone && (
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={onCall}
          >
            <span className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call
            </span>
          </Button>
        )}
      </div>
    </div>
  </div>
);

export default DeliveryActive;
