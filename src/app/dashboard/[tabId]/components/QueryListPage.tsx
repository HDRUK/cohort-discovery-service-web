"use client";

import { useDaphneStore } from "@/store/useDaphneStore";
import { useEffect, useState } from "react";
import { Query } from "@/types/api";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import CodeIcon from "@mui/icons-material/Code";
import { Box, Grid, Paper } from "@mui/material";
import dayjs from "dayjs";
import CodeBlock from "@/components/CodeBlock";
import ShowOnClick from "@/components/ShowOnClick";
import TaskResults from "@/components/TaskResults";
import { getNaturalLanguage } from "@/utils/queryBuilder";
import { useTable } from "@/hooks/useTable";

const QueryListPage = () => {
  const { queries, fields, getUserQueries, getUserQuery, setQueryBuilderJson } =
    useDaphneStore();
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

  const table = useTable<Query>({
    columns,
    data: rows,
    renderDetailPanel: ({ row }) => (
      <Grid container spacing={2}>
        <Grid size={5}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: "grey.100",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "grey.200",
                boxShadow: 3,
              },
            }}
            onClick={() =>
              row.original.definition &&
              setQueryBuilderJson(row.original.definition)
            }
          >
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
              }}
            >
              {getNaturalLanguage(row.original.definition, fields)}
            </pre>
          </Paper>
        </Grid>
        <Grid size={7}>
          <TaskResults tasks={row.original.tasks} />
        </Grid>
      </Grid>
    ),
  });

  if (!hasMounted) return null;

  return (
    <Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default QueryListPage;
