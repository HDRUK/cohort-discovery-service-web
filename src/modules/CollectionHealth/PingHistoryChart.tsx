"use client";

import { useCallback, useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import getCollectionHealth from "@/actions/collection/getCollectionHealth";
import MultiSeriesLineChart, {
  ChartSeries,
} from "@/components/MultiSeriesLineChart";
import { getTagsCollectionHealth } from "@/config/tags";
import { PingBin, PingSummary } from "@/types/api";
import { getDatetime } from "@/utils/date";
import { STALE_TIME_TELEMETRY, useSeriesColours } from "./telemetryChart";
import { formatBinLabel, rangeFromBins, TimeRange } from "./timeRange";

const Y_AXIS_LABEL = "polls / min";

const toRates = (points: PingBin[] | undefined): (number | null)[] =>
  points?.map((point) =>
    point.per_minute !== null && point.per_minute > 0 ? point.per_minute : null,
  ) ?? [];

const formatPoint = (point: PingBin | undefined, value: number | null) => {
  if (!point) return "no data yet";
  if (value === null) {
    return point.minutes === 0
      ? "no data yet"
      : `no pings · ${point.silent_minutes} min silent`;
  }

  return `${value.toFixed(2)} /min · ${point.n.toLocaleString()} pings · ${point.silent_minutes} min silent`;
};

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
    staleTime: STALE_TIME_TELEMETRY,
  });

  const health = data?.data;
  const hasFailed = isError || !!data?.error;

  const labels = useMemo(
    () => health?.series.a.map((point) => formatBinLabel(point.bin, bin)) ?? [],
    [health, bin],
  );

  const series = useMemo<ChartSeries[]>(() => {
    if (!health) return [];

    return (["a", "b"] as const).map((type) => {
      const points = health.series[type];
      const rates = toRates(points);

      return {
        key: type,
        label: `${type.toUpperCase()}-type`,
        colour: type === "a" ? seriesAColour : seriesBColour,
        data: rates,
        showMark: (index: number) => rates[index] !== null,
        valueFormatter: (value: number | null, dataIndex: number) =>
          formatPoint(points[dataIndex], value),
      };
    });
  }, [health, seriesAColour, seriesBColour]);

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
    <MultiSeriesLineChart
      labels={labels}
      series={series}
      yAxisLabel={Y_AXIS_LABEL}
      isLoading={enabled && isLoading}
      isEmpty={!health}
      errorMessage={
        enabled && hasFailed
          ? "Could not load ping history for this collection."
          : null
      }
      onSelectRange={handleDragSelect}
      footer={
        <Stack spacing={0.25}>
          <SummaryLine
            label="A-type"
            colour={seriesAColour}
            summary={health?.summary.a}
          />
          <SummaryLine
            label="B-type"
            colour={seriesBColour}
            summary={health?.summary.b}
          />
          <Typography variant="caption" color="text.secondary">
            A ping is a poll for work, not a query. Rates are not comparable
            between collections, so empty bins and gaps are the signal rather
            than any uptime figure.
          </Typography>
        </Stack>
      }
    />
  );
};

export default PingHistoryChart;
