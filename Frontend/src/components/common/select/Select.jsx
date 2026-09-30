import {
    forwardRef,
    useId,
} from "react";

const Select = forwardRef(
    (
        {
            label,

            options = [],

            placeholder = "Select an option",

            error = "",
            helperText = "",

            required = false,
            disabled = false,
            loading = false,

            id,

            className = "",
            wrapperClassName = "",

            ...props
        },
        ref
    ) => {
        const generatedId = useId();

        const selectId =
            id || `select-${generatedId}`;

        const errorId =
            `${selectId}-error`;

        const helperId =
            `${selectId}-helper`;

        const hasError =
            Boolean(error);

        const isDisabled =
            disabled || loading;

        return (
            <div
                className={`
          w-full
          ${wrapperClassName}
        `}
            >
                {/* Label */}
                {label && (
                    <label
                        htmlFor={selectId}
                        className="
              mb-1.5
              block
              text-sm
              font-medium
              text-gray-800
            "
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

                {/* Select */}
                <select
                    ref={ref}
                    id={selectId}

                    disabled={isDisabled}
                    required={required}

                    aria-invalid={
                        hasError
                            ? "true"
                            : "false"
                    }

                    aria-busy={loading}

                    aria-describedby={
                        hasError
                            ? errorId
                            : helperText
                                ? helperId
                                : undefined
                    }

                    className={`
            min-h-11
            w-full

            rounded-lg
            border

            bg-white

            px-3
            pr-10

            text-sm
            text-gray-900

            outline-none

            transition
            duration-200

            focus:ring-2
            focus:ring-offset-0

            disabled:cursor-not-allowed
            disabled:bg-gray-100
            disabled:text-gray-500

            ${hasError
                            ? `
                  border-red-500
                  focus:border-red-500
                  focus:ring-red-500/20
                `
                            : `
                  border-gray-300
                  focus:border-orange-500
                  focus:ring-orange-500/20
                `
                        }

            ${className}
          `}

                    {...props}
                >
                    {/* Placeholder */}
                    <option value="">
                        {loading
                            ? "Loading..."
                            : placeholder}
                    </option>


                    {/* Options */}
                    {!loading &&
                        options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={
                                    option.disabled || false
                                }
                            >
                                {option.label}
                            </option>
                        ))}
                </select>


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


                {/* Helper */}
                {!hasError &&
                    helperText && (
                        <p
                            id={helperId}
                            className="
                mt-1.5
                text-sm
                text-gray-500
              "
                        >
                            {helperText}
                        </p>
                    )}
            </div>
        );
    }
);

Select.displayName = "Select";

export default Select;