import {
    AlertTriangle,
    RefreshCw,
} from "lucide-react";

import Button from "../Button/Button";

const ErrorState = ({
    title = "Something went wrong",

    description =
    "We couldn't load the data. Please try again.",

    onRetry,

    retryText = "Try Again",

    retryLoading = false,

    icon: Icon = AlertTriangle,

    className = "",
}) => {
    return (
        <div
            className={`
        flex
        min-h-64
        w-full
        items-center
        justify-center
        px-4
        py-10
        ${className}
      `}
            role="alert"
        >
            <div
                className="
          mx-auto
          flex
          max-w-md
          flex-col
          items-center
          text-center
        "
            >
                {/* Icon */}
                {Icon && (
                    <div
                        className="
              mb-4
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-red-50
            "
                    >
                        <Icon
                            className="
                h-6
                w-6
                text-red-500
              "
                            aria-hidden="true"
                        />
                    </div>
                )}


                {/* Title */}
                <h3
                    className="
            text-lg
            font-semibold
            text-gray-900
            sm:text-xl
          "
                >
                    {title}
                </h3>


                {/* Description */}
                {description && (
                    <p
                        className="
              mt-2
              text-sm
              leading-6
              text-gray-500
              sm:text-base
            "
                    >
                        {description}
                    </p>
                )}


                {/* Retry */}
                {onRetry && (
                    <div className="mt-5">
                        <Button
                            variant="outline"

                            loading={retryLoading}

                            loadingText="Retrying..."

                            leftIcon={RefreshCw}

                            onClick={onRetry}
                        >
                            {retryText}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ErrorState;