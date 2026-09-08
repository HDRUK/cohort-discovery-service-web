"use client";

import { useCallback } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import SkeletonFull from "@/components/SkeletonFull";
import { routes } from "@/config/routes";
import useHasMounted from "@/hooks/useHasMounted";
import { CollectionWithHosts } from "@/types/api";
import { getDatetime } from "@/utils/date";
import { CollectionHealthDetail } from "./HealthDetailPanel";
import { HealthIcon } from "./HealthIndicator";
import useCollectionHealth, { REFRESH_INTERVAL } from "./useCollectionHealth";

const OVERALL_COLOURS = {
  ok: "success",
  warn: "warning",
  fail: "error",
  none: "warning",
} as const;

const CollectionHealthDetailView = ({
  pid,
  initialCollections,
  fetchedAt,
}: {
  pid: string;
  initialCollections: CollectionWithHosts[];
  fetchedAt: number;
}) => {
  const hasMounted = useHasMounted();

  const {
    rows,
    now,
    runStates,
    isFetching,
    isError,
    invalidate,
    updateExpected,
    runTest,
  } = useCollectionHealth({ initialCollections, fetchedAt });

  const row = rows.find((candidate) => candidate.pid === pid);

  const handleUpdateExpected = useCallback(
    (testPid: string, expected: number | null) =>
      updateExpected(testPid, expected, pid),
    [pid, updateExpected],
  );

  const handleRunTest = useCallback(
    (testPid: string) => runTest(testPid, pid),
    [pid, runTest],
  );

  if (!hasMounted) return <SkeletonFull sx={{ minHeight: 400 }} />;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: 2, flexWrap: "wrap" }}
      >
        <Button
          size="small"
          variant="text"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          component={Link}
          href={routes.adminCollectionHealth}
        >
          All collections
        </Button>

        <Typography variant="subtitle1" noWrap sx={{ minWidth: 0 }}>
          {row?.name ?? pid}
        </Typography>

        {row && (
          <Chip
            size="small"
            variant="outlined"
            color={OVERALL_COLOURS[row.overall.level]}
            icon={<HealthIcon level={row.overall.level} />}
            label={row.overall.label}
          />
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          suppressHydrationWarning
          sx={{ flex: 1, minWidth: 0 }}
        >
          Updated {getDatetime(new Date(now).toISOString())}, refreshing every{" "}
          {REFRESH_INTERVAL / 1000}s.
        </Typography>

        <Button
          size="small"
          variant="outlined"
          color="secondary"
          startIcon={
            isFetching ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <RefreshIcon />
            )
          }
          onClick={invalidate}
          sx={{ minWidth: 116, flexShrink: 0 }}
        >
          Refresh
        </Button>
      </Stack>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Could not load collection health. The figures below may be stale or
          incomplete — retry with Refresh.
        </Alert>
      )}

      {!row && !isError && (
        <Alert severity="warning">
          No collection matches this identifier. It may have been removed.
        </Alert>
      )}

      {row && (
        <CollectionHealthDetail
          row={row}
          isActive
          isRunning={!!runStates[row.pid]}
          onUpdateExpected={handleUpdateExpected}
          onRunTest={handleRunTest}
        />
      )}
    </Box>
  );
};

export default CollectionHealthDetailView;
