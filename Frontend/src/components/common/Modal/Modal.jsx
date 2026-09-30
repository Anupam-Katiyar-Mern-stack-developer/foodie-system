import {
    useEffect,
    useId,
    useRef,
} from "react";

import { createPortal } from "react-dom";
import { X } from "lucide-react";


const Modal = ({
    open,
    onClose,

    title,
    description,

    children,
    footer,

    size = "md",

    showCloseButton = true,
    closeOnBackdrop = true,
    closeOnEscape = true,

    disableClose = false,

    className = "",
}) => {
    const modalRef = useRef(null);

    const previousFocusedElement =
        useRef(null);

    const generatedId = useId();

    const titleId =
        `${generatedId}-title`;

    const descriptionId =
        `${generatedId}-description`;


    const sizes = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-lg",
        lg: "sm:max-w-2xl",
        xl: "sm:max-w-4xl",
        full: "sm:max-w-[calc(100%-2rem)]",
    };


    const handleClose = () => {
        if (disableClose) return;

        onClose?.();
    };


    /*
      Modal open hone par:
      1. background scroll lock
      2. previous focused element save
      3. modal ke first focusable element
         par focus
    */
    useEffect(() => {
        if (!open) return;


        previousFocusedElement.current =
            document.activeElement;


        const previousOverflow =
            document.body.style.overflow;


        document.body.style.overflow =
            "hidden";


        const timer = setTimeout(() => {
            const modal =
                modalRef.current;

            if (!modal) return;


            const focusable =
                modal.querySelector(
                    `
            button:not([disabled]),
            input:not([disabled]),
            textarea:not([disabled]),
            select:not([disabled]),
            a[href],
            [tabindex]:not([tabindex="-1"])
          `
                );


            focusable?.focus();

        }, 0);


        return () => {
            clearTimeout(timer);

            document.body.style.overflow =
                previousOverflow;


            previousFocusedElement.current
                ?.focus?.();
        };

    }, [open]);


    /*
      ESC + Focus Trap
    */
    useEffect(() => {
        if (!open) return;


        const handleKeyDown = (event) => {

            // =========================
            // ESC CLOSE
            // =========================
            if (
                event.key === "Escape" &&
                closeOnEscape &&
                !disableClose
            ) {
                event.preventDefault();

                onClose?.();

                return;
            }


            // =========================
            // TAB FOCUS TRAP
            // =========================
            if (event.key !== "Tab") {
                return;
            }


            const modal =
                modalRef.current;

            if (!modal) return;


            const focusableElements =
                modal.querySelectorAll(
                    `
            button:not([disabled]),
            input:not([disabled]),
            textarea:not([disabled]),
            select:not([disabled]),
            a[href],
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


    const modalContent = (
        <div
            className="
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center

        sm:items-center
        sm:px-4
        sm:py-6
      "
        >
            {/* Backdrop */}
            <div
                className="
          absolute
          inset-0
          bg-black/50
          backdrop-blur-[2px]
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


            {/* Modal */}
            <div
                ref={modalRef}

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
          relative
          z-10

          flex
          max-h-[90dvh]
          w-full
          flex-col

          overflow-hidden

          rounded-t-2xl
          bg-white
          shadow-xl

          sm:rounded-2xl

          ${sizes[size] || sizes.md}

          ${className}
        `}

                onMouseDown={(
                    event
                ) => {
                    /*
                      Modal ke andar click karne
                      par backdrop event trigger
                      na ho.
                    */
                    event.stopPropagation();
                }}
            >
                {/* Header */}
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

              sm:px-6
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

                    sm:text-xl
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
                    leading-6
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

                                    aria-label="Close modal"

                                    className="
                  inline-flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center

                  rounded-lg

                  text-gray-400

                  transition

                  hover:bg-gray-100
                  hover:text-gray-700

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


                {/* Body */}
                <div
                    className="
            min-h-0
            flex-1
            overflow-y-auto

            px-4
            py-5

            sm:px-6
          "
                >
                    {children}
                </div>


                {/* Footer */}
                {footer && (
                    <div
                        className="
              shrink-0

              border-t
              border-gray-100

              bg-white

              px-4
              py-4

              sm:px-6
            "
                    >
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );


    return createPortal(
        modalContent,
        document.body
    );
};


export default Modal;