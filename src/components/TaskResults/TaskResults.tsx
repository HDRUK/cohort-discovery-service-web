"use client";

import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Task } from "../../types/api";
import {
  Box,
  LinearProgress,
  Typography,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { useTable } from "../../hooks/useTable";
import { formatNumber } from "@/utils/numbers";
import { RemoveCircle } from "@mui/icons-material";
import dayjs from "dayjs";
import Table from "../Table";

type TaskResultsProps = {
  tasks: Task[];
};

const TaskResults = ({ tasks }: TaskResultsProps) => {
  const columns = useMemo<MRT_ColumnDef<Task>[]>(
    () => [
      {
        id: "status",
        header: "",
        Cell: ({ row }) => {
          const { completed_at, failed_at, attempts } = row.original;
          if (failed_at) {
            return (
              <Tooltip title={`Marked as failed after ${attempts} were made.`}>
                <RemoveCircle color="error" fontSize="small" />
              </Tooltip>
            );
          }
          return completed_at ? (
            <CheckCircleIcon color="success" fontSize="small" />
          ) : (
            <PendingIcon color="warning" fontSize="small" />
          );
        },
        size: 20,
      },
      {
        accessorFn: (row) => row.collection?.name ?? "—",
        id: "collection",
        header: "Collection",
        size: 200,
      },
      {
        accessorKey: "attempted_at",
        header: "Executed At",
        minSize: 80,
        maxSize: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value
            ? dayjs(cell.getValue<string>()).format("MMM D, YYYY h:mm A")
            : "-";
        },
      },
      {
        accessorFn: (row) => row.result?.count ?? null,
        id: "count",
        header: "Count",
        Cell: ({ row }) => {
          const count = row.original.result?.count;
          const { failed_at } = row.original;
          if (failed_at) return "-";
          return count === undefined || count === null ? (
            <CircularProgress size={20} />
          ) : (
            formatNumber(count)
          );
        },
        size: 100,
      },
      {
        id: "coverage",
        header: "Coverage [%]",
        accessorFn: (row) => {
          const total = row?.collection?.latest_demographic?.count || 0;

          const count = row.result?.count;

          if (count === undefined || count === null) return null;
          if (!total || total === 0) return 0;

          return Math.round((count / total) * 100);
        },
        Cell: ({ cell, row }) => {
          const { failed_at } = row.original;
          if (failed_at) return "-";
          const percent = cell.getValue<number | null>();

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 120,
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={percent || 0}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="body2" sx={{ minWidth: 32 }}>
                {percent != null ? (
                  <>{percent}% </>
                ) : (
                  <CircularProgress size={20} />
                )}
              </Typography>
            </Box>
          );
        },
        size: 160,
      },
    ],
    [],
  );

  const table = useTable({
    columns,
    data: tasks || [],
  });

  return <Table table={table} />;
};

export default TaskResults;
