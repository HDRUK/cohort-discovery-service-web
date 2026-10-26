"use client";

import { useCallback, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";
import Link from "next/link";
import { routes } from "@/config/routes";
import SkeletonFull from "@/components/SkeletonFull";
import SyntheticChip from "@/components/SyntheticChip";
import ExpectedValue from "@/components/ExpectedValue";
import Table from "@/components/Table";
import useHasMounted from "@/hooks/useHasMounted";
import { useTable } from "@/hooks/useTable";
import { CollectionWithHosts, RegressionTest } from "@/types/api";
import { getDatetime } from "@/utils/date";
import AddHealthCheckDialog from "./AddHealthCheckDialog";
import useCollectionHealth, { REFRESH_INTERVAL } from "./useCollectionHealth";
import {
  CollectionHealthRow,
  getCheck,
  HealthLevel,
  regressionCheckId,
} from "./health";
import HealthDetailPanel from "./HealthDetailPanel";
import HealthIndicator, { HealthIcon } from "./HealthIndicator";

const STAGE_DIVIDER_SX = {
  borderLeft: "2px solid",
  borderLeftColor: "divider",
} as const;

const TOOLBAR_HEIGHT_PX = 32;
const COUNT_CHIP_WIDTH_PX = 128;
const ICON_SLOT_PX = 20;

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
  const hasMounted = useHasMounted();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    rows,
    tests,
    collections,
    now,
    runStates,
    isFetching,
    isFetchingRegression,
    hasRegressionResponse,
    isError,
    invalidate,
    addHealthCheck,
    updateExpected,
    runTest,
  } = useCollectionHealth({ initialCollections, fetchedAt });

  const handleUpdateExpected = updateExpected;
  const handleRunTest = runTest;

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
              <Link
                href={routes.adminCollectionHealthDetail(row.original.pid)}
                style={{ minWidth: 0, textDecoration: "none" }}
              >
                <Typography
                  variant="body2"
                  component="span"
                  color="link.main"
                  noWrap
                  sx={{ "&:hover": { textDecoration: "underline" } }}
                >
                  {row.original.name}
                </Typography>
              </Link>
              {row.original.isSynthetic && <SyntheticChip isSynthetic />}
              <Tooltip title="Open this collection's health on its own page">
                <IconButton
                  size="small"
                  component={Link}
                  href={routes.adminCollectionHealthDetail(row.original.pid)}
                  sx={{ flexShrink: 0 }}
                >
                  <OpenInNewIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
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
    state: { isLoading: isFetchingRegression && !hasRegressionResponse },
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
        onSubmit={addHealthCheck}
      />
    </Box>
  );
};

export default CollectionHealth;
