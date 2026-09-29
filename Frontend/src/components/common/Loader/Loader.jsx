const Loader = ({
    text = "Loading...",
    size = "md",
    fullScreen = false,
    className = "",
}) => {
    const sizes = {
        sm: "h-5 w-5 border-2",
        md: "h-8 w-8 border-2",
        lg: "h-12 w-12 border-[3px]",
    };

    const spinnerSize =
        sizes[size] || sizes.md;

    return (
        <div
            className={`
        flex
        items-center
        justify-center

        ${fullScreen
                    ? "min-h-screen"
                    : "min-h-40"
                }

        ${className}
      `}
            role="status"
            aria-live="polite"
        >
            <div
                className="
          flex
          flex-col
          items-center
          justify-center
          gap-3
          text-center
        "
            >
                <span
                    className={`
            animate-spin
            rounded-full
            border-gray-300
            border-t-orange-500
            ${spinnerSize}
          `}
                    aria-hidden="true"
                />

                {text && (
                    <p
                        className="
              text-sm
              font-medium
              text-gray-500
              sm:text-base
            "
                    >
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Loader;