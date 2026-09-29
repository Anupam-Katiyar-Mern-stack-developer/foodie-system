import {
    forwardRef,
    useState,
} from "react";

import {
    Eye,
    EyeOff,
    LockKeyhole,
} from "lucide-react";

import Input from "../Input/Input";


const PasswordInput = forwardRef(
    (
        {
            label = "Password",

            error = "",
            helperText = "",

            required = false,
            disabled = false,

            showPasswordToggle = true,

            className = "",
            wrapperClassName = "",

            ...props
        },
        ref
    ) => {
        const [
            showPassword,
            setShowPassword,
        ] = useState(false);


        const handleTogglePassword = () => {
            if (disabled) return;

            setShowPassword(
                (previous) => !previous
            );
        };


        return (
            <Input
                ref={ref}

                type={
                    showPassword
                        ? "text"
                        : "password"
                }

                label={label}

                error={error}
                helperText={helperText}

                required={required}
                disabled={disabled}

                leftIcon={LockKeyhole}

                className={className}
                wrapperClassName={
                    wrapperClassName
                }

                rightElement={
                    showPasswordToggle ? (
                        <button
                            type="button"

                            onClick={
                                handleTogglePassword
                            }

                            disabled={disabled}

                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }

                            aria-pressed={
                                showPassword
                            }

                            className="
                inline-flex
                h-8
                w-8
                items-center
                justify-center
                rounded-md
                text-gray-500
                transition

                hover:bg-gray-100
                hover:text-gray-800

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-orange-500/40

                disabled:pointer-events-none
                disabled:opacity-50
              "
                        >
                            {showPassword ? (
                                <EyeOff
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Eye
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                            )}
                        </button>
                    ) : null
                }

                {...props}
            />
        );
    }
);


PasswordInput.displayName =
    "PasswordInput";


export default PasswordInput;