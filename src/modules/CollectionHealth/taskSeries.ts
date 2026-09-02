import dayjs from "dayjs";
import { DurationStats, TaskHistoryBin, TaskHistoryTask } from "@/types/api";
import { binWidthMinutes, TimeRange } from "./timeRange";

const MS_PER_MINUTE = 60_000;

/**
 * Nearest-rank percentile, matching the CUME_DIST() the API uses for its
 * whole-range summary — so a bin's figures and the summary's agree.
 */
const percentile = (sorted: number[], p: number): number | null => {
  if (!sorted.length) return null;

  const index = Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1);
  return sorted[Math.max(0, index)];
};

const summarise = (durations: number[]): DurationStats => {
  const sorted = [...durations].sort((a, b) => a - b);

  if (!sorted.length) {
    return {
      runs_measured: 0,
      min: null,
      avg: null,
      p50: null,
      p95: null,
      max: null,
    };
  }

  const total = sorted.reduce((sum, value) => sum + value, 0);

  return {
    runs_measured: sorted.length,
    min: sorted[0],
    avg: Math.round(total / sorted.length),
    p50: percentile(sorted, 0.5),
    p95: percentile(sorted, 0.95),
    max: sorted[sorted.length - 1],
  };
};

const mean = (values: number[]): number | null =>
  values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : null;

/** A run reduced to the interval it occupied, in epoch milliseconds. */
interface RunInterval {
  pid: string;
  start: number;
  end: number;
  durationMs: number | null;
}

/**
 * A bin, plus the tasks that contributed to it. `taskPids` is client-only —
 * it is what a click on a mark resolves to, and it would be dropped if the API
 * ever served a `series` block of its own.
 */
export interface TaskSeriesPoint extends TaskHistoryBin {
  taskPids: string[];
}

/**
 * A run's span. An unsettled run has no end — it is held open to `now` rather
 * than dropped, since a worker stuck mid-run is exactly what the plot is for.
 */
const toIntervals = (tasks: TaskHistoryTask[], now: number): RunInterval[] =>
  tasks.flatMap((task) =>
    task.runs.flatMap((run) => {
      const claimed = run.claimed_at ?? run.started_at;
      if (!claimed) return [];

      const start = dayjs(claimed).valueOf();
      const end = run.finished_at ? dayjs(run.finished_at).valueOf() : now;
      if (!Number.isFinite(start) || !Number.isFinite(end)) return [];

      return [
        {
          pid: task.pid,
          start,
          end: Math.max(start, end),
          durationMs: run.duration_ms,
        },
      ];
    }),
  );

/** Peak simultaneous runs inside a bin, by sweeping the interval endpoints. */
const peakConcurrency = (
  intervals: RunInterval[],
  binStart: number,
  binEnd: number,
): number => {
  const events = intervals.flatMap((interval) => [
    { at: Math.max(interval.start, binStart), delta: 1 },
    { at: Math.min(interval.end, binEnd), delta: -1 },
  ]);

  // Ends before starts at the same instant, so a run ending exactly as another
  // begins is not counted as two concurrent runs.
  events.sort((a, b) => a.at - b.at || a.delta - b.delta);

  let running = 0;
  let peak = 0;
  events.forEach((event) => {
    running += event.delta;
    peak = Math.max(peak, running);
  });

  return peak;
};

const inBin = (iso: string | null, start: number, end: number): boolean => {
  if (!iso) return false;

  const at = dayjs(iso).valueOf();
  return at >= start && at < end;
};

/**
 * Splits tasks by their `task_type`, keys ascending so each type keeps the same
 * colour across refetches. Every group is binned separately, and since bins are
 * derived from the range alone the groups stay index-aligned.
 */
export const groupByTaskType = (
  tasks: TaskHistoryTask[],
): Map<string, TaskHistoryTask[]> => {
  const groups = new Map<string, TaskHistoryTask[]>();

  tasks.forEach((task) => {
    const existing = groups.get(task.task_type);
    if (existing) existing.push(task);
    else groups.set(task.task_type, [task]);
  });

  return new Map([...groups].sort(([a], [b]) => a.localeCompare(b)));
};

/**
 * Bins a page of tasks into the series the plots draw, so the charts do not
 * wait on the API growing a `series` block of its own.
 *
 * Concurrency is attributed by each run's overlap with the bin; duration is
 * attributed by the bin a run finished in. The two deliberately differ — a long
 * run counts towards concurrency across every bin it spans, but towards
 * duration only once it ends.
 */
export const buildTaskSeries = (
  tasks: TaskHistoryTask[],
  bin: string,
  range: TimeRange,
  now: number = Date.now(),
): TaskSeriesPoint[] => {
  const width = binWidthMinutes(bin);
  const from = dayjs(range.from).valueOf();
  const to = dayjs(range.to).valueOf();
  if (width === null || !Number.isFinite(from) || !Number.isFinite(to)) {
    return [];
  }

  const widthMs = width * MS_PER_MINUTE;
  const count = Math.ceil((to - from) / widthMs);
  if (count <= 0) return [];

  const intervals = toIntervals(tasks, now);

  return Array.from({ length: count }, (_, index) => {
    const start = from + index * widthMs;
    const end = Math.min(start + widthMs, to);

    // The final bin is usually still filling, and a bin wholly ahead of now has
    // no elapsed time at all — a rate over it would be meaningless.
    const elapsedMs = Math.max(0, Math.min(end, now) - start);

    const overlapping = intervals.filter(
      (interval) => interval.start < end && interval.end > start,
    );

    const overlapMs = overlapping.reduce(
      (sum, interval) =>
        sum + (Math.min(interval.end, end) - Math.max(interval.start, start)),
      0,
    );

    const settled = overlapping.filter(
      (interval) =>
        interval.durationMs !== null &&
        interval.end >= start &&
        interval.end < end,
    );

    const startedTasks = tasks.filter((task) =>
      inBin(task.created_at, start, end),
    );

    return {
      taskPids: [...new Set(overlapping.map((interval) => interval.pid))],
      bin: dayjs(start).toISOString(),
      minutes: Math.round(elapsedMs / MS_PER_MINUTE),
      started: startedTasks.length,
      finished: settled.length,
      succeeded: tasks.filter((task) => inBin(task.completed_at, start, end))
        .length,
      failed: tasks.filter((task) => inBin(task.failed_at, start, end)).length,
      concurrency_avg: elapsedMs > 0 ? overlapMs / elapsedMs : null,
      concurrency_max:
        elapsedMs > 0 ? peakConcurrency(overlapping, start, end) : null,
      duration_ms: summarise(
        settled.map((interval) => interval.durationMs as number),
      ),
      queued_for_ms_avg: mean(
        startedTasks
          .map((task) => task.queued_for_ms)
          .filter((value): value is number => value !== null),
      ),
    };
  });
};
