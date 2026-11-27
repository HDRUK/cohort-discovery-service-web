import { getMockResult, getMockTask } from "@/test/fixtures/tasks";
import { getSpecimenCount, hasSpecimenCounts } from "../recordCounts";

const taskWithMetadata = (metadata: unknown) =>
  getMockTask({ result: getMockResult({ metadata }) });

const COUNTED = taskWithMetadata({ record_counts: { specimen: 150 } });
const NOT_COUNTED = taskWithMetadata({});

describe("getSpecimenCount", () => {
  it.each([
    ["empty metadata", {}],
    ["null metadata", null],
    ["non-object metadata", "specimen"],
    ["record counts without specimens", { record_counts: {} }],
    ["a non-numeric specimen count", { record_counts: { specimen: "150" } }],
    ["record counts that aren't an object", { record_counts: 150 }],
  ])("returns null for %s", (_case, metadata) => {
    expect(getSpecimenCount(taskWithMetadata(metadata))).toBeNull();
  });

  it("returns null for a task without a result", () => {
    expect(getSpecimenCount(getMockTask({ result: undefined }))).toBeNull();
  });

  it("returns null for a failed task", () => {
    expect(
      getSpecimenCount({ ...COUNTED, failed_at: "2025-01-01T12:00:00Z" }),
    ).toBeNull();
  });

  it("returns null for an errored result", () => {
    expect(
      getSpecimenCount(
        getMockTask({
          result: getMockResult({
            status: "error",
            metadata: { record_counts: { specimen: 150 } },
          }),
        }),
      ),
    ).toBeNull();
  });

  it("returns the specimen count", () => {
    expect(getSpecimenCount(COUNTED)).toBe(150);
  });

  it("returns a suppressed specimen count of 0", () => {
    expect(
      getSpecimenCount(taskWithMetadata({ record_counts: { specimen: 0 } })),
    ).toBe(0);
  });
});

describe("hasSpecimenCounts", () => {
  it("is false when no task has a specimen count", () => {
    expect(hasSpecimenCounts([NOT_COUNTED, NOT_COUNTED])).toBe(false);
  });

  it("is false for no tasks", () => {
    expect(hasSpecimenCounts([])).toBe(false);
  });

  it("is true when any task has a specimen count", () => {
    expect(hasSpecimenCounts([NOT_COUNTED, COUNTED])).toBe(true);
  });
});
