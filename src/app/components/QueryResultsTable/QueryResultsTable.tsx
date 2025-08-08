"use client";

import { Query, Task, Result } from "@/types/api";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, Chip, Paper } from "@mui/material";
import { revalidateAction } from "@/actions/revalidate";
import { useEffect } from "react";
import { useTable } from "@/hooks/useTable";
import { useDaphneStore } from "@/store/useDaphneStore";
import { QueryResultsTableSkeleton } from "./QueryResultsTableSkeleton";

const QueryResultsTable = ({ query }: { query: Query }) => {
  const {
    stateManagement: { isLoading },
  } = useDaphneStore();

  const { tasks } = query;

  const isPending = tasks.some((t) => !t.result);

  useEffect(() => {
    if (!isPending) return;
    const interval = setInterval(() => {
      console.log("getting again");
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
    /*{
      accessorFn: (row) => row.tasks?.length ?? 0,
      id: "tasks",
      header: "Dataset Count",
      minSize: 50,
      maxSize: 80,
      Cell: ({ cell }) => cell.getValue<number>().toString(),
    },*/
  ];

  const table = useTable<Task>({
    columns,
    data: tasks,
  });

  if (isLoading) {
    return <QueryResultsTableSkeleton />;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <MaterialReactTable table={table} />
    </Paper>
  );
};

export default QueryResultsTable;
