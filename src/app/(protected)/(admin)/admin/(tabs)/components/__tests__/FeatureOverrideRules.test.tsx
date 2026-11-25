import "@testing-library/jest-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
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
  overridable: true,
  users: [
    { id: 1, name: "Jane Doe", email: "jane@example.com", enabled: false },
  ],
  workgroups: [{ id: 10, name: "UK-RESEARCH", enabled: true }],
};

const withoutOverrides: FeatureOverrides = {
  feature: FEATURE,
  global: false,
  overridable: true,
  users: [],
  workgroups: [],
};

const rulesFor = (feature: FeatureOverrides) => (
  <MockCohortDiscoveryServiceStore
    overrides={{ adminSection: { users, workgroups } }}
  >
    <FeatureOverrideRules feature={feature} />
  </MockCohortDiscoveryServiceStore>
);

const renderRules = (feature: FeatureOverrides) => render(rulesFor(feature));

const rule = (value: "On" | "Off") =>
  within(screen.getByRole("group", { name: `${value} rule` }));

const dialog = () => within(screen.getByRole("dialog"));

describe("FeatureOverrideRules", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReplaceFeatureOverrides.mockResolvedValue(undefined);
  });

  it("lists the on rule and the off rule with who is in them", () => {
    renderRules(withOverrides);

    expect(rule("On").getByText("UK-RESEARCH")).toBeInTheDocument();
    expect(
      rule("Off").getByText("Jane Doe (jane@example.com)"),
    ).toBeInTheDocument();
  });

  it("explains an empty list", () => {
    renderRules(withoutOverrides);

    expect(screen.getByText(/No override rules/)).toBeInTheDocument();
  });

  it("adds an override with the opposite of the global value", async () => {
    const user = userEvent.setup();
    renderRules(withoutOverrides);

    await user.click(screen.getByRole("button", { name: "Add override" }));
    expect(dialog().getByRole("switch")).toBeChecked();
    await user.click(dialog().getByRole("combobox", { name: "Workgroups" }));
    await user.click(screen.getByRole("option", { name: "UK-INDUSTRY" }));
    await user.click(dialog().getByRole("combobox", { name: "Users" }));
    await user.click(
      screen.getByRole("option", { name: "John Smith (john@example.com)" }),
    );
    await user.click(dialog().getByRole("button", { name: "Save" }));

    expect(mockReplaceFeatureOverrides).toHaveBeenCalledWith(FEATURE, {
      users: [{ id: 2, enabled: true }],
      workgroups: [{ id: 11, enabled: true }],
    });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("adds to an existing rule without losing what is already in it", async () => {
    const user = userEvent.setup();
    renderRules(withOverrides);

    await user.click(screen.getByRole("button", { name: "Add override" }));
    expect(dialog().getByRole("switch")).not.toBeChecked();
    await user.click(dialog().getByRole("combobox", { name: "Users" }));
    await user.click(
      screen.getByRole("option", { name: "John Smith (john@example.com)" }),
    );
    await user.click(dialog().getByRole("button", { name: "Save" }));

    expect(mockReplaceFeatureOverrides).toHaveBeenCalledWith(FEATURE, {
      users: [
        { id: 1, enabled: false },
        { id: 2, enabled: false },
      ],
      workgroups: [{ id: 10, enabled: true }],
    });
  });

  it("only enables save once someone is chosen", async () => {
    const user = userEvent.setup();
    renderRules(withoutOverrides);

    await user.click(screen.getByRole("button", { name: "Add override" }));

    expect(dialog().getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("does not offer a subject that is already in the other rule", async () => {
    const user = userEvent.setup();
    renderRules(withOverrides);

    await user.click(screen.getByRole("button", { name: "Add override" }));
    await user.click(dialog().getByRole("switch"));
    await user.click(dialog().getByRole("combobox", { name: "Users" }));

    expect(
      screen.getByRole("option", { name: "Jane Doe (jane@example.com)" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("edits a rule with its subjects filled in and its value fixed", async () => {
    const user = userEvent.setup();
    renderRules(withOverrides);

    await user.click(screen.getByRole("button", { name: "Edit the on rule" }));
    expect(dialog().getByText("UK-RESEARCH")).toBeInTheDocument();
    expect(dialog().getByRole("switch")).toBeDisabled();
    await user.click(dialog().getByRole("combobox", { name: "Workgroups" }));
    await user.click(screen.getByRole("option", { name: "UK-INDUSTRY" }));
    await user.click(dialog().getByRole("button", { name: "Save" }));

    expect(mockReplaceFeatureOverrides).toHaveBeenCalledWith(FEATURE, {
      users: [{ id: 1, enabled: false }],
      workgroups: [
        { id: 10, enabled: true },
        { id: 11, enabled: true },
      ],
    });
  });

  it("removes a rule once the removal is confirmed", async () => {
    const user = userEvent.setup();
    renderRules(withOverrides);

    await user.click(
      screen.getByRole("button", { name: "Remove the off rule" }),
    );
    expect(mockReplaceFeatureOverrides).not.toHaveBeenCalled();
    await user.click(dialog().getByRole("button", { name: "Remove" }));

    expect(mockReplaceFeatureOverrides).toHaveBeenCalledWith(FEATURE, {
      users: [],
      workgroups: [{ id: 10, enabled: true }],
    });
  });

  it("keeps the modal open and shows an error when the save fails", async () => {
    mockReplaceFeatureOverrides.mockRejectedValue(new Error("save failed"));
    const user = userEvent.setup();
    renderRules(withoutOverrides);

    await user.click(screen.getByRole("button", { name: "Add override" }));
    await user.click(dialog().getByRole("combobox", { name: "Workgroups" }));
    await user.click(screen.getByRole("option", { name: "UK-INDUSTRY" }));
    await user.click(dialog().getByRole("button", { name: "Save" }));

    expect(
      await screen.findByText(/Could not save the overrides/),
    ).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
