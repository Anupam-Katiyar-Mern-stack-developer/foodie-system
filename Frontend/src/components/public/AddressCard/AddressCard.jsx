import {
    FaCheckCircle,
    FaEdit,
    FaHome,
    FaMapMarkerAlt,
    FaTrash,
} from "react-icons/fa";


const AddressCard = ({
    address,

    onEdit,

    onDelete,

    onSetDefault,

    deleting = false,

    defaultLoading = false,
}) => {
    if (!address) {
        return null;
    }


    return (
        <article
            className={`
        relative

        overflow-hidden

        rounded-[1.6rem]

        border-2

        bg-white

        p-5

        shadow-sm

        transition
        duration-300

        ${address.isDefault
                    ? `
              border-orange-300
              shadow-orange-950/5
            `
                    : `
              border-slate-200

              hover:border-orange-200
              hover:shadow-md
            `
                }
      `}
        >
            {/* DEFAULT ACCENT */}

            {address.isDefault && (
                <div
                    className="
            absolute
            left-0
            top-0

            h-full
            w-1

            bg-gradient-to-b
            from-orange-500
            to-rose-500
          "
                />
            )}


            <div
                className="
          flex
          items-start
          gap-4
        "
            >
                {/* ICON */}

                <span
                    className={`
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center

            rounded-2xl

            ${address.isDefault
                            ? `
                  bg-orange-100
                  text-orange-600
                `
                            : `
                  bg-slate-100
                  text-slate-500
                `
                        }
          `}
                >
                    <FaHome
                        className="
              h-4
              w-4
            "
                    />
                </span>


                {/* CONTENT */}

                <div
                    className="
            min-w-0
            flex-1
          "
                >
                    <div
                        className="
              flex
              flex-wrap
              items-center
              gap-2
            "
                    >
                        <h3
                            className="
                text-base
                font-black
                text-slate-950
              "
                        >
                            {address.isDefault
                                ? "Default Address"
                                : "Saved Address"}
                        </h3>


                        {address.isDefault && (
                            <span
                                className="
                  inline-flex
                  items-center
                  gap-1

                  rounded-full

                  bg-emerald-50

                  px-2
                  py-1

                  text-[9px]
                  font-black
                  uppercase
                  tracking-wide
                  text-emerald-700
                "
                            >
                                <FaCheckCircle />

                                Default
                            </span>
                        )}
                    </div>


                    <div
                        className="
              mt-3

              flex
              items-start
              gap-2

              text-sm
              leading-6
              text-slate-600
            "
                    >
                        <FaMapMarkerAlt
                            className="
                mt-1
                shrink-0

                text-orange-500
              "
                        />

                        <p>
                            {address.addressLine}
                            ,{" "}
                            {address.city}
                            ,{" "}
                            {address.state}
                            {" - "}
                            {address.pincode}
                        </p>
                    </div>
                </div>
            </div>


            {/* =====================
          ACTIONS
      ====================== */}

            <div
                className="
          mt-5

          flex
          flex-wrap
          items-center
          gap-2

          border-t
          border-slate-100

          pt-4
        "
            >
                {!address.isDefault && (
                    <button
                        type="button"

                        onClick={
                            onSetDefault
                        }

                        disabled={
                            defaultLoading
                        }

                        className="
              min-h-10

              rounded-xl

              bg-orange-50

              px-3.5

              text-xs
              font-black
              text-orange-600

              transition

              hover:bg-orange-100

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
                    >
                        Set as Default
                    </button>
                )}


                <button
                    type="button"

                    onClick={
                        onEdit
                    }

                    className="
            inline-flex
            min-h-10
            items-center
            gap-2

            rounded-xl

            border
            border-slate-200

            bg-white

            px-3.5

            text-xs
            font-bold
            text-slate-600

            transition

            hover:border-orange-200
            hover:text-orange-600
          "
                >
                    <FaEdit />

                    Edit
                </button>


                <button
                    type="button"

                    onClick={
                        onDelete
                    }

                    disabled={
                        deleting
                    }

                    className="
            ml-auto

            inline-flex
            min-h-10
            items-center
            gap-2

            rounded-xl

            px-3

            text-xs
            font-bold
            text-slate-400

            transition

            hover:bg-rose-50
            hover:text-rose-600

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
                >
                    <FaTrash />

                    Delete
                </button>
            </div>
        </article>
    );
};


export default AddressCard;