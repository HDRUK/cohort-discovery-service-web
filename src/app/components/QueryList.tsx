"use client";

import { useDaphneStore } from "../store/useDaphneStore";
import { useEffect, useState } from "react";
import { Query } from "../types/api";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import CodeIcon from "@mui/icons-material/Code";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import CodeBlock from "./CodeBlock";
import ShowOnClick from "./ShowOnClick";
import TaskResults from "./TaskResults";

const QueryList = () => {
  const { queries, getUserQueries, getUserQuery } = useDaphneStore();
  const [rows, setRows] = useState<Query[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    getUserQueries();
    setHasMounted(true);
  }, [getUserQueries]);

  useEffect(() => {
    const interval = setInterval(() => {
      const incompleteQueries = queries.filter((q) =>
        q.tasks.some((t) => !t.completed_at)
      );

      incompleteQueries.forEach((q) => {
        getUserQuery(q.pid);
      });
    }, 1000);

    return () => clearInterval(interval); // Clean up on unmount
  }, [queries, getUserQuery]);

  useEffect(() => {
    if (queries && Array.isArray(queries)) {
      setRows(queries);
    }
  }, [queries]);

  const columns: MRT_ColumnDef<Query>[] = [
    {
      accessorKey: "created_at",
      header: "Created",
      minSize: 80,
      maxSize: 150,
      Cell: ({ cell }) =>
        dayjs(cell.getValue<string>()).format("MMM D, YYYY h:mm A"),
    },
    {
      accessorKey: "pid",
      header: "Identifier",
      minSize: 80,
      maxSize: 150,
    },
    {
      id: "query",
      header: "Raw Query",
      accessorFn: (row) => {
        return (
          <ShowOnClick icon={<CodeIcon />}>
            <CodeBlock code={row.definition} />
          </ShowOnClick>
        );
      },
    },
    {
      accessorFn: (row) => row.tasks?.length ?? 0,
      id: "tasks",
      header: "Dataset Count",
      minSize: 50,
      maxSize: 80,
      Cell: ({ cell }) => cell.getValue<number>().toString(),
    },
    {
      id: "percentComplete",
      header: "Percent Complete",
      minSize: 50,
      maxSize: 80,
      accessorFn: (row) => {
        const tasks = row.tasks || [];
        if (tasks.length === 0) return "0%";
        const completedCount = tasks.filter(
          (t) => t.completed_at !== null
        ).length;
        const percent = Math.round((completedCount / tasks.length) * 100);
        return `${percent}%`;
      },
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: rows,
    enableRowSelection: false,
    enablePagination: false,
    enableSorting: false,
    enableFilters: false,
    enableColumnActions: false,
    initialState: {
      columnVisibility: { description: false },
      density: "compact",
      expanded: true,
    },
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    enableExpanding: true,
    renderDetailPanel: ({ row }) => (
      <Box sx={{ width: "70%" }}>
        <TaskResults tasks={row.original.tasks} />
      </Box>
    ),
  });

  if (!hasMounted) return null;

  return <MaterialReactTable table={table} />;
};

export default QueryList;
