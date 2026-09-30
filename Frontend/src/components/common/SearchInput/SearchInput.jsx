import {
    Search,
    X,
    Loader2,
} from "lucide-react";

const SearchInput = ({
    value = "",
    onChange,
    onClear,

    placeholder = "Search...",

    loading = false,
    disabled = false,

    className = "",
    wrapperClassName = "",
}) => {
    const handleChange = (event) => {
        onChange?.(event.target.value);
    };

    const handleClear = () => {
        if (disabled || loading) return;

        onClear?.();

        if (!onClear) {
            onChange?.("");
        }
    };

    const showClearButton =
        Boolean(value) &&
        !loading &&
        !disabled;

    return (
        <div
            className={`
        relative
        w-full
        ${wrapperClassName}
      `}
        >
            {/* Search Icon */}
            <div
                className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          flex
          items-center
          pl-3
          text-gray-400
        "
            >
                <Search
                    className="h-5 w-5"
                    aria-hidden="true"
                />
            </div>


            {/* Input */}
            <input
                type="search"

                value={value}

                onChange={handleChange}

                placeholder={placeholder}

                disabled={disabled}

                aria-label={placeholder}

                aria-busy={loading}

                className={`
          min-h-11
          w-full

          rounded-lg
          border
          border-gray-300

          bg-white

          pl-10
          pr-10

          text-sm
          text-gray-900

          outline-none

          transition
          duration-200

          placeholder:text-gray-400

          focus:border-orange-500
          focus:ring-2
          focus:ring-orange-500/20

          disabled:cursor-not-allowed
          disabled:bg-gray-100
          disabled:text-gray-500

          ${className}
        `}
            />


            {/* Right Action */}
            <div
                className="
          absolute
          inset-y-0
          right-0
          flex
          items-center
          pr-2
        "
            >
                {loading ? (
                    <Loader2
                        className="
              h-4
              w-4
              animate-spin
              text-gray-400
            "
                        aria-hidden="true"
                    />
                ) : showClearButton ? (
                    <button
                        type="button"

                        onClick={handleClear}

                        aria-label="Clear search"

                        className="
              inline-flex
              h-8
              w-8
              items-center
              justify-center

              rounded-md

              text-gray-400

              transition

              hover:bg-gray-100
              hover:text-gray-700

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-orange-500/30
            "
                    >
                        <X
                            className="h-4 w-4"
                            aria-hidden="true"
                        />
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default SearchInput;