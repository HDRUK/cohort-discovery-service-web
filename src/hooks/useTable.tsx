import {
  getMRT_RowSelectionHandler,
  MRT_ColumnDef,
  useMaterialReactTable,
  type MRT_RowData,
  type MRT_TableOptions,
} from "material-react-table";
import { useMemo } from "react";
import SquareCheckbox from "@/components/SquareCheckbox";
import { Tooltip } from "@mui/material";

const SELECT_COL_SIZE = 60;

export const useTable = <TData extends MRT_RowData>({
  columns,
  data,
  enableRowSelection = true,
  enableSorting = false,
  ...rest
}: MRT_TableOptions<TData>) => {
  const hydratedColumns = useMemo<MRT_ColumnDef<TData>[]>(
    () => [
      ...(enableRowSelection
        ? [
            {
              id: "custom-row-select",
              header: "select",
              enableSorting: false,
              Header: ({ table }) => (
                <Tooltip title="Select all">
                  <SquareCheckbox
                    slotProps={{
                      input: { "aria-label": "Toggle select all rows" },
                    }}
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                  />
                </Tooltip>
              ),
              Cell: ({ row }) => (
                <SquareCheckbox
                  slotProps={{ input: { "aria-label": "Toggle select row" } }}
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  onChange={row.getToggleSelectedHandler()}
                />
              ),
              size: 10,
              maxSize: 10,
            } as MRT_ColumnDef<TData>,
          ]
        : []),
      ...columns,
    ],
    [columns, enableRowSelection],
  );

  return useMaterialReactTable<TData>({
    columns: hydratedColumns,
    data,
    enablePagination: false,
    enableSorting,
    enableFilters: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    enableExpanding: false,
    enableRowSelection: true,
    enableGrouping: false,
    enableHiding: false,
    displayColumnDefOptions: {
      "mrt-row-actions": {
        visibleInShowHideMenu: false,
      },
    },
    initialState: {
      density: "compact",
    },
    muiTableHeadCellProps: ({ column }) => ({
      sx: {
        backgroundColor: "table.main",
        color: "primary.main.contrastText",
        fontWeight: "bold",
        ...(column.id === "mrt-row-select" && {
          display: "none",
        }),
        ...(column.id === "custom-row-select" && {
          width: SELECT_COL_SIZE,
          minWidth: SELECT_COL_SIZE,
          maxWidth: SELECT_COL_SIZE,
          pr: 0,
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
      onClick: (event) => {
        // don't override native controls (inputs, buttons) clicks
        const target = event.target as HTMLElement | null;
        if (
          target &&
          (target.closest("input") ||
            target.closest("button") ||
            target.closest("a") ||
            target.closest("svg"))
        ) {
          return;
        }

        if (!row.getCanSelect()) return;

        try {
          // prefer row.id if available, otherwise fall back to staticRowIndex
          const rowId = row.id ?? String(staticRowIndex);
          const visibleRowIds = table.getRowModel().rows.map((r) => r.id);

          const cleanSelection = (sel: Record<string, boolean>) =>
            Object.fromEntries(
              Object.entries(sel).filter(
                ([k, v]) => v && visibleRowIds.includes(k),
              ),
            ) as Record<string, boolean>;

          const current = { ...(table.getState().rowSelection ?? {}) };
          if (event.metaKey) {
            if (!current[rowId]) {
              // add key when meta-selecting
              current[rowId] = true;
            } else {
              // remove the key entirely when meta-unselecting
              delete current[rowId];
            }
            table.setRowSelection(cleanSelection(current));
          } else {
            // deselect this row if clicking and it's the only selected row
            if (current[rowId] && Object.keys(current).length === 1) {
              table.setRowSelection(cleanSelection({}));
            } else {
              // select only this row
              table.setRowSelection(cleanSelection({ [rowId]: true }));
            }
          }
        } catch (_) {
          // toggle this row only using the helper
          getMRT_RowSelectionHandler({ row, staticRowIndex, table })(event);
        }
      },
      sx: { backgroundColor: "transparent !important", cursor: "pointer" },
    }),
    muiTableBodyCellProps: ({ column }) => ({
      sx: {
        ...(column.id === "mrt-row-select" && {
          display: "none",
        }),
        ...(column.id === "custom-row-select" && {
          width: SELECT_COL_SIZE,
          minWidth: SELECT_COL_SIZE,
          maxWidth: SELECT_COL_SIZE,
          textOverflow: "false",
        }),
      },
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
