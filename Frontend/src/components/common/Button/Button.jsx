import { forwardRef } from "react";

const Button = forwardRef(
    (
        {
            children,
            type = "button",

            variant = "primary",
            size = "md",

            loading = false,
            loadingText = "Please wait...",

            disabled = false,
            fullWidth = false,

            leftIcon: LeftIcon,
            rightIcon: RightIcon,

            className = "",
            ...props
        },
        ref
    ) => {
        const variants = {
            primary:
                "bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500",

            secondary:
                "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400",

            outline:
                "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 focus-visible:ring-gray-400",

            danger:
                "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",

            ghost:
                "bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400",
        };

        const sizes = {
            sm: "min-h-9 px-3 text-sm",
            md: "min-h-11 px-4 text-sm sm:px-5",
            lg: "min-h-12 px-5 text-base sm:px-6",
        };

        const isDisabled =
            disabled || loading;

        return (
            <button
                ref={ref}
                type={type}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                aria-busy={loading}
                className={`
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-lg
          font-medium
          transition-all
          duration-200

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-offset-2

          disabled:pointer-events-none
          disabled:cursor-not-allowed
          disabled:opacity-60

          ${variants[variant] || variants.primary}
          ${sizes[size] || sizes.md}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
                {...props}
            >
                {loading ? (
                    <>
                        <span
                            className="
                h-4
                w-4
                shrink-0
                animate-spin
                rounded-full
                border-2
                border-current
                border-t-transparent
              "
                            aria-hidden="true"
                        />

                        <span>
                            {loadingText}
                        </span>
                    </>
                ) : (
                    <>
                        {LeftIcon && (
                            <LeftIcon
                                className="h-4 w-4 shrink-0"
                                aria-hidden="true"
                            />
                        )}

                        <span>{children}</span>

                        {RightIcon && (
                            <RightIcon
                                className="h-4 w-4 shrink-0"
                                aria-hidden="true"
                            />
                        )}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;