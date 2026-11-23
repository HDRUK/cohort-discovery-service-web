import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { User, Workgroup } from "@/types/api";
import { FeatureOverrides, FeatureOverrideSubject } from "@/types/features";
import { FeatureOverridesManager } from "../FeatureOverridesManager";

const mockSetFeatureOverride = jest.fn();
const mockClearFeatureOverride = jest.fn();

jest.mock("@/actions/admin/setFeatureOverride", () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockSetFeatureOverride(...args),
}));

jest.mock("@/actions/admin/clearFeatureOverride", () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockClearFeatureOverride(...args),
}));

const FEATURE = "query-builder-use-location";

const users = [
  { id: 1, name: "Jane Doe", email: "jane@example.com" },
  { id: 2, name: "John Smith", email: "john@example.com" },
] as User[];

const workgroups = [
  { id: 10, name: "UK-RESEARCH" },
  { id: 11, name: "UK-INDUSTRY" },
] as Workgroup[];

const featureOverrides: FeatureOverrides[] = [
  {
    feature: FEATURE,
    global: false,
    users: [
      { id: 1, name: "Jane Doe", email: "jane@example.com", enabled: false },
    ],
    workgroups: [{ id: 10, name: "UK-RESEARCH", enabled: true }],
  },
];

const renderManager = () =>
  render(
    <MockCohortDiscoveryServiceStore
      overrides={{ adminSection: { users, workgroups, featureOverrides } }}
    >
      <FeatureOverridesManager />
    </MockCohortDiscoveryServiceStore>,
  );

describe("FeatureOverridesManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetFeatureOverride.mockResolvedValue(undefined);
    mockClearFeatureOverride.mockResolvedValue(undefined);
  });

  it("shows the global value and each override", () => {
    renderManager();

    expect(screen.getByText(FEATURE)).toBeInTheDocument();
    expect(screen.getByText("Global: off")).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "UK-RESEARCH override" }),
    ).toBeChecked();
    expect(
      screen.getByRole("switch", { name: "Jane Doe override" }),
    ).not.toBeChecked();
  });

  it("saves a toggled workgroup override", async () => {
    const user = userEvent.setup();
    renderManager();

    await user.click(
      screen.getByRole("switch", { name: "UK-RESEARCH override" }),
    );

    expect(mockSetFeatureOverride).toHaveBeenCalledWith(
      FEATURE,
      FeatureOverrideSubject.Workgroup,
      10,
      { enabled: false },
    );
  });

  it("clears a user override", async () => {
    const user = userEvent.setup();
    renderManager();

    await user.click(
      screen.getByRole("button", { name: "Clear override for Jane Doe" }),
    );

    expect(mockClearFeatureOverride).toHaveBeenCalledWith(
      FEATURE,
      FeatureOverrideSubject.User,
      1,
    );
  });

  it("adds a user override that flips the global value", async () => {
    const user = userEvent.setup();
    renderManager();

    await user.click(screen.getByRole("combobox", { name: "Add a user" }));

    expect(
      screen.queryByRole("option", { name: "Jane Doe (jane@example.com)" }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("option", { name: "John Smith (john@example.com)" }),
    );

    expect(mockSetFeatureOverride).toHaveBeenCalledWith(
      FEATURE,
      FeatureOverrideSubject.User,
      2,
      { enabled: true },
    );
  });

  it("tells the admin when a save fails", async () => {
    mockSetFeatureOverride.mockRejectedValue(new Error("save failed"));
    const user = userEvent.setup();
    renderManager();

    await user.click(
      screen.getByRole("switch", { name: "UK-RESEARCH override" }),
    );

    await waitFor(() =>
      expect(
        screen.getByText(
          /Could not save the override for "query-builder-use-location"/,
        ),
      ).toBeInTheDocument(),
    );
  });
});
