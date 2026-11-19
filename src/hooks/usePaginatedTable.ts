"use client";

import { useMemo, useState } from "react";
import {
  MRT_ColumnDef,
  MRT_RowData,
  MRT_TableOptions,
  MRT_SortingState,
  MRT_PaginationState,
  MRT_Updater,
} from "material-react-table";
import { useTable } from "./useTable";
import useSearchParams from "./useSearchParams";
import { buildRowsPerPageOptions } from "@/utils/pagination";
import { DEFAULT_PER_PAGE } from "@/config/defaults";
import { useSearchParamsTransition } from "@/contexts/SearchParamsTransitionContext";

const NO_ROWS: never[] = [];

const PREVIOUS_ROWS_OPACITY = 0.5;

interface UsePaginatedTableOptions<TData extends MRT_RowData> extends Partial<
  MRT_TableOptions<TData>
> {
  columns: MRT_ColumnDef<TData>[];
  data?: TData[];
  showSkeletonWhilePending?: boolean;
  rowCount: number;
  perPageDefault: number;
  expandFirstRow?: boolean;
  getRowId?: (row: TData) => string;

  pageParam?: string;
  perPageParam?: string;
}

export function usePaginatedTable<TData extends MRT_RowData>({
  columns,
  data,
  showSkeletonWhilePending = true,
  rowCount,
  perPageDefault,
  expandFirstRow = false,
  getRowId = (row) => row?.pid ?? String(row?.id || ""),
  pageParam = "page",
  perPageParam = "per_page",
  state,
  initialState,
  ...rest
}: UsePaginatedTableOptions<TData>) {
  const { searchParams, setSearchParams } = useSearchParams();
  const { isPending } = useSearchParamsTransition();

  const rows = data ?? NO_ROWS;
  const showPreviousRows = !showSkeletonWhilePending && data !== undefined;
  const isLoading = data === undefined || (isPending && !showPreviousRows);
  const isRefreshing = isPending && showPreviousRows;

  const page = parseInt(searchParams.get(pageParam) || "1");
  const resolvedPerPageDefault =
    perPageDefault > 0 ? perPageDefault : DEFAULT_PER_PAGE;
  const perPage = parseInt(
    searchParams.get(perPageParam) || resolvedPerPageDefault.toString(),
    10,
  );
  const rowsPerPageOptions = buildRowsPerPageOptions(resolvedPerPageDefault);

  const pagination = useMemo(
    () => ({ pageIndex: page - 1, pageSize: perPage }),
    [page, perPage],
  );

  const handlePaginationChange = (
    updaterOrValue: MRT_Updater<MRT_PaginationState>,
  ) => {
    const nextPagination =
      typeof updaterOrValue === "function"
        ? updaterOrValue(pagination)
        : updaterOrValue;

    setSearchParams({
      [pageParam]: String(nextPagination.pageIndex + 1),
      [perPageParam]: String(nextPagination.pageSize),
    });
  };

  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  /*useEffect(() => {
    const collapsed = sorting
      .map(({ id, desc }) => `${id}:${desc ? "desc" : "asc"}`)
      .join(",");

    //note: temporary right now, until implemented in the BE
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", collapsed);
    router.replace(`?${params.toString()}`);
  }, [sorting, router, searchParams]);
  */

  const firstRowId = getRowId(rows[0]);
  const expanded = useMemo(() => {
    return firstRowId && expandFirstRow ? { [firstRowId]: true } : {};
  }, [firstRowId, expandFirstRow]);

  const table = useTable<TData>({
    columns,
    data: rows,
    rowCount,
    getRowId,
    enablePagination: true,
    manualPagination: true,
    enableSorting: true,
    onPaginationChange: handlePaginationChange,
    onSortingChange: setSorting,
    initialState: {
      ...initialState,
      expanded,
    },
    state: {
      pagination,
      sorting,
      isLoading,
      showLoadingOverlay: false,
      ...state,
    },
    muiTableBodyProps: {
      "aria-busy": isLoading || isRefreshing,
      sx: isRefreshing ? { opacity: PREVIOUS_ROWS_OPACITY } : undefined,
    },
    muiPaginationProps: {
      rowsPerPageOptions,
    },
    muiBottomToolbarProps: {
      sx: {
        display: "flex",
        "&& .MuiInputBase-input, && .MuiSelect-select": {
          backgroundColor: "transparent !important",
        },

        "&& .MuiInputBase-root, && .MuiInput-root": {
          backgroundColor: "transparent !important",
        },
      },
    },
    ...rest,
  });

  return table;
}
