"use client";

import { useCallback, useMemo } from "react";
import { Alert, Box, Skeleton, Stack, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useQuery } from "@tanstack/react-query";
import getCollectionHealth from "@/actions/collection/getCollectionHealth";
import { PingBin, PingSummary } from "@/types/api";
import { getDatetime } from "@/utils/date";
import DragRangeOverlay from "./DragRangeOverlay";
import {
  CHART_HEIGHT,
  SERIES_A_COLOUR,
  SERIES_B_COLOUR,
  X_AXIS_HEIGHT,
  Y_AXIS_WIDTH,
} from "./telemetryChart";
import { formatBinLabel, rangeFromBins, tickStep, TimeRange } from "./timeRange";

// per_minute is normalised by the API, so this holds at every bin width — the
// bin control changes resolution, never scale.
const Y_AXIS_LABEL = "polls / min";

const SummaryLine = ({
  label,
  colour,
  summary,
}: {
  label: string;
  colour: string;
  summary?: PingSummary;
}) => {
  if (!summary) return null;

  const silent = summary.last_ping_at === null;

  return (
    <Typography variant="caption" color="text.secondary" component="div">
      <Box
        component="span"
        sx={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: colour,
          mr: 0.75,
        }}
      />
      {label}:{" "}
      {silent
        ? "no pings in this window"
        : `last ${getDatetime(summary.last_ping_at ?? undefined)} · ${summary.pings.toLocaleString()} pings · ${summary.empty_bins} empty bin(s) · longest gap ${summary.longest_gap_bins}`}
    </Typography>
  );
};

interface PingHistoryChartProps {
  collectionPid: string;
  bin: string;
  range: TimeRange;
  enabled: boolean;
  onSelectRange: (range: TimeRange) => void;
}

const PingHistoryChart = ({
  collectionPid,
  bin,
  range,
  enabled,
  onSelectRange,
}: PingHistoryChartProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["collection-health-series", collectionPid, bin, range],
    queryFn: () => getCollectionHealth(collectionPid, bin, range),
    enabled,
    refetchOnWindowFocus: false,
    // No polling: the range is an explicit from/to span, so refetching it
    // returns the same bins. Reset re-seeds the range to the last hour, which
    // is how you pull the view forward to now.
  });

  const health = data?.data;

  // The API zero-fills and sorts ascending, so both series align with the same
  // bin list and need no gap-filling here — the zeros are the signal.
  const labels = useMemo(
    () => health?.series.a.map((point) => formatBinLabel(point.bin, bin)) ?? [],
    [health, bin],
  );

  // per_minute rather than n — the rate is what stays comparable across bin
  // widths. Nulls are kept in place: MUI draws them as a gap, which is the
  // right reading for "no data can exist yet", and it keeps both series
  // index-aligned with the labels.
  const ratesA = health?.series.a.map((point) => point.per_minute);
  const ratesB = health?.series.b.map((point) => point.per_minute);

  // n and silent_minutes belong in the tooltip and nowhere else — silence is
  // what separates an outage from a host polling on a slower cadence.
  const formatPoint = (point: PingBin | undefined, value: number | null) => {
    if (value === null || !point) return "no data yet";

    return `${value.toFixed(2)} /min · ${point.n.toLocaleString()} pings · ${point.silent_minutes} min silent`;
  };

  const handleDragSelect = useCallback(
    (startIndex: number, endIndex: number) => {
      if (!health) return;

      const next = rangeFromBins(
        health.series.a.map((point) => point.bin),
        startIndex,
        endIndex,
        bin,
        health.to,
      );
      if (next) onSelectRange(next);
    },
    [health, bin, onSelectRange],
  );

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="subtitle2">Host polling</Typography>

      {enabled && isLoading && (
        <Skeleton variant="rectangular" height={CHART_HEIGHT} sx={{ mb: 1 }} />
      )}

      {enabled && isError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          Could not load ping history for this collection.
        </Alert>
      )}

      {health && (
        <>
          <LineChart
            height={CHART_HEIGHT}
            xAxis={[
              {
                scaleType: "point",
                data: labels,
                // Explicit height: the axis needs its own band for tick labels.
                height: X_AXIS_HEIGHT,
                tickLabelStyle: { fontSize: 11 },
                // 60+ bins cannot each carry a label without colliding.
                tickLabelInterval: (_, index) =>
                  index % tickStep(labels.length) === 0,
              },
            ]}
            yAxis={[{ label: Y_AXIS_LABEL, min: 0, width: Y_AXIS_WIDTH }]}
            series={[
              {
                data: ratesA,
                label: "A-type",
                color: SERIES_A_COLOUR,
                showMark: true,
                valueFormatter: (value, { dataIndex }) =>
                  formatPoint(health.series.a[dataIndex], value),
              },
              {
                data: ratesB,
                label: "B-type",
                color: SERIES_B_COLOUR,
                showMark: true,
                valueFormatter: (value, { dataIndex }) =>
                  formatPoint(health.series.b[dataIndex], value),
              },
            ]}>
            <DragRangeOverlay onSelect={handleDragSelect} />
          </LineChart>

          <Stack spacing={0.25}>
            <SummaryLine
              label="A-type"
              colour={SERIES_A_COLOUR}
              summary={health.summary.a}
            />
            <SummaryLine
              label="B-type"
              colour={SERIES_B_COLOUR}
              summary={health.summary.b}
            />
            <Typography variant="caption" color="text.secondary">
              A ping is a poll for work, not a query. Rates are not comparable
              between collections, so empty bins and gaps are the signal rather
              than any uptime figure.
            </Typography>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default PingHistoryChart;
