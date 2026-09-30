import {
    forwardRef,
    useId,
} from "react";

const Switch = forwardRef(
    (
        {
            label,
            description = "",

            checked = false,

            disabled = false,
            loading = false,

            error = "",

            onChange,

            id,

            className = "",
            wrapperClassName = "",

            ...props
        },
        ref
    ) => {
        const generatedId = useId();

        const switchId =
            id || `switch-${generatedId}`;

        const descriptionId =
            `${switchId}-description`;

        const errorId =
            `${switchId}-error`;

        const hasError =
            Boolean(error);

        const isDisabled =
            disabled || loading;


        const handleChange = (
            event
        ) => {
            if (isDisabled) return;

            onChange?.(
                event.target.checked,
                event
            );
        };


        return (
            <div
                className={`
          w-full
          ${wrapperClassName}
        `}
            >
                <div
                    className="
            flex
            items-center
            justify-between
            gap-4
          "
                >
                    {/* Label */}
                    {(label || description) && (
                        <div className="min-w-0 flex-1">
                            {label && (
                                <label
                                    htmlFor={switchId}
                                    className={`
                    block
                    text-sm
                    font-medium

                    ${isDisabled
                                            ? "text-gray-400"
                                            : "text-gray-800"
                                        }
                  `}
                                >
                                    {label}
                                </label>
                            )}


                            {description && (
                                <p
                                    id={descriptionId}
                                    className="
                    mt-0.5
                    text-sm
                    leading-5
                    text-gray-500
                  "
                                >
                                    {description}
                                </p>
                            )}
                        </div>
                    )}


                    {/* Switch */}
                    <label
                        htmlFor={switchId}
                        className={`
              relative
              inline-flex
              shrink-0
              items-center

              ${isDisabled
                                ? "cursor-not-allowed opacity-60"
                                : "cursor-pointer"
                            }

              ${className}
            `}
                    >
                        <input
                            ref={ref}

                            id={switchId}

                            type="checkbox"

                            role="switch"

                            checked={checked}

                            disabled={isDisabled}

                            aria-checked={checked}

                            aria-busy={loading}

                            aria-invalid={
                                hasError
                                    ? "true"
                                    : "false"
                            }

                            aria-describedby={
                                hasError
                                    ? errorId
                                    : description
                                        ? descriptionId
                                        : undefined
                            }

                            onChange={
                                handleChange
                            }

                            className="peer sr-only"

                            {...props}
                        />


                        {/* Track */}
                        <span
                            className={`
                relative
                h-6
                w-11
                rounded-full

                bg-gray-300

                transition-colors
                duration-200

                peer-checked:bg-orange-500

                peer-focus-visible:ring-2
                peer-focus-visible:ring-orange-500/30
                peer-focus-visible:ring-offset-2
              `}
                        >
                            {/* Thumb */}
                            <span
                                className={`
                  absolute
                  left-0.5
                  top-0.5

                  flex
                  h-5
                  w-5
                  items-center
                  justify-center

                  rounded-full
                  bg-white

                  shadow-sm

                  transition-transform
                  duration-200

                  ${checked
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    }
                `}
                            >
                                {loading && (
                                    <span
                                        className="
                      h-3
                      w-3
                      animate-spin
                      rounded-full
                      border
                      border-gray-400
                      border-t-transparent
                    "
                                        aria-hidden="true"
                                    />
                                )}
                            </span>
                        </span>
                    </label>
                </div>


                {/* Error */}
                {hasError && (
                    <p
                        id={errorId}
                        className="
              mt-1.5
              text-sm
              text-red-600
            "
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Switch.displayName = "Switch";

export default Switch;