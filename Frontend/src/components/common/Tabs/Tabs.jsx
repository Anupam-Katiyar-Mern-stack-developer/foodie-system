import {
    useRef,
} from "react";


const Tabs = ({
    tabs = [],

    activeTab,

    onChange,

    disabled = false,

    className = "",
    tabClassName = "",
}) => {
    const tabRefs =
        useRef([]);


    const enabledTabs =
        tabs.filter(
            (tab) => !tab.disabled
        );


    const handleChange = (
        tab
    ) => {
        if (
            disabled ||
            tab.disabled ||
            tab.key === activeTab
        ) {
            return;
        }

        onChange?.(tab.key);
    };


    const handleKeyDown = (
        event,
        currentTab
    ) => {
        if (disabled) return;


        const currentIndex =
            enabledTabs.findIndex(
                (tab) =>
                    tab.key ===
                    currentTab.key
            );


        if (currentIndex === -1) {
            return;
        }


        let nextIndex =
            currentIndex;


        if (
            event.key ===
            "ArrowRight"
        ) {
            nextIndex =
                (
                    currentIndex + 1
                ) %
                enabledTabs.length;
        }

        else if (
            event.key ===
            "ArrowLeft"
        ) {
            nextIndex =
                (
                    currentIndex -
                    1 +
                    enabledTabs.length
                ) %
                enabledTabs.length;
        }

        else if (
            event.key === "Home"
        ) {
            nextIndex = 0;
        }

        else if (
            event.key === "End"
        ) {
            nextIndex =
                enabledTabs.length -
                1;
        }

        else {
            return;
        }


        event.preventDefault();


        const nextTab =
            enabledTabs[nextIndex];


        onChange?.(
            nextTab.key
        );


        const originalIndex =
            tabs.findIndex(
                (tab) =>
                    tab.key ===
                    nextTab.key
            );


        requestAnimationFrame(
            () => {
                tabRefs.current[
                    originalIndex
                ]?.focus();
            }
        );
    };


    if (!tabs.length) {
        return null;
    }


    return (
        <div
            className={`
        w-full
        border-b
        border-gray-200

        ${className}
      `}
        >
            <div
                role="tablist"

                aria-label="Tabs"

                className="
          flex
          w-full
          items-center
          gap-1

          overflow-x-auto
          overscroll-x-contain

          scrollbar-none
        "
            >
                {tabs.map(
                    (tab, index) => {
                        const {
                            key,
                            label,

                            icon: Icon,

                            count,

                            disabled:
                            tabDisabled =
                            false,
                        } = tab;


                        const isActive =
                            activeTab === key;


                        const isDisabled =
                            disabled ||
                            tabDisabled;


                        return (
                            <button
                                key={key}

                                ref={(element) => {
                                    tabRefs.current[
                                        index
                                    ] = element;
                                }}

                                type="button"

                                role="tab"

                                aria-selected={
                                    isActive
                                }

                                aria-disabled={
                                    isDisabled
                                }

                                tabIndex={
                                    isActive
                                        ? 0
                                        : -1
                                }

                                disabled={
                                    isDisabled
                                }

                                onClick={() =>
                                    handleChange(
                                        tab
                                    )
                                }

                                onKeyDown={(
                                    event
                                ) =>
                                    handleKeyDown(
                                        event,
                                        tab
                                    )
                                }

                                className={`
                  relative

                  inline-flex
                  min-h-11
                  shrink-0
                  items-center
                  justify-center
                  gap-2

                  whitespace-nowrap

                  px-3
                  py-2.5

                  text-sm
                  font-medium

                  transition-colors
                  duration-200

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-orange-500/30
                  focus-visible:ring-inset

                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  ${isActive
                                        ? `
                        text-orange-600
                      `
                                        : `
                        text-gray-500

                        hover:text-gray-900
                      `
                                    }

                  ${tabClassName}
                `}
                            >
                                {/* Icon */}
                                {Icon && (
                                    <Icon
                                        className="
                      h-4
                      w-4
                      shrink-0
                    "
                                        aria-hidden="true"
                                    />
                                )}


                                {/* Label */}
                                <span>
                                    {label}
                                </span>


                                {/* Optional Count */}
                                {count !==
                                    undefined &&
                                    count !==
                                    null && (
                                        <span
                                            className={`
                        inline-flex
                        min-w-5
                        items-center
                        justify-center

                        rounded-full

                        px-1.5
                        py-0.5

                        text-xs
                        font-semibold

                        ${isActive
                                                    ? `
                              bg-orange-100
                              text-orange-700
                            `
                                                    : `
                              bg-gray-100
                              text-gray-600
                            `
                                                }
                      `}
                                        >
                                            {count}
                                        </span>
                                    )}


                                {/* Active Line */}
                                {isActive && (
                                    <span
                                        className="
                      absolute
                      inset-x-2
                      bottom-0

                      h-0.5

                      rounded-full
                      bg-orange-500
                    "
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        );
                    }
                )}
            </div>
        </div>
    );
};


export default Tabs;