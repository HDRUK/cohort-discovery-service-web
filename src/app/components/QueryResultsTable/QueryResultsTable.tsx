"use client";

import { Query, Task, Result } from "@/types/api";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { CircularProgress, Link, Paper } from "@mui/material";
import { revalidateAction } from "@/actions/revalidate";
import { useEffect } from "react";
import { useTable } from "@/hooks/useTable";
import { formatNumber } from "@/utils/numbers";

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
      minSize: 400,
    },
    {
      accessorKey: "total",
      accessorFn: (row) => row.result?.count,
      header: "Total",
      maxSize: 50,
      Cell: ({ cell }) => {
        const count = cell.getValue<number | undefined>();
        return count === undefined || count === null ? (
          <CircularProgress size={20} />
        ) : (
          formatNumber(count)
        );
      },
    },
    {
      accessorKey: "status",
      accessorFn: (row) => row.result,
      header: "Status",
      maxSize: 50,
      Cell: ({ cell }) => {
        const result = cell.getValue<Result>();
        if (result) {
          return "Successful";
        } else {
          return "Pending";
        }
      },
    },
  ];

  const table = useTable<Task>({
    columns,
    data: tasks,
  });

  return (
    <Paper sx={{ p: 2 }}>
      <MaterialReactTable table={table} />
    </Paper>
  );
};

export default QueryResultsTable;
