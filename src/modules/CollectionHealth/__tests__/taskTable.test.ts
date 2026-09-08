import { TaskHistoryTask } from "@/types/api";
import { countMissingText, distinctQueryPids, filterTasks } from "../taskTable";

const task = (
  pid: string,
  query: { pid: string; name: string } | null,
): TaskHistoryTask =>
  ({
    pid,
    task_type: query ? "a" : "b",
    status: "succeeded",
    attempts: 1,
    created_at: "2026-09-07T12:00:00Z",
    attempted_at: null,
    completed_at: null,
    failed_at: null,
    queued_for_ms: null,
    duration_ms: null,
    total_duration_ms: null,
    query: query ? { ...query, query_type: "cohort" } : null,
    runs: [],
  }) as TaskHistoryTask;

const A = task("t1", { pid: "q1", name: "Under 60 and female" });
const B = task("t2", { pid: "q1", name: "Under 60 and female" });
const C = task("t3", { pid: "q2", name: "CKD cohort" });
const DISTRIBUTION = task("t4", null);

describe("distinctQueryPids", () => {
  it("dedupes pids shared by several tasks", () => {
    expect(distinctQueryPids([A, B, C])).toEqual(["q1", "q2"]);
  });

  it("ignores tasks with no query, since B-type runs distributions", () => {
    expect(distinctQueryPids([DISTRIBUTION])).toEqual([]);
    expect(distinctQueryPids([A, DISTRIBUTION, C])).toEqual(["q1", "q2"]);
  });

  it("preserves first-seen order so colours and requests stay stable", () => {
    expect(distinctQueryPids([C, A])).toEqual(["q2", "q1"]);
  });
});

describe("filterTasks", () => {
  const textByPid = {
    q1: "Age < 60 AND Sex = Female",
    q2: "Condition = Chronic kidney disease",
  };

  it("returns everything for an empty or whitespace term", () => {
    expect(filterTasks([A, C], "", textByPid)).toHaveLength(2);
    expect(filterTasks([A, C], "   ", textByPid)).toHaveLength(2);
  });

  it("matches on the query text", () => {
    expect(filterTasks([A, C], "kidney", textByPid)).toEqual([C]);
  });

  it("matches on the query name", () => {
    expect(filterTasks([A, C], "under 60", textByPid)).toEqual([A]);
  });

  it("is case insensitive", () => {
    expect(filterTasks([A, C], "FEMALE", textByPid)).toEqual([A]);
  });

  it("excludes tasks whose text has not loaded and whose name does not match", () => {
    expect(filterTasks([A, C], "kidney", {})).toEqual([]);
  });

  it("never matches a task with no query", () => {
    expect(filterTasks([DISTRIBUTION], "anything", textByPid)).toEqual([]);
  });
});

describe("countMissingText", () => {
  it("counts only tasks that have a query but no loaded text", () => {
    expect(countMissingText([A, C, DISTRIBUTION], { q1: "loaded" })).toBe(1);
  });

  it("is zero when every query has text", () => {
    expect(countMissingText([A, C], { q1: "x", q2: "y" })).toBe(0);
  });

  it("does not count distribution tasks, which never have a query", () => {
    expect(countMissingText([DISTRIBUTION], {})).toBe(0);
  });
});
