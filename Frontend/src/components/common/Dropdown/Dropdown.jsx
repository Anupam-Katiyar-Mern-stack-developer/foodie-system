import {
    cloneElement,
    isValidElement,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    createPortal,
} from "react-dom";


const Dropdown = ({
    trigger,

    items = [],

    header = null,
    footer = null,

    align = "right",
    width = "md",

    disabled = false,

    className = "",
}) => {
    const [
        open,
        setOpen,
    ] = useState(false);


    const [
        position,
        setPosition,
    ] = useState({
        top: 0,
        left: 0,
        right: "auto",
    });


    const triggerRef =
        useRef(null);

    const menuRef =
        useRef(null);


    const widths = {
        sm: "w-40",
        md: "w-52",
        lg: "w-64",
    };


    // =========================
    // POSITION MENU
    // =========================

    const updatePosition = () => {
        if (!triggerRef.current) {
            return;
        }


        const rect =
            triggerRef.current
                .getBoundingClientRect();


        const gap = 8;


        if (align === "left") {
            setPosition({
                top:
                    rect.bottom +
                    gap,

                left:
                    rect.left,

                right: "auto",
            });

            return;
        }


        setPosition({
            top:
                rect.bottom +
                gap,

            left: "auto",

            right:
                window.innerWidth -
                rect.right,
        });
    };


    // =========================
    // OPEN / CLOSE
    // =========================

    const openDropdown = () => {
        if (disabled) return;

        updatePosition();

        setOpen(true);
    };


    const closeDropdown = () => {
        setOpen(false);
    };


    const toggleDropdown = () => {
        if (disabled) return;

        if (open) {
            closeDropdown();
        } else {
            openDropdown();
        }
    };


    // =========================
    // OUTSIDE CLICK
    // =========================

    useEffect(() => {
        if (!open) return;


        const handleOutsideClick = (
            event
        ) => {
            const clickedTrigger =
                triggerRef.current
                    ?.contains(
                        event.target
                    );


            const clickedMenu =
                menuRef.current
                    ?.contains(
                        event.target
                    );


            if (
                !clickedTrigger &&
                !clickedMenu
            ) {
                closeDropdown();
            }
        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, [open]);


    // =========================
    // KEYBOARD
    // =========================

    useEffect(() => {
        if (!open) return;


        const handleKeyDown = (
            event
        ) => {

            // ESC
            if (
                event.key ===
                "Escape"
            ) {
                event.preventDefault();

                closeDropdown();

                triggerRef.current
                    ?.focus();

                return;
            }


            if (
                event.key !==
                "ArrowDown" &&
                event.key !==
                "ArrowUp"
            ) {
                return;
            }


            const menu =
                menuRef.current;

            if (!menu) return;


            const items =
                Array.from(
                    menu.querySelectorAll(
                        `
              [data-dropdown-item]
              :not([disabled])
            `
                            .replace(
                                /\s+/g,
                                ""
                            )
                    )
                );


            if (!items.length) {
                return;
            }


            event.preventDefault();


            const currentIndex =
                items.indexOf(
                    document.activeElement
                );


            let nextIndex;


            if (
                event.key ===
                "ArrowDown"
            ) {
                nextIndex =
                    currentIndex <
                        items.length - 1
                        ? currentIndex + 1
                        : 0;
            } else {
                nextIndex =
                    currentIndex > 0
                        ? currentIndex - 1
                        : items.length - 1;
            }


            items[
                nextIndex
            ]?.focus();
        };


        document.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [open]);


    // =========================
    // SCROLL / RESIZE
    // =========================

    useEffect(() => {
        if (!open) return;


        const handleWindowChange =
            () => {
                closeDropdown();
            };


        window.addEventListener(
            "resize",
            handleWindowChange
        );

        window.addEventListener(
            "scroll",
            handleWindowChange,
            true
        );


        return () => {
            window.removeEventListener(
                "resize",
                handleWindowChange
            );

            window.removeEventListener(
                "scroll",
                handleWindowChange,
                true
            );
        };
    }, [open]);


    // =========================
    // ITEM CLICK
    // =========================

    const handleItemClick = (
        item
    ) => {
        if (
            item.disabled
        ) {
            return;
        }


        item.onClick?.();

        closeDropdown();
    };


    // =========================
    // TRIGGER
    // =========================

    const triggerElement =
        isValidElement(trigger)
            ? cloneElement(
                trigger,
                {
                    ref:
                        triggerRef,

                    type:
                        trigger.props
                            .type ||
                        "button",

                    onClick: (
                        event
                    ) => {
                        trigger.props
                            .onClick?.(
                                event
                            );

                        toggleDropdown();
                    },

                    disabled:
                        disabled ||
                        trigger.props
                            .disabled,

                    "aria-haspopup":
                        "menu",

                    "aria-expanded":
                        open,
                }
            )
            : null;


    // =========================
    // MENU
    // =========================

    const menu = open ? (
        <div
            ref={menuRef}

            role="menu"

            style={{
                top:
                    position.top,

                left:
                    position.left,

                right:
                    position.right,
            }}

            className={`
        fixed
        z-[100]

        max-h-[calc(100vh-2rem)]

        overflow-y-auto

        rounded-xl

        border
        border-gray-200

        bg-white

        p-1.5

        shadow-lg
        shadow-black/10

        ${widths[width] ||
                widths.md}

        ${className}
      `}
        >
            {/* =====================
          HEADER
      ===================== */}
            {header && (
                <div
                    className="
            border-b
            border-gray-100

            px-3
            py-2.5
          "
                >
                    {header}
                </div>
            )}


            {/* =====================
          ITEMS
      ===================== */}
            <div className="py-1">
                {items
                    .filter(
                        (item) =>
                            !item.hidden
                    )
                    .map(
                        (
                            item,
                            index
                        ) => {

                            if (
                                item.type ===
                                "separator"
                            ) {
                                return (
                                    <div
                                        key={
                                            item.key ||
                                            `separator-${index}`
                                        }

                                        className="
                      my-1
                      border-t
                      border-gray-100
                    "
                                        role="separator"
                                    />
                                );
                            }


                            const {
                                key,
                                label,

                                icon: Icon,

                                disabled:
                                itemDisabled =
                                false,

                                danger =
                                false,

                                description =
                                "",
                            } = item;


                            return (
                                <button
                                    key={
                                        key ||
                                        label
                                    }

                                    type="button"

                                    role="menuitem"

                                    data-dropdown-item

                                    disabled={
                                        itemDisabled
                                    }

                                    onClick={() =>
                                        handleItemClick(
                                            item
                                        )
                                    }

                                    className={`
                    flex
                    w-full
                    items-start
                    gap-3

                    rounded-lg

                    px-3
                    py-2.5

                    text-left

                    transition-colors

                    focus-visible:outline-none

                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    ${danger
                                            ? `
                          text-red-600

                          hover:bg-red-50
                          focus-visible:bg-red-50
                        `
                                            : `
                          text-gray-700

                          hover:bg-gray-50
                          focus-visible:bg-gray-50
                        `
                                        }
                  `}
                                >
                                    {Icon && (
                                        <Icon
                                            className="
                        mt-0.5
                        h-4
                        w-4
                        shrink-0
                      "
                                            aria-hidden="true"
                                        />
                                    )}


                                    <span
                                        className="
                      min-w-0
                      flex-1
                    "
                                    >
                                        <span
                                            className="
                        block
                        text-sm
                        font-medium
                      "
                                        >
                                            {label}
                                        </span>


                                        {description && (
                                            <span
                                                className="
                          mt-0.5
                          block

                          text-xs
                          leading-5
                          text-gray-400
                        "
                                            >
                                                {description}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            );
                        }
                    )}
            </div>


            {/* =====================
          FOOTER
      ===================== */}
            {footer && (
                <div
                    className="
            border-t
            border-gray-100

            px-3
            py-2.5
          "
                >
                    {footer}
                </div>
            )}
        </div>
    ) : null;


    return (
        <>
            {triggerElement}

            {open &&
                createPortal(
                    menu,
                    document.body
                )}
        </>
    );
};


export default Dropdown;