"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MRT_ColumnDef,
  MRT_RowData,
  MRT_TableOptions,
} from "material-react-table";
import { useTable } from "./useTable";

interface UsePaginatedTableOptions<TData extends MRT_RowData>
  extends Partial<MRT_TableOptions<TData>> {
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
  getRowId = (row) => row.pid,
  ...rest
}: UsePaginatedTableOptions<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(
    searchParams.get("per_page") || perPageDefault.toString()
  );

  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: perPage,
  });

  const [sorting, setSorting] = useState([]);

  const table = useTable<TData>({
    columns,
    data,
    rowCount,
    getRowId,
    enablePagination: true,
    manualPagination: true,
    enableSorting: true,
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 20],
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

  /*
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(
    searchParams.get("per_page") || perPageDefault.toString()
  );

  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: perPage,
  });

  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    const collapsed = sorting
      .map(({ id, desc }) => `${id}:${desc ? "desc" : "asc"}`)
      .join(",");

    //note: temporary right now, until implemented in the BE
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", collapsed);
    router.replace(`?${params.toString()}`);
  }, [sorting, router, searchParams]);

  useEffect(() => {
    const currentPage = pagination.pageIndex + 1;
    const currentPerPage = pagination.pageSize;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", currentPage.toString());
    params.set("per_page", currentPerPage.toString());

    router.replace(`?${params.toString()}`);
  }, [pagination.pageIndex, pagination.pageSize, router, searchParams]);

  const firstRowId = data?.[0]?.pid;
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
      expanded,
    },
    state: {
      pagination,
      sorting,
    },
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 20],
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

  return table;*/
}
