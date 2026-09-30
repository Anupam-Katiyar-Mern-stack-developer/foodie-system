import {
    useEffect,
    useState,
} from "react";

import {
    User,
} from "lucide-react";


const Avatar = ({
    src = "",
    name = "",

    alt,

    size = "md",

    status = null,

    showStatus = false,

    className = "",

    imageClassName = "",
}) => {
    const [
        imageError,
        setImageError,
    ] = useState(false);


    /*
      Agar src change ho,
      broken image state reset.
    */
    useEffect(() => {
        setImageError(false);
    }, [src]);


    const sizes = {
        xs: {
            wrapper: "h-7 w-7",
            text: "text-[10px]",
            icon: "h-3.5 w-3.5",
            status:
                "h-2 w-2 border",
        },

        sm: {
            wrapper: "h-9 w-9",
            text: "text-xs",
            icon: "h-4 w-4",
            status:
                "h-2.5 w-2.5 border-2",
        },

        md: {
            wrapper: "h-11 w-11",
            text: "text-sm",
            icon: "h-5 w-5",
            status:
                "h-3 w-3 border-2",
        },

        lg: {
            wrapper: "h-14 w-14",
            text: "text-base",
            icon: "h-6 w-6",
            status:
                "h-3.5 w-3.5 border-2",
        },

        xl: {
            wrapper: "h-20 w-20",
            text: "text-xl",
            icon: "h-8 w-8",
            status:
                "h-4 w-4 border-2",
        },

        "2xl": {
            wrapper: "h-28 w-28",
            text: "text-2xl",
            icon: "h-10 w-10",
            status:
                "h-5 w-5 border-2",
        },
    };


    const statusColors = {
        online:
            "bg-green-500",

        offline:
            "bg-gray-400",

        busy:
            "bg-red-500",

        away:
            "bg-amber-500",
    };


    const selectedSize =
        sizes[size] ||
        sizes.md;


    const selectedStatus =
        statusColors[status] ||
        statusColors.offline;


    /*
      Example:
      "Anupam Katiyar"
          ↓
      "AK"
  
      "Anupam"
          ↓
      "A"
    */
    const getInitials = () => {
        if (!name?.trim()) {
            return "";
        }


        const words =
            name
                .trim()
                .split(/\s+/);


        if (words.length === 1) {
            return words[0]
                .charAt(0)
                .toUpperCase();
        }


        return (
            words[0]
                .charAt(0) +
            words[
                words.length - 1
            ].charAt(0)
        ).toUpperCase();
    };


    const initials =
        getInitials();


    const showImage =
        Boolean(src) &&
        !imageError;


    return (
        <div
            className={`
        relative
        inline-flex
        shrink-0

        ${selectedSize.wrapper}

        ${className}
      `}
        >
            {/* ======================
          AVATAR
      ====================== */}
            <div
                className="
          flex
          h-full
          w-full
          items-center
          justify-center

          overflow-hidden

          rounded-full

          bg-orange-50

          font-semibold
          text-orange-600

          ring-1
          ring-gray-200
        "
            >
                {showImage ? (
                    <img
                        src={src}

                        alt={
                            alt ||
                            (name
                                ? `${name} profile`
                                : "Profile")
                        }

                        loading="lazy"

                        decoding="async"

                        onError={() => {
                            setImageError(true);
                        }}

                        className={`
              h-full
              w-full
              object-cover

              ${imageClassName}
            `}
                    />
                ) : initials ? (
                    <span
                        className={
                            selectedSize.text
                        }
                        aria-label={
                            name || undefined
                        }
                    >
                        {initials}
                    </span>
                ) : (
                    <User
                        className={
                            selectedSize.icon
                        }

                        aria-hidden="true"
                    />
                )}
            </div>


            {/* ======================
          STATUS INDICATOR
      ====================== */}
            {showStatus && (
                <span
                    className={`
            absolute
            bottom-0
            right-0

            rounded-full
            border-white

            ${selectedSize.status}

            ${selectedStatus}
          `}

                    aria-label={
                        status
                            ? `Status: ${status}`
                            : "Status: offline"
                    }

                    role="status"
                />
            )}
        </div>
    );
};


export default Avatar;