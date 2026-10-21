import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Drawer({
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
  bodyClassName = "p-5 sm:p-7",
}) {
  const panel = useRef(null),
    closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  const id = useId();
  const sizes = {
    sm: "w-[300px]",
    md: "w-[380px]",
    lg: "w-[460px]",
    xl: "w-[560px]",
    full: "w-full",
  };
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement,
      overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const handle = (event) => {
      if (event.key === "Escape" && closeOnEscape && !disableClose)
        closeRef.current?.();
      if (event.key !== "Tab") return;
      const items = [
        ...panel.current.querySelectorAll(
          'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]'
        ),
      ].filter((item) => item.getClientRects().length);
      if (!items.length) {
        event.preventDefault();
        return;
      }
      const first = items[0],
        last = items.at(-1);
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === panel.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          document.activeElement === panel.current)
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open, closeOnEscape, disableClose]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        onMouseDown={() => {
          if (closeOnBackdrop && !disableClose) onClose?.();
        }}
      />
      <aside
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${id}-title` : undefined}
        aria-label={!title ? "Details" : undefined}
        aria-describedby={description ? `${id}-description` : undefined}
        className={`drawer-panel absolute inset-y-0 flex max-w-[100vw] flex-col bg-[#fbfaf8] shadow-2xl outline-none sm:my-3 sm:max-w-[calc(100vw-24px)] sm:rounded-3xl ${
          side === "right" ? "right-0 sm:right-3" : "left-0 sm:left-3"
        } ${sizes[size] || sizes.md} ${className}`}
        style={{ "--drawer-direction": side === "right" ? "32px" : "-32px" }}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200/70 px-5 py-6 sm:px-7">
          <div className="min-w-0">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[.22em] text-orange-700">
              Record overview
            </p>
            {title && (
              <h2
                id={`${id}-title`}
                className="text-2xl font-bold tracking-tight text-slate-950"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id={`${id}-description`}
                className="mt-2 text-sm leading-6 text-slate-500"
              >
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <button
              type="button"
              aria-label="Close drawer"
              disabled={disableClose}
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-40"
            >
              <X size={19} />
            </button>
          )}
        </header>
        <div
          className={`min-h-0 flex-1 overflow-y-auto overscroll-contain ${bodyClassName}`}
        >
          {children}
        </div>
        {footer && (
          <footer className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
            {footer}
          </footer>
        )}
      </aside>
    </div>,
    document.body
  );
}
