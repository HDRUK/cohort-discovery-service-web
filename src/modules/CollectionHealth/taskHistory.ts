import { DurationStats, TaskHistoryBin } from "@/types/api";

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;

export const NO_VALUE = "—";

/**
 * Milliseconds as a duration a human can compare at a glance. Sub-second stays
 * in ms, because a 40ms difference matters there and "0.04s" hides it.
 */
export const formatDuration = (ms: number | null | undefined): string => {
  if (ms === null || ms === undefined || !Number.isFinite(ms)) return NO_VALUE;
  if (ms < MS_PER_SECOND) return `${Math.round(ms)}ms`;

  if (ms < MS_PER_MINUTE) {
    const seconds = ms / MS_PER_SECOND;
    return `${seconds.toFixed(seconds < 10 ? 2 : 1)}s`;
  }

  const minutes = Math.floor(ms / MS_PER_MINUTE);
  const seconds = Math.round((ms % MS_PER_MINUTE) / MS_PER_SECOND);

  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
};

/** Runs in flight, to one decimal — an average of overlaps is rarely integral. */
export const formatConcurrency = (value: number | null): string =>
  value === null ? NO_VALUE : value.toFixed(1);

/**
 * True when the range holds nothing to plot. Zero-filled bins mean a silent
 * collection still returns a full series, so length alone says nothing.
 */
export const isEmptySeries = (series: TaskHistoryBin[]): boolean =>
  series.every((point) => point.started === 0 && point.finished === 0);

/**
 * p50/max/count for a bin's tooltip, skipping stats that have no runs. p95 is
 * left out: nearest-rank on the sample sizes a bin holds simply repeats max.
 */
export const describeDurations = (stats: DurationStats): string => {
  if (stats.runs_measured === 0) return "no runs settled";

  return [
    `p50 ${formatDuration(stats.p50)}`,
    `max ${formatDuration(stats.max)}`,
    `${stats.runs_measured} run${stats.runs_measured === 1 ? "" : "s"}`,
  ].join(" · ");
};
