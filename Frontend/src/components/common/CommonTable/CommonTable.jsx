import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import Skeleton from "../Skeleton/Skeleton";
import Checkbox from "../Checkbox/Checkbox";


const CommonTable = ({
  columns = [],
  data = [],

  rowKey,

  loading = false,
  skeletonRows = 5,

  emptyState = null,

  minWidth = "min-w-[800px]",

  rowClassName = "",

  className = "",
  wrapperClassName = "",

  // =========================
  // ROW SELECTION
  // =========================
  selectable = false,

  selectedKeys = [],

  onSelectionChange,

  isRowSelectable = () => true,
}) => {
  const selectAllRef =
    useRef(null);


  /*
    Stable public key
  */
  const getRowKey = (
    row,
    index
  ) => {
    if (
      typeof rowKey === "function"
    ) {
      return rowKey(row);
    }

    if (
      typeof rowKey === "string" &&
      row?.[rowKey] !== undefined
    ) {
      return row[rowKey];
    }

    return index;
  };


  /*
    Selected keys ko Set me convert.

    .has() lookup fast hota hai.
  */
  const selectedKeySet =
    useMemo(
      () =>
        new Set(selectedKeys),
      [selectedKeys]
    );


  /*
    Current page par kaunsi rows
    selectable hain?
  */
  const selectableRowKeys =
    useMemo(() => {
      if (!selectable) {
        return [];
      }

      return data
        .map((row, index) => ({
          row,
          key: getRowKey(
            row,
            index
          ),
        }))
        .filter(({ row }) =>
          isRowSelectable(row)
        )
        .map(({ key }) => key);

    }, [
      data,
      selectable,
      rowKey,
      isRowSelectable,
    ]);


  /*
    Current visible page ki
    saari selectable rows selected?
  */
  const allPageRowsSelected =
    selectableRowKeys.length > 0 &&
    selectableRowKeys.every(
      (key) =>
        selectedKeySet.has(key)
    );


  /*
    Kuch rows selected hain,
    lekin sab nahi.
  */
  const somePageRowsSelected =
    selectableRowKeys.some(
      (key) =>
        selectedKeySet.has(key)
    ) &&
    !allPageRowsSelected;


  /*
    Native checkbox ka
    indeterminate state.
  */
  useEffect(() => {
    if (
      selectAllRef.current
    ) {
      selectAllRef.current.indeterminate =
        somePageRowsSelected;
    }
  }, [
    somePageRowsSelected,
  ]);


  // =========================
  // SINGLE ROW SELECT
  // =========================

  const handleRowSelection = (
    key,
    checked
  ) => {
    if (loading) return;

    const nextSelected =
      new Set(selectedKeys);


    if (checked) {
      nextSelected.add(key);
    } else {
      nextSelected.delete(key);
    }


    onSelectionChange?.(
      Array.from(nextSelected)
    );
  };


  // =========================
  // SELECT CURRENT PAGE
  // =========================

  const handleSelectAll = (
    checked
  ) => {
    if (loading) return;


    const nextSelected =
      new Set(selectedKeys);


    if (checked) {
      /*
        Current page ki
        selectable rows add.
      */
      selectableRowKeys.forEach(
        (key) => {
          nextSelected.add(key);
        }
      );

    } else {
      /*
        Sirf current page ki
        selection remove.

        Agar future me cross-page
        selection hogi to doosre page
        ke selected keys safe rahenge.
      */
      selectableRowKeys.forEach(
        (key) => {
          nextSelected.delete(key);
        }
      );
    }


    onSelectionChange?.(
      Array.from(nextSelected)
    );
  };


  /*
    Empty state
  */
  if (
    !loading &&
    data.length === 0 &&
    emptyState
  ) {
    return emptyState;
  }


  return (
    <div
      className={`
        w-full
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white

        ${wrapperClassName}
      `}
    >
      <div
        className="
          w-full
          overflow-x-auto
        "
      >
        <table
          className={`
            w-full
            border-collapse
            text-left

            ${minWidth}
            ${className}
          `}

          aria-busy={loading}
        >
          {/* =====================
              HEADER
          ===================== */}
          <thead className="bg-gray-50">
            <tr>

              {/* SELECT ALL */}
              {selectable && (
                <th
                  scope="col"

                  className="
                    w-12
                    border-b
                    border-gray-200
                    px-4
                    py-3
                  "
                >
                  <Checkbox
                    ref={selectAllRef}

                    checked={
                      allPageRowsSelected
                    }

                    disabled={
                      loading ||
                      selectableRowKeys.length ===
                        0
                    }

                    onChange={(event) =>
                      handleSelectAll(
                        event.target.checked
                      )
                    }

                    aria-label={
                      allPageRowsSelected
                        ? "Deselect all rows on this page"
                        : "Select all rows on this page"
                    }

                    wrapperClassName="w-fit"
                  />
                </th>
              )}


              {/* NORMAL HEADERS */}
              {columns.map(
                (column) => {
                  const {
                    key,
                    label,

                    align = "left",

                    headerClassName = "",

                    stickyRight = false,
                  } = column;


                  const alignment = {
                    left:
                      "text-left",

                    center:
                      "text-center",

                    right:
                      "text-right",
                  };


                  return (
                    <th
                      key={key}

                      scope="col"

                      className={`
                        whitespace-nowrap

                        border-b
                        border-gray-200

                        px-4
                        py-3

                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-500

                        ${
                          alignment[
                            align
                          ] ||
                          alignment.left
                        }

                        ${
                          stickyRight
                            ? `
                              sticky
                              right-0
                              z-20
                              bg-gray-50
                            `
                            : ""
                        }

                        ${headerClassName}
                      `}
                    >
                      {label}
                    </th>
                  );
                }
              )}
            </tr>
          </thead>


          {/* =====================
              BODY
          ===================== */}
          <tbody
            className="
              divide-y
              divide-gray-100
            "
          >
            {loading ? (

              // ===================
              // SKELETON
              // ===================

              Array.from({
                length:
                  skeletonRows,
              }).map(
                (_, rowIndex) => (
                  <tr
                    key={
                      `skeleton-${rowIndex}`
                    }
                  >
                    {selectable && (
                      <td
                        className="
                          w-12
                          px-4
                          py-4
                        "
                      >
                        <Skeleton
                          width="w-5"
                          height="h-5"
                          rounded="rounded"
                        />
                      </td>
                    )}


                    {columns.map(
                      (column) => (
                        <td
                          key={
                            column.key
                          }

                          className={`
                            px-4
                            py-4

                            ${
                              column
                                .stickyRight
                                ? `
                                  sticky
                                  right-0
                                  bg-white
                                `
                                : ""
                            }
                          `}
                        >
                          <Skeleton
                            height="h-4"

                            width={
                              column
                                .skeletonWidth ||
                              "w-full"
                            }
                          />
                        </td>
                      )
                    )}
                  </tr>
                )
              )

            ) : (

              // ===================
              // ACTUAL ROWS
              // ===================

              data.map(
                (
                  row,
                  rowIndex
                ) => {
                  const key =
                    getRowKey(
                      row,
                      rowIndex
                    );


                  const rowSelectable =
                    isRowSelectable(
                      row
                    );


                  const isSelected =
                    selectedKeySet.has(
                      key
                    );


                  return (
                    <tr
                      key={key}

                      className={`
                        group

                        transition-colors

                        ${
                          isSelected
                            ? "bg-orange-50/50"
                            : "hover:bg-gray-50/70"
                        }

                        ${rowClassName}
                      `}
                    >
                      {/* ROW CHECKBOX */}
                      {selectable && (
                        <td
                          className="
                            w-12
                            px-4
                            py-3.5
                          "
                        >
                          <Checkbox
                            checked={
                              isSelected
                            }

                            disabled={
                              loading ||
                              !rowSelectable
                            }

                            onChange={(
                              event
                            ) =>
                              handleRowSelection(
                                key,
                                event.target
                                  .checked
                              )
                            }

                            aria-label={
                              isSelected
                                ? "Deselect row"
                                : "Select row"
                            }

                            wrapperClassName="w-fit"
                          />
                        </td>
                      )}


                      {/* NORMAL CELLS */}
                      {columns.map(
                        (column) => {
                          const {
                            key:
                              columnKey,

                            render,

                            align =
                              "left",

                            cellClassName =
                              "",

                            stickyRight =
                              false,
                          } = column;


                          const alignment = {
                            left:
                              "text-left",

                            center:
                              "text-center",

                            right:
                              "text-right",
                          };


                          const cellContent =
                            typeof render ===
                            "function"
                              ? render(
                                  row,
                                  rowIndex
                                )
                              : row?.[
                                  columnKey
                                ];


                          return (
                            <td
                              key={
                                columnKey
                              }

                              className={`
                                px-4
                                py-3.5

                                text-sm
                                text-gray-700

                                ${
                                  alignment[
                                    align
                                  ] ||
                                  alignment.left
                                }

                                ${
                                  stickyRight
                                    ? `
                                      sticky
                                      right-0
                                      z-10

                                      ${
                                        isSelected
                                          ? "bg-orange-50"
                                          : "bg-white group-hover:bg-gray-50"
                                      }
                                    `
                                    : ""
                                }

                                ${cellClassName}
                              `}
                            >
                              {cellContent ??
                                "-"}
                            </td>
                          );
                        }
                      )}
                    </tr>
                  );
                }
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default CommonTable;