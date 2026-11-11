import { ApiError } from "@/lib/https";
import { runSaveSteps, SaveStep } from "../runSaveSteps";

jest.mock("next/navigation", () => ({ unstable_rethrow: jest.fn() }));

const succeeds = jest.fn().mockResolvedValue(undefined);
const fails = (message: string) =>
  jest.fn().mockRejectedValue(new ApiError(422, message));

beforeEach(() => jest.clearAllMocks());

describe("runSaveSteps", () => {
  it("returns null when every step succeeds", async () => {
    await expect(
      runSaveSteps([
        ["details", succeeds],
        ["status", succeeds],
      ]),
    ).resolves.toBeNull();
    expect(succeeds).toHaveBeenCalledTimes(2);
  });

  it("stops at the first failing step and names it", async () => {
    const later = jest.fn();

    const failure = await runSaveSteps([
      ["details", fails("Name taken")],
      ["status", later],
    ]);

    expect(failure).toEqual({
      ok: false,
      failedStep: "details",
      message: "Name taken",
    });
    expect(later).not.toHaveBeenCalled();
  });

  it("names the collection whose step failed", async () => {
    const steps: SaveStep[] = [
      ["workgroups", succeeds, { id: 1, name: "Cohort A" }],
      ["workgroups", fails("Workgroup not found"), { id: 2, name: "Cohort B" }],
      ["workgroups", succeeds, { id: 3, name: "Cohort C" }],
    ];

    const failure = await runSaveSteps(steps);

    expect(failure).toEqual({
      ok: false,
      failedStep: "workgroups",
      failedCollection: { id: 2, name: "Cohort B" },
      message: "Workgroup not found",
    });
    expect(succeeds).toHaveBeenCalledTimes(1);
  });

  it("hides the message of an error that isn't from the API", async () => {
    const failure = await runSaveSteps([
      ["details", jest.fn().mockRejectedValue(new Error("secret detail"))],
    ]);

    expect(failure?.message).toBe("Unexpected error");
  });
});
