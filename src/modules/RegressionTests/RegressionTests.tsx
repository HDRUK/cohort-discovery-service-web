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
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RuleGroupType } from "@/types/rules";
import { MRT_ColumnDef } from "material-react-table";
import {
  CollectionWithHosts,
  RegressionTest,
  RegressionTestCollection,
  RegressionTestCollectionInput,
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
import useTaskPolling from "@/hooks/useTaskPolling";
import { useConfirmBool } from "@/hooks/useConfirm";

type RunStates = Record<string, Set<string>>;

type TableRow =
  | { kind: "test"; test: RegressionTest }
  | { kind: "collection"; test: RegressionTest; col: RegressionTestCollection };

interface RegressionTestsProps {
  collections: CollectionWithHosts[];
}

const RegressionTests = ({ collections }: RegressionTestsProps) => {
  const queryClient = useQueryClient();
  const confirmBool = useConfirmBool();

  const { data, isLoading } = useQuery({
    queryKey: ["regression-tests"],
    queryFn: () => getRegressionTests(),
    staleTime: 30_000,
  });

  const tests = useMemo(() => data?.data ?? [], [data]);

  const rows = useMemo(
    (): TableRow[] =>
      tests.flatMap((test): TableRow[] => [
        { kind: "test", test },
        ...test.collections.map((col): TableRow => ({ kind: "collection", test, col })),
      ]),
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

  const handleRun = useCallback(async (testPid: string, colPid?: string) => {
    const key = colPid ?? testPid;
    try {
      const res = await runRegressionTest(testPid, colPid);
      if (res.error || !res.data?.task_pids?.length) return;
      setRunStates((prev) => ({
        ...prev,
        [key]: new Set(res.data.task_pids),
      }));
    } catch {
      // silently fail
    }
  }, []);

  const handleTaskComplete = useCallback((key: string, taskPid: string) => {
    setRunStates((prev) => {
      const pending = new Set(prev[key]);
      pending.delete(taskPid);
      if (pending.size === 0) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: pending };
    });
  }, []);

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
    collections: RegressionTestCollectionInput[];
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

  const handleDeleteTest = useCallback(
    async (test: RegressionTest) => {
      const ok = await confirmBool({
        title: "Delete test",
        description: `Delete "${test.name}" and all its history?`,
        confirmText: "Delete",
        confirmColor: "error",
        confirmVariant: "contained",
        cancelText: "Cancel",
      });
      if (!ok) return;
      await deleteRegressionTest(test.pid);
      queryClient.invalidateQueries({ queryKey: ["regression-tests"] });
    },
    [confirmBool, queryClient],
  );

  const handleRemoveCollection = useCallback(
    async (test: RegressionTest, colPid: string) => {
      await updateRegressionTest(test.pid, {
        collections: test.collections
          .filter((c) => c.pid !== colPid)
          .map((c) => ({ pid: c.pid, expected_result: c.expected_result })),
      });
      queryClient.invalidateQueries({ queryKey: ["regression-tests"] });
    },
    [queryClient],
  );

  useTaskPolling(runStates, handleTaskComplete);

  const columns = useMemo(
    (): MRT_ColumnDef<TableRow>[] => [
      {
        id: "test",
        header: "Test",
        Cell: ({ row }) => {
          if (row.original.kind !== "test") return null;
          return (
            <Typography variant="body2" fontWeight="bold">
              {row.original.test.name}
            </Typography>
          );
        },
      },
      {
        id: "collection",
        header: "Collection",
        Cell: ({ row }) => {
          if (row.original.kind !== "collection") return null;
          return (
            <Typography variant="body2">{row.original.col.name}</Typography>
          );
        },
      },
      {
        id: "expected",
        header: "Expected",
        size: 100,
        Cell: ({ row }) => {
          if (row.original.kind !== "collection") return null;
          const expected = row.original.col.expected_result;
          if (expected === null || expected === undefined) return <>—</>;
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
        Cell: ({ row }) => {
          if (row.original.kind !== "collection") return null;
          const { col } = row.original;
          const actual = col.tasks[0]?.result?.count;
          const expected = col.expected_result;
          if (actual === null || actual === undefined) return <>—</>;
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
        Cell: ({ row }) => {
          if (row.original.kind !== "collection") return null;
          const task = row.original.col.tasks[0];
          const duration = getDurationSeconds(
            task?.created_at,
            task?.completed_at ?? task?.failed_at,
          );
          return duration ? (
            <Typography variant="body2">{duration}</Typography>
          ) : (
            <>—</>
          );
        },
      },
      {
        id: "runs",
        header: "Runs",
        size: 70,
        Cell: ({ row }) => {
          if (row.original.kind !== "collection") return null;
          const n = row.original.col.run_count;
          return n > 0 ? (
            <Typography variant="body2">{n}</Typography>
          ) : (
            <>—</>
          );
        },
      },
      {
        id: "passRate",
        header: "Pass Rate",
        size: 90,
        Cell: ({ row }) => {
          if (row.original.kind !== "collection") return null;
          const rate = row.original.col.pass_rate;
          return rate != null ? (
            <Typography variant="body2">{rate}%</Typography>
          ) : (
            <>—</>
          );
        },
      },
      {
        id: "lastRun",
        header: "Last Run",
        size: 155,
        Cell: ({ row }) => {
          if (row.original.kind !== "collection") return null;
          const ts = row.original.col.last_run_at;
          return ts ? (
            <Typography variant="caption" color="text.secondary">
              {getDatetime(ts)}
            </Typography>
          ) : (
            <>—</>
          );
        },
      },
      {
        id: "status",
        header: "Status",
        size: 100,
        Cell: ({ row }) => {
          if (row.original.kind === "test") {
            const { test } = row.original;
            const anyRunning =
              !!runStates[test.pid] ||
              test.collections.some((c) => !!runStates[c.pid]);
            return anyRunning ? <CircularProgress size={16} /> : null;
          }
          const { col } = row.original;
          if (!!runStates[col.pid]) return <CircularProgress size={16} />;
          return <PassFailChip value={col.last_passed} />;
        },
      },
      {
        id: "controls",
        header: "",
        size: 140,
        muiTableBodyCellProps: { sx: { whiteSpace: "nowrap" } },
        Cell: ({ row }) => {
          if (row.original.kind === "test") {
            const { test } = row.original;
            const anyRunning =
              !!runStates[test.pid] ||
              test.collections.some((c) => !!runStates[c.pid]);
            return (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Tooltip title="Run all collections">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => handleRun(test.pid)}
                      disabled={anyRunning}
                    >
                      <PlayArrowIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => openEdit(test)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete test">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteTest(test)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            );
          }

          const { test, col } = row.original;
          const isRunning = !!runStates[col.pid] || !!runStates[test.pid];
          return (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Tooltip title="Run this collection">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => handleRun(test.pid, col.pid)}
                    disabled={isRunning}
                  >
                    <PlayArrowIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Remove from test">
                <IconButton
                  size="small"
                  onClick={() => handleRemoveCollection(test, col.pid)}
                >
                  <RemoveCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        },
      },
    ],
    [runStates, handleRun, openEdit, handleDeleteTest, handleRemoveCollection],
  );

  const table = useTable({
    data: rows,
    columns,
    getRowId: (row) =>
      row?.kind === "test"
        ? `test-${row.test.pid}`
        : `col-${row?.col?.pid ?? ""}`,
    enableRowSelection: false,
    enableSorting: false,
    state: { isLoading },
    muiTableBodyRowProps: ({ row }) => ({
      sx:
        row.original.kind === "test"
          ? { backgroundColor: "action.hover" }
          : {},
    }),
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
