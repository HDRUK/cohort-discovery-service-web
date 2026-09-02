import { DurationStats, TaskHistoryBin } from "@/types/api";
import {
  describeDurations,
  formatConcurrency,
  formatDuration,
  isEmptySeries,
  NO_VALUE,
} from "../taskHistory";

const stats = (overrides: Partial<DurationStats> = {}): DurationStats => ({
  runs_measured: 3,
  min: 900,
  avg: 2100,
  p50: 1800,
  p95: 4200,
  max: 4400,
  ...overrides,
});

const point = (overrides: Partial<TaskHistoryBin> = {}): TaskHistoryBin => ({
  bin: "2026-09-02T10:00:00Z",
  minutes: 10,
  started: 0,
  finished: 0,
  succeeded: 0,
  failed: 0,
  concurrency_avg: 0,
  concurrency_max: 0,
  duration_ms: stats({
    n: 0,
    min: null,
    avg: null,
    p50: null,
    p95: null,
    max: null,
  }),
  queued_for_ms_avg: null,
  ...overrides,
});

describe("formatDuration", () => {
  it("keeps sub-second values in milliseconds", () => {
    expect(formatDuration(0)).toBe("0ms");
    expect(formatDuration(40)).toBe("40ms");
    expect(formatDuration(999)).toBe("999ms");
  });

  it("switches to seconds at one second, with more precision below ten", () => {
    expect(formatDuration(1000)).toBe("1.00s");
    expect(formatDuration(9994)).toBe("9.99s");
    expect(formatDuration(12500)).toBe("12.5s");
  });

  it("switches to minutes and seconds at one minute", () => {
    expect(formatDuration(60_000)).toBe("1m 00s");
    expect(formatDuration(95_000)).toBe("1m 35s");
    expect(formatDuration(3_723_000)).toBe("62m 03s");
  });

  it("renders a placeholder for anything that is not a number", () => {
    expect(formatDuration(null)).toBe(NO_VALUE);
    expect(formatDuration(undefined)).toBe(NO_VALUE);
    expect(formatDuration(Number.NaN)).toBe(NO_VALUE);
  });
});

describe("formatConcurrency", () => {
  it("keeps one decimal, since an average of overlaps is rarely integral", () => {
    expect(formatConcurrency(0)).toBe("0.0");
    expect(formatConcurrency(1.44)).toBe("1.4");
  });

  it("renders a placeholder for a bin with no elapsed minutes", () => {
    expect(formatConcurrency(null)).toBe(NO_VALUE);
  });
});

describe("isEmptySeries", () => {
  it("is true for a zero-filled series, which a silent collection still returns", () => {
    expect(isEmptySeries([point(), point(), point()])).toBe(true);
    expect(isEmptySeries([])).toBe(true);
  });

  it("is false as soon as one bin has a task starting or finishing", () => {
    expect(isEmptySeries([point(), point({ started: 1 })])).toBe(false);
    expect(isEmptySeries([point({ finished: 1 }), point()])).toBe(false);
  });
});

describe("describeDurations", () => {
  it("lists the quantiles that matter alongside the sample size", () => {
    expect(describeDurations(stats())).toBe("p50 1.80s · max 4.40s · 3 runs");
  });

  it("leaves out p95, which repeats max at a bin's sample size", () => {
    expect(describeDurations(stats())).not.toContain("p95");
  });

  it("singularises a lone run", () => {
    expect(describeDurations(stats({ runs_measured: 1 }))).toContain("1 run");
  });

  it("says so when nothing settled, rather than printing empty stats", () => {
    expect(describeDurations(stats({ runs_measured: 0 }))).toBe(
      "no runs settled",
    );
  });
});
