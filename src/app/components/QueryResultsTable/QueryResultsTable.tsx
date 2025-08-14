"use client";

import { Query, Task, Result } from "@/types/api";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, Chip, CircularProgress, Paper } from "@mui/material";
import { revalidateAction } from "@/actions/revalidate";
import { useEffect } from "react";
import { useTable } from "@/hooks/useTable";
import { useDaphneStore } from "@/store/useDaphneStore";
import { QueryResultsTableSkeleton } from "./QueryResultsTableSkeleton";
import { formatNumber } from "@/utils/numbers";

const QueryResultsTable = ({ query }: { query: Query }) => {
  const {
    stateManagement: { isLoading },
  } = useDaphneStore();

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
      accessorFn: (row) => row.collection.name,
      header: "Collection Name",
    },
    {
      accessorKey: "total",
      accessorFn: (row) => row.result?.count,
      header: "Total",
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
      Cell: ({ cell }) => {
        const result = cell.getValue<Result>();
        if (result) {
          return <Chip label={"Success"} color="success" />;
        } else {
          return <Chip label={"Pending"} color="warning" />;
        }
      },
    },
  ];

  const table = useTable<Task>({
    columns,
    data: tasks,
  });

  /*if (isLoading) {
    return <QueryResultsTableSkeleton />;
  }*/

  return (
    <Paper sx={{ p: 2 }}>
      <MaterialReactTable table={table} />
    </Paper>
  );
};

export default QueryResultsTable;
