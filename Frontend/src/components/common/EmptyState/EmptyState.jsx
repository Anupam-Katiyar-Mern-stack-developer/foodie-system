const EmptyState = ({
    icon: Icon,

    title = "No data found",
    description = "",

    action = null,

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
              bg-gray-100
            "
                    >
                        <Icon
                            className="
                h-6
                w-6
                text-gray-500
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


                {/* Action */}
                {action && (
                    <div className="mt-5">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmptyState;