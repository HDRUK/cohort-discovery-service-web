import { TaskHistoryTask } from "@/types/api";
import { buildTaskSeries, groupByTaskType } from "../taskSeries";

const RANGE = { from: "2026-09-02T12:20:02Z", to: "2026-09-02T13:20:02Z" };

// Well past the range, so no bin is still filling.
const NOW = Date.parse("2026-09-02T14:00:00Z");

const task = (overrides: Partial<TaskHistoryTask> = {}): TaskHistoryTask => ({
  pid: "task-1",
  task_type: "a",
  status: "succeeded",
  attempts: 1,
  created_at: "2026-09-02T13:06:43Z",
  attempted_at: "2026-09-02T13:06:44Z",
  completed_at: "2026-09-02T13:06:46Z",
  failed_at: null,
  queued_for_ms: 1000,
  duration_ms: 2334,
  total_duration_ms: 2334,
  query: { pid: "query-1", name: "query-1", query_type: null },
  runs: [
    {
      attempt: 1,
      worker_id: "127.0.0.1",
      claimed_at: "2026-09-02T13:06:44Z",
      started_at: "2026-09-02T13:06:44Z",
      finished_at: "2026-09-02T13:06:46Z",
      duration_ms: 2334,
      result_status: "ok",
      error_class: null,
      error_message: null,
    },
  ],
  ...overrides,
});

/** The three tasks the API returns for this collection over this hour. */
const TASKS: TaskHistoryTask[] = [
  task({
    pid: "04c754b6",
    created_at: "2026-09-02T13:11:26Z",
    attempted_at: "2026-09-02T13:11:32Z",
    completed_at: "2026-09-02T13:11:34Z",
    queued_for_ms: 6000,
    duration_ms: 2552,
    total_duration_ms: 2552,
    runs: [
      {
        attempt: 1,
        worker_id: "127.0.0.1",
        claimed_at: "2026-09-02T13:11:32Z",
        started_at: "2026-09-02T13:11:32Z",
        finished_at: "2026-09-02T13:11:34Z",
        duration_ms: 2552,
        result_status: "ok",
        error_class: null,
        error_message: null,
      },
    ],
  }),
  task({
    pid: "234125f2",
    created_at: "2026-09-02T13:07:03Z",
    attempted_at: "2026-09-02T13:07:06Z",
    completed_at: "2026-09-02T13:07:08Z",
    queued_for_ms: 3000,
    duration_ms: 2132,
    total_duration_ms: 2132,
    runs: [
      {
        attempt: 1,
        worker_id: "127.0.0.1",
        claimed_at: "2026-09-02T13:07:06Z",
        started_at: "2026-09-02T13:07:06Z",
        finished_at: "2026-09-02T13:07:08Z",
        duration_ms: 2132,
        result_status: "ok",
        error_class: null,
        error_message: null,
      },
    ],
  }),
  task({ pid: "7f897c75" }),
];

describe("buildTaskSeries", () => {
  it("reproduces the API's whole-range summary when the range is one bin", () => {
    const [only] = buildTaskSeries(TASKS, "1h", RANGE, NOW);

    // The API reports min 2132, avg 2339, p50 2334, p95 2552, max 2552 over
    // these same three runs — nearest-rank matches its CUME_DIST().
    expect(only.duration_ms).toEqual({
      runs_measured: 3,
      min: 2132,
      avg: 2339,
      p50: 2334,
      p95: 2552,
      max: 2552,
    });
  });

  it("zero-fills every bin in the range, ascending", () => {
    const series = buildTaskSeries(TASKS, "10m", RANGE, NOW);

    expect(series).toHaveLength(6);
    expect(series.map((point) => point.bin)).toEqual([
      "2026-09-02T12:20:02.000Z",
      "2026-09-02T12:30:02.000Z",
      "2026-09-02T12:40:02.000Z",
      "2026-09-02T12:50:02.000Z",
      "2026-09-02T13:00:02.000Z",
      "2026-09-02T13:10:02.000Z",
    ]);
    expect(series[0].started).toBe(0);
    expect(series[0].duration_ms.runs_measured).toBe(0);
    expect(series[0].concurrency_avg).toBe(0);
  });

  it("attributes each task to the bin it ran in", () => {
    const series = buildTaskSeries(TASKS, "10m", RANGE, NOW);

    // Two tasks at 13:06 and 13:07, one at 13:11.
    expect(series[4].started).toBe(2);
    expect(series[4].succeeded).toBe(2);
    expect(series[4].duration_ms.runs_measured).toBe(2);
    expect(series[5].started).toBe(1);
    expect(series[5].duration_ms).toMatchObject({
      runs_measured: 1,
      p50: 2552,
    });
  });

  it("averages concurrency over the bin's own length", () => {
    const series = buildTaskSeries(TASKS, "10m", RANGE, NOW);

    // Two runs of 13:06:44-46 and 13:07:06-08 inside a 600s bin. The overlap is
    // computed from the run timestamps, which the API truncates to whole
    // seconds — so it is 2s + 2s, not the finer-grained duration_ms.
    expect(series[4].concurrency_avg).toBeCloseTo(4000 / 600_000, 6);
    expect(series[4].concurrency_max).toBe(1);
  });

  it("counts overlapping runs as concurrent, not sequential", () => {
    const overlapping = [
      task({ pid: "one" }),
      task({
        pid: "two",
        created_at: "2026-09-02T13:06:43Z",
        runs: [
          {
            attempt: 1,
            worker_id: "127.0.0.1",
            claimed_at: "2026-09-02T13:06:45Z",
            started_at: "2026-09-02T13:06:45Z",
            finished_at: "2026-09-02T13:06:47Z",
            duration_ms: 2000,
            result_status: "ok",
            error_class: null,
            error_message: null,
          },
        ],
      }),
    ];

    const series = buildTaskSeries(overlapping, "10m", RANGE, NOW);
    expect(series[4].concurrency_max).toBe(2);
  });

  it("holds an unsettled run open to now, and leaves it out of durations", () => {
    const stuck = [
      task({
        pid: "stuck",
        status: "in_flight",
        completed_at: null,
        duration_ms: null,
        runs: [
          {
            attempt: 1,
            worker_id: "127.0.0.1",
            claimed_at: "2026-09-02T13:06:44Z",
            started_at: "2026-09-02T13:06:44Z",
            finished_at: null,
            duration_ms: null,
            result_status: null,
            error_class: null,
            error_message: null,
          },
        ],
      }),
    ];

    const series = buildTaskSeries(stuck, "10m", RANGE, NOW);

    // Running for the rest of the bin, but never measured.
    expect(series[4].concurrency_max).toBe(1);
    expect(series[4].concurrency_avg).toBeGreaterThan(0);
    expect(series[4].duration_ms.runs_measured).toBe(0);
    expect(series[5].concurrency_max).toBe(1);
  });

  it("returns nothing for a malformed bin width or an inverted range", () => {
    expect(buildTaskSeries(TASKS, "10x", RANGE, NOW)).toEqual([]);
    expect(
      buildTaskSeries(TASKS, "10m", { from: RANGE.to, to: RANGE.from }, NOW),
    ).toEqual([]);
  });

  it("names the tasks each bin drew on, and only those", () => {
    const series = buildTaskSeries(TASKS, "10m", RANGE, NOW);

    expect(series[4].taskPids.sort()).toEqual(["234125f2", "7f897c75"]);
    expect(series[5].taskPids).toEqual(["04c754b6"]);
    expect(series[0].taskPids).toEqual([]);
  });

  it("names a task once however many runs it made in the bin", () => {
    const retried = [
      task({
        pid: "retried",
        attempts: 2,
        runs: [
          {
            attempt: 1,
            worker_id: "127.0.0.1",
            claimed_at: "2026-09-02T13:06:44Z",
            started_at: "2026-09-02T13:06:44Z",
            finished_at: "2026-09-02T13:06:46Z",
            duration_ms: 2000,
            result_status: "error",
            error_class: "Timeout",
            error_message: null,
          },
          {
            attempt: 2,
            worker_id: "127.0.0.1",
            claimed_at: "2026-09-02T13:06:50Z",
            started_at: "2026-09-02T13:06:50Z",
            finished_at: "2026-09-02T13:06:52Z",
            duration_ms: 2000,
            result_status: "ok",
            error_class: null,
            error_message: null,
          },
        ],
      }),
    ];

    expect(buildTaskSeries(retried, "10m", RANGE, NOW)[4].taskPids).toEqual([
      "retried",
    ]);
  });
});

describe("groupByTaskType", () => {
  const mixed = [
    task({ pid: "b-one", task_type: "b" }),
    task({ pid: "a-one", task_type: "a" }),
    task({ pid: "b-two", task_type: "b" }),
  ];

  it("splits by type, keys ascending so a type keeps its colour", () => {
    expect([...groupByTaskType(mixed).keys()]).toEqual(["a", "b"]);
    expect(
      [...groupByTaskType(mixed).values()].map((group) =>
        group.map((entry) => entry.pid),
      ),
    ).toEqual([["a-one"], ["b-one", "b-two"]]);
  });

  it("leaves each group's bins index-aligned with the others", () => {
    const [a, b] = [...groupByTaskType(mixed).values()].map((group) =>
      buildTaskSeries(group, "10m", RANGE, NOW),
    );

    expect(a.map((point) => point.bin)).toEqual(b.map((point) => point.bin));
  });

  it("returns nothing for no tasks", () => {
    expect(groupByTaskType([]).size).toBe(0);
  });
});
