"use client";

import { Query, Task, Result } from "@/types/api";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, CircularProgress, Link, Paper, Typography } from "@mui/material";
import { revalidateAction } from "@/actions/revalidate";
import { useEffect } from "react";
import { useTable } from "@/hooks/useTable";
import { formatNumber } from "@/utils/numbers";
import TableTitle from "../TableTitle/TableTitle";

const QueryResultsTable = ({ query }: { query: Query }) => {
  const { tasks } = query;

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
      accessorKey: "collection_name",
      Cell: ({ row }) => (
        <Link component="a" href={row.original.collection.url || "#"}>
          {row.original.collection.name}
        </Link>
      ),
      header: "Dataset",
      size: 400,
      minSize: 400,
      maxSize: 400,
    },
    {
      accessorKey: "total",
      accessorFn: (row) => row.result?.count,
      header: "Total",
      Cell: ({ cell }) => {
        const count = cell.getValue<number | undefined>();
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
        if (result) {
          return "Successful";
        } else {
          return "Pending";
        }
      },
      size: 100,
      minSize: 100,
      maxSize: 100,
    },
  ];

  const table = useTable<Task>({
    columns,
    data: tasks,
  });

  return (
    <Paper sx={{ p: 2, gap: 2, display: "flex", flexDirection: "column" }}>
      <TableTitle name={"Results"} count={tasks.length} />
      <MaterialReactTable table={table} />
    </Paper>
  );
};

export default QueryResultsTable;
