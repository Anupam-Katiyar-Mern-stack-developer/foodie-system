import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const Pagination = ({
    currentPage = 1,
    totalPages = 1,

    onPageChange,

    loading = false,
    disabled = false,

    siblingCount = 1,

    className = "",
}) => {
    const isDisabled =
        disabled || loading;

    if (
        !totalPages ||
        totalPages <= 1
    ) {
        return null;
    }


    const safeCurrentPage =
        Math.min(
            Math.max(currentPage, 1),
            totalPages
        );


    const createPageRange = () => {
        const pages = [];

        const startPage =
            Math.max(
                2,
                safeCurrentPage -
                siblingCount
            );

        const endPage =
            Math.min(
                totalPages - 1,
                safeCurrentPage +
                siblingCount
            );


        // First page
        pages.push(1);


        // Left ellipsis
        if (startPage > 2) {
            pages.push("left-ellipsis");
        }


        // Middle pages
        for (
            let page = startPage;
            page <= endPage;
            page += 1
        ) {
            pages.push(page);
        }


        // Right ellipsis
        if (
            endPage <
            totalPages - 1
        ) {
            pages.push(
                "right-ellipsis"
            );
        }


        // Last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }


        return pages;
    };


    const pages =
        createPageRange();


    const handlePageChange = (
        page
    ) => {
        if (isDisabled) return;

        if (
            page < 1 ||
            page > totalPages ||
            page === safeCurrentPage
        ) {
            return;
        }

        onPageChange?.(page);
    };


    const previousDisabled =
        isDisabled ||
        safeCurrentPage === 1;


    const nextDisabled =
        isDisabled ||
        safeCurrentPage ===
        totalPages;


    return (
        <nav
            aria-label="Pagination"

            className={`
        flex
        w-full
        items-center
        justify-between
        gap-3

        ${className}
      `}
        >
            {/* Previous */}
            <button
                type="button"

                onClick={() =>
                    handlePageChange(
                        safeCurrentPage - 1
                    )
                }

                disabled={
                    previousDisabled
                }

                aria-label="Previous page"

                className="
          inline-flex
          min-h-10
          items-center
          justify-center
          gap-1.5

          rounded-lg
          border
          border-gray-300

          bg-white

          px-3

          text-sm
          font-medium
          text-gray-700

          transition

          hover:bg-gray-50

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-orange-500/30

          disabled:cursor-not-allowed
          disabled:opacity-50
        "
            >
                <ChevronLeft
                    className="h-4 w-4"
                    aria-hidden="true"
                />

                <span className="hidden sm:inline">
                    Previous
                </span>
            </button>


            {/* =========================
          MOBILE
      ========================== */}
            <div
                className="
          flex
          items-center
          gap-1
          sm:hidden
        "
            >
                <span
                    className="
            text-sm
            font-medium
            text-gray-700
          "
                >
                    Page {safeCurrentPage}
                </span>

                <span
                    className="
            text-sm
            text-gray-400
          "
                >
                    of {totalPages}
                </span>
            </div>


            {/* =========================
          TABLET / DESKTOP
      ========================== */}
            <div
                className="
          hidden
          items-center
          gap-1
          sm:flex
        "
            >
                {pages.map(
                    (page) => {

                        const isEllipsis =
                            page ===
                            "left-ellipsis" ||
                            page ===
                            "right-ellipsis";


                        if (isEllipsis) {
                            return (
                                <span
                                    key={page}

                                    className="
                    flex
                    h-10
                    min-w-10
                    items-center
                    justify-center

                    px-2

                    text-sm
                    text-gray-400
                  "
                                    aria-hidden="true"
                                >
                                    ...
                                </span>
                            );
                        }


                        const isActive =
                            page ===
                            safeCurrentPage;


                        return (
                            <button
                                key={page}

                                type="button"

                                onClick={() =>
                                    handlePageChange(
                                        page
                                    )
                                }

                                disabled={
                                    isDisabled
                                }

                                aria-label={
                                    `Go to page ${page}`
                                }

                                aria-current={
                                    isActive
                                        ? "page"
                                        : undefined
                                }

                                className={`
                  flex
                  h-10
                  min-w-10
                  items-center
                  justify-center

                  rounded-lg

                  px-3

                  text-sm
                  font-medium

                  transition

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-orange-500/30

                  disabled:cursor-not-allowed

                  ${isActive
                                        ? `
                        bg-orange-500
                        text-white
                      `
                                        : `
                        border
                        border-gray-300
                        bg-white
                        text-gray-700
                        hover:bg-gray-50
                      `
                                    }

                  ${isDisabled &&
                                        !isActive
                                        ? "opacity-50"
                                        : ""
                                    }
                `}
                            >
                                {page}
                            </button>
                        );
                    }
                )}
            </div>


            {/* Next */}
            <button
                type="button"

                onClick={() =>
                    handlePageChange(
                        safeCurrentPage + 1
                    )
                }

                disabled={
                    nextDisabled
                }

                aria-label="Next page"

                className="
          inline-flex
          min-h-10
          items-center
          justify-center
          gap-1.5

          rounded-lg
          border
          border-gray-300

          bg-white

          px-3

          text-sm
          font-medium
          text-gray-700

          transition

          hover:bg-gray-50

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-orange-500/30

          disabled:cursor-not-allowed
          disabled:opacity-50
        "
            >
                <span className="hidden sm:inline">
                    Next
                </span>

                <ChevronRight
                    className="h-4 w-4"
                    aria-hidden="true"
                />
            </button>
        </nav>
    );
};

export default Pagination;