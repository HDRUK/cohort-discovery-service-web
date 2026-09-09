"use client";

import { ReactNode, useMemo } from "react";
import { Alert, Box, Skeleton } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { LineItemIdentifier } from "@mui/x-charts/models";
import DragRangeOverlay from "./DragRangeOverlay";
import {
  CHART_HEIGHT,
  DASH_PATTERN,
  TICK_FONT_SIZE,
  tickStep,
  X_AXIS_HEIGHT,
  Y_AXIS_WIDTH,
} from "./chartAxis";

export interface ChartSeries {
  key: string;
  label: string;
  colour: string;
  data: (number | null)[];
  dashed?: boolean;
  showMark?: (index: number) => boolean;
  valueFormatter?: (value: number | null, dataIndex: number) => string;
}

export interface MultiSeriesLineChartProps {
  labels: string[];
  series: ChartSeries[];
  yAxisLabel: string;
  height?: number;
  isLoading?: boolean;
  errorMessage?: string | null;
  isEmpty?: boolean;
  emptyContent?: ReactNode;
  footer?: ReactNode;
  hideLegend?: boolean;
  onSelectRange?: (startIndex: number, endIndex: number) => void;
  onPointClick?: (seriesKey: string, dataIndex: number) => void;
}

const MultiSeriesLineChart = ({
  labels,
  series,
  yAxisLabel,
  height = CHART_HEIGHT,
  isLoading,
  errorMessage,
  isEmpty,
  emptyContent,
  footer,
  hideLegend,
  onSelectRange,
  onPointClick,
}: MultiSeriesLineChartProps) => {
  const dashedKeys = useMemo(
    () =>
      new Set(series.filter((entry) => entry.dashed).map((entry) => entry.key)),
    [series],
  );

  const chartSeries = useMemo(
    () =>
      series.map((entry) => ({
        id: entry.key,
        data: entry.data,
        label: entry.label,
        color: entry.colour,
        showMark: entry.showMark
          ? ({ index }: { index: number }) => entry.showMark!(index)
          : undefined,
        valueFormatter: entry.valueFormatter
          ? (value: number | null, { dataIndex }: { dataIndex: number }) =>
              entry.valueFormatter!(value, dataIndex)
          : undefined,
      })),
    [series],
  );

  const handleMarkClick = useMemo(
    () =>
      onPointClick
        ? (_: unknown, identifier: LineItemIdentifier) => {
            if (identifier.dataIndex === undefined) return;
            onPointClick(String(identifier.seriesId), identifier.dataIndex);
          }
        : undefined,
    [onPointClick],
  );

  if (isLoading) {
    return <Skeleton variant="rectangular" height={height} sx={{ mb: 1 }} />;
  }

  if (errorMessage) {
    return (
      <Alert severity="error" sx={{ mb: 1 }}>
        {errorMessage}
      </Alert>
    );
  }

  if (isEmpty) return <>{emptyContent}</>;

  return (
    <Box sx={{ minWidth: 0 }}>
      <LineChart
        height={height}
        hideLegend={hideLegend}
        xAxis={[
          {
            scaleType: "point",
            data: labels,
            height: X_AXIS_HEIGHT,
            tickLabelStyle: { fontSize: TICK_FONT_SIZE },
            tickLabelInterval: (_, index) =>
              index % tickStep(labels.length) === 0,
          },
        ]}
        yAxis={[{ label: yAxisLabel, min: 0, width: Y_AXIS_WIDTH }]}
        series={chartSeries}
        onMarkClick={handleMarkClick}
        slotProps={{
          line: (ownerState) => ({
            strokeDasharray: dashedKeys.has(String(ownerState.id))
              ? DASH_PATTERN
              : undefined,
          }),
        }}
      >
        {onSelectRange && <DragRangeOverlay onSelect={onSelectRange} />}
      </LineChart>

      {footer}
    </Box>
  );
};

export default MultiSeriesLineChart;
