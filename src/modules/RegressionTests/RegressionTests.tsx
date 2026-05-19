"use client";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RuleGroupType } from "@/types/rules";
import { MRT_ColumnDef } from "material-react-table";
import {
  CollectionWithHosts,
  RegressionTest,
  RegressionTestCollection,
} from "@/types/api";
import { useTable } from "@/hooks/useTable";
import Table from "@/components/Table";
import { getDatetime, getDurationSeconds } from "@/utils/date";
import getRegressionTests from "@/actions/regressionTest/getRegressionTests";
import createRegressionTest from "@/actions/regressionTest/createRegressionTest";
import updateRegressionTest from "@/actions/regressionTest/updateRegressionTest";
import deleteRegressionTest from "@/actions/regressionTest/deleteRegressionTest";
import runRegressionTest from "@/actions/regressionTest/runRegressionTest";
import PassFailChip from "./PassFailChip";
import AddRegressionTestDialog from "./AddRegressionTestDialog";
import CollectionTaskHistory from "./CollectionTaskHistory";
import useTaskPolling from "@/hooks/useTaskPolling";

// testPid → set of still-pending taskPids
type RunStates = Record<string, Set<string>>;

type FlatRow = { test: RegressionTest; col: RegressionTestCollection | null };

interface RegressionTestsProps {
  collections: CollectionWithHosts[];
}

const RegressionTests = ({ collections }: RegressionTestsProps) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["regression-tests"],
    queryFn: () => getRegressionTests(),
    staleTime: 30_000,
  });

  const tests = useMemo(() => data?.data ?? [], [data]);

  const rows = useMemo(
    (): FlatRow[] =>
      tests.flatMap((test): FlatRow[] =>
        test.collections.length > 0
          ? test.collections.map((col) => ({ test, col }))
          : [{ test, col: null }],
      ),
    [tests],
  );

  const [runStates, setRunStates] = useState<RunStates>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RegressionTest | undefined>();

  const editingJsonDef = useMemo(
    () =>
      editing?.query.definition
        ? JSON.stringify(editing.query.definition, null, 2)
        : "",
    [editing],
  );

  const handleRun = useCallback(async (testPid: string) => {
    try {
      const res = await runRegressionTest(testPid);
      if (res.error || !res.data?.task_pids?.length) return;
      setRunStates((prev) => ({
        ...prev,
        [testPid]: new Set(res.data.task_pids),
      }));
    } catch {
      // silently fail
    }
  }, []);

  const handleTaskComplete = useCallback((testPid: string, taskPid: string) => {
    setRunStates((prev) => {
      const pending = new Set(prev[testPid]);
      pending.delete(taskPid);
      if (pending.size === 0) {
        const next = { ...prev };
        delete next[testPid];
        return next;
      }
      return { ...prev, [testPid]: pending };
    });
  }, []);

  // Invalidate when a test's tasks all complete (its key disappears from runStates)
  const runStateKeysRef = useRef<string[]>([]);
  useEffect(() => {
    const currentKeys = Object.keys(runStates);
    const justCompleted = runStateKeysRef.current.filter(
      (k) => !currentKeys.includes(k),
    );
    runStateKeysRef.current = currentKeys;
    if (justCompleted.length > 0) {
      queryClient.invalidateQueries({ queryKey: ["regression-tests"] });
    }
  }, [runStates, queryClient]);

  const handleRunAll = () => {
    tests.forEach((t) => {
      if (!runStates[t.pid]) handleRun(t.pid);
    });
  };

  const openEdit = useCallback((test: RegressionTest) => {
    setEditing(test);
    setDialogOpen(true);
  }, []);

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(undefined);
  };

  const handleDialogSubmit = async (values: {
    name: string;
    query_definition: RuleGroupType;
    collections: { pid: string; expected_result: number | null }[];
  }) => {
    if (editing) {
      await updateRegressionTest(editing.pid, {
        name: values.name,
        query_definition: values.query_definition,
        collections: values.collections,
      });
    } else {
      await createRegressionTest(values);
    }
    queryClient.invalidateQueries({ queryKey: ["regression-tests"] });
  };

  const handleDelete = useCallback(
    async (pid: string) => {
      await deleteRegressionTest(pid);
      queryClient.invalidateQueries({ queryKey: ["regression-tests"] });
    },
    [queryClient],
  );

  useTaskPolling(runStates, handleTaskComplete);

  const columns = useMemo(
    (): MRT_ColumnDef<FlatRow>[] => [
      {
        id: "test",
        header: "Test",
        Cell: ({ row }) => (
          <Typography variant="body2">{row.original.test.name}</Typography>
        ),
      },
      {
        id: "collection",
        header: "Collection",
        accessorFn: (row) => row.col?.name ?? "—",
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue<string>()}</Typography>
        ),
      },
      {
        id: "expected",
        header: "Expected",
        size: 100,
        accessorFn: (row) => row.col?.expected_result,
        Cell: ({ cell }) => {
          const expected = cell.getValue<number | null | undefined>();
          if (expected === null || expected === undefined) return "—";
          return (
            <Chip
              label={expected.toLocaleString()}
              size="small"
              variant="outlined"
            />
          );
        },
      },
      {
        id: "actual",
        header: "Actual",
        size: 100,
        accessorFn: (row) => ({
          actual: row.col?.tasks[0]?.result?.count,
          expected: row.col?.expected_result,
        }),
        Cell: ({ cell }) => {
          const { actual, expected } = cell.getValue<{
            actual: number | null | undefined;
            expected: number | null | undefined;
          }>();
          if (actual === null || actual === undefined) return "—";
          const matched = expected != null ? actual === expected : null;
          return (
            <Chip
              label={actual.toLocaleString()}
              size="small"
              color={
                matched === true
                  ? "success"
                  : matched === false
                    ? "error"
                    : "default"
              }
              variant="outlined"
            />
          );
        },
      },
      {
        id: "time",
        header: "Time",
        size: 80,
        accessorFn: (row) => {
          const task = row.col?.tasks[0];
          return getDurationSeconds(
            task?.created_at,
            task?.completed_at ?? task?.failed_at,
          );
        },
        Cell: ({ cell }) => {
          const duration = cell.getValue<string | null>();
          return duration ? (
            <Typography variant="body2">{duration}</Typography>
          ) : (
            "—"
          );
        },
      },
      {
        id: "runs",
        header: "Runs",
        size: 70,
        accessorFn: (row) => row.col?.run_count,
        Cell: ({ cell }) => {
          const n = cell.getValue<number | undefined>();
          return n != null && n > 0 ? (
            <Typography variant="body2">{n}</Typography>
          ) : (
            "—"
          );
        },
      },
      {
        id: "passRate",
        header: "Pass Rate",
        size: 90,
        accessorFn: (row) => row.col?.pass_rate,
        Cell: ({ cell }) => {
          const rate = cell.getValue<number | null | undefined>();
          return rate != null ? (
            <Typography variant="body2">{rate}%</Typography>
          ) : (
            "—"
          );
        },
      },
      {
        id: "lastRun",
        header: "Last Run",
        size: 155,
        accessorFn: (row) => row.col?.last_run_at,
        Cell: ({ cell }) => {
          const ts = cell.getValue<string | null | undefined>();
          return ts ? (
            <Typography variant="caption" color="text.secondary">
              {getDatetime(ts)}
            </Typography>
          ) : (
            "—"
          );
        },
      },
      {
        id: "status",
        header: "Status",
        size: 100,
        Cell: ({ row }) => {
          const isRunning = !!runStates[row.original.test.pid];
          if (isRunning) return <CircularProgress size={16} />;
          return <PassFailChip value={row.original.col?.last_passed} />;
        },
      },
      {
        id: "controls",
        header: "",
        size: 120,
        muiTableBodyCellProps: { sx: { whiteSpace: "nowrap" } },
        Cell: ({ row }) => {
          const isRunning = !!runStates[row.original.test.pid];
          return (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Tooltip title="Run">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => handleRun(row.original.test.pid)}
                    disabled={isRunning}
                  >
                    <PlayArrowIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => openEdit(row.original.test)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={() => handleDelete(row.original.test.pid)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        },
      },
    ],
    [runStates, handleRun, openEdit, handleDelete],
  );

  const table = useTable({
    data: rows,
    columns,
    getRowId: (row) => `${row?.test?.pid ?? ""}-${row.col?.pid ?? "empty"}`,
    enableRowSelection: false,
    enableSorting: false,
    state: { isLoading },
    enableExpanding: true,
    renderDetailPanel: ({ row }) => {
      const col = row.original.col;
      if (!col) return null;
      return <CollectionTaskHistory col={col} />;
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Button
          color="secondary"
          variant="outlined"
          startIcon={<PlayArrowIcon />}
          onClick={handleRunAll}
          disabled={tests.length === 0}
        >
          Run All
        </Button>
        <Button
          color="secondary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Test
        </Button>
      </Stack>

      <Table table={table} emptyMessage="No regression tests configured" />

      <AddRegressionTestDialog
        key={`${editing?.pid ?? "new"}-${dialogOpen}`}
        open={dialogOpen}
        onClose={closeDialog}
        onSubmit={handleDialogSubmit}
        collections={collections}
        initial={editing}
        initialJsonText={editingJsonDef}
      />
    </Box>
  );
};

export default RegressionTests;
