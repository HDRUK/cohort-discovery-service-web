"use client";

import { Query, Task, Result } from "../../types/api";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Chip, CircularProgress, Link, Paper, Tooltip } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { revalidateAction } from "@/actions/revalidate";
import { useEffect } from "react";
import { useTable } from "../../hooks/useTable";
import { formatNumber } from "@/utils/numbers";
import Title from "../Title";
import { useDaphneStore } from "@/store/useDaphneStore";
import { capitaliseFirstLetter } from "@/utils/string";
import CodeBlock from "../CodeBlock";
import ShowOnClick from "../ShowOnClick";

const QueryResultsTable = ({ query }: { query: Query }) => {
  const {
    queryBuilder: { setQueryName },
  } = useDaphneStore();
  const { tasks, name } = query;
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
        return (
          <ShowOnClick
            dialogTitle={"Error details"}
            icon={
              <Chip
                color={
                  result?.status
                    ? result.status === "error"
                      ? "error"
                      : "success"
                    : "warning"
                }
                label={
                  result?.status
                    ? capitaliseFirstLetter(result.status)
                    : "Pending"
                }
              />
            }
          >
            <CodeBlock code={result?.message} />
          </ShowOnClick>
        );
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
      <Title title={"Results"} subTitle={tasks.length} />
      <MaterialReactTable table={table} />
    </Paper>
  );
};

export default QueryResultsTable;
