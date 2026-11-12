import { refresh } from "next/cache";
import {
  addCollectionToWorkgroupIds,
  removeCollectionFromWorkgroupIds,
  transitionCollectionIds,
  updateCollectionDetails,
} from "@/server/mutations/collections";
import { ApiError } from "@/lib/https";
import { CollectionStatus } from "@/types/api";
import saveCollection from "../saveCollection";

jest.mock("@/server/mutations/collections", () => ({
  updateCollectionDetails: jest.fn(),
  addCollectionToWorkgroupIds: jest.fn(),
  removeCollectionFromWorkgroupIds: jest.fn(),
  transitionCollectionIds: jest.fn(),
  toTransitionState: (status: number) => `state-${status}`,
}));

jest.mock("@/server/session", () => ({
  requireSession: jest.fn().mockResolvedValue({ token: "a-token" }),
}));

jest.mock("next/navigation", () => ({ unstable_rethrow: jest.fn() }));

const CHANGES = {
  collection: { name: "Cohort A" },
  config: {},
  addWorkgroupIds: [10, 11],
  removeWorkgroupIds: [12],
};

beforeEach(() => jest.clearAllMocks());

describe("saveCollection", () => {
  it("runs every step and reports what changed", async () => {
    const result = await saveCollection(1, {
      ...CHANGES,
      status: CollectionStatus.ACTIVE,
    });

    expect(updateCollectionDetails).toHaveBeenCalledWith(
      "a-token",
      1,
      CHANGES.collection,
      CHANGES.config,
    );
    expect(addCollectionToWorkgroupIds).toHaveBeenCalledWith(
      "a-token",
      1,
      [10, 11],
    );
    expect(removeCollectionFromWorkgroupIds).toHaveBeenCalledWith(
      "a-token",
      1,
      [12],
    );
    expect(transitionCollectionIds).toHaveBeenCalledWith("a-token", [1], {
      state: `state-${CollectionStatus.ACTIVE}`,
    });
    expect(result).toEqual({
      ok: true,
      workgroupsAdded: 2,
      workgroupsRemoved: 1,
      statusChanged: true,
    });
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("skips the status step when the status is unchanged", async () => {
    const result = await saveCollection(1, CHANGES);

    expect(transitionCollectionIds).not.toHaveBeenCalled();
    expect(result).toMatchObject({ ok: true, statusChanged: false });
  });

  it("stops at the failing step, names it and still refreshes", async () => {
    (addCollectionToWorkgroupIds as jest.Mock).mockRejectedValueOnce(
      new ApiError(404, "Workgroup not found"),
    );

    const result = await saveCollection(1, {
      ...CHANGES,
      status: CollectionStatus.ACTIVE,
    });

    expect(result).toEqual({
      ok: false,
      failedStep: "workgroups",
      message: "Workgroup not found",
    });
    expect(transitionCollectionIds).not.toHaveBeenCalled();
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
