import {
    useEffect,
    useId,
    useRef,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    X,
} from "lucide-react";


const Drawer = ({
    open,
    onClose,

    title = "",
    description = "",

    children,
    footer = null,

    side = "left",
    size = "md",

    showCloseButton = true,
    closeOnBackdrop = true,
    closeOnEscape = true,

    disableClose = false,

    className = "",
}) => {
    const drawerRef =
        useRef(null);

    const previousFocusedElement =
        useRef(null);

    const generatedId =
        useId();

    const titleId =
        `${generatedId}-title`;

    const descriptionId =
        `${generatedId}-description`;


    const sizes = {
        sm: "w-[280px]",
        md: "w-[320px]",
        lg: "w-[380px]",
        xl: "w-[440px]",
        full: "w-full",
    };


    const isRight =
        side === "right";


    const handleClose = () => {
        if (disableClose) {
            return;
        }

        onClose?.();
    };


    // =========================
    // BODY SCROLL + FOCUS
    // =========================

    useEffect(() => {
        if (!open) return;


        previousFocusedElement.current =
            document.activeElement;


        const previousOverflow =
            document.body.style.overflow;


        document.body.style.overflow =
            "hidden";


        const timer =
            setTimeout(() => {
                const drawer =
                    drawerRef.current;

                if (!drawer) return;


                const firstFocusable =
                    drawer.querySelector(
                        `
              button:not([disabled]),
              a[href],
              input:not([disabled]),
              select:not([disabled]),
              textarea:not([disabled]),
              [tabindex]:not([tabindex="-1"])
            `
                    );


                firstFocusable?.focus();

            }, 0);


        return () => {
            clearTimeout(timer);

            document.body.style.overflow =
                previousOverflow;


            previousFocusedElement.current
                ?.focus?.();
        };

    }, [open]);


    // =========================
    // ESC + FOCUS TRAP
    // =========================

    useEffect(() => {
        if (!open) return;


        const handleKeyDown = (
            event
        ) => {

            // ESC
            if (
                event.key === "Escape" &&
                closeOnEscape &&
                !disableClose
            ) {
                event.preventDefault();

                onClose?.();

                return;
            }


            // TAB FOCUS TRAP
            if (event.key !== "Tab") {
                return;
            }


            const drawer =
                drawerRef.current;

            if (!drawer) return;


            const focusableElements =
                drawer.querySelectorAll(
                    `
            button:not([disabled]),
            a[href],
            input:not([disabled]),
            select:not([disabled]),
            textarea:not([disabled]),
            [tabindex]:not([tabindex="-1"])
          `
                );


            if (
                focusableElements.length === 0
            ) {
                event.preventDefault();
                return;
            }


            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                focusableElements.length - 1
                ];


            if (
                event.shiftKey &&
                document.activeElement ===
                firstElement
            ) {
                event.preventDefault();

                lastElement.focus();

            } else if (
                !event.shiftKey &&
                document.activeElement ===
                lastElement
            ) {
                event.preventDefault();

                firstElement.focus();
            }
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

    }, [
        open,
        closeOnEscape,
        disableClose,
        onClose,
    ]);


    if (!open) {
        return null;
    }


    const content = (
        <div
            className="
        fixed
        inset-0
        z-[100]
      "
        >
            {/* =====================
          BACKDROP
      ===================== */}
            <div
                className="
          absolute
          inset-0
          bg-black/50
          backdrop-blur-[1px]
        "

                aria-hidden="true"

                onMouseDown={() => {
                    if (
                        closeOnBackdrop &&
                        !disableClose
                    ) {
                        onClose?.();
                    }
                }}
            />


            {/* =====================
          DRAWER
      ===================== */}
            <div
                ref={drawerRef}

                role="dialog"
                aria-modal="true"

                aria-labelledby={
                    title
                        ? titleId
                        : undefined
                }

                aria-describedby={
                    description
                        ? descriptionId
                        : undefined
                }

                className={`
          absolute
          inset-y-0

          flex
          max-w-full
          flex-col

          bg-white
          shadow-2xl

          ${isRight
                        ? "right-0"
                        : "left-0"
                    }

          ${sizes[size] ||
                    sizes.md
                    }

          ${className}
        `}

                onMouseDown={(
                    event
                ) => {
                    event.stopPropagation();
                }}
            >
                {/* =====================
            HEADER
        ===================== */}
                {(title ||
                    description ||
                    showCloseButton) && (
                        <div
                            className="
              flex
              shrink-0
              items-start
              justify-between
              gap-4

              border-b
              border-gray-100

              px-4
              py-4
            "
                        >
                            <div className="min-w-0">
                                {title && (
                                    <h2
                                        id={titleId}

                                        className="
                    text-lg
                    font-semibold
                    text-gray-900
                  "
                                    >
                                        {title}
                                    </h2>
                                )}


                                {description && (
                                    <p
                                        id={descriptionId}

                                        className="
                    mt-1
                    text-sm
                    leading-5
                    text-gray-500
                  "
                                    >
                                        {description}
                                    </p>
                                )}
                            </div>


                            {showCloseButton && (
                                <button
                                    type="button"

                                    onClick={
                                        handleClose
                                    }

                                    disabled={
                                        disableClose
                                    }

                                    aria-label="Close drawer"

                                    className="
                  inline-flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center

                  rounded-lg

                  text-gray-500

                  transition

                  hover:bg-gray-100
                  hover:text-gray-900

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-orange-500/30

                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                                >
                                    <X
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </button>
                            )}
                        </div>
                    )}


                {/* =====================
            BODY
        ===================== */}
                <div
                    className="
            min-h-0
            flex-1
            overflow-y-auto
          "
                >
                    {children}
                </div>


                {/* =====================
            FOOTER
        ===================== */}
                {footer && (
                    <div
                        className="
              shrink-0

              border-t
              border-gray-100

              bg-white

              px-4
              py-4
            "
                    >
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );


    return createPortal(
        content,
        document.body
    );
};


export default Drawer;