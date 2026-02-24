"use client";

import { Query, Task, Result } from "../../types/api";
import { MRT_TableOptions, type MRT_ColumnDef } from "material-react-table";
import { Box, CircularProgress, Link } from "@mui/material";
import ErrorIcon from "@/components/ErrorIcon";
import LaunchIcon from "@mui/icons-material/Launch";
import { useEffect, useMemo } from "react";
import { useTable } from "../../hooks/useTable";
import { formatNumber } from "@/utils/numbers";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import useSearchParams from "@/hooks/useSearchParams";
import { DEFAULT_INTERVAL, STATUS_LABELS } from "@/config/defaults";
import Table from "../../components/Table";
import { TableProps } from "../../components/Table/Table";
import getQuery from "@/actions/getQuery";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import QueryHistoryGuidance from "../QueryHistory";

interface QueryResultsTableProps {
  initialData: Query;
  initialSearchParams?: URLSearchParams;
  tableProps?: TableProps;
  useTableProps?: Omit<MRT_TableOptions<Task>, "data" | "columns">;
}

const QueryResultsTable = ({
  initialData,
  initialSearchParams = new URLSearchParams(),
  tableProps,
  useTableProps,
}: QueryResultsTableProps) => {
  const { setQueryName, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    setQueryName: qb.setQueryName,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    queryAsText: qb.queryAsText,
  }));

  const queryKey = useMemo(
    () => [
      "query",
      initialData.pid,
      `${initialData.pid}-${initialSearchParams.toString()}`,
    ],
    [initialSearchParams, initialData.pid],
  );
  const qc = useQueryClient();
  const { data: query } = useQuery<Query>({
    queryKey,
    queryFn: async () => {
      const res = await getQuery(initialData.pid, {
        params: initialSearchParams.toString(),
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
      const hasPending = data?.tasks?.some((t) => !t.completed_at);
      return hasPending ? DEFAULT_INTERVAL : false;
    },
  });
  useEffect(() => {
    qc.setQueryData(queryKey, initialData);
  }, [qc, queryKey, initialData]);

  const { tasks, name, definition } = query;

  useEffect(() => {
    setQueryBuilderJson(definition);
  }, [definition, setQueryBuilderJson]);

  useEffect(() => {
    setQueryName(name);
  }, [name, setQueryName]);

  const columns: MRT_ColumnDef<Task>[] = [
    {
      accessorKey: "custodian_name",
      accessorFn: (row) => row.collection.custodian?.name,
      header: "Custodian",
      size: 250,
      minSize: 250,
      maxSize: 250,
    },
    {
      accessorKey: "collection_name",
      accessorFn: (row) => ({
        name: row.collection.name,
        url: row.collection.url,
      }),
      Cell: ({ cell }) => {
        const { name, url } = cell.getValue<{ name: string; url: string }>();
        if (!url) {
          return <span> {name} </span>;
        }
        return (
          <Link
            component="a"
            rel="noopener noreferrer"
            target="_blank"
            href={url}
            sx={{
              display: "inline-flex",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {name}
            <LaunchIcon
              fontSize="small"
              sx={{ ml: 0.25, verticalAlign: "middle" }}
            />
          </Link>
        );
      },
      header: "Dataset",
      size: 200,
      minSize: 200,
      maxSize: 400,
    },
    {
      accessorKey: "total",
      accessorFn: (row) => row.result,
      header: "Total",
      Cell: ({ cell, row: { original } }) => {
        const result = cell.getValue<Result>();
        const { count, status } = result || {};
        if (status === "error" || original.failed_at) {
          return <ErrorIcon message={original.latest_run?.error_message} />;
        }

        return count === undefined || count === null ? (
          <CircularProgress size={12} />
        ) : (
          formatNumber(count)
        );
      },
      size: 100,
      minSize: 100,
      maxSize: 100,
    },
    {
      accessorKey: "status",
      accessorFn: (row) => row.result,
      header: "Status",
      Cell: ({ cell, row: { original } }) => {
        const result = cell.getValue<Result>();
        if (original.failed_at) {
          return "Failed";
        }
        const rawStatus = result?.status ?? "pending";
        const displayStatus = STATUS_LABELS[rawStatus] ?? rawStatus;
        return displayStatus;
      },
      size: 100,
      minSize: 100,
      maxSize: 100,
    },
  ];

  const { getSearchParam } = useSearchParams("sort");
  const currentSortDirection = getSearchParam()?.split(":")[1];

  // ideally this would be done on the BE
  // - made a note of this for the BE
  // - we should definitely do this on the BE
  //   if the results are to be paginated in the future
  const sortedTasks = useMemo(() => {
    if (!currentSortDirection) {
      return [...tasks].sort(
        (a, b) => (b.result?.count ?? -1) - (a.result?.count ?? -1),
      );
    }
    return tasks;
  }, [tasks, currentSortDirection]);

  const table = useTable<Task>({
    columns,
    data: sortedTasks,
    ...useTableProps,
  });

  return (
    <Box sx={{ p: 2, gap: 2, display: "flex", flexDirection: "column" }}>
      <Table
        table={table}
        rightPanel={QueryHistoryGuidance}
        rightPanelProps={{ resultsView: true }}
        {...tableProps}
      />
    </Box>
  );
};

export default QueryResultsTable;
