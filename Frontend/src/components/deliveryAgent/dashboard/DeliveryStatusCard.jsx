import {
  Bike,
  Loader2,
} from "lucide-react";

import StatusBadge from "../../common/StatusBadge/StatusBadge";

const DeliveryStatusCard = ({
  isOnline = false,
  onToggle,
  loading = false,
}) => {
  return (
    <section className="rounded-[1.5rem] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-orange-50 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Bike className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-950">
                Delivery Status
              </h2>

              <StatusBadge
                variant={
                  isOnline
                    ? "success"
                    : "neutral"
                }
                size="sm"
                dot
              >
                {isOnline
                  ? "Online"
                  : "Offline"}
              </StatusBadge>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {isOnline
                ? "You're available for delivery assignments."
                : "You're currently unavailable for delivery assignments."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          disabled={loading}
          aria-label="Change delivery online status"
          className={`
            relative
            h-8
            w-16
            rounded-full
            transition

            ${
              isOnline
                ? "bg-emerald-500"
                : "bg-slate-300"
            }

            ${
              loading
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
            }
          `}
        >
          {loading ? (
            <Loader2
              className="
                absolute
                left-1/2
                top-1/2
                h-4
                w-4
                -translate-x-1/2
                -translate-y-1/2
                animate-spin
                text-white
              "
            />
          ) : (
            <span
              className={`
                absolute
                top-1
                h-6
                w-6
                rounded-full
                bg-white
                shadow-sm
                transition-all

                ${
                  isOnline
                    ? "left-9"
                    : "left-1"
                }
              `}
            />
          )}
        </button>
      </div>
    </section>
  );
};

export default DeliveryStatusCard;