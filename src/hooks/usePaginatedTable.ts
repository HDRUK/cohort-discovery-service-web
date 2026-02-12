"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MRT_ColumnDef,
  MRT_RowData,
  MRT_TableOptions,
  MRT_SortingState,
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
}

export function usePaginatedTable<TData extends { pid: string }>({
  columns,
  data,
  rowCount,
  perPageDefault,
  expandFirstRow = false,
  getRowId = (row) => row?.pid,
  state,
  initialState,
  ...rest
}: UsePaginatedTableOptions<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const resolvedPerPageDefault =
    perPageDefault > 0 ? perPageDefault : DEFAULT_PER_PAGE;
  const perPage = parseInt(
    searchParams.get("per_page") || resolvedPerPageDefault.toString(),
    10,
  );
  const rowsPerPageOptions = buildRowsPerPageOptions(resolvedPerPageDefault);

  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: perPage,
  });

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

  useEffect(() => {
    const currentPage = (pagination.pageIndex + 1).toString();
    const currentPerPage = pagination.pageSize.toString();

    if (
      currentPage === searchParams.get("page") &&
      currentPerPage === searchParams.get("per_page")
    )
      return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", currentPage);
    params.set("per_page", currentPerPage);

    router.replace(`?${params.toString()}`);
  }, [pagination.pageIndex, pagination.pageSize, router, searchParams]);

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
    onPaginationChange: setPagination,
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
