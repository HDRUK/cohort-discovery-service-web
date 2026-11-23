import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { User, Workgroup } from "@/types/api";
import { FeatureOverrides } from "@/types/features";
import { FeatureOverrideRules } from "../FeatureOverrideRules";

const mockReplaceFeatureOverrides = jest.fn();

jest.mock("@/actions/admin/replaceFeatureOverrides", () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockReplaceFeatureOverrides(...args),
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

const withOverrides: FeatureOverrides = {
  feature: FEATURE,
  global: false,
  users: [
    { id: 1, name: "Jane Doe", email: "jane@example.com", enabled: false },
  ],
  workgroups: [{ id: 10, name: "UK-RESEARCH", enabled: true }],
};

const withoutOverrides: FeatureOverrides = {
  feature: FEATURE,
  global: false,
  users: [],
  workgroups: [],
};

const renderRules = (feature: FeatureOverrides) =>
  render(
    <MockCohortDiscoveryServiceStore
      overrides={{ adminSection: { users, workgroups } }}
    >
      <FeatureOverrideRules feature={feature} />
    </MockCohortDiscoveryServiceStore>,
  );

const rule = (value: "On" | "Off") =>
  within(screen.getByRole("group", { name: `${value} rule` }));

describe("FeatureOverrideRules", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReplaceFeatureOverrides.mockResolvedValue(undefined);
  });

  it("groups overrides into an on rule and an off rule", () => {
    renderRules(withOverrides);

    expect(rule("On").getByText("UK-RESEARCH")).toBeInTheDocument();
    expect(
      rule("Off").getByText("Jane Doe (jane@example.com)"),
    ).toBeInTheDocument();
    expect(rule("On").getByRole("switch")).toBeChecked();
    expect(rule("On").getByRole("switch")).toBeDisabled();
    expect(rule("Off").getByRole("switch")).not.toBeChecked();
    expect(
      screen.queryByRole("button", { name: "Add rule" }),
    ).not.toBeInTheDocument();
  });

  it("saves a new rule with the opposite of the global value", async () => {
    const user = userEvent.setup();
    renderRules(withoutOverrides);

    await user.click(screen.getByRole("button", { name: "Add rule" }));
    await user.click(rule("On").getByRole("combobox", { name: "Workgroups" }));
    await user.click(screen.getByRole("option", { name: "UK-INDUSTRY" }));
    await user.click(rule("On").getByRole("combobox", { name: "Users" }));
    await user.click(
      screen.getByRole("option", { name: "John Smith (john@example.com)" }),
    );
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(mockReplaceFeatureOverrides).toHaveBeenCalledWith(FEATURE, {
      users: [{ id: 2, enabled: true }],
      workgroups: [{ id: 11, enabled: true }],
    });
  });

  it("clears a removed rule's overrides on save", async () => {
    const user = userEvent.setup();
    renderRules(withOverrides);

    await user.click(
      screen.getByRole("button", { name: "Remove the off rule" }),
    );
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(mockReplaceFeatureOverrides).toHaveBeenCalledWith(FEATURE, {
      users: [],
      workgroups: [{ id: 10, enabled: true }],
    });
  });

  it("can switch a single rule's value", async () => {
    const user = userEvent.setup();
    renderRules({ ...withOverrides, users: [] });

    await user.click(rule("On").getByRole("switch"));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(mockReplaceFeatureOverrides).toHaveBeenCalledWith(FEATURE, {
      users: [],
      workgroups: [{ id: 10, enabled: false }],
    });
  });

  it("does not offer a subject that is already in the other rule", async () => {
    const user = userEvent.setup();
    renderRules(withOverrides);

    await user.click(rule("On").getByRole("combobox", { name: "Users" }));

    expect(
      screen.getByRole("option", { name: "Jane Doe (jane@example.com)" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("only enables save and reset once something changes", async () => {
    const user = userEvent.setup();
    renderRules(withOverrides);

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Reset" })).toBeDisabled();

    await user.click(
      screen.getByRole("button", { name: "Remove the off rule" }),
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(rule("Off").getByRole("switch")).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("shows an error when the save fails", async () => {
    mockReplaceFeatureOverrides.mockRejectedValue(new Error("save failed"));
    const user = userEvent.setup();
    renderRules(withOverrides);

    await user.click(
      screen.getByRole("button", { name: "Remove the off rule" }),
    );
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      await screen.findByText(/Could not save the overrides/),
    ).toBeInTheDocument();
  });
});
