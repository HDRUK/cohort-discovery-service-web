import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { FeatureFlag, FeatureName } from "@/types/features";
import { FeatureFlagManager } from "../FeatureFlagManager";

const mockUpdateFeatureFlag = jest.fn();

jest.mock("@/actions/admin/updateFeatureFlag", () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockUpdateFeatureFlag(...args),
}));

const globalFeatureFlags = {
  [FeatureName.QueryBuilderUseLocation]: false,
} as FeatureFlag;

const renderManager = () =>
  render(
    <MockCohortDiscoveryServiceStore
      overrides={{ adminSection: { globalFeatureFlags } }}
    >
      <FeatureFlagManager />
    </MockCohortDiscoveryServiceStore>,
  );

const locationSwitch = () => screen.getByRole("switch");

describe("FeatureFlagManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows the global value of each flag", () => {
    renderManager();

    expect(
      screen.getByText(FeatureName.QueryBuilderUseLocation),
    ).toBeInTheDocument();
    expect(locationSwitch()).not.toBeChecked();
  });

  it("saves the new global value", async () => {
    mockUpdateFeatureFlag.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderManager();

    await user.click(locationSwitch());

    expect(mockUpdateFeatureFlag).toHaveBeenCalledWith(
      FeatureName.QueryBuilderUseLocation,
      { enabled: true },
    );
    await waitFor(() => expect(locationSwitch()).toBeChecked());
  });

  it("switches back when the save fails", async () => {
    mockUpdateFeatureFlag.mockRejectedValue(new Error("save failed"));
    const user = userEvent.setup();
    renderManager();

    await user.click(locationSwitch());

    await waitFor(() => expect(locationSwitch()).not.toBeChecked());
    expect(screen.getByText(/has been switched back/)).toBeInTheDocument();
  });
});
