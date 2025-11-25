import {
  getMRT_RowSelectionHandler,
  useMaterialReactTable,
  type MRT_RowData,
  type MRT_TableOptions,
} from "material-react-table";

const SELECT_COL_SIZE = 30;

export const useTable = <TData extends MRT_RowData>({
  columns,
  data,
  ...rest
}: MRT_TableOptions<TData>) => {
  return useMaterialReactTable<TData>({
    columns,
    data,
    enableRowSelection: true,
    enablePagination: false,
    enableSorting: false,
    enableFilters: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    enableExpanding: false,
    enableGrouping: false,
    enableHiding: false,
    displayColumnDefOptions: {
      "mrt-row-actions": {
        visibleInShowHideMenu: false,
      },
    },
    initialState: {
      columnVisibility: { description: false },
      density: "compact",
    },
    muiTableHeadCellProps: ({ column }) => ({
      sx: {
        backgroundColor: "table.main",
        color: "primary.main.contrastText",
        fontWeight: "bold",
        ...(column.id === "mrt-row-select" && {
          width: SELECT_COL_SIZE,
          minWidth: SELECT_COL_SIZE,
          maxWidth: SELECT_COL_SIZE,
        }),
      },
    }),
    muiTopToolbarProps: {
      sx: {
        display: "none",
      },
    },
    muiBottomToolbarProps: {
      sx: {
        display: "none",
      },
    },
    muiTableBodyRowProps: ({ row, staticRowIndex, table }) => ({
      onClick: (event) =>
        getMRT_RowSelectionHandler({ row, staticRowIndex, table })(event), //import this helper function from material-react-table
      sx: { backgroundColor: "transparent !important", cursor: "pointer" },
    }),
    muiTableBodyCellProps: ({ column }) => ({
      sx:
        column.id === "mrt-row-select"
          ? {
              width: SELECT_COL_SIZE,
              minWidth: SELECT_COL_SIZE,
              maxWidth: SELECT_COL_SIZE,
            }
          : {},
    }),
    muiTablePaperProps: {
      sx: {
        boxShadow: "none",
        backgroundColor: "transparent",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      },
    },
    muiTableContainerProps: {
      sx: {
        flex: 1,
        overflow: "auto",
      },
    },
    ...rest,
  });
};
