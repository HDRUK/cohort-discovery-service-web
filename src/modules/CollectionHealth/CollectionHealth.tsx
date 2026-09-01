"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MRT_ColumnDef } from "material-react-table";
import getAdminCollections from "@/actions/collection/getAdminCollections";
import createRegressionTest from "@/actions/regressionTest/createRegressionTest";
import getRegressionTests from "@/actions/regressionTest/getRegressionTests";
import runRegressionTest from "@/actions/regressionTest/runRegressionTest";
import updateRegressionTest from "@/actions/regressionTest/updateRegressionTest";
import rerunDistributions from "@/actions/rerunDistributions";
import SyntheticChip from "@/components/SyntheticChip";
import Table from "@/components/Table";
import { useConfirmBool } from "@/hooks/useConfirm";
import { useTable } from "@/hooks/useTable";
import useTaskPolling from "@/hooks/useTaskPolling";
import {
  CollectionWithHosts,
  DistributionType,
  Paginated,
  RegressionTest,
} from "@/types/api";
import AddHealthCheckDialog from "./AddHealthCheckDialog";
import ExpectedValue from "./ExpectedValue";
import {
  buildHealthRows,
  CollectionHealthRow,
  getCheck,
  HealthLevel,
  regressionCheckId,
} from "./health";
import HealthDetailPanel from "./HealthDetailPanel";
import HealthIndicator, { HealthIcon } from "./HealthIndicator";

const REFRESH_INTERVAL = 15_000;
const AGE_TICK_INTERVAL = 5_000;
const COLLECTIONS_PER_PAGE = "500";

const QUERY_KEY_COLLECTIONS = ["collection-health", "collections"];
const QUERY_KEY_REGRESSION = ["collection-health", "regression-tests"];

// Ascending sort puts healthy first, then degraded, with failures last.
const LEVEL_RANK: Record<HealthLevel, number> = {
  ok: 0,
  warn: 1,
  none: 2,
  fail: 3,
};

const OVERALL_COLOURS: Record<HealthLevel, "success" | "warning" | "error"> = {
  ok: "success",
  warn: "warning",
  fail: "error",
  none: "warning",
};

const CollectionHealth = ({
  initialCollections,
}: {
  initialCollections: CollectionWithHosts[];
}) => {
  const queryClient = useQueryClient();
  const confirm = useConfirmBool();

  const [now, setNow] = useState(() => Date.now());
  const [runStates, setRunStates] = useState<Record<string, Set<string>>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), AGE_TICK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const { data: collectionsResponse, isFetching: isFetchingCollections } =
    useQuery({
      queryKey: QUERY_KEY_COLLECTIONS,
      queryFn: () =>
        getAdminCollections({
          params: new URLSearchParams({ per_page: COLLECTIONS_PER_PAGE }),
          cacheOptions: { useCache: false },
        }),
      refetchInterval: REFRESH_INTERVAL,
      initialData: {
        message: "",
        data: { data: initialCollections } as Paginated<CollectionWithHosts>,
      },
    });

  const { data: regressionResponse, isFetching: isFetchingRegression } =
    useQuery({
      queryKey: QUERY_KEY_REGRESSION,
      queryFn: () => getRegressionTests(),
      refetchInterval: REFRESH_INTERVAL,
    });

  const collections = useMemo(
    () => collectionsResponse?.data?.data ?? [],
    [collectionsResponse],
  );

  const tests = useMemo<RegressionTest[]>(
    () => regressionResponse?.data ?? [],
    [regressionResponse],
  );

  const rows = useMemo(
    () => buildHealthRows(collections, tests, now),
    [collections, tests, now],
  );

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY_COLLECTIONS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEY_REGRESSION });
  }, [queryClient]);

  const handleTaskComplete = useCallback(
    (collectionPid: string, taskPid: string) => {
      setRunStates((previous) => {
        const remaining = new Set(previous[collectionPid] ?? []);
        remaining.delete(taskPid);

        if (remaining.size === 0) {
          const { [collectionPid]: _removed, ...rest } = previous;
          return rest;
        }

        return { ...previous, [collectionPid]: remaining };
      });
      invalidate();
    },
    [invalidate],
  );

  useTaskPolling(runStates, handleTaskComplete);

  const handleAddHealthCheck = useCallback(
    async (values: Parameters<typeof createRegressionTest>[0]) => {
      await createRegressionTest(values);
      invalidate();
    },
    [invalidate],
  );

  const handleUpdateExpected = useCallback(
    async (testPid: string, expected: number | null, collectionPid: string) => {
      const test = tests.find((candidate) => candidate.pid === testPid);
      if (!test) return;

      await updateRegressionTest(testPid, {
        collections: test.collections.map((collection) => ({
          pid: collection.pid,
          expected_result:
            collection.pid === collectionPid
              ? expected
              : collection.expected_result,
        })),
      });
      invalidate();
    },
    [invalidate, tests],
  );

  const handleRunChecks = useCallback(
    async (row: CollectionHealthRow) => {
      const confirmed = await confirm({
        title: `Run checks for ${row.name}?`,
        description: `This triggers a live concept scan and demographics scan on the collection host, plus ${row.regressionTestPids.length} health check(s) linked to this collection. These run against the custodian's real database.`,
        confirmText: "Run checks",
        confirmColor: "primary",
        confirmVariant: "contained",
        cancelText: "Cancel",
      });

      if (!confirmed) return;

      const distributionRuns = [
        DistributionType.GENERIC,
        DistributionType.DEMOGRAPHICS,
      ].map((queryType) =>
        rerunDistributions(row.pid, { query_type: queryType }),
      );

      const regressionRuns = row.regressionTestPids.map((testPid) =>
        runRegressionTest(testPid, row.pid),
      );

      const [distributionResults, regressionResults] = await Promise.all([
        Promise.all(distributionRuns),
        Promise.all(regressionRuns),
      ]);

      const taskPids = new Set<string>([
        ...distributionResults.flatMap(
          (result) => result.data?.tasks?.map((task) => task.pid) ?? [],
        ),
        ...regressionResults.flatMap((result) => result.data?.task_pids ?? []),
      ]);

      if (taskPids.size === 0) {
        invalidate();
        return;
      }

      setRunStates((previous) => ({ ...previous, [row.pid]: taskPids }));
    },
    [confirm, invalidate],
  );

  const checkColumn = useCallback(
    (
      id: string,
      header: string,
      size = 110,
    ): MRT_ColumnDef<CollectionHealthRow> => ({
      id,
      header,
      size,
      accessorFn: (row) => LEVEL_RANK[getCheck(row, id)?.level ?? "none"],
      Cell: ({ row }) => {
        const check = getCheck(row.original, id);
        return check ? <HealthIndicator check={check} /> : null;
      },
    }),
    [],
  );

  const regressionColumn = useCallback(
    (test: RegressionTest): MRT_ColumnDef<CollectionHealthRow> => {
      const id = regressionCheckId(test.pid);

      return {
        id,
        header: test.name,
        size: 160,
        accessorFn: (row) => LEVEL_RANK[getCheck(row, id)?.level ?? "none"],
        Cell: ({ row }) => {
          const check = getCheck(row.original, id);
          if (!check) return null;

          return (
            <Stack spacing={0.5} alignItems="flex-start">
              <HealthIndicator check={check} />
              {check.linked && (
                <ExpectedValue
                  prefix="Exp"
                  value={check.expected}
                  onSave={(expected) =>
                    handleUpdateExpected(test.pid, expected, row.original.pid)
                  }
                />
              )}
            </Stack>
          );
        },
      };
    },
    [handleUpdateExpected],
  );

  const columns = useMemo<MRT_ColumnDef<CollectionHealthRow>[]>(
    () => [
      {
        id: "collection",
        header: "Collection",
        size: 260,
        accessorFn: (row) => row.name,
        Cell: ({ row }) => (
          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                minWidth: 0,
              }}>
              <Typography variant="body2" component="span" noWrap>
                {row.original.name}
              </Typography>
              {row.original.isSynthetic && <SyntheticChip isSynthetic />}
            </Box>
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              noWrap>
              {row.original.custodianName}
            </Typography>
            <Tooltip title={row.original.pid}>
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
                noWrap
                sx={{ fontFamily: "monospace" }}>
                {row.original.pid}
              </Typography>
            </Tooltip>
          </Box>
        ),
      },
      {
        id: "stage_1",
        header: "Stage 1: Connectivity",
        columns: [
          checkColumn("ping_a", "A ping"),
          checkColumn("ping_b", "B ping"),
        ],
      },
      {
        id: "stage_2",
        header: "Stage 2: Data returned",
        columns: [
          checkColumn("cohort_query", "Cohort"),
          checkColumn("concept_scan", "Concepts"),
          checkColumn("demographics_scan", "Demographics", 130),
          checkColumn("metadata", "Metadata", 130),
        ],
      },
      ...(tests.length
        ? [
            {
              id: "stage_3",
              header: "Stage 3: Validation",
              columns: tests.map(regressionColumn),
            } as MRT_ColumnDef<CollectionHealthRow>,
          ]
        : []),
      {
        id: "overall",
        header: "Overall",
        size: 130,
        accessorFn: (row) => LEVEL_RANK[row.overall.level],
        Cell: ({ row }) => (
          <Chip
            size="small"
            variant="outlined"
            color={OVERALL_COLOURS[row.original.overall.level]}
            icon={<HealthIcon level={row.original.overall.level} />}
            label={row.original.overall.label}
          />
        ),
      },
      {
        id: "controls",
        header: "",
        size: 60,
        enableSorting: false,
        muiTableBodyCellProps: { sx: { whiteSpace: "nowrap" } },
        Cell: ({ row }) => {
          if (runStates[row.original.pid]) return <CircularProgress size={16} />;

          return (
            <Tooltip title="Run concept scan, demographics scan and linked health checks">
              <IconButton
                size="small"
                onClick={() => handleRunChecks(row.original)}>
                <PlayArrowIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        },
      },
    ],
    [checkColumn, handleRunChecks, regressionColumn, runStates, tests],
  );

  const table = useTable({
    data: rows,
    columns,
    getRowId: (row) => row?.pid ?? "",
    enableRowSelection: false,
    enableSorting: true,
    enableExpanding: true,
    // Default ordering only — clicking a column header still re-sorts.
    initialState: {
      density: "compact",
      sorting: [{ id: "overall", desc: false }],
    },
    renderDetailPanel: ({ row }) => (
      <HealthDetailPanel
        row={row.original}
        onUpdateExpected={(testPid, expected) =>
          handleUpdateExpected(testPid, expected, row.original.pid)
        }
      />
    ),
    state: { isLoading: !collectionsResponse && !regressionResponse },
  });

  const counts = useMemo(
    () =>
      rows.reduce<Record<HealthLevel, number>>(
        (accumulator, row) => ({
          ...accumulator,
          [row.overall.level]: accumulator[row.overall.level] + 1,
        }),
        { ok: 0, warn: 0, fail: 0, none: 0 },
      ),
    [rows],
  );

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: 2, flexWrap: "wrap" }}>
        <Chip
          size="small"
          color="success"
          variant="outlined"
          icon={<HealthIcon level="ok" />}
          label={`${counts.ok} live`}
        />
        <Chip
          size="small"
          color="warning"
          variant="outlined"
          icon={<HealthIcon level="warn" />}
          label={`${counts.warn} degraded`}
        />
        <Chip
          size="small"
          color="error"
          variant="outlined"
          icon={<HealthIcon level="fail" />}
          label={`${counts.fail} failing`}
        />

        <Typography variant="caption" color="text.secondary">
          Auto-refreshing every {REFRESH_INTERVAL / 1000}s. Counts are
          obfuscated by BUNNY, so a result of 0 is not treated as a failure.
        </Typography>

        <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            startIcon={<RefreshIcon />}
            disabled={isFetchingCollections || isFetchingRegression}
            onClick={invalidate}>
            Refresh
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}>
            Add health check
          </Button>
        </Stack>
      </Stack>

      <Table table={table} emptyMessage="No collections found" />

      <AddHealthCheckDialog
        key={dialogOpen ? "open" : "closed"}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        collectionPids={collections.map((collection) => collection.pid)}
        onSubmit={handleAddHealthCheck}
      />
    </Box>
  );
};

export default CollectionHealth;
