import { DurationStats, TaskHistoryBin } from "@/types/api";
import { formatDuration } from "@/utils/date";

export const NO_VALUE = "—";

export const formatConcurrency = (value: number | null): string =>
  value === null ? NO_VALUE : value.toFixed(1);

export const isEmptySeries = (series: TaskHistoryBin[]): boolean =>
  series.every((point) => point.started === 0 && point.finished === 0);

export const describeDurations = (stats: DurationStats): string => {
  if (stats.runs_measured === 0) return "no runs settled";

  return [
    `p50 ${formatDuration(stats.p50)}`,
    `max ${formatDuration(stats.max)}`,
    `${stats.runs_measured} run${stats.runs_measured === 1 ? "" : "s"}`,
  ].join(" · ");
};
