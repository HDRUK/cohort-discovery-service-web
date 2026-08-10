"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MRT_ColumnDef,
  MRT_RowData,
  MRT_TableOptions,
  MRT_SortingState,
  MRT_Updater,
} from "material-react-table";
import { useTable } from "./useTable";
import { buildRowsPerPageOptions } from "@/utils/pagination";
import { DEFAULT_PER_PAGE } from "@/config/defaults";
import { SortDirection } from "@/types/common";

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

  sortParam?: string;
  serverSorting?: boolean;
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
  sortParam = "sort",
  serverSorting = false,
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

  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: perPage,
  });

  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const [sortField, sortDirection] = (searchParams.get(sortParam) ?? "").split(
    ":",
  );

  const urlSorting: MRT_SortingState = sortField
    ? [{ id: sortField, desc: sortDirection === SortDirection.DESCENDING }]
    : [];

  const handleSortingChange = (
    updaterOrValue: MRT_Updater<MRT_SortingState>,
  ) => {
    const nextSorting =
      typeof updaterOrValue === "function"
        ? updaterOrValue(urlSorting)
        : updaterOrValue;

    const [column] = nextSorting;
    const params = new URLSearchParams(searchParams.toString());

    if (column) {
      const direction = column.desc
        ? SortDirection.DESCENDING
        : SortDirection.ASCENDING;

      params.set(sortParam, `${column.id}:${direction}`);
    } else {
      params.delete(sortParam);
    }

    params.set(pageParam, "1");

    router.replace(`?${params.toString()}`);
  };

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

  useEffect(() => {
    const currentPage = (pagination.pageIndex + 1).toString();
    const currentPerPage = pagination.pageSize.toString();

    if (
      currentPage === searchParams.get(pageParam) &&
      currentPerPage === searchParams.get(perPageParam)
    )
      return;

    const params = new URLSearchParams(searchParams.toString());
    params.set(pageParam, currentPage);
    params.set(perPageParam, currentPerPage);

    router.replace(`?${params.toString()}`);
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    router,
    searchParams,
    pageParam,
    perPageParam,
  ]);

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
    manualSorting: serverSorting,
    onPaginationChange: setPagination,
    onSortingChange: serverSorting ? handleSortingChange : setSorting,
    initialState: {
      ...initialState,
      expanded,
    },
    state: {
      pagination,
      sorting: serverSorting ? urlSorting : sorting,
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
