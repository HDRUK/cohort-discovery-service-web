import { CollectionSaveResult } from "@/types/api";
import { describeCollectionSave } from "../collectionSave";

const saved = (
  overrides: Partial<Extract<CollectionSaveResult, { ok: true }>> = {},
): CollectionSaveResult => ({
  ok: true,
  workgroupsAdded: 0,
  workgroupsRemoved: 0,
  statusChanged: false,
  ...overrides,
});

describe("describeCollectionSave", () => {
  it("names only the subject when nothing else changed", () => {
    expect(describeCollectionSave('collection "Cohort A"', saved())).toEqual({
      ok: true,
      message: 'Saved collection "Cohort A"',
    });
  });

  it("lists workgroup and status changes in one message", () => {
    const { message } = describeCollectionSave(
      'collection "Cohort A"',
      saved({ workgroupsAdded: 2, workgroupsRemoved: 1, statusChanged: true }),
      "Active",
    );

    expect(message).toBe(
      'Saved collection "Cohort A": added to 2 workgroups, removed from 1 workgroup, status changed to Active',
    );
  });

  it("names the step that failed and says earlier steps were saved", () => {
    const { ok, message } = describeCollectionSave('collection "Cohort A"', {
      ok: false,
      failedStep: "workgroups",
      message: "Workgroup not found",
    });

    expect(ok).toBe(false);
    expect(message).toContain("the workgroup changes");
    expect(message).toContain("Workgroup not found");
    expect(message).toContain("Anything before that step was saved");
  });
});
