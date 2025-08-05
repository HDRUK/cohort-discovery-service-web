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
    enableExpanding: true,
    initialState: {
      columnVisibility: { description: false },
      density: "compact",
      expanded: true,
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "secondary.main",
        color: "#fff",
        fontWeight: "bold",
      },
    },
    ...rest,
  });
};
