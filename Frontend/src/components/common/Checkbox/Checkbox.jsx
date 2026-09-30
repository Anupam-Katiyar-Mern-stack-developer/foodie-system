import {
    forwardRef,
    useId,
} from "react";

const Checkbox = forwardRef(
    (
        {
            label,
            description = "",
            error = "",

            required = false,
            disabled = false,

            id,

            className = "",
            wrapperClassName = "",

            ...props
        },
        ref
    ) => {
        const generatedId = useId();

        const checkboxId =
            id || `checkbox-${generatedId}`;

        const descriptionId =
            `${checkboxId}-description`;

        const errorId =
            `${checkboxId}-error`;

        const hasError =
            Boolean(error);

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
            items-start
            gap-3
          "
                >
                    {/* Checkbox */}
                    <input
                        ref={ref}
                        id={checkboxId}
                        type="checkbox"

                        disabled={disabled}
                        required={required}

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

                        className={`
              mt-0.5
              h-5
              w-5
              shrink-0

              cursor-pointer

              rounded
              border-gray-300

              text-orange-500

              accent-orange-500

              focus:ring-2
              focus:ring-orange-500/20
              focus:ring-offset-1

              disabled:cursor-not-allowed
              disabled:opacity-50

              ${className}
            `}

                        {...props}
                    />


                    {/* Label + Description */}
                    {(label || description) && (
                        <div className="min-w-0 flex-1">
                            {label && (
                                <label
                                    htmlFor={checkboxId}
                                    className={`
                    block
                    cursor-pointer
                    text-sm
                    font-medium

                    ${disabled
                                            ? "cursor-not-allowed text-gray-400"
                                            : "text-gray-800"
                                        }
                  `}
                                >
                                    {label}

                                    {required && (
                                        <span
                                            className="ml-1 text-red-500"
                                            aria-hidden="true"
                                        >
                                            *
                                        </span>
                                    )}
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
                </div>


                {/* Validation Error */}
                {hasError && (
                    <p
                        id={errorId}
                        className="
              mt-1.5
              pl-8
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

Checkbox.displayName = "Checkbox";

export default Checkbox;