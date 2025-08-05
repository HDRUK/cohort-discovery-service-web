"use client";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import { Task } from "../types/api";
import {
  Box,
  LinearProgress,
  Typography,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";

type TaskResultsProps = {
  tasks: Task[];
};

const TaskResults = ({ tasks }: TaskResultsProps) => {
  const columns = useMemo<MRT_ColumnDef<Task>[]>(
    () => [
      {
        id: "status",
        header: "",
        accessorFn: (row) => row.completed_at !== null,
        Cell: ({ cell }) => {
          const completed = cell.getValue<boolean>();
          return completed ? (
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
        accessorFn: (row) => row.result?.count ?? null,
        id: "count",
        header: "Count",
        Cell: ({ row }) => {
          const count = row.original.result?.count;
          return count === undefined || count === null ? (
            <CircularProgress size={20} />
          ) : (
            count
          );
        },
        size: 100,
      },

      {
        id: "coverage",
        header: "Coverage [%]",
        accessorFn: (row) => {
          const sexCount = row?.collection?.size?.count;

          const total = sexCount ? parseInt(sexCount) : 0;
          const count = row.result?.count;

          if (count === undefined || count === null) return null;
          if (!total || total === 0) return 0;

          return Math.round((count / total) * 100);
        },
        Cell: ({ cell }) => {
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
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tasks,
    enablePagination: false,
    enableSorting: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableRowSelection: false,
    initialState: {
      density: "compact",
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "secondary.main",
        color: "#fff",
        fontWeight: "bold",
      },
    },
  });

  return <MaterialReactTable table={table} />;
};

export default TaskResults;
