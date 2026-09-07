"use client";

import { useCallback, useMemo } from "react";
import { Alert, Box, Skeleton, Stack, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useQuery } from "@tanstack/react-query";
import getCollectionHealth from "@/actions/collection/getCollectionHealth";
import { getTagsCollectionHealth } from "@/config/tags";
import { PingBin, PingSummary } from "@/types/api";
import { getDatetime } from "@/utils/date";
import DragRangeOverlay from "./DragRangeOverlay";
import {
  CHART_HEIGHT,
  useSeriesColours,
  X_AXIS_HEIGHT,
  Y_AXIS_WIDTH,
} from "./telemetryChart";
import {
  formatBinLabel,
  rangeFromBins,
  tickStep,
  TimeRange,
} from "./timeRange";

const Y_AXIS_LABEL = "polls / min";

const toRates = (points: PingBin[] | undefined) =>
  points?.map((point) =>
    point.per_minute !== null && point.per_minute > 0 ? point.per_minute : null,
  );

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
  const [seriesAColour, seriesBColour] = useSeriesColours();

  const { data, isLoading, isError } = useQuery({
    queryKey: getTagsCollectionHealth(collectionPid, bin, range),
    queryFn: () => getCollectionHealth(collectionPid, bin, range),
    enabled,
    refetchOnWindowFocus: false,
  });

  const health = data?.data;

  const labels = useMemo(
    () => health?.series.a.map((point) => formatBinLabel(point.bin, bin)) ?? [],
    [health, bin],
  );

  const ratesA = useMemo(() => toRates(health?.series.a), [health]);
  const ratesB = useMemo(() => toRates(health?.series.b), [health]);

  const formatPoint = (point: PingBin | undefined, value: number | null) => {
    if (!point) return "no data yet";
    if (value === null) {
      return point.minutes === 0
        ? "no data yet"
        : `no pings · ${point.silent_minutes} min silent`;
    }

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

                height: X_AXIS_HEIGHT,
                tickLabelStyle: { fontSize: 11 },

                tickLabelInterval: (_, index) =>
                  index % tickStep(labels.length) === 0,
              },
            ]}
            yAxis={[{ label: Y_AXIS_LABEL, min: 0, width: Y_AXIS_WIDTH }]}
            series={[
              {
                data: ratesA,
                label: "A-type",
                color: seriesAColour,
                showMark: ({ index }) => (ratesA?.[index] ?? null) !== null,
                valueFormatter: (value, { dataIndex }) =>
                  formatPoint(health.series.a[dataIndex], value),
              },
              {
                data: ratesB,
                label: "B-type",
                color: seriesBColour,
                showMark: ({ index }) => (ratesB?.[index] ?? null) !== null,
                valueFormatter: (value, { dataIndex }) =>
                  formatPoint(health.series.b[dataIndex], value),
              },
            ]}
          >
            <DragRangeOverlay onSelect={handleDragSelect} />
          </LineChart>

          <Stack spacing={0.25}>
            <SummaryLine
              label="A-type"
              colour={seriesAColour}
              summary={health.summary.a}
            />
            <SummaryLine
              label="B-type"
              colour={seriesBColour}
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
