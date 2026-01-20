"use client";

import useQueryBuilder from "@/store/useQueryBuilder";

import { useEffect, useMemo, useState } from "react";
import { Query, Paginated } from "@/types/api";
import {
  MRT_ExpandedState,
  MRT_RowSelectionState,
  type MRT_ColumnDef,
} from "material-react-table";
import { Grid, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { formatNumber } from "@/utils/numbers";
import Link from "next/link";
import { Link as MuiLink } from "@mui/material";
import { routes } from "@/config/routes";
import Table from "@/components/Table";
import { getTasksStatus, getTotalAllTasks } from "@/utils/tasks";
import QueryResultsTable from "@/modules/QueryResultsTable";
import { queryToText } from "@/utils/queryBuilder";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getQueries from "@/actions/getQueries";
import { DEFAULT_INTERVAL } from "@/config/defaults";
import { getQueryName } from "@/utils/query";
import useSearchParams from "@/hooks/useSearchParams";
import { buildQueryHistoryParams } from "@/utils/params";
import { AvailableFormats } from "@/components/DownloadButton/DownloadButton";
import rerunQuery from "@/actions/rerunQuery";
import useUserStore from "@/store/useUserStore";
import { getUserQueryTag, TAG_QUERIES } from "@/config/tags";

interface QueriesTableProps {
  initialData: Paginated<Query[]>;
  columnVisibility?: Record<string, boolean>;
}

const QueriesTable = ({
  initialData,
  columnVisibility = { pid: false, "mrt-row-expand": false },
}: QueriesTableProps) => {
  const router = useRouter();
  const { searchParams } = useSearchParams();
  const { setQueryBuilderJson, setSelectedDatasets, setQueryName } =
    useQueryBuilder((qb) => ({
      resetQueryBuilderJson: qb.resetQueryBuilderJson,
      setSelectedDatasets: qb.setSelectedDatasets,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      setQueryName: qb.setQueryName,
    }));

  const user = useUserStore((store) => store.user);
  const deleteQueries = useUserStore((store) => store.deleteQueries);

  const qc = useQueryClient();
  const queryKey = useMemo(
    () => [`queries-${searchParams.toString()}`],
    [searchParams],
  );
  const { data: queries } = useQuery<Paginated<Query[]>>({
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
    staleTime: 2 * DEFAULT_INTERVAL,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasIncomplete =
        data?.data.filter((q) => q.tasks.some((t) => !t.completed_at))
          ?.length ?? 0 > 0;
      return hasIncomplete ? DEFAULT_INTERVAL : false;
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
              pathname: routes.dashboardNewQuery(pid),
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
      Cell: ({ cell }) =>
        dayjs(cell.getValue<string>()).format("DD/MM/YYYY, HH:MM:ss"),
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
            rightAction: {
              deleteProps: {
                onClick: () => {
                  deleteQueries([row.original.pid]);
                },
              },
              reRunProps: {
                label: "Re-run query",
                onClick: async () => {
                  const { data } = await rerunQuery(row.original.pid);
                  const open_queries = (searchParams.get("open_queries") || "")
                    .split(",")
                    .filter((q) => q);
                  open_queries.indexOf(data.query_pid) === -1
                    ? open_queries.push(data.query_pid)
                    : null;
                  router.push(
                    routes.dashboardQueryResult(
                      data.query_pid,
                      `open_queries=${open_queries.join(",")}`
                    )
                  );
                },
              },
              downloadProps: {
                id: row.original.pid,
                entity: "queries",
                formats: [AvailableFormats.JSON],
              },
              editProps: {
                onClick: () => {
                  const ranCollectionPids = row.original.tasks.map(
                    (t) => t.collection.pid,
                  );
                  setSelectedDatasets(ranCollectionPids);
                  setQueryName("");

                  setQueryBuilderJson(row.original.definition);
                  router.push(
                    routes.dashboardNewQuery(`query=${row.original.pid}`),
                  );
                },
              },
            },
          }}
        />
      </Paper>
    ),
  });

  return (
    <Table
      table={table}
      leftAction={{
        searchProps: {
          placeholder: "Search your historical queries...",
        },
      }}
      rightAction={{
        refreshProps: {
          tag: user ? getUserQueryTag(user.id) : TAG_QUERIES,
          label: "Refresh Queries",
        },
        sortProps: { field: "name" },
        deleteProps: {
          onClick: deleteQueries,
        },
      }}
    />
  );
};

export default QueriesTable;
