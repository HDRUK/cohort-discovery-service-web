import { Result, Task } from "@/types/api";
import { TaskStatus } from "@/types/tasks";
import {
  getTaskResultStatus,
  getTaskStatus,
  getTotalAllTasks,
} from "@/utils/tasks";

const makeResult = (overrides: Partial<Result> = {}): Result =>
  ({
    id: 1,
    pid: "res1",
    count: 1240,
    metadata: {},
    status: "ok",
    message: "ok",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  }) as Result;

const makeTask = (overrides: Partial<Task> = {}): Task =>
  ({
    id: 1,
    pid: "task1",
    query_id: 100,
    collection_id: 1,
    task_type: "condition",
    created_at: "2026-01-01T00:00:00Z",
    completed_at: "2026-01-01T12:00:00Z",
    failed_at: null,
    attempts: 1,
    collection: { id: 1, name: "Test collection" },
    result: makeResult(),
    ...overrides,
  }) as Task;

const RESULT_WITHOUT_STATUS = {
  ...makeResult(),
  status: undefined,
} as unknown as Result;

const RESULT_WITHOUT_COUNT = {
  ...makeResult(),
  count: null,
  status: undefined,
} as unknown as Result;

describe("getTaskResultStatus", () => {
  it("returns the status the backend sent", () => {
    expect(getTaskResultStatus(makeTask())).toBe("ok");
  });

  it("falls back to ok when a count arrived without a status", () => {
    expect(
      getTaskResultStatus(
        makeTask({ completed_at: null, result: RESULT_WITHOUT_STATUS }),
      ),
    ).toBe("ok");
  });

  it("treats a zero count as a delivered result", () => {
    expect(
      getTaskResultStatus(
        makeTask({
          completed_at: null,
          result: { ...RESULT_WITHOUT_STATUS, count: 0 },
        }),
      ),
    ).toBe("ok");
  });

  it("falls back to ok when the status came back empty", () => {
    expect(
      getTaskResultStatus(makeTask({ result: makeResult({ status: "" }) })),
    ).toBe("ok");
  });

  it("stays pending when no result has arrived", () => {
    expect(
      getTaskResultStatus(makeTask({ completed_at: null, result: undefined })),
    ).toBe("pending");
  });

  it("stays pending when a result exists but carries no count", () => {
    expect(
      getTaskResultStatus(
        makeTask({ completed_at: null, result: RESULT_WITHOUT_COUNT }),
      ),
    ).toBe("pending");
  });

  it("reports a failed task as unselected when its result is missing", () => {
    expect(
      getTaskResultStatus(
        makeTask({
          failed_at: "2026-01-01T12:00:00Z",
          result: makeResult({ status: "missing" }),
        }),
      ),
    ).toBe("unselected");
  });

  it("keeps a failed task in error even when a count is present", () => {
    expect(
      getTaskResultStatus(
        makeTask({
          failed_at: "2026-01-01T12:00:00Z",
          result: RESULT_WITHOUT_STATUS,
        }),
      ),
    ).toBe("error");
  });

  it("passes an unrecognised backend status straight through", () => {
    expect(
      getTaskResultStatus(
        makeTask({ result: makeResult({ status: "throttled" }) }),
      ),
    ).toBe("throttled");
  });
});

describe("getTaskStatus", () => {
  it("reports a completed task as successful", () => {
    expect(getTaskStatus(makeTask())).toBe(TaskStatus.SUCCESSFUL);
  });

  it("reports a task with no result and no attempts as pending", () => {
    expect(
      getTaskStatus(
        makeTask({ completed_at: null, attempts: 0, result: undefined }),
      ),
    ).toBe(TaskStatus.PENDING);
  });

  it("reports a task as successful once a count arrives without a completion time", () => {
    expect(
      getTaskStatus(
        makeTask({ completed_at: null, result: RESULT_WITHOUT_STATUS }),
      ),
    ).toBe(TaskStatus.SUCCESSFUL);
  });

  it("keeps a failed task in error even when a count is present", () => {
    expect(
      getTaskStatus(
        makeTask({
          failed_at: "2026-01-01T12:00:00Z",
          result: RESULT_WITHOUT_STATUS,
        }),
      ),
    ).toBe(TaskStatus.ERROR);
  });

  it("stays pending when a result exists but carries no count", () => {
    expect(
      getTaskStatus(
        makeTask({
          completed_at: null,
          attempts: 0,
          result: RESULT_WITHOUT_COUNT,
        }),
      ),
    ).toBe(TaskStatus.PENDING);
  });
});

describe("getTotalAllTasks", () => {
  it("sums the counts of completed tasks", () => {
    expect(
      getTotalAllTasks([
        makeTask({ id: 1, result: makeResult({ count: 100 }) }),
        makeTask({ id: 2, result: makeResult({ count: 40 }) }),
      ]),
    ).toBe(140);
  });

  it("includes a task whose count arrived without a completion time", () => {
    expect(
      getTotalAllTasks([
        makeTask({ id: 1, result: makeResult({ count: 100 }) }),
        makeTask({
          id: 2,
          completed_at: null,
          result: { ...RESULT_WITHOUT_STATUS, count: 40 },
        }),
      ]),
    ).toBe(140);
  });

  it("returns a placeholder when every task failed", () => {
    expect(
      getTotalAllTasks([makeTask({ failed_at: "2026-01-01T12:00:00Z" })]),
    ).toBe("-");
  });
});
