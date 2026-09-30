const StatusBadge = ({
    children,

    variant = "neutral",

    size = "md",

    dot = false,

    className = "",
}) => {
    const variants = {
        neutral:
            "bg-gray-100 text-gray-700 ring-gray-200",

        info:
            "bg-blue-50 text-blue-700 ring-blue-200",

        warning:
            "bg-amber-50 text-amber-700 ring-amber-200",

        success:
            "bg-green-50 text-green-700 ring-green-200",

        danger:
            "bg-red-50 text-red-700 ring-red-200",

        purple:
            "bg-purple-50 text-purple-700 ring-purple-200",
    };


    const dotColors = {
        neutral: "bg-gray-500",
        info: "bg-blue-500",
        warning: "bg-amber-500",
        success: "bg-green-500",
        danger: "bg-red-500",
        purple: "bg-purple-500",
    };


    const sizes = {
        sm: "px-2 py-0.5 text-xs",

        md: "px-2.5 py-1 text-xs",

        lg: "px-3 py-1.5 text-sm",
    };


    const selectedVariant =
        variants[variant] ||
        variants.neutral;


    const selectedDotColor =
        dotColors[variant] ||
        dotColors.neutral;


    return (
        <span
            className={`
        inline-flex
        w-fit
        items-center
        gap-1.5

        rounded-full

        font-medium

        ring-1
        ring-inset

        ${selectedVariant}

        ${sizes[size] || sizes.md}

        ${className}
      `}
        >
            {dot && (
                <span
                    className={`
            h-1.5
            w-1.5
            shrink-0
            rounded-full
            ${selectedDotColor}
          `}
                    aria-hidden="true"
                />
            )}

            <span>
                {children}
            </span>
        </span>
    );
};

export default StatusBadge;