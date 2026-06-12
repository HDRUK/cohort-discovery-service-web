import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RuleAlternatives from "./RuleAlternatives";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { CloseGuardProvider } from "@/providers/CloseGuardProvider";
import { RuleLeafType, RuleGroupType } from "@/types/rules";

jest.mock("@/utils/rules", () => {
  const actual = jest.requireActual("@/utils/rules");
  return {
    ...actual,
    updateById: jest.fn(),
  };
});
import { updateById } from "@/utils/rules";

const setQueryBuilderJson = jest.fn();

const conceptMain = { concept_id: 100, name: "COVID-19", category: "Condition" };
const conceptA = { concept_id: 200, name: "Acute COVID-19", category: "Condition" };
const conceptB = { concept_id: 300, name: "Suspected COVID-19", category: "Observation" };

const ruleAlt: RuleLeafType = {
  id: "rule-alt",
  exclude: false,
  valid: false,
  invalidReason: ["alternatives"],
  rule: {
    concept: { ...conceptMain, alternatives: [conceptA, conceptB] },
  },
} as unknown as RuleLeafType;

const ruleAlt2: RuleLeafType = {
  id: "rule-alt-2",
  exclude: false,
  valid: false,
  rule: {
    concept: { concept_id: 400, name: "Type 2 Diabetes", category: "Condition", alternatives: [{ concept_id: 401, name: "DM2" }] },
  },
} as unknown as RuleLeafType;

const makeQuery = (...rules: RuleLeafType[]): RuleGroupType =>
  ({ id: "group-1", rules }) as RuleGroupType;

const renderComponent = (
  rule: RuleLeafType = ruleAlt,
  query: RuleGroupType = makeQuery(ruleAlt),
  storeOverrides: Record<string, unknown> = {},
) => {
  return render(
    <CloseGuardProvider>
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: {
            queryBuilderJson: query,
            setQueryBuilderJson,
            ...storeOverrides,
          },
        }}
      >
        <RuleAlternatives rule={rule} groupId="group-1" />
      </MockCohortDiscoveryServiceStore>
    </CloseGuardProvider>,
  );
};

describe("RuleAlternatives", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (updateById as jest.Mock).mockImplementation((_tree, _id, fn) =>
      fn(ruleAlt),
    );
  });

  it("renders all concept options as chips", () => {
    renderComponent();
    // ConceptChip renders "{name} ( {id})" — all three names contain "COVID-19"
    expect(screen.getAllByText(/COVID-19/i)).toHaveLength(3);
  });

  it("does not show checkboxes or confirm footer when rule is not selected", () => {
    renderComponent();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /confirm/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /clear all/i })).not.toBeInTheDocument();
  });

  it("shows checkboxes and confirm footer when rule is selected", () => {
    renderComponent(ruleAlt, makeQuery(ruleAlt), { selected: { "rule-alt": true } });
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
    expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear all/i })).toBeInTheDocument();
  });

  it("pre-checks only the first concept by default", () => {
    renderComponent(ruleAlt, makeQuery(ruleAlt), { selected: { "rule-alt": true } });
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();   // conceptMain
    expect(checkboxes[1]).not.toBeChecked(); // conceptA
    expect(checkboxes[2]).not.toBeChecked(); // conceptB
  });

  it("clear all unchecks everything and disables Confirm", async () => {
    renderComponent(ruleAlt, makeQuery(ruleAlt), { selected: { "rule-alt": true } });
    await userEvent.click(screen.getByRole("button", { name: /clear all/i }));
    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((cb) => expect(cb).not.toBeChecked());
    expect(screen.getByRole("button", { name: /confirm/i })).toBeDisabled();
  });

  it("confirm with single selection calls setConcept without alternatives field", async () => {
    renderComponent(ruleAlt, makeQuery(ruleAlt), { selected: { "rule-alt": true } });

    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));

    expect(updateById).toHaveBeenCalledWith(
      expect.anything(),
      "rule-alt",
      expect.any(Function),
    );

    const callback = (updateById as jest.Mock).mock.calls[0][2];
    const updated = callback(ruleAlt);
    expect(updated.rule.concept).toEqual(
      expect.objectContaining({ concept_id: 100, name: "COVID-19" }),
    );
    expect(updated.rule.concept.alternatives).toBeUndefined();
    expect(setQueryBuilderJson).toHaveBeenCalled();
  });

  it("confirm with multiple selections calls setConcept with an array", async () => {
    renderComponent(ruleAlt, makeQuery(ruleAlt), { selected: { "rule-alt": true } });

    const checkboxes = screen.getAllByRole("checkbox");
    await userEvent.click(checkboxes[1]); // add conceptA

    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));

    const callback = (updateById as jest.Mock).mock.calls[0][2];
    const updated = callback(ruleAlt);
    expect(Array.isArray(updated.rule.concept)).toBe(true);
    expect(updated.rule.concept).toHaveLength(2);
    expect(updated.rule.concept[0].concept_id).toBe(100);
    expect(updated.rule.concept[1].concept_id).toBe(200);
  });

  it("does not call select/deselect when there are no other alternative rules", async () => {
    const mockSelect = jest.fn();
    const mockDeselect = jest.fn();
    renderComponent(ruleAlt, makeQuery(ruleAlt), {
      selected: { "rule-alt": true },
      select: mockSelect,
      deselect: mockDeselect,
    });

    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));

    expect(mockDeselect).not.toHaveBeenCalled();
    expect(mockSelect).not.toHaveBeenCalled();
  });

  it("selects next alternative rule and deselects current after confirm when others exist", async () => {
    const mockSelect = jest.fn();
    const mockDeselect = jest.fn();
    const query = makeQuery(ruleAlt, ruleAlt2);

    renderComponent(ruleAlt, query, {
      selected: { "rule-alt": true },
      select: mockSelect,
      deselect: mockDeselect,
    });

    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));

    expect(mockDeselect).toHaveBeenCalledWith("rule-alt");
    expect(mockSelect).toHaveBeenCalledWith("rule-alt-2");
  });
});
