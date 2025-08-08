import {
  useMaterialReactTable,
  type MRT_RowData,
  type MRT_TableOptions,
} from "material-react-table";

export const useTable = <TData extends MRT_RowData>({
  columns,
  data,
  ...rest
}: MRT_TableOptions<TData>) => {
  return useMaterialReactTable<TData>({
    columns,
    data,
    enableRowSelection: false,
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
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "secondary.main",
        color: "#fff",
        fontWeight: "bold",
      },
    },
    muiTopToolbarProps: {
      sx: {
        display: "none",
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        boxShadow: "none",
        backgroundColor: "transparent",
      },
    },
    ...rest,
  });
};
