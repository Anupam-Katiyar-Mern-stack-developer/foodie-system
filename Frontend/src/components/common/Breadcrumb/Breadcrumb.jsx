import { Link } from "react-router-dom";

import {
    ChevronRight,
    Home,
} from "lucide-react";


const Breadcrumb = ({
    items = [],

    showHomeIcon = false,

    className = "",
}) => {
    if (!items.length) {
        return null;
    }


    return (
        <nav
            aria-label="Breadcrumb"

            className={`
        w-full
        overflow-x-auto
        ${className}
      `}
        >
            <ol
                className="
          flex
          min-w-max
          items-center
          gap-1.5
        "
            >
                {items.map(
                    (item, index) => {
                        const {
                            label,
                            to,
                            icon: Icon,
                            current = false,
                        } = item;


                        const isLast =
                            index ===
                            items.length - 1;


                        const isCurrent =
                            current || isLast;


                        return (
                            <li
                                key={`${label}-${index}`}

                                className="
                  flex
                  items-center
                  gap-1.5
                "
                            >
                                {/* Breadcrumb Item */}
                                {to && !isCurrent ? (
                                    <Link
                                        to={to}

                                        className="
                      inline-flex
                      items-center
                      gap-1.5

                      whitespace-nowrap

                      text-sm
                      font-medium
                      text-gray-500

                      transition-colors

                      hover:text-orange-600

                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-orange-500/30
                    "
                                    >
                                        {index === 0 &&
                                            showHomeIcon ? (
                                            <Home
                                                className="
                          h-4
                          w-4
                        "
                                                aria-hidden="true"
                                            />
                                        ) : Icon ? (
                                            <Icon
                                                className="
                          h-4
                          w-4
                        "
                                                aria-hidden="true"
                                            />
                                        ) : null}

                                        <span>
                                            {label}
                                        </span>
                                    </Link>
                                ) : (
                                    <span
                                        aria-current={
                                            isCurrent
                                                ? "page"
                                                : undefined
                                        }

                                        className="
                      inline-flex
                      items-center
                      gap-1.5

                      whitespace-nowrap

                      text-sm
                      font-semibold
                      text-gray-900
                    "
                                    >
                                        {Icon && (
                                            <Icon
                                                className="
                          h-4
                          w-4
                        "
                                                aria-hidden="true"
                                            />
                                        )}

                                        {label}
                                    </span>
                                )}


                                {/* Separator */}
                                {!isLast && (
                                    <ChevronRight
                                        className="
                      h-4
                      w-4
                      shrink-0
                      text-gray-300
                    "
                                        aria-hidden="true"
                                    />
                                )}
                            </li>
                        );
                    }
                )}
            </ol>
        </nav>
    );
};


export default Breadcrumb;