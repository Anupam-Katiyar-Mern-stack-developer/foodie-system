import Button from "../Button/Button";


const FormActions = ({
    onCancel,

    submitText = "Save",
    loadingText = "Saving...",

    cancelText = "Cancel",

    loading = false,
    disabled = false,

    showCancel = true,

    submitVariant = "primary",
    cancelVariant = "outline",

    submitIcon = null,
    cancelIcon = null,

    align = "right",

    className = "",
}) => {
    const alignments = {
        left: "sm:justify-start",
        center: "sm:justify-center",
        right: "sm:justify-end",
        between: "sm:justify-between",
    };


    const isSubmitDisabled =
        loading || disabled;


    return (
        <div
            className={`
        flex
        w-full
        flex-col-reverse
        gap-3

        sm:flex-row
        sm:items-center

        ${alignments[align] ||
                alignments.right
                }

        ${className}
      `}
        >
            {/* Cancel */}
            {showCancel && (
                <Button
                    type="button"

                    variant={
                        cancelVariant
                    }

                    leftIcon={
                        cancelIcon
                    }

                    onClick={
                        onCancel
                    }

                    disabled={loading}

                    fullWidth
                    className="sm:w-auto"
                >
                    {cancelText}
                </Button>
            )}


            {/* Submit */}
            <Button
                type="submit"

                variant={
                    submitVariant
                }

                leftIcon={
                    submitIcon
                }

                loading={loading}

                loadingText={
                    loadingText
                }

                disabled={
                    isSubmitDisabled
                }

                fullWidth
                className="sm:w-auto"
            >
                {submitText}
            </Button>
        </div>
    );
};


export default FormActions;