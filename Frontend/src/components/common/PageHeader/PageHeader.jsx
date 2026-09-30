const PageHeader = ({
    title,
    description = "",

    actions = null,

    children = null,

    className = "",
}) => {
    return (
        <div
            className={`
        w-full
        space-y-4
        ${className}
      `}
        >
            <div
                className="
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-start
          sm:justify-between
        "
            >
                {/* =====================
            TITLE AREA
        ===================== */}
                <div className="min-w-0">
                    {title && (
                        <h1
                            className="
                text-2xl
                font-bold
                tracking-tight
                text-gray-900

                sm:text-3xl
              "
                        >
                            {title}
                        </h1>
                    )}

                    {description && (
                        <p
                            className="
                mt-1.5
                max-w-2xl
                text-sm
                leading-6
                text-gray-500

                sm:text-base
              "
                        >
                            {description}
                        </p>
                    )}
                </div>


                {/* =====================
            PAGE ACTIONS
        ===================== */}
                {actions && (
                    <div
                        className="
              flex
              shrink-0
              flex-wrap
              gap-2

              sm:justify-end
            "
                    >
                        {actions}
                    </div>
                )}
            </div>


            {/* =====================
          OPTIONAL EXTRA CONTENT
      ===================== */}
            {children && (
                <div>
                    {children}
                </div>
            )}
        </div>
    );
};

export default PageHeader;