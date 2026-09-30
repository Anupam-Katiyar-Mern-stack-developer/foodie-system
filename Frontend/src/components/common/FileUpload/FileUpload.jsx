import {
    useEffect,
    useId,
    useRef,
    useState,
} from "react";

import {
    ImageIcon,
    Upload,
    X,
} from "lucide-react";


const FileUpload = ({
    label,

    accept = "image/jpeg,image/png,image/webp",

    error = "",
    helperText = "",

    required = false,
    disabled = false,
    loading = false,

    existingPreview = "",

    onChange,
    onRemove,

    id,
    className = "",
    wrapperClassName = "",
}) => {
    const generatedId = useId();

    const inputId =
        id || `file-${generatedId}`;

    const inputRef = useRef(null);

    const [
        previewUrl,
        setPreviewUrl,
    ] = useState(existingPreview);

    const [
        objectUrl,
        setObjectUrl,
    ] = useState(null);

    const hasError =
        Boolean(error);

    const isDisabled =
        disabled || loading;


    // Existing backend image changes
    useEffect(() => {
        if (!objectUrl) {
            setPreviewUrl(
                existingPreview || ""
            );
        }
    }, [
        existingPreview,
        objectUrl,
    ]);


    // Cleanup browser object URL
    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(
                    objectUrl
                );
            }
        };
    }, [objectUrl]);


    const handleFileChange = (
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) return;


        // Old temporary preview remove
        if (objectUrl) {
            URL.revokeObjectURL(
                objectUrl
            );
        }


        const newPreview =
            URL.createObjectURL(file);

        setObjectUrl(newPreview);
        setPreviewUrl(newPreview);


        /*
          Parent / React Hook Form
          selected File receive karega.
        */
        onChange?.(file);
    };


    const handleRemove = () => {
        if (isDisabled) return;


        if (objectUrl) {
            URL.revokeObjectURL(
                objectUrl
            );
        }


        setObjectUrl(null);
        setPreviewUrl("");


        /*
          Same file dobara choose
          karne ko allow karta hai.
        */
        if (inputRef.current) {
            inputRef.current.value = "";
        }


        onChange?.(null);
        onRemove?.();
    };


    const handleChooseFile = () => {
        if (isDisabled) return;

        inputRef.current?.click();
    };


    return (
        <div
            className={`
        w-full
        ${wrapperClassName}
      `}
        >
            {/* Label */}
            {label && (
                <label
                    htmlFor={inputId}
                    className="
            mb-1.5
            block
            text-sm
            font-medium
            text-gray-800
          "
                >
                    {label}

                    {required && (
                        <span
                            className="
                ml-1
                text-red-500
              "
                            aria-hidden="true"
                        >
                            *
                        </span>
                    )}
                </label>
            )}


            {/* Hidden File Input */}
            <input
                ref={inputRef}

                id={inputId}

                type="file"

                accept={accept}

                disabled={isDisabled}

                onChange={
                    handleFileChange
                }

                className="sr-only"
            />


            {/* No Image Selected */}
            {!previewUrl ? (
                <button
                    type="button"

                    onClick={
                        handleChooseFile
                    }

                    disabled={isDisabled}

                    aria-label={
                        label
                            ? `Upload ${label}`
                            : "Upload image"
                    }

                    className={`
            flex
            min-h-40
            w-full
            flex-col
            items-center
            justify-center
            gap-3

            rounded-xl
            border-2
            border-dashed

            bg-gray-50
            px-4
            py-6

            text-center

            transition
            duration-200

            ${hasError
                            ? `
                  border-red-400
                  hover:border-red-500
                `
                            : `
                  border-gray-300
                  hover:border-orange-400
                  hover:bg-orange-50/40
                `
                        }

            disabled:cursor-not-allowed
            disabled:opacity-60

            ${className}
          `}
                >
                    {loading ? (
                        <span
                            className="
                h-7
                w-7
                animate-spin
                rounded-full
                border-2
                border-gray-400
                border-t-transparent
              "
                            aria-hidden="true"
                        />
                    ) : (
                        <div
                            className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-white
                shadow-sm
              "
                        >
                            <Upload
                                className="
                  h-5
                  w-5
                  text-gray-500
                "
                                aria-hidden="true"
                            />
                        </div>
                    )}


                    <div>
                        <p
                            className="
                text-sm
                font-medium
                text-gray-800
              "
                        >
                            {loading
                                ? "Processing image..."
                                : "Choose an image"}
                        </p>

                        {!loading && (
                            <p
                                className="
                  mt-1
                  text-xs
                  text-gray-500
                "
                            >
                                JPG, PNG or WEBP
                            </p>
                        )}
                    </div>
                </button>
            ) : (
                /* Image Preview */
                <div
                    className={`
            relative
            overflow-hidden
            rounded-xl
            border
            bg-gray-50

            ${hasError
                            ? "border-red-400"
                            : "border-gray-200"
                        }
          `}
                >
                    <div
                        className="
              relative
              aspect-video
              w-full
              overflow-hidden
            "
                    >
                        <img
                            src={previewUrl}
                            alt="Selected preview"

                            className="
                h-full
                w-full
                object-cover
              "
                        />


                        {loading && (
                            <div
                                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  bg-black/40
                "
                            >
                                <span
                                    className="
                    h-8
                    w-8
                    animate-spin
                    rounded-full
                    border-2
                    border-white
                    border-t-transparent
                  "
                                />
                            </div>
                        )}
                    </div>


                    {/* Preview Actions */}
                    <div
                        className="
              flex
              flex-col
              gap-2
              p-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
                    >
                        <div
                            className="
                flex
                min-w-0
                items-center
                gap-2
              "
                        >
                            <ImageIcon
                                className="
                  h-4
                  w-4
                  shrink-0
                  text-gray-400
                "
                            />

                            <span
                                className="
                  truncate
                  text-sm
                  text-gray-600
                "
                            >
                                Image selected
                            </span>
                        </div>


                        <div
                            className="
                flex
                gap-2
              "
                        >
                            <button
                                type="button"

                                onClick={
                                    handleChooseFile
                                }

                                disabled={isDisabled}

                                className="
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-orange-600
                  transition

                  hover:bg-orange-50

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                            >
                                Replace
                            </button>


                            <button
                                type="button"

                                onClick={
                                    handleRemove
                                }

                                disabled={isDisabled}

                                aria-label="Remove image"

                                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-red-600
                  transition

                  hover:bg-red-50

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                            >
                                <X
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />

                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Validation Error */}
            {hasError && (
                <p
                    className="
            mt-1.5
            text-sm
            text-red-600
          "
                    role="alert"
                >
                    {error}
                </p>
            )}


            {/* Helper Text */}
            {!hasError &&
                helperText && (
                    <p
                        className="
              mt-1.5
              text-sm
              text-gray-500
            "
                    >
                        {helperText}
                    </p>
                )}
        </div>
    );
};

export default FileUpload;