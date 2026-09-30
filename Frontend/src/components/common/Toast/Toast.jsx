import {
    AlertCircle,
    CheckCircle2,
    Info,
    TriangleAlert,
    X,
} from "lucide-react";


const Toast = ({
    toast,
    onClose,
}) => {
    const variants = {
        success: {
            icon: CheckCircle2,
            wrapper:
                "border-green-200 bg-green-50",
            iconColor:
                "text-green-600",
        },

        error: {
            icon: AlertCircle,
            wrapper:
                "border-red-200 bg-red-50",
            iconColor:
                "text-red-600",
        },

        warning: {
            icon: TriangleAlert,
            wrapper:
                "border-amber-200 bg-amber-50",
            iconColor:
                "text-amber-600",
        },

        info: {
            icon: Info,
            wrapper:
                "border-blue-200 bg-blue-50",
            iconColor:
                "text-blue-600",
        },
    };


    const selectedVariant =
        variants[toast.type] ||
        variants.info;


    const Icon =
        selectedVariant.icon;


    return (
        <div
            role={
                toast.type === "error"
                    ? "alert"
                    : "status"
            }

            className={`
        pointer-events-auto

        flex
        w-full
        items-start
        gap-3

        rounded-xl
        border

        p-4

        shadow-lg
        shadow-black/5

        ${selectedVariant.wrapper}
      `}
        >
            {/* Icon */}
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


            {/* Content */}
            <div
                className="
          min-w-0
          flex-1
        "
            >
                {toast.title && (
                    <p
                        className="
              text-sm
              font-semibold
              text-gray-900
            "
                    >
                        {toast.title}
                    </p>
                )}


                {toast.message && (
                    <p
                        className={`
              text-sm
              leading-5
              text-gray-600

              ${toast.title
                                ? "mt-1"
                                : ""
                            }
            `}
                    >
                        {toast.message}
                    </p>
                )}
            </div>


            {/* Close */}
            <button
                type="button"

                onClick={() =>
                    onClose(toast.id)
                }

                aria-label="Close notification"

                className="
          inline-flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center

          rounded-lg

          text-gray-400

          transition

          hover:bg-black/5
          hover:text-gray-700

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
        </div>
    );
};


export default Toast;