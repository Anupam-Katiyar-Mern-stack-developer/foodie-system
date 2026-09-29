import {
    forwardRef,
    useId,
} from "react";

const Input = forwardRef(
    (
        {
            label,
            type = "text",

            error = "",
            helperText = "",

            required = false,
            disabled = false,
            readOnly = false,

            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            rightElement,
            
            id,
            className = "",
            wrapperClassName = "",

            ...props
        },
        ref
    ) => {
        const generatedId = useId();

        const inputId =
            id || `input-${generatedId}`;

        const helperId =
            `${inputId}-helper`;

        const errorId =
            `${inputId}-error`;

        const hasError =
            Boolean(error);

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
                        htmlFor={inputId}
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


                {/* Input Wrapper */}
                <div className="relative">
                    {LeftIcon && (
                        <div
                            className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                flex
                items-center
                pl-3
                text-gray-400
              "
                        >
                            <LeftIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                        </div>
                    )}


                    <input
                        ref={ref}
                        id={inputId}
                        type={type}
                        disabled={disabled}
                        readOnly={readOnly}
                        required={required}
                        aria-invalid={
                            hasError
                                ? "true"
                                : "false"
                        }
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
              text-sm
              text-gray-900
              outline-none
              transition
              duration-200

              placeholder:text-gray-400

              focus:ring-2
              focus:ring-offset-0

              disabled:cursor-not-allowed
              disabled:bg-gray-100
              disabled:text-gray-500

              read-only:bg-gray-50

              ${LeftIcon
                                ? "pl-10"
                                : ""
                            }

              ${RightIcon
                                ? "pr-10"
                                : ""
                            }

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
                    />


                    {RightIcon && (
                        <div
                            className="
                pointer-events-none
                absolute
                inset-y-0
                right-0
                flex
                items-center
                pr-3
                text-gray-400
              "
                        >
                            <RightIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                        </div>
                    )}
                </div>


                {/* Validation Error */}
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


                {/* Helper Text */}
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

Input.displayName = "Input";

export default Input;