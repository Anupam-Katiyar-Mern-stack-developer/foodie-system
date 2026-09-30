const Card = ({
    children,

    title = "",
    description = "",

    headerAction = null,

    footer = null,

    padding = "md",

    shadow = "sm",

    hover = false,

    className = "",
    headerClassName = "",
    bodyClassName = "",
    footerClassName = "",
}) => {
    const paddings = {
        none: "",

        sm: "p-3 sm:p-4",

        md: "p-4 sm:p-5",

        lg: "p-5 sm:p-6",
    };


    const shadows = {
        none: "",

        sm: "shadow-sm",

        md: "shadow-md",
    };


    return (
        <div
            className={`
        w-full
        overflow-hidden

        rounded-xl
        border
        border-gray-200
        bg-white

        ${shadows[shadow] || shadows.sm}

        ${hover
                    ? `
              transition
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
            `
                    : ""
                }

        ${className}
      `}
        >
            {/* =====================
          HEADER
      ===================== */}
            {(title ||
                description ||
                headerAction) && (
                    <div
                        className={`
            flex
            items-start
            justify-between
            gap-4

            border-b
            border-gray-100

            px-4
            py-4

            sm:px-5

            ${headerClassName}
          `}
                    >
                        <div className="min-w-0">
                            {title && (
                                <h3
                                    className="
                  text-base
                  font-semibold
                  text-gray-900

                  sm:text-lg
                "
                                >
                                    {title}
                                </h3>
                            )}

                            {description && (
                                <p
                                    className="
                  mt-1
                  text-sm
                  leading-6
                  text-gray-500
                "
                                >
                                    {description}
                                </p>
                            )}
                        </div>


                        {headerAction && (
                            <div className="shrink-0">
                                {headerAction}
                            </div>
                        )}
                    </div>
                )}


            {/* =====================
          BODY
      ===================== */}
            <div
                className={`
          ${paddings[padding] || paddings.md}

          ${bodyClassName}
        `}
            >
                {children}
            </div>


            {/* =====================
          FOOTER
      ===================== */}
            {footer && (
                <div
                    className={`
            border-t
            border-gray-100

            px-4
            py-4

            sm:px-5

            ${footerClassName}
          `}
                >
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;