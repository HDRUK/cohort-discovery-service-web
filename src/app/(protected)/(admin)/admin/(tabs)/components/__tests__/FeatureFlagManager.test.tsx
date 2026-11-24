import "@testing-library/jest-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
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
    overridable: true,
    users: [],
    workgroups: [{ id: 10, name: "UK-RESEARCH", enabled: true }],
  },
  {
    feature: FeatureName.AccessBanner,
    global: true,
    overridable: true,
    users: [],
    workgroups: [],
  },
  {
    feature: FeatureName.FlattenNestedGroups,
    global: true,
    overridable: false,
    users: [],
    workgroups: [],
  },
];

const managerWith = (overrides: FeatureOverrides[]) => (
  <MockCohortDiscoveryServiceStore
    overrides={{ adminSection: { featureOverrides: overrides } }}
  >
    <FeatureFlagManager />
  </MockCohortDiscoveryServiceStore>
);

const renderManager = () => render(managerWith(featureOverrides));

const withGlobal = (feature: string, global: boolean) =>
  featureOverrides.map((flag) =>
    flag.feature === feature ? { ...flag, global } : flag,
  );

const rowOf = (feature: string) =>
  within(
    screen
      .getAllByRole("row")
      .find((row) => within(row).queryByText(feature)) as HTMLElement,
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
    const { rerender } = renderManager();

    await user.click(locationSwitch());

    expect(mockUpdateFeatureFlag).toHaveBeenCalledWith(
      FeatureName.QueryBuilderUseLocation,
      { enabled: true },
    );
    rerender(
      managerWith(withGlobal(FeatureName.QueryBuilderUseLocation, true)),
    );
    await waitFor(() => expect(locationSwitch()).toBeChecked());
  });

  it("shows the saved global value once a save has finished", async () => {
    mockUpdateFeatureFlag.mockResolvedValue(undefined);
    const user = userEvent.setup();
    const { rerender } = renderManager();

    await user.click(locationSwitch());
    await waitFor(() => expect(locationSwitch()).toBeEnabled());
    rerender(
      managerWith(withGlobal(FeatureName.QueryBuilderUseLocation, false)),
    );

    expect(locationSwitch()).not.toBeChecked();
  });

  it("marks a global value that some workgroups or users override", () => {
    renderManager();

    expect(
      screen.getByRole("img", {
        name: `${FeatureName.QueryBuilderUseLocation} has overrides`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("img", {
        name: `${FeatureName.AccessBanner} has overrides`,
      }),
    ).not.toBeInTheDocument();
  });

  it("groups the flags and describes each one", () => {
    renderManager();

    expect(screen.getByText(/Rule types/)).toBeInTheDocument();
    expect(screen.getByText(/Users and access/)).toBeInTheDocument();
    expect(screen.queryByText(/Query builder/)).not.toBeInTheDocument();
    expect(
      rowOf(FeatureName.QueryBuilderUseLocation).getByText(
        /Lets users query by location/,
      ),
    ).toBeInTheDocument();
  });

  it("keeps unsaved rule edits when a flag is collapsed", async () => {
    const user = userEvent.setup();
    renderManager();

    await user.click(
      rowOf(FeatureName.QueryBuilderUseLocation).getByRole("button", {
        name: "Expand",
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Remove the on rule" }),
    );
    await user.click(
      rowOf(FeatureName.QueryBuilderUseLocation).getByRole("button", {
        name: "Expand",
      }),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Save" }),
      ).not.toBeInTheDocument(),
    );
    await user.click(
      rowOf(FeatureName.QueryBuilderUseLocation).getByRole("button", {
        name: "Expand",
      }),
    );

    expect(
      screen.queryByRole("group", { name: "On rule" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
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

    await user.click(
      rowOf(FeatureName.QueryBuilderUseLocation).getByRole("button", {
        name: "Expand",
      }),
    );

    expect(screen.getByRole("group", { name: "On rule" })).toBeInTheDocument();
  });

  it("does not offer override rules for a global-only flag", () => {
    renderManager();

    expect(
      rowOf(FeatureName.FlattenNestedGroups).getByText("Global only"),
    ).toBeInTheDocument();
    expect(
      rowOf(FeatureName.FlattenNestedGroups).getByRole("button", {
        name: "Expand",
      }),
    ).toBeDisabled();
    expect(
      rowOf(FeatureName.QueryBuilderUseLocation).getByRole("button", {
        name: "Expand",
      }),
    ).toBeEnabled();
  });
});
