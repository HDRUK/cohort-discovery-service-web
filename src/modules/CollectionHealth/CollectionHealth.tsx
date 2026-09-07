"use client";

import { useCallback, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import SkeletonFull from "@/components/SkeletonFull";
import SyntheticChip from "@/components/SyntheticChip";
import ExpectedValue from "@/components/ExpectedValue";
import Table from "@/components/Table";
import useHasMounted from "@/hooks/useHasMounted";
import { useTable } from "@/hooks/useTable";
import useTaskPolling from "@/hooks/useTaskPolling";
import { useNotify } from "@/providers/NotifyProvider";
import { useDefaults } from "@/providers/DefaultProvider";
import {
  TAG_COLLECTION_HEALTH,
  TAG_COLLECTIONS_ADMIN,
  TAG_REGRESSION_TESTS,
} from "@/config/tags";
import { CollectionWithHosts, Paginated, RegressionTest } from "@/types/api";
import { getDatetime } from "@/utils/date";
import AddHealthCheckDialog from "./AddHealthCheckDialog";
import {
  buildHealthRows,
  CollectionHealthRow,
  getCheck,
  HealthLevel,
  HealthThresholds,
  regressionCheckId,
} from "./health";
import HealthDetailPanel from "./HealthDetailPanel";
import HealthIndicator, { HealthIcon } from "./HealthIndicator";

const COLLECTIONS_PER_PAGE = "500";
const REFRESH_INTERVAL = 10_000;

const REFRESH_OPTIONS = {
  refetchInterval: REFRESH_INTERVAL,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

const STAGE_DIVIDER_SX = {
  borderLeft: "2px solid",
  borderLeftColor: "divider",
} as const;

const TOOLBAR_HEIGHT_PX = 32;
const COUNT_CHIP_WIDTH_PX = 128;
const ICON_SLOT_PX = 20;

const QUERY_KEY_COLLECTIONS = [TAG_COLLECTION_HEALTH, TAG_COLLECTIONS_ADMIN];
const QUERY_KEY_REGRESSION = [TAG_COLLECTION_HEALTH, TAG_REGRESSION_TESTS];

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
  fetchedAt,
}: {
  initialCollections: CollectionWithHosts[];
  fetchedAt: number;
}) => {
  const queryClient = useQueryClient();
  const notify = useNotify();
  const hasMounted = useHasMounted();

  const [runStates, setRunStates] = useState<Record<string, Set<string>>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const defaults = useDefaults();

  const {
    data: collectionsResponse,
    isFetching: isFetchingCollections,
    isError: isCollectionsError,
    dataUpdatedAt: collectionsUpdatedAt,
  } = useQuery({
    queryKey: QUERY_KEY_COLLECTIONS,
    queryFn: () =>
      getAdminCollections({
        params: new URLSearchParams({ per_page: COLLECTIONS_PER_PAGE }),
        cacheOptions: { useCache: false },
      }),
    initialData: {
      message: "",
      data: { data: initialCollections } as Paginated<CollectionWithHosts>,
    },

    initialDataUpdatedAt: fetchedAt,
    ...REFRESH_OPTIONS,
  });

  const {
    data: regressionResponse,
    isFetching: isFetchingRegression,
    isError: isRegressionError,
    dataUpdatedAt: regressionUpdatedAt,
  } = useQuery({
    queryKey: QUERY_KEY_REGRESSION,
    queryFn: () => getRegressionTests(),
    ...REFRESH_OPTIONS,
  });

  const isFetching = isFetchingCollections || isFetchingRegression;
  const isError = isCollectionsError || isRegressionError;

  const now = useMemo(
    () =>
      Math.max(collectionsUpdatedAt || 0, regressionUpdatedAt || 0) ||
      fetchedAt,
    [collectionsUpdatedAt, regressionUpdatedAt, fetchedAt],
  );

  const collections = useMemo(
    () => collectionsResponse?.data?.data ?? [],
    [collectionsResponse],
  );

  const tests = useMemo<RegressionTest[]>(
    () => regressionResponse?.data ?? [],
    [regressionResponse],
  );

  const thresholds = useMemo<HealthThresholds>(
    () => ({
      pingA: {
        warnAfterMs: defaults.pingAWarnMs,
        failAfterMs: defaults.pingAFailMs,
      },
      pingB: {
        warnAfterMs: defaults.pingBWarnMs,
        failAfterMs: defaults.pingBFailMs,
      },
    }),
    [
      defaults.pingAWarnMs,
      defaults.pingAFailMs,
      defaults.pingBWarnMs,
      defaults.pingBFailMs,
    ],
  );

  const rows = useMemo(
    () => buildHealthRows(collections, tests, now, thresholds),
    [collections, tests, now, thresholds],
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
      const result = await createRegressionTest(values);
      if (result.error) {
        notify.error(`Could not add the health check: ${result.error}`);
        return;
      }

      notify.success("Health check added");
      invalidate();
    },
    [invalidate, notify],
  );

  const handleUpdateExpected = useCallback(
    async (testPid: string, expected: number | null, collectionPid: string) => {
      const test = tests.find((candidate) => candidate.pid === testPid);
      if (!test) return;

      const result = await updateRegressionTest(testPid, {
        collections: test.collections.map((collection) => ({
          pid: collection.pid,
          expected_result:
            collection.pid === collectionPid
              ? expected
              : collection.expected_result,
        })),
      });

      if (result.error) {
        notify.error(`Could not save the expected count: ${result.error}`);
        return;
      }

      invalidate();
    },
    [invalidate, notify, tests],
  );

  const trackRun = useCallback(
    (collectionPid: string, taskPids: Set<string>) => {
      if (taskPids.size === 0) {
        invalidate();
        return;
      }

      setRunStates((previous) => ({ ...previous, [collectionPid]: taskPids }));
    },
    [invalidate],
  );

  const handleRunTest = useCallback(
    async (testPid: string, collectionPid: string) => {
      const result = await runRegressionTest(testPid, collectionPid);
      if (result.error) {
        notify.error(`Could not run the health check: ${result.error}`);
        return;
      }

      trackRun(collectionPid, new Set(result.data?.task_pids ?? []));
    },
    [notify, trackRun],
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
              }}
            >
              <Typography variant="body2" component="span" noWrap>
                {row.original.name}
              </Typography>
              {row.original.isSynthetic && <SyntheticChip isSynthetic />}
            </Box>
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              noWrap
            >
              {row.original.custodianName}
            </Typography>
            <Tooltip title={row.original.pid}>
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
                noWrap
                sx={{ fontFamily: "monospace" }}
              >
                {row.original.pid}
              </Typography>
            </Tooltip>
          </Box>
        ),
      },
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
    ],
    [checkColumn, regressionColumn, tests],
  );

  const stageStartIds = useMemo(
    () =>
      new Set([
        "stage_1",
        "stage_2",
        "stage_3",
        "ping_a",
        "cohort_query",
        ...(tests.length ? [regressionCheckId(tests[0].pid)] : []),
      ]),
    [tests],
  );

  const table = useTable({
    data: rows,
    columns,
    getRowId: (row) => row?.pid ?? "",
    enableRowSelection: false,
    enableSorting: true,
    enableExpanding: true,

    layoutMode: "grid",

    initialState: {
      density: "compact",
      sorting: [{ id: "overall", desc: false }],
    },

    muiTableHeadCellProps: ({ column }) => ({
      sx: {
        backgroundColor: "table.main",
        fontWeight: "bold",
        ...(column.id === "mrt-row-select" && { display: "none" }),
        ...(stageStartIds.has(column.id) ? STAGE_DIVIDER_SX : {}),
      },
    }),
    muiTableBodyCellProps: ({ column }) => ({
      sx: {
        ...(column.id === "mrt-row-select" && { display: "none" }),
        ...(stageStartIds.has(column.id) ? STAGE_DIVIDER_SX : {}),
      },
    }),

    renderDetailPanel: ({ row }) => (
      <HealthDetailPanel
        row={row.original}
        isExpanded={row.getIsExpanded()}
        isRunning={!!runStates[row.original.pid]}
        onUpdateExpected={(testPid, expected) =>
          handleUpdateExpected(testPid, expected, row.original.pid)
        }
        onRunTest={(testPid) => handleRunTest(testPid, row.original.pid)}
      />
    ),
    state: { isLoading: isFetchingRegression && !regressionResponse },
  });

  const counts = useMemo(
    () =>
      rows.reduce<Record<HealthLevel, number>>(
        (accumulator, row) => {
          accumulator[row.overall.level] += 1;
          return accumulator;
        },
        { ok: 0, warn: 0, fail: 0, none: 0 },
      ),
    [rows],
  );

  if (!hasMounted) return <SkeletonFull sx={{ minHeight: 400 }} />;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: 2, flexWrap: "nowrap", minHeight: TOOLBAR_HEIGHT_PX }}
      >
        <Chip
          size="small"
          color="success"
          variant="outlined"
          icon={<HealthIcon level="ok" />}
          label={`${counts.ok} live`}
          sx={{ minWidth: COUNT_CHIP_WIDTH_PX, flexShrink: 0 }}
        />
        <Chip
          size="small"
          color="warning"
          variant="outlined"
          icon={<HealthIcon level="warn" />}
          label={`${counts.warn} degraded`}
          sx={{ minWidth: COUNT_CHIP_WIDTH_PX, flexShrink: 0 }}
        />
        <Chip
          size="small"
          color="error"
          variant="outlined"
          icon={<HealthIcon level="fail" />}
          label={`${counts.fail} failing`}
          sx={{ minWidth: COUNT_CHIP_WIDTH_PX, flexShrink: 0 }}
        />

        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          suppressHydrationWarning
          sx={{ flex: 1, minWidth: 0 }}
        >
          Updated {getDatetime(new Date(now).toISOString())}, refreshing every{" "}
          {REFRESH_INTERVAL / 1000}s. Counts are obfuscated by BUNNY, so a
          result of 0 is not treated as a failure.
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            startIcon={
              <Box
                sx={{
                  width: ICON_SLOT_PX,
                  height: ICON_SLOT_PX,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {isFetching ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <RefreshIcon sx={{ fontSize: ICON_SLOT_PX }} />
                )}
              </Box>
            }
            onClick={invalidate}
            sx={{ minWidth: 116 }}
          >
            Refresh
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            startIcon={<AddIcon sx={{ fontSize: ICON_SLOT_PX }} />}
            onClick={() => setDialogOpen(true)}
          >
            Add health check
          </Button>
        </Stack>
      </Stack>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Could not load collection health. The figures below may be stale or
          incomplete — retry with Refresh.
        </Alert>
      )}

      <Table
        table={table}
        emptyMessage={
          isError ? "Collection health is unavailable" : "No collections found"
        }
      />

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
