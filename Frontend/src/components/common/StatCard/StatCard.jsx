import {
    ArrowUpRight,
} from "lucide-react";

import Card from "../Card/Card";
import Skeleton from "../Skeleton/Skeleton";


const StatCard = ({
    title,

    value,

    icon: Icon,

    description = "",

    loading = false,

    variant = "primary",

    onClick,

    actionLabel = "",

    className = "",
}) => {
    const variants = {
        primary: {
            iconWrapper:
                "bg-orange-50 text-orange-600",
        },

        success: {
            iconWrapper:
                "bg-green-50 text-green-600",
        },

        warning: {
            iconWrapper:
                "bg-amber-50 text-amber-600",
        },

        danger: {
            iconWrapper:
                "bg-red-50 text-red-600",
        },

        info: {
            iconWrapper:
                "bg-blue-50 text-blue-600",
        },

        neutral: {
            iconWrapper:
                "bg-gray-100 text-gray-600",
        },
    };


    const selectedVariant =
        variants[variant] ||
        variants.primary;


    const isClickable =
        typeof onClick === "function";


    const handleKeyDown = (
        event
    ) => {
        if (!isClickable) return;

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();

            onClick();
        }
    };


    return (
        <Card
            padding="md"

            hover={isClickable}

            className={`
        ${isClickable
                    ? "cursor-pointer"
                    : ""
                }

        ${className}
      `}
        >
            <div
                role={
                    isClickable
                        ? "button"
                        : undefined
                }

                tabIndex={
                    isClickable
                        ? 0
                        : undefined
                }

                onClick={onClick}

                onKeyDown={
                    handleKeyDown
                }

                className="
          flex
          items-start
          justify-between
          gap-4
        "
            >
                {/* LEFT */}
                <div className="min-w-0 flex-1">
                    {loading ? (
                        <>
                            <Skeleton
                                width="w-24"
                                height="h-4"
                            />

                            <div className="mt-3">
                                <Skeleton
                                    width="w-20"
                                    height="h-8"
                                />
                            </div>

                            <div className="mt-3">
                                <Skeleton
                                    width="w-32"
                                    height="h-3"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <p
                                className="
                  text-sm
                  font-medium
                  text-gray-500
                "
                            >
                                {title}
                            </p>


                            <p
                                className="
                  mt-2
                  break-words
                  text-2xl
                  font-bold
                  tracking-tight
                  text-gray-900

                  sm:text-3xl
                "
                            >
                                {value ?? "-"}
                            </p>


                            {description && (
                                <p
                                    className="
                    mt-2
                    text-xs
                    leading-5
                    text-gray-500

                    sm:text-sm
                  "
                                >
                                    {description}
                                </p>
                            )}


                            {isClickable &&
                                actionLabel && (
                                    <div
                                        className="
                      mt-3
                      inline-flex
                      items-center
                      gap-1

                      text-sm
                      font-medium
                      text-orange-600
                    "
                                    >
                                        {actionLabel}

                                        <ArrowUpRight
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </div>
                                )}
                        </>
                    )}
                </div>


                {/* ICON */}
                <div
                    className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center

            rounded-xl

            sm:h-12
            sm:w-12

            ${selectedVariant.iconWrapper}
          `}
                >
                    {loading ? (
                        <Skeleton
                            width="w-6"
                            height="h-6"
                            rounded="rounded-md"
                        />
                    ) : (
                        Icon && (
                            <Icon
                                className="
                  h-5
                  w-5

                  sm:h-6
                  sm:w-6
                "
                                aria-hidden="true"
                            />
                        )
                    )}
                </div>
            </div>
        </Card>
    );
};


export default StatCard;