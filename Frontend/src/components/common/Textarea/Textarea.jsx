import {
    forwardRef,
    useId,
} from "react";

const Textarea = forwardRef(
    (
        {
            label,

            error = "",
            helperText = "",

            required = false,
            disabled = false,
            readOnly = false,

            rows = 4,

            maxLength,

            showCharacterCount = false,

            value,

            id,
            className = "",
            wrapperClassName = "",

            ...props
        },
        ref
    ) => {
        const generatedId = useId();

        const textareaId =
            id || `textarea-${generatedId}`;

        const errorId =
            `${textareaId}-error`;

        const helperId =
            `${textareaId}-helper`;

        const hasError =
            Boolean(error);

        const currentLength =
            typeof value === "string"
                ? value.length
                : 0;

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
                        htmlFor={textareaId}
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


                {/* Textarea */}
                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={rows}

                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}

                    maxLength={maxLength}

                    value={value}

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
            w-full
            resize-y
            rounded-lg
            border
            bg-white
            px-3
            py-2.5
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


                {/* Bottom Row */}
                <div
                    className="
            mt-1.5
            flex
            items-start
            justify-between
            gap-3
          "
                >
                    <div className="min-w-0">
                        {hasError && (
                            <p
                                id={errorId}
                                className="
                  text-sm
                  text-red-600
                "
                                role="alert"
                            >
                                {error}
                            </p>
                        )}

                        {!hasError &&
                            helperText && (
                                <p
                                    id={helperId}
                                    className="
                    text-sm
                    text-gray-500
                  "
                                >
                                    {helperText}
                                </p>
                            )}
                    </div>


                    {showCharacterCount &&
                        maxLength && (
                            <span
                                className="
                  shrink-0
                  text-xs
                  text-gray-400
                "
                            >
                                {currentLength}/{maxLength}
                            </span>
                        )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

export default Textarea;