import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";


const Tooltip = ({
  children,

  content,

  placement = "top",

  delay = 250,

  disabled = false,

  className = "",
}) => {
  const [open, setOpen] =
    useState(false);

  const [position, setPosition] =
    useState({
      top: 0,
      left: 0,
    });

  const timerRef =
    useRef(null);

  const triggerRef =
    useRef(null);

  const generatedId =
    useId();

  const tooltipId =
    `tooltip-${generatedId}`;


  // =========================
  // POSITION
  // =========================

  const updatePosition = () => {
    if (!triggerRef.current) {
      return;
    }

    const rect =
      triggerRef.current
        .getBoundingClientRect();

    const gap = 8;


    if (placement === "bottom") {
      setPosition({
        top:
          rect.bottom + gap,

        left:
          rect.left +
          rect.width / 2,
      });

      return;
    }


    if (placement === "left") {
      setPosition({
        top:
          rect.top +
          rect.height / 2,

        left:
          rect.left - gap,
      });

      return;
    }


    if (placement === "right") {
      setPosition({
        top:
          rect.top +
          rect.height / 2,

        left:
          rect.right + gap,
      });

      return;
    }


    // Default → top
    setPosition({
      top:
        rect.top - gap,

      left:
        rect.left +
        rect.width / 2,
    });
  };


  // =========================
  // SHOW
  // =========================

  const showTooltip = () => {
    if (
      disabled ||
      !content
    ) {
      return;
    }


    clearTimeout(
      timerRef.current
    );


    timerRef.current =
      setTimeout(() => {
        updatePosition();

        setOpen(true);
      }, delay);
  };


  // =========================
  // HIDE
  // =========================

  const hideTooltip = () => {
    clearTimeout(
      timerRef.current
    );

    setOpen(false);
  };


  // =========================
  // ESC
  // =========================

  useEffect(() => {
    if (!open) return;


    const handleKeyDown = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        setOpen(false);
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
  }, [open]);


  // =========================
  // SCROLL / RESIZE
  // =========================

  useEffect(() => {
    if (!open) return;


    const handleChange = () => {
      setOpen(false);
    };


    window.addEventListener(
      "resize",
      handleChange
    );

    window.addEventListener(
      "scroll",
      handleChange,
      true
    );


    return () => {
      window.removeEventListener(
        "resize",
        handleChange
      );

      window.removeEventListener(
        "scroll",
        handleChange,
        true
      );
    };
  }, [open]);


  // =========================
  // TIMER CLEANUP
  // =========================

  useEffect(() => {
    return () => {
      clearTimeout(
        timerRef.current
      );
    };
  }, []);


  const placementClasses = {
    top:
      "-translate-x-1/2 -translate-y-full",

    bottom:
      "-translate-x-1/2",

    left:
      "-translate-x-full -translate-y-1/2",

    right:
      "-translate-y-1/2",
  };


  /*
    Actual child ko accessibility
    description attach kar rahe hain.
  */
  const trigger =
    isValidElement(children)
      ? cloneElement(
          children,
          {
            "aria-describedby":
              open
                ? tooltipId
                : undefined,
          }
        )
      : children;


  return (
    <>
      {/* Trigger */}
      <span
        ref={triggerRef}

        onMouseEnter={
          showTooltip
        }

        onMouseLeave={
          hideTooltip
        }

        onFocus={
          showTooltip
        }

        onBlur={
          hideTooltip
        }

        className="
          inline-flex
        "
      >
        {trigger}
      </span>


      {/* Tooltip */}
      {open &&
        createPortal(
          <div
            id={tooltipId}

            role="tooltip"

            style={{
              top:
                position.top,

              left:
                position.left,
            }}

            className={`
              pointer-events-none

              fixed
              z-[300]

              max-w-60

              rounded-md

              bg-gray-900

              px-2.5
              py-1.5

              text-xs
              font-medium
              leading-5
              text-white

              shadow-lg

              ${
                placementClasses[
                  placement
                ] ||
                placementClasses.top
              }

              ${className}
            `}
          >
            {content}
          </div>,

          document.body
        )}
    </>
  );
};


export default Tooltip;
