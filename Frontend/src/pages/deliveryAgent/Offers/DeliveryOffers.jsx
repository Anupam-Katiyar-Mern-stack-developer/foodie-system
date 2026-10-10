import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Bike,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MapPin,
  PackageOpen,
  Store,
  XCircle,
} from "lucide-react";

import PageHeader from "../../../components/common/PageHeader/PageHeader";
import StatCard from "../../../components/common/StatCard/StatCard";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import Button from "../../../components/common/Button/Button";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ConfirmModal from "../../../components/common/ConfirmModal/ConfirmModal";

import {
  getDeliveryOffer,
  acceptDeliveryOffer,
  rejectDeliveryOffer,
} from "../../../redux/thunks/deliveryAgent/deliveryOffer.thunk";

const DeliveryOffers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =========================================
  // REDUX
  // =========================================

  const {
    offers = [],
    fetchLoading,
    actionLoading,
    error,
    actionError,
  } = useSelector((state) => state.deliveryOffer) || {};

  // =========================================
  // MODAL STATE
  // =========================================

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalType, setModalType] = useState(null);

  // =========================================
  // FETCH OFFER
  // =========================================

  useEffect(() => {
    dispatch(getDeliveryOffer());
  }, [dispatch]);

  // =========================================
  // STATS
  // =========================================

  const stats = useMemo(() => {
    const totalOrderAmount = offers.reduce(
      (total, offer) => total + Number(offer.totalAmount || 0),
      0
    );

    const totalItems = offers.reduce(
      (total, offer) => total + Number(offer.totalItems || 0),
      0
    );

    return [
      {
        key: "offers",
        title: "Available Offers",
        value: offers.length,
        description: "Ready to accept",
        icon: PackageOpen,
        variant: "orange",
      },
      {
        key: "amount",
        title: "Order Value",
        value: `₹${totalOrderAmount.toFixed(0)}`,
        description: "Current offer value",
        icon: IndianRupee,
        variant: "success",
      },
      {
        key: "items",
        title: "Total Items",
        value: totalItems,
        description: "Items to deliver",
        icon: PackageOpen,
        variant: "purple",
      },
      {
        key: "status",
        title: "Delivery Status",
        value: "Online",
        description: "Receiving offers",
        icon: Bike,
        variant: "success",
      },
    ];
  }, [offers]);

  // =========================================
  // ACCEPT OFFER
  // =========================================

  const handleAccept = async () => {
    if (!selectedOffer) return;

    const orderNumber = selectedOffer.orderNumber;

    try {
      await dispatch(acceptDeliveryOffer(orderNumber)).unwrap();

      setSelectedOffer(null);
      setModalType(null);

      navigate(`/delivery/active?order=${orderNumber}`);
    } catch (error) {
      console.error("ACCEPT DELIVERY ERROR:", error);
    }
  };

  // =========================================
  // REJECT OFFER
  // =========================================

  const handleReject = async () => {
    if (!selectedOffer) return;

    try {
      await dispatch(
        rejectDeliveryOffer(selectedOffer.orderNumber)
      ).unwrap();

      setSelectedOffer(null);
      setModalType(null);
    } catch (error) {
      console.error("REJECT DELIVERY ERROR:", error);
    }
  };

  // =========================================
  // MODAL CLOSE
  // =========================================

  const handleModalClose = () => {
    if (actionLoading) return;

    setSelectedOffer(null);
    setModalType(null);
  };

  // =========================================
  // OPEN ACCEPT MODAL
  // =========================================

  const openAcceptModal = (offer) => {
    setSelectedOffer(offer);
    setModalType("ACCEPT");
  };

  // =========================================
  // OPEN REJECT MODAL
  // =========================================

  const openRejectModal = (offer) => {
    setSelectedOffer(offer);
    setModalType("REJECT");
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="space-y-7">
      {/* HEADER */}

      <PageHeader
        title="Delivery Offers"
        description="View available delivery opportunities and choose the orders you want to deliver."
      />

      {/* ONLINE INFO */}

      <section className="rounded-[1.5rem] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-orange-50 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              <Bike className="h-5 w-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-black text-slate-950">
                  You're Online
                </h2>

                <StatusBadge variant="success" size="sm" dot>
                  Available
                </StatusBadge>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                New delivery offers will appear here while you're available.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/delivery/active")}
          >
            Active Delivery
          </Button>
        </div>
      </section>

      {/* ERROR */}

      {(error || actionError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {actionError || error}
        </div>
      )}

      {/* STATS */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            variant={stat.variant}
            loading={fetchLoading}
          />
        ))}
      </section>

      {/* AVAILABLE DELIVERIES */}

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Available Deliveries
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review pickup and delivery details before accepting.
            </p>
          </div>

          <p className="text-sm font-bold text-slate-500">
            {offers.length} offer{offers.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* LOADING */}

        {fetchLoading && offers.length === 0 && (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <Bike className="mx-auto h-8 w-8 animate-pulse text-orange-500" />

            <p className="mt-3 text-sm font-bold text-slate-500">
              Loading delivery offer...
            </p>
          </div>
        )}

        {/* EMPTY */}

        {!fetchLoading && offers.length === 0 && (
          <EmptyState
            icon={PackageOpen}
            title="No delivery offers"
            description="There are no new delivery offers available right now."
          />
        )}

        {/* OFFER CARDS */}

        {!fetchLoading && offers.length > 0 && (
          <div className="grid gap-5 xl:grid-cols-2">
            {offers.map((offer) => {
              const pickupAddress = [
                offer.restaurantAddress,
                offer.restaurantCity,
              ]
                .filter(Boolean)
                .join(", ");

              const deliveryAddress = [
                offer.deliveryCity,
                offer.deliveryPincode,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <article
                  key={offer.orderNumber}
                  className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:border-orange-200 hover:shadow-md"
                >
                  {/* OFFER HEADER */}

                  <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-black text-slate-950">
                          {offer.orderNumber}
                        </h3>

                        <StatusBadge variant="warning" size="sm" dot>
                          New Offer
                        </StatusBadge>
                      </div>

                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        Received {formatDate(offer.offeredAt)}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Order Amount
                      </p>

                      <p className="mt-1 text-2xl font-black text-emerald-600">
                        ₹{Number(offer.totalAmount || 0).toFixed(0)}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    {/* ROUTE */}

                    <div className="relative space-y-5">
                      <div className="absolute left-[19px] top-10 h-[55px] border-l-2 border-dashed border-slate-200" />

                      {/* PICKUP */}

                      <div className="relative flex gap-3">
                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                          <Store className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Pickup
                          </p>

                          <p className="mt-1 font-black text-slate-900">
                            {offer.restaurantName || "-"}
                          </p>

                          <p className="mt-1 text-sm leading-5 text-slate-500">
                            {pickupAddress || "Restaurant address unavailable"}
                          </p>
                        </div>
                      </div>

                      {/* DROP */}

                      <div className="relative flex gap-3">
                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                          <MapPin className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Deliver To
                          </p>

                          <p className="mt-1 font-black text-slate-900">
                            Delivery Address
                          </p>

                          <p className="mt-1 text-sm leading-5 text-slate-500">
                            {deliveryAddress || "Delivery address unavailable"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DELIVERY DETAILS */}

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <InfoCard
                        icon={PackageOpen}
                        value={offer.totalItems || 0}
                        label="Items"
                      />

                      <InfoCard
                        icon={IndianRupee}
                        value={`₹${Number(offer.totalAmount || 0).toFixed(0)}`}
                        label="Order Value"
                      />

                      <InfoCard
                        icon={Clock3}
                        value={formatDate(offer.expiresAt)}
                        label="Expires"
                      />

                      <InfoCard
                        icon={Bike}
                        value={offer.orderStatus || "-"}
                        label="Order Status"
                      />
                    </div>

                    {/* ACTIONS */}

                    <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={actionLoading}
                        onClick={() => openRejectModal(offer)}
                      >
                        <span className="inline-flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          Reject
                        </span>
                      </Button>

                      <Button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => openAcceptModal(offer)}
                      >
                        <span className="inline-flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Accept Delivery
                        </span>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ACCEPT MODAL */}

      <ConfirmModal
        open={modalType === "ACCEPT"}
        onClose={handleModalClose}
        title="Accept Delivery?"
        description={
          selectedOffer
            ? `Accept ${selectedOffer.orderNumber} from ${selectedOffer.restaurantName}?`
            : ""
        }
        confirmText="Accept Delivery"
        loading={actionLoading}
        onConfirm={handleAccept}
      />

      {/* REJECT MODAL */}

      <ConfirmModal
        open={modalType === "REJECT"}
        onClose={handleModalClose}
        title="Reject Delivery Offer?"
        description={
          selectedOffer
            ? `Are you sure you want to reject ${selectedOffer.orderNumber}?`
            : ""
        }
        confirmText="Reject Offer"
        variant="danger"
        loading={actionLoading}
        onConfirm={handleReject}
      />
    </div>
  );
};

// =========================================
// INFO CARD
// =========================================

const InfoCard = ({ icon: Icon, value, label }) => {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <Icon className="h-4 w-4 text-orange-500" />

      <p className="mt-2 break-words text-sm font-black text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-semibold text-slate-400">
        {label}
      </p>
    </div>
  );
};

export default DeliveryOffers;