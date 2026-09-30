import {
  FilterX,
} from "lucide-react";

import SearchInput from "../SearchInput/SearchInput";
import Select from "../select/Select";
import Button from "../Button/Button";


const TableToolbar = ({
  // =========================
  // SEARCH
  // =========================
  searchValue = "",
  onSearchChange,
  onSearchClear,

  searchPlaceholder = "Search...",

  searchLoading = false,


  // =========================
  // FILTERS
  // =========================
  filters = [],

  onFilterChange,

  onClearFilters,


  // =========================
  // SELECTION / BULK
  // =========================
  selectedCount = 0,

  bulkActions = null,


  // =========================
  // GENERAL
  // =========================
  disabled = false,

  className = "",
}) => {

  /*
    Search ya kisi filter me
    value hai ya nahi.
  */
  const hasActiveFilters =
    Boolean(searchValue?.trim()) ||
    filters.some((filter) => {
      const value =
        filter.value;

      return (
        value !== "" &&
        value !== null &&
        value !== undefined
      );
    });


  const handleFilterChange = (
    key,
    value
  ) => {
    if (disabled) return;

    onFilterChange?.(
      key,
      value
    );
  };


  const handleClearFilters = () => {
    if (disabled) return;

    onClearFilters?.();
  };


  return (
    <div
      className={`
        w-full
        space-y-3

        ${className}
      `}
    >
      {/* ========================
          SEARCH + FILTERS
      ======================== */}
      <div
        className="
          flex
          flex-col
          gap-3

          lg:flex-row
          lg:items-end
        "
      >
        {/* Search */}
        <div
          className="
            w-full
            lg:max-w-md
          "
        >
          <SearchInput
            value={searchValue}

            onChange={
              onSearchChange
            }

            onClear={
              onSearchClear
            }

            placeholder={
              searchPlaceholder
            }

            loading={
              searchLoading
            }

            disabled={disabled}
          />
        </div>


        {/* Filters */}
        {filters.length > 0 && (
          <div
            className="
              grid
              w-full
              grid-cols-1
              gap-3

              sm:grid-cols-2

              lg:flex
              lg:w-auto
              lg:flex-1
              lg:flex-wrap
            "
          >
            {filters.map(
              (filter) => {
                const {
                  key,
                  label,

                  value = "",

                  options = [],

                  placeholder =
                    "Select",

                  loading = false,

                  disabled:
                    filterDisabled =
                      false,

                  className:
                    filterClassName =
                      "",
                } = filter;


                return (
                  <div
                    key={key}

                    className={`
                      w-full
                      lg:w-48

                      ${filterClassName}
                    `}
                  >
                    <Select
                      label={label}

                      value={value}

                      options={options}

                      placeholder={
                        placeholder
                      }

                      loading={
                        loading
                      }

                      disabled={
                        disabled ||
                        filterDisabled
                      }

                      onChange={(
                        event
                      ) =>
                        handleFilterChange(
                          key,
                          event.target
                            .value
                        )
                      }
                    />
                  </div>
                );
              }
            )}


            {/* Clear Filters */}
            {hasActiveFilters &&
              onClearFilters && (
                <div
                  className="
                    flex
                    items-end
                  "
                >
                  <Button
                    variant="ghost"

                    leftIcon={
                      FilterX
                    }

                    onClick={
                      handleClearFilters
                    }

                    disabled={
                      disabled
                    }

                    className="
                      w-full
                      sm:w-auto
                    "
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
          </div>
        )}
      </div>


      {/* ========================
          BULK ACTION BAR
      ======================== */}
      {selectedCount > 0 && (
        <div
          className="
            flex
            flex-col
            gap-3

            rounded-xl
            border
            border-orange-200

            bg-orange-50

            px-4
            py-3

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Selected Count */}
          <div>
            <p
              className="
                text-sm
                font-semibold
                text-gray-900
              "
            >
              {selectedCount}{" "}
              {selectedCount === 1
                ? "item"
                : "items"}{" "}
              selected
            </p>

            <p
              className="
                mt-0.5
                text-xs
                text-gray-500
              "
            >
              Choose an action for
              the selected items.
            </p>
          </div>


          {/* Bulk Actions */}
          {bulkActions && (
            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >
              {bulkActions}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default TableToolbar;