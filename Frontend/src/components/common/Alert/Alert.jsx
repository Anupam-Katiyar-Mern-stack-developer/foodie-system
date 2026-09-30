import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";


const Alert = ({
  type = "info",

  title = "",
  description = "",

  icon: CustomIcon,

  action = null,

  dismissible = false,
  onDismiss,

  className = "",
}) => {
  const variants = {
    info: {
      icon: Info,

      wrapper:
        "border-blue-200 bg-blue-50",

      iconColor:
        "text-blue-600",

      titleColor:
        "text-blue-900",
    },

    success: {
      icon: CheckCircle2,

      wrapper:
        "border-green-200 bg-green-50",

      iconColor:
        "text-green-600",

      titleColor:
        "text-green-900",
    },

    warning: {
      icon: TriangleAlert,

      wrapper:
        "border-amber-200 bg-amber-50",

      iconColor:
        "text-amber-600",

      titleColor:
        "text-amber-900",
    },

    error: {
      icon: AlertCircle,

      wrapper:
        "border-red-200 bg-red-50",

      iconColor:
        "text-red-600",

      titleColor:
        "text-red-900",
    },
  };


  const selectedVariant =
    variants[type] ||
    variants.info;


  const Icon =
    CustomIcon ||
    selectedVariant.icon;


  return (
    <div
      role={
        type === "error"
          ? "alert"
          : "status"
      }

      className={`
        flex
        w-full
        items-start
        gap-3

        rounded-xl
        border

        p-4

        ${selectedVariant.wrapper}

        ${className}
      `}
    >
      {/* Icon */}
      {Icon && (
        <Icon
          className={`
            mt-0.5
            h-5
            w-5
            shrink-0

            ${selectedVariant.iconColor}
          `}
          aria-hidden="true"
        />
      )}


      {/* Content */}
      <div className="min-w-0 flex-1">
        {title && (
          <p
            className={`
              text-sm
              font-semibold

              ${selectedVariant.titleColor}
            `}
          >
            {title}
          </p>
        )}


        {description && (
          <p
            className={`
              text-sm
              leading-6
              text-gray-600

              ${
                title
                  ? "mt-1"
                  : ""
              }
            `}
          >
            {description}
          </p>
        )}


        {/* Optional Action */}
        {action && (
          <div className="mt-3">
            {action}
          </div>
        )}
      </div>


      {/* Dismiss */}
      {dismissible &&
        onDismiss && (
          <button
            type="button"

            onClick={onDismiss}

            aria-label="Dismiss alert"

            className="
              inline-flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center

              rounded-lg

              text-gray-500

              transition

              hover:bg-black/5
              hover:text-gray-800

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-orange-500/30
            "
          >
            <X
              className="h-4 w-4"
              aria-hidden="true"
            />
          </button>
        )}
    </div>
  );
};


export default Alert;