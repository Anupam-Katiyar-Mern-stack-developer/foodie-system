import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    createPortal,
} from "react-dom";

import Toast from "./Toast";


export const ToastContext =
    createContext(null);


const ToastProvider = ({
    children,
    maxToasts = 4,
}) => {
    const [
        toasts,
        setToasts,
    ] = useState([]);


    const timersRef =
        useRef(new Map());


    // =========================
    // REMOVE TOAST
    // =========================

    const removeToast =
        useCallback((id) => {

            setToasts(
                (currentToasts) =>
                    currentToasts.filter(
                        (toast) =>
                            toast.id !== id
                    )
            );


            const timer =
                timersRef.current.get(
                    id
                );


            if (timer) {
                clearTimeout(timer);

                timersRef.current.delete(
                    id
                );
            }

        }, []);


    // =========================
    // ADD TOAST
    // =========================

    const addToast =
        useCallback(
            ({
                type = "info",

                title = "",

                message = "",

                duration = 3500,
            }) => {

                const id =
                    globalThis.crypto
                        ?.randomUUID?.() ||
                    `${Date.now()}-${Math.random()}`;


                const newToast = {
                    id,
                    type,
                    title,
                    message,
                    duration,
                };


                setToasts(
                    (currentToasts) => {
                        const nextToasts = [
                            ...currentToasts,
                            newToast,
                        ];


                        /*
                          Maximum fixed number
                          of notifications.
                        */
                        return nextToasts.slice(
                            -maxToasts
                        );
                    }
                );


                /*
                  duration <= 0
                  means auto-dismiss nahi.
                */
                if (duration > 0) {
                    const timer =
                        setTimeout(() => {
                            removeToast(id);
                        }, duration);


                    timersRef.current.set(
                        id,
                        timer
                    );
                }


                return id;
            },

            [
                maxToasts,
                removeToast,
            ]
        );


    // =========================
    // SHORTCUT METHODS
    // =========================

    const success =
        useCallback(
            (message, options = {}) =>
                addToast({
                    type: "success",
                    message,
                    ...options,
                }),
            [addToast]
        );


    const error =
        useCallback(
            (message, options = {}) =>
                addToast({
                    type: "error",
                    message,
                    ...options,
                }),
            [addToast]
        );


    const warning =
        useCallback(
            (message, options = {}) =>
                addToast({
                    type: "warning",
                    message,
                    ...options,
                }),
            [addToast]
        );


    const info =
        useCallback(
            (message, options = {}) =>
                addToast({
                    type: "info",
                    message,
                    ...options,
                }),
            [addToast]
        );


    // =========================
    // CLEANUP
    // =========================

    useEffect(() => {
        return () => {
            timersRef.current.forEach(
                (timer) => {
                    clearTimeout(timer);
                }
            );

            timersRef.current.clear();
        };
    }, []);


    const value =
        useMemo(
            () => ({
                addToast,

                removeToast,

                success,
                error,
                warning,
                info,
            }),
            [
                addToast,
                removeToast,
                success,
                error,
                warning,
                info,
            ]
        );


    const toastContainer =
        toasts.length > 0 ? (
            <div
                className="
          pointer-events-none

          fixed
          right-0
          top-0
          z-[200]

          flex
          w-full
          flex-col
          gap-3

          p-4

          sm:max-w-sm
          sm:right-4
          sm:top-4
          sm:p-0
        "

                aria-live="polite"
                aria-atomic="false"
            >
                {toasts.map(
                    (toast) => (
                        <Toast
                            key={toast.id}

                            toast={toast}

                            onClose={
                                removeToast
                            }
                        />
                    )
                )}
            </div>
        ) : null;


    return (
        <ToastContext.Provider
            value={value}
        >
            {children}

            {toastContainer &&
                createPortal(
                    toastContainer,
                    document.body
                )}
        </ToastContext.Provider>
    );
};


export default ToastProvider;