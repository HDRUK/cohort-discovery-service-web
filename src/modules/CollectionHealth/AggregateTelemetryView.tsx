"use client";

import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import SkeletonFull from "@/components/SkeletonFull";
import useHasMounted from "@/hooks/useHasMounted";
import { CollectionWithHosts } from "@/types/api";
import { getDatetime } from "@/utils/date";
import AggregateTelemetry from "./AggregateTelemetry";
import useCollectionHealth, { REFRESH_INTERVAL } from "./useCollectionHealth";
import useTelemetryRange from "./useTelemetryRange";

interface AggregateTelemetryViewProps {
  initialCollections: CollectionWithHosts[];
  fetchedAt: number;
}

const AggregateTelemetryView = ({
  initialCollections,
  fetchedAt,
}: AggregateTelemetryViewProps) => {
  const hasMounted = useHasMounted();
  const telemetry = useTelemetryRange();

  const { rows, now, isFetching, isError, invalidate } = useCollectionHealth({
    initialCollections,
    fetchedAt,
  });

  if (!hasMounted) return <SkeletonFull sx={{ minHeight: 400 }} />;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: 2, flexWrap: "wrap" }}
      >
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
        >
          Refresh
        </Button>
      </Stack>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Could not load the collection list, so there is nothing to plot.
        </Alert>
      )}

      <AggregateTelemetry rows={rows} telemetry={telemetry} />
    </Box>
  );
};

export default AggregateTelemetryView;
