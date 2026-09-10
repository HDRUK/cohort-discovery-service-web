"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MRT_ColumnDef,
  MRT_RowData,
  MRT_TableOptions,
  MRT_SortingState,
  MRT_PaginationState,
  MRT_Updater,
} from "material-react-table";
import { useTable } from "./useTable";
import { buildRowsPerPageOptions } from "@/utils/pagination";
import { DEFAULT_PER_PAGE } from "@/config/defaults";

interface UsePaginatedTableOptions<TData extends MRT_RowData> extends Partial<
  MRT_TableOptions<TData>
> {
  columns: MRT_ColumnDef<TData>[];
  data: TData[];
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
  const router = useRouter();
  const searchParams = useSearchParams();

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

    const params = new URLSearchParams(searchParams.toString());

    params.set(pageParam, String(nextPagination.pageIndex + 1));
    params.set(perPageParam, String(nextPagination.pageSize));

    router.replace(`?${params.toString()}`);
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

  const firstRowId = getRowId(data?.[0]);
  const expanded = useMemo(() => {
    return firstRowId && expandFirstRow ? { [firstRowId]: true } : {};
  }, [firstRowId, expandFirstRow]);

  const table = useTable<TData>({
    columns,
    data,
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
      ...state,
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
