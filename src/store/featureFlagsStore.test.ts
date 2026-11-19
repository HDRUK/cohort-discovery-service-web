import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import { FeatureFlag, FeatureName } from "@/types/features";
import updateFeatureFlag from "@/actions/admin/updateFeatureFlag";

jest.mock("@/actions/admin/updateFeatureFlag", () => jest.fn());

const mockUpdateFeatureFlag = updateFeatureFlag as jest.MockedFunction<
  typeof updateFeatureFlag
>;

const FLAG = FeatureName.AccessBanner;

const flag = () => useFeatureFlagsStore.getState().flags?.[FLAG];

describe("updateFlag", () => {
  beforeEach(() => {
    mockUpdateFeatureFlag.mockReset();
    useFeatureFlagsStore.setState({
      flags: { [FLAG]: false } as FeatureFlag,
    });
  });

  it("sets the flag before the save resolves", () => {
    mockUpdateFeatureFlag.mockReturnValue(new Promise(() => {}));

    useFeatureFlagsStore.getState().updateFlag(FLAG, true);

    expect(flag()).toBe(true);
  });

  it("keeps the new value once the save succeeds", async () => {
    mockUpdateFeatureFlag.mockResolvedValue();

    await useFeatureFlagsStore.getState().updateFlag(FLAG, true);

    expect(flag()).toBe(true);
  });

  it("restores the previous value when the save fails", async () => {
    mockUpdateFeatureFlag.mockRejectedValue(new Error("save failed"));

    await expect(
      useFeatureFlagsStore.getState().updateFlag(FLAG, true),
    ).rejects.toThrow("save failed");

    expect(flag()).toBe(false);
  });
});
