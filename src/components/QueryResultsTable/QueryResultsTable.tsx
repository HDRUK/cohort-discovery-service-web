"use client";

import { Query, Task, Result } from "../../types/api";
import { MRT_TableOptions, type MRT_ColumnDef } from "material-react-table";
import { Box, CircularProgress, Link } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import LaunchIcon from "@mui/icons-material/Launch";
import { revalidateAction } from "@/actions/revalidate";
import { useEffect, useMemo } from "react";
import { useTable } from "../../hooks/useTable";
import { formatNumber } from "@/utils/numbers";
import useQueryBuilder from "@/store/useQueryBuilder";
import useSearchParams from "@/hooks/useSearchParams";
import { STATUS_LABELS } from "@/config/defaults";
import Table from "../Table";
import { TableProps } from "../Table/Table";

interface QueryResultsTableProps {
  query: Query;
  tableProps?: TableProps;
  useTableProps?: Omit<MRT_TableOptions<Task>, "data" | "columns">;
}

const QueryResultsTable = ({
  query,
  tableProps,
  useTableProps,
}: QueryResultsTableProps) => {
  const { setQueryName, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    setQueryName: qb.setQueryName,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    queryAsText: qb.queryAsText,
  }));

  const { tasks, name, definition } = query;

  useEffect(() => {
    setQueryBuilderJson(definition);
  }, [definition, setQueryBuilderJson]);

  useEffect(() => {
    setQueryName(name);
  }, [name, setQueryName]);

  const isPending = tasks.some((t) => !t.result);

  useEffect(() => {
    if (!isPending) return;
    const interval = setInterval(() => {
      revalidateAction(query.pid);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPending, query.pid]);

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
            component={"a"}
            href={url}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span>{name}</span>
            <LaunchIcon fontSize="small" />
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
      Cell: ({ cell }) => {
        const result = cell.getValue<Result>();
        const { count, status } = result || {};
        if (status === "error") {
          return <ErrorIcon color="error" />;
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
      Cell: ({ cell }) => {
        const result = cell.getValue<Result>();
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
        (a, b) => (b.result?.count ?? 0) - (a.result?.count ?? 0)
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
      <Table table={table} {...tableProps} />
    </Box>
  );
};

export default QueryResultsTable;
