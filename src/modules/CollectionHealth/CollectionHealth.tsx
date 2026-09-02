"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
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
import Table from "@/components/Table";
import { useTable } from "@/hooks/useTable";
import useTaskPolling from "@/hooks/useTaskPolling";
import { CollectionWithHosts, Paginated, RegressionTest } from "@/types/api";
import { getDatetime } from "@/utils/date";
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

const COLLECTIONS_PER_PAGE = "500";
const REFRESH_INTERVAL = 10_000;

// Refetch on the interval and on demand only — window focus and reconnect
// would otherwise refresh at unpredictable moments.
const REFRESH_OPTIONS = {
  refetchInterval: REFRESH_INTERVAL,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

// Stable reference, or useSyncExternalStore resubscribes on every render.
const subscribeNoop = () => () => {};

const STAGE_DIVIDER_SX = {
  borderLeft: "2px solid",
  borderLeftColor: "divider",
} as const;

const TOOLBAR_HEIGHT_PX = 32;
const COUNT_CHIP_WIDTH_PX = 128;
const ICON_SLOT_PX = 20;

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
  fetchedAt,
}: {
  initialCollections: CollectionWithHosts[];
  fetchedAt: number;
}) => {
  const queryClient = useQueryClient();

  // The table is derived from wall-clock ages, so server and client would
  // disagree at hydration. Render it in the browser only.
  const isClient = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  const [runStates, setRunStates] = useState<Record<string, Set<string>>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: collectionsResponse,
    isFetching: isFetchingCollections,
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
    // Stamp the seed data with the server's fetch time rather than letting
    // React Query default it to Date.now() in the browser.
    initialDataUpdatedAt: fetchedAt,
    ...REFRESH_OPTIONS,
  });

  const {
    data: regressionResponse,
    isFetching: isFetchingRegression,
    dataUpdatedAt: regressionUpdatedAt,
  } = useQuery({
    queryKey: QUERY_KEY_REGRESSION,
    queryFn: () => getRegressionTests(),
    ...REFRESH_OPTIONS,
  });

  const isFetching = isFetchingCollections || isFetchingRegression;

  // Ages are measured against the last fetch, not the wall clock, so a stale
  // page cannot drift from green to red without new data to justify it.
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

  // No task pids means nothing was queued, so just refresh rather than showing
  // a spinner that would never resolve.
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
      trackRun(collectionPid, new Set(result.data?.task_pids ?? []));
    },
    [trackRun],
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

  // Columns that begin a stage get a left border, so the three stage bands read
  // as distinct blocks rather than one continuous run of icons.
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
    // Honour the per-column `size` values so column widths stay put when a
    // cell's text changes on refresh (e.g. "4s" to "never").
    layoutMode: "grid",
    // Default ordering only — clicking a column header still re-sorts.
    initialState: {
      density: "compact",
      sorting: [{ id: "overall", desc: false }],
    },
    // These overrides replace useTable's versions wholesale, so they must keep
    // hiding MRT's built-in select column — nothing here uses row selection.
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
    // Must always return an element: MRT calls this per row to decide whether
    // that row's expand button is enabled, so returning null disables it.
    // Laziness lives inside the panel instead, via isExpanded.
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

  if (!isClient) return <SkeletonFull sx={{ minHeight: 400 }} />;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}>
      {/* Fixed heights and widths throughout: this bar must not reflow when a
          count changes or a refresh starts, or the table below resizes. */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: 2, flexWrap: "nowrap", minHeight: TOOLBAR_HEIGHT_PX }}>
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
          sx={{ flex: 1, minWidth: 0 }}>
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
                }}>
                {isFetching ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <RefreshIcon sx={{ fontSize: ICON_SLOT_PX }} />
                )}
              </Box>
            }
            onClick={invalidate}
            sx={{ minWidth: 116 }}>
            Refresh
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            startIcon={<AddIcon sx={{ fontSize: ICON_SLOT_PX }} />}
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
