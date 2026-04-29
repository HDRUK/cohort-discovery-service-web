"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Query, Paginated } from "@/types/api";
import {
  MRT_ExpandedState,
  MRT_RowSelectionState,
  type MRT_ColumnDef,
} from "material-react-table";
import { Grid, Paper, Typography } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import dayjs from "dayjs";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { formatNumber, trueKeys } from "@/utils/numbers";
import { getDatetime } from "@/utils/date";
import Link from "next/link";
import { Link as MuiLink } from "@mui/material";
import { routes } from "@/config/routes";
import Table from "@/components/Table";
import { getTasksStatus, getTotalAllTasks } from "@/utils/tasks";
import QueryResultsTable from "@/modules/QueryResultsTable";
import QueryHistoryGuidance from "@/modules/QueryHistory/QueryHistoryGuidance";
import { queryToText } from "@/utils/queryBuilder";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getQueries from "@/actions/query/getQueries";
import { getQueryName } from "@/utils/query";
import useSearchParams from "@/hooks/useSearchParams";
import { buildQueryHistoryParams } from "@/utils/params";
import { useDefaults } from "@/providers/DefaultProvider";
import TwoPaneSwimLaneLayout from "../TwoPaneSwimLaneLayout";
import QueriesTableSkeleton from "./QueriesTableSkeleton";

interface QueriesTableProps {
  initialData: Paginated<Query>;
  columnVisibility?: Record<string, boolean>;
}

const QueriesTable = ({
  initialData,
  columnVisibility = { pid: false, "mrt-row-expand": false },
}: QueriesTableProps) => {
  const defaults = useDefaults();
  const { searchParams } = useSearchParams();
  const { setSelectedDatasets } = useQueryBuilder((qb) => ({
    setSelectedDatasets: qb.setSelectedDatasets,
  }));

  const qc = useQueryClient();
  const queryKey = useMemo(
    () => [`queries-${searchParams.toString()}`],
    [searchParams],
  );

  //refactor candidate
  // - when do we show a loader (or not)
  // - when cache is invalidated, when we do a client side refresh?
  // - the SSR/CSR mix here has made this a little complex
  const [showSkeletonRefresh, setShowSkeletonRefresh] = useState(false);

  const { data: queries, isLoading } = useQuery<Paginated<Query>>({
    queryKey,
    queryFn: async () => {
      const searchParamsObject = buildQueryHistoryParams({
        page: Number(searchParams.get("page")) ?? initialData.current_page,
        per_page: Number(searchParams.get("per_page")) ?? initialData.per_page,
        sort: searchParams.get("sort") ?? undefined,
        search_term: searchParams.get("search_term") ?? undefined,
      });

      const res = await getQueries({
        params: searchParamsObject.toString(),
        cacheOptions: { useCache: false },
      });
      return res.data;
    },
    initialData,
    staleTime: 2 * defaults.tableRefresh,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasIncomplete =
        data?.data.filter((q) => q.tasks.some((t) => !t.completed_at))
          ?.length ?? 0 > 0;
      return hasIncomplete ? defaults.tableRefresh : false;
    },
  });
  useEffect(() => {
    qc.setQueryData(queryKey, initialData);
  }, [qc, queryKey, initialData]);

  const columns: MRT_ColumnDef<Query>[] = [
    {
      id: "pid",
      accessorKey: "pid",
      header: "Query ID",
      minSize: 80,
      maxSize: 150,
      Cell: ({ cell, row }) => {
        const pid = cell.getValue<string>();
        return (
          <MuiLink
            component={Link}
            href={{
              pathname: routes.dashboardNewQuery(undefined, pid),
              query: { query: pid },
            }}
            onClick={() => {
              setSelectedDatasets(
                row.original.tasks.map((t) => t.collection.pid),
              );
            }}
          >
            {pid}
          </MuiLink>
        );
      },
    },
    {
      accessorFn: (row) => getQueryName(row),
      header: "Query Name",
      minSize: 100,
      maxSize: 300,
      Cell: ({ cell }) => cell.getValue<string>(),
    },
    {
      accessorKey: "created_at",
      header: "Started(UTC)",
      minSize: 80,
      maxSize: 80,
      Cell: ({ cell }) => getDatetime(cell.getValue<string>()),
    },
    {
      id: "status",
      accessorFn: (row) => getTasksStatus(row.tasks),
      header: "Status",
      minSize: 50,
      maxSize: 80,
      Cell: ({ cell }) => cell.getValue<string>().toString(),
    },
    {
      id: "total",
      header: "Total",
      minSize: 50,
      maxSize: 80,
      Cell: ({ cell }) => formatNumber(cell.getValue<number>()),
      accessorFn: (row) => {
        const tasks = row.tasks || [];
        return getTotalAllTasks(tasks);
      },
    },
  ];

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [expanded, setExpanded] = useState<MRT_ExpandedState>({});

  function openQueryResult(queryId: string): string {
    const openQueries = (searchParams.get("open_queries") || "")
      .split(/,|%2C/)
      .concat(queryId)
      .filter((q) => q !== "");
    return routes.dashboardQueryResult(queryId, openQueries);
  }

  const table = usePaginatedTable<Query>({
    columns,
    data: queries.data,
    enableSorting: false,
    rowCount: queries.total,
    perPageDefault: queries.per_page,
    expandFirstRow: false,
    initialState: { columnVisibility },
    enableRowSelection: true,
    manualExpanding: true,
    enableExpanding: true,
    getRowId: (row) => row?.pid,
    onRowSelectionChange: (updaterOrValue) => {
      setRowSelection((prev) => {
        const nextSelection =
          typeof updaterOrValue === "function"
            ? updaterOrValue(prev)
            : updaterOrValue;

        setExpanded(() => {
          const nextExpanded: Record<string, boolean> = {};
          for (const rowId of Object.keys(nextSelection)) {
            nextExpanded[rowId] = true;
          }
          return nextExpanded;
        });

        return nextSelection;
      });
    },
    state: {
      rowSelection,
      expanded,
    },
    renderDetailPanel: ({ row }) => (
      <Paper
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <QueryResultsTable
          initialData={row.original}
          useTableProps={{ enableRowSelection: false }}
          tableProps={{
            leftAction: {
              titleProps: {
                startIcon: (
                  <Link href={openQueryResult(row.original.pid)}>
                    <LaunchIcon sx={{ ml: 0.25, verticalAlign: "middle" }} />
                  </Link>
                ),
                title: `Query ${getQueryName(row.original)}`,
                subTitle: "Results",
              },
            },
            details: (
              <Grid container sx={{ pt: 1 }}>
                <Grid size={10}>
                  <Typography>
                    {queryToText(row.original.definition)}
                  </Typography>
                </Grid>
                <Grid size={1}>
                  <Typography>
                    Total{" "}
                    <b> {formatNumber(getTotalAllTasks(row.original.tasks))}</b>
                  </Typography>
                </Grid>
                <Grid size={1}>
                  <Typography>
                    {dayjs(row.original.created_at).format(
                      "DD/MM/YYYY, HH:MM:ss",
                    )}
                  </Typography>
                </Grid>
              </Grid>
            ),
          }}
        />
      </Paper>
    ),
  });

  const selectedRows = useMemo(() => trueKeys(rowSelection), [rowSelection]);

  const onClear = useCallback(async () => {
    setShowSkeletonRefresh(true);
    setRowSelection({});
    setExpanded({});
    await qc.refetchQueries({ queryKey, type: "active" });
    setShowSkeletonRefresh(false);
  }, [setShowSkeletonRefresh, setRowSelection, setExpanded, qc, queryKey]);

  if (isLoading || showSkeletonRefresh) return <QueriesTableSkeleton />;

  return (
    <TwoPaneSwimLaneLayout
      left={
        <Table
          table={table}
          leftAction={{
            searchProps: {
              placeholder: "Search your historical queries...",
            },
          }}
          rightAction={{
            sortProps: { field: "name" },
          }}
        />
      }
      right={
        <QueryHistoryGuidance selectedIds={selectedRows} onClear={onClear} />
      }
    />
  );
};

export default QueriesTable;
