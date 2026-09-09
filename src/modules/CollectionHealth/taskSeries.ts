import dayjs from "dayjs";
import { DurationStats, TaskHistoryBin, TaskHistoryTask } from "@/types/api";
import { binWidthMinutes, TimeRange } from "./timeRange";

const MS_PER_MINUTE = 60_000;

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

interface RunInterval {
  pid: string;
  start: number;
  end: number;
  durationMs: number | null;
}

export interface TaskSeriesPoint extends TaskHistoryBin {
  taskPids: string[];
}

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

interface ConcurrencyEvent {
  at: number;
  delta: number;
}

const peakConcurrency = (events: ConcurrencyEvent[]): number => {
  events.sort((a, b) => a.at - b.at || a.delta - b.delta);

  let running = 0;
  let peak = 0;
  events.forEach((event) => {
    running += event.delta;
    peak = Math.max(peak, running);
  });

  return peak;
};

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

  const binStartAt = (index: number) => from + index * widthMs;
  const binEndAt = (index: number) => Math.min(binStartAt(index) + widthMs, to);

  const binIndexOf = (iso: string | null): number => {
    if (!iso) return -1;

    const at = dayjs(iso).valueOf();
    if (!Number.isFinite(at) || at < from) return -1;

    const index = Math.floor((at - from) / widthMs);
    if (index < 0 || index >= count || at >= binEndAt(index)) return -1;

    return index;
  };

  const pids: Set<string>[] = Array.from({ length: count }, () => new Set());
  const events: ConcurrencyEvent[][] = Array.from({ length: count }, () => []);
  const durations: number[][] = Array.from({ length: count }, () => []);
  const queued: number[][] = Array.from({ length: count }, () => []);
  const overlapMs = new Float64Array(count);
  const started = new Int32Array(count);
  const succeeded = new Int32Array(count);
  const failed = new Int32Array(count);

  toIntervals(tasks, now).forEach((interval) => {
    const first = Math.max(0, Math.floor((interval.start - from) / widthMs));
    const last = Math.min(
      count - 1,
      Math.ceil((interval.end - from) / widthMs) - 1,
    );

    for (let index = first; index <= last; index += 1) {
      const start = binStartAt(index);
      const end = binEndAt(index);
      if (interval.start >= end || interval.end <= start) continue;

      const clippedStart = Math.max(interval.start, start);
      const clippedEnd = Math.min(interval.end, end);

      pids[index].add(interval.pid);
      overlapMs[index] += clippedEnd - clippedStart;
      events[index].push(
        { at: clippedStart, delta: 1 },
        { at: clippedEnd, delta: -1 },
      );
    }

    if (interval.durationMs === null) return;

    const settledIn = Math.floor((interval.end - from) / widthMs);
    if (
      settledIn >= 0 &&
      settledIn < count &&
      interval.end >= binStartAt(settledIn) &&
      interval.end < binEndAt(settledIn)
    ) {
      durations[settledIn].push(interval.durationMs);
    }
  });

  tasks.forEach((task) => {
    const createdIn = binIndexOf(task.created_at);
    if (createdIn !== -1) {
      started[createdIn] += 1;
      if (task.queued_for_ms !== null)
        queued[createdIn].push(task.queued_for_ms);
    }

    const completedIn = binIndexOf(task.completed_at);
    if (completedIn !== -1) succeeded[completedIn] += 1;

    const failedIn = binIndexOf(task.failed_at);
    if (failedIn !== -1) failed[failedIn] += 1;
  });

  return Array.from({ length: count }, (_, index) => {
    const start = binStartAt(index);
    const elapsedMs = Math.max(0, Math.min(binEndAt(index), now) - start);

    return {
      taskPids: [...pids[index]],
      bin: dayjs(start).toISOString(),
      minutes: Math.round(elapsedMs / MS_PER_MINUTE),
      started: started[index],
      finished: durations[index].length,
      succeeded: succeeded[index],
      failed: failed[index],
      concurrency_avg: elapsedMs > 0 ? overlapMs[index] / elapsedMs : null,
      concurrency_max: elapsedMs > 0 ? peakConcurrency(events[index]) : null,
      duration_ms: summarise(durations[index]),
      queued_for_ms_avg: mean(queued[index]),
    };
  });
};
