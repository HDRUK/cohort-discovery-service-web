import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { FeatureName, FeatureOverrides } from "@/types/features";
import { FeatureFlagManager } from "../FeatureFlagManager";

const mockUpdateFeatureFlag = jest.fn();

jest.mock("@/actions/admin/updateFeatureFlag", () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockUpdateFeatureFlag(...args),
}));

jest.mock("@/actions/admin/replaceFeatureOverrides", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const featureOverrides: FeatureOverrides[] = [
  {
    feature: FeatureName.QueryBuilderUseLocation,
    global: false,
    users: [],
    workgroups: [{ id: 10, name: "UK-RESEARCH", enabled: true }],
  },
  {
    feature: FeatureName.AccessBanner,
    global: true,
    users: [],
    workgroups: [],
  },
];

const renderManager = () =>
  render(
    <MockCohortDiscoveryServiceStore
      overrides={{ adminSection: { featureOverrides } }}
    >
      <FeatureFlagManager />
    </MockCohortDiscoveryServiceStore>,
  );

const locationSwitch = () =>
  screen.getByRole("switch", {
    name: `${FeatureName.QueryBuilderUseLocation} global value`,
  });

describe("FeatureFlagManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows the global value and override count of each flag", () => {
    renderManager();

    expect(locationSwitch()).not.toBeChecked();
    expect(
      screen.getByRole("switch", {
        name: `${FeatureName.AccessBanner} global value`,
      }),
    ).toBeChecked();
    expect(screen.getByText("1 override")).toBeInTheDocument();
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

  it("expands a flag to show its override rules", async () => {
    const user = userEvent.setup();
    renderManager();

    expect(
      screen.queryByRole("group", { name: "On rule" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Expand" })[0]);

    expect(screen.getByRole("group", { name: "On rule" })).toBeInTheDocument();
  });
});
