"use client";

import { Query, Task, Result } from "../../types/api";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { revalidateAction } from "@/actions/revalidate";
import { useEffect } from "react";
import { useTable } from "../../hooks/useTable";
import { formatNumber } from "@/utils/numbers";
import Title from "../Title";
import useQueryBuilder from "@/store/useQueryBuilder";
import SortIcon from "@mui/icons-material/Sort";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DownloadIcon from "@mui/icons-material/Download";
import ControlledSearchBox from "@/modules/ControlledSearchBox";

const STATUS_LABELS: Record<string, string> = {
  ok: "Successful",
  error: "Failed",
  pending: "Pending",
};

const QueryResultsTable = ({ query }: { query: Query }) => {
  const { setQueryName, setQueryBuilderJson, queryAsText } = useQueryBuilder(
    (qb) => ({
      setQueryName: qb.setQueryName,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      queryAsText: qb.queryAsText,
    })
  );

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
        url: row.collection.url || "#",
      }),
      Cell: ({ cell }) => {
        const { name, url } = cell.getValue<{ name: string; url: string }>();
        return (
          <Link component="a" href={url}>
            {name}
          </Link>
        );
      },
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
        const rawStatus = result?.status ?? "pending";
        const displayStatus = STATUS_LABELS[rawStatus] ?? rawStatus;
        return displayStatus;
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
    <Box sx={{ p: 2, gap: 2, display: "flex", flexDirection: "column" }}>
      <Title title={"Query Results"} subTitle={query.pid} />
      <Typography variant="h6">{queryAsText}</Typography>
      <Divider />

      <ControlledSearchBox
        placeholder="Search your query results..."
        actions={[
          <IconButton key="sort">
            <SortIcon />
          </IconButton>,
          <IconButton key="delete">
            <DeleteForeverIcon />
          </IconButton>,
          <IconButton
            key="download"
            href={`/api/download/${query.pid}?entity=queries&format=json`}
          >
            <DownloadIcon />
          </IconButton>,
        ]}
      />

      <Paper sx={{ p: 2, gap: 2, display: "flex", flexDirection: "column" }}>
        <MaterialReactTable table={table} />
      </Paper>
    </Box>
  );
};

export default QueryResultsTable;
