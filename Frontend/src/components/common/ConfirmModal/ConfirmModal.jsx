import {
    AlertTriangle,
} from "lucide-react";

import Modal from "../Modal/Modal";
import Button from "../Button/Button";


const ConfirmModal = ({
    open,
    onClose,
    onConfirm,

    title = "Are you sure?",
    description = "",

    confirmText = "Confirm",
    cancelText = "Cancel",

    loading = false,
    loadingText = "Processing...",

    confirmVariant = "danger",

    confirmDisabled = false,

    icon: Icon = AlertTriangle,
}) => {
    const handleConfirm = () => {
        if (
            loading ||
            confirmDisabled
        ) {
            return;
        }

        onConfirm?.();
    };


    const handleClose = () => {
        if (loading) return;

        onClose?.();
    };


    return (
        <Modal
            open={open}

            onClose={handleClose}

            size="sm"

            showCloseButton
            disableClose={loading}

            closeOnBackdrop
            closeOnEscape

            footer={
                <div
                    className="
            flex
            flex-col-reverse
            gap-2

            sm:flex-row
            sm:justify-end
          "
                >
                    <Button
                        variant="outline"

                        onClick={
                            handleClose
                        }

                        disabled={loading}

                        fullWidth
                        className="sm:w-auto"
                    >
                        {cancelText}
                    </Button>


                    <Button
                        variant={
                            confirmVariant
                        }

                        onClick={
                            handleConfirm
                        }

                        loading={loading}

                        loadingText={
                            loadingText
                        }

                        disabled={
                            confirmDisabled
                        }

                        fullWidth
                        className="sm:w-auto"
                    >
                        {confirmText}
                    </Button>
                </div>
            }
        >
            <div
                className="
          flex
          flex-col
          items-center
          text-center
        "
            >
                {Icon && (
                    <div
                        className="
              mb-4
              flex
              h-14
              w-14
              items-center
              justify-center

              rounded-full

              bg-red-50
            "
                    >
                        <Icon
                            className="
                h-6
                w-6
                text-red-600
              "
                            aria-hidden="true"
                        />
                    </div>
                )}


                <h3
                    className="
            text-lg
            font-semibold
            text-gray-900
          "
                >
                    {title}
                </h3>


                {description && (
                    <p
                        className="
              mt-2
              text-sm
              leading-6
              text-gray-500
            "
                    >
                        {description}
                    </p>
                )}
            </div>
        </Modal>
    );
};


export default ConfirmModal;