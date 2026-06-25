import { fireEvent, render, screen } from "@testing-library/react";
import RuleValueAsNumberSelector from "../RuleValueAsNumberSelector";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { createOperator, createRule, createRuleGroup } from "@/utils/rules";
import { RuleLeafType, ValueAsNumberOperator } from "@/types/rules";

beforeEach(() => {
  jest.clearAllMocks();
});

const storeOverrides = {
  queryBuilder: {
    queryBuilderJson: createRuleGroup(),
    setQueryBuilderJson: jest.fn(),
    setSelectedGuidance: jest.fn(),
    selected: {},
  },
};

const renderComponent = (
  rule: ReturnType<typeof createRule>,
  readOnly: boolean,
) =>
  render(
    <MockCohortDiscoveryServiceStore overrides={storeOverrides}>
      <RuleValueAsNumberSelector rule={rule} readOnly={readOnly} flex={false} />
    </MockCohortDiscoveryServiceStore>,
  );

/**
 * Renders the component with the given rule seeded into the store's
 * queryBuilderJson tree so that updateById can find and update it.
 * Returns the setQueryBuilderJson mock so callers can assert on it.
 */
const renderWithRule = (rule: RuleLeafType, readOnly = false) => {
  const setQueryBuilderJson = jest.fn();
  const queryBuilderJson = createRuleGroup(
    [createRule(), createOperator(), rule],
  );
  render(
    <MockCohortDiscoveryServiceStore
      overrides={{
        queryBuilder: {
          queryBuilderJson,
          setQueryBuilderJson,
          setSelectedGuidance: jest.fn(),
          selected: {},
        },
      }}
    >
      <RuleValueAsNumberSelector rule={rule} readOnly={readOnly} flex={false} />
    </MockCohortDiscoveryServiceStore>,
  );
  return { setQueryBuilderJson };
};

describe("RuleValueAsNumberSelector — read-only labels", () => {
  it('displays "Any value" when valueAsNumber is undefined', () => {
    renderComponent(createRule(), true);
    expect(screen.getByText("Any value")).toBeInTheDocument();
  });

  it('displays "Value ≥ X" for GREATER_THAN', () => {
    const rule = {
      ...createRule(),
      valueAsNumber: [5, null] as [number | null, number | null],
      valueAsNumberOperator: ValueAsNumberOperator.GREATER_THAN,
    };
    renderComponent(rule, true);
    expect(screen.getByText("Value ≥ 5")).toBeInTheDocument();
  });

  it('displays "Value < X" for LESS_THAN', () => {
    const rule = {
      ...createRule(),
      valueAsNumber: [null, 10] as [number | null, number | null],
      valueAsNumberOperator: ValueAsNumberOperator.LESS_THAN,
    };
    renderComponent(rule, true);
    expect(screen.getByText("Value < 10")).toBeInTheDocument();
  });

  it('displays "X ≤ Value < Y" for BETWEEN with both bounds set', () => {
    const rule = {
      ...createRule(),
      valueAsNumber: [5, 10] as [number | null, number | null],
      valueAsNumberOperator: ValueAsNumberOperator.BETWEEN,
    };
    renderComponent(rule, true);
    expect(screen.getByText("5 ≤ Value < 10")).toBeInTheDocument();
  });

  it('displays "Value ≥ X" for BETWEEN with only a lower bound', () => {
    const rule = {
      ...createRule(),
      valueAsNumber: [5, null] as [number | null, number | null],
      valueAsNumberOperator: ValueAsNumberOperator.BETWEEN,
    };
    renderComponent(rule, true);
    expect(screen.getByText("Value ≥ 5")).toBeInTheDocument();
  });

  it('displays "Value < Y" for BETWEEN with only an upper bound', () => {
    const rule = {
      ...createRule(),
      valueAsNumber: [null, 10] as [number | null, number | null],
      valueAsNumberOperator: ValueAsNumberOperator.BETWEEN,
    };
    renderComponent(rule, true);
    expect(screen.getByText("Value < 10")).toBeInTheDocument();
  });

  it('displays "Any value" for BETWEEN with neither bound set', () => {
    const rule = {
      ...createRule(),
      valueAsNumber: [null, null] as [number | null, number | null],
      valueAsNumberOperator: ValueAsNumberOperator.BETWEEN,
    };
    renderComponent(rule, true);
    expect(screen.getByText("Any value")).toBeInTheDocument();
  });
});

describe("RuleValueAsNumberSelector — edit mode", () => {
  it("renders a single input for the ≥ operator", () => {
    const rule = {
      ...createRule(),
      valueAsNumber: [5, null] as [number | null, number | null],
      valueAsNumberOperator: ValueAsNumberOperator.GREATER_THAN,
    };
    renderComponent(rule, false);
    expect(screen.getAllByRole("spinbutton")).toHaveLength(1);
    expect(screen.queryByText("–")).not.toBeInTheDocument();
  });

  it("renders a single input for the < operator showing the upper bound value", () => {
    const rule = {
      ...createRule(),
      valueAsNumber: [null, 10] as [number | null, number | null],
      valueAsNumberOperator: ValueAsNumberOperator.LESS_THAN,
    };
    renderComponent(rule, false);
    expect(screen.getAllByRole("spinbutton")).toHaveLength(1);
    expect(screen.queryByText("–")).not.toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(10);
  });

  it("renders two inputs and a dash separator for the ↔ operator", () => {
    const rule = {
      ...createRule(),
      valueAsNumber: [5, 10] as [number | null, number | null],
      valueAsNumberOperator: ValueAsNumberOperator.BETWEEN,
    };
    renderComponent(rule, false);
    expect(screen.getAllByRole("spinbutton")).toHaveLength(2);
    expect(screen.getByText("–")).toBeInTheDocument();
  });
});

describe("RuleValueAsNumberSelector — edit mode onChange constraints", () => {
  it("GREATER_THAN: typing 5 produces valueAsNumber [5, null]", () => {
    const rule: RuleLeafType = {
      ...createRule(),
      valueAsNumber: [null, null],
      valueAsNumberOperator: ValueAsNumberOperator.GREATER_THAN,
    };
    const { setQueryBuilderJson } = renderWithRule(rule);

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.blur(input);

    expect(setQueryBuilderJson).toHaveBeenCalledTimes(1);
    const updatedTree = setQueryBuilderJson.mock.calls[0][0];
    const updatedRule = updatedTree.rules.find(
      (n: RuleLeafType) => n.id === rule.id,
    );
    expect(updatedRule.valueAsNumber).toEqual([5, null]);
  });

  it("LESS_THAN: typing 10 produces valueAsNumber [null, 10]", () => {
    const rule: RuleLeafType = {
      ...createRule(),
      valueAsNumber: [null, null],
      valueAsNumberOperator: ValueAsNumberOperator.LESS_THAN,
    };
    const { setQueryBuilderJson } = renderWithRule(rule);

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "10" } });
    fireEvent.blur(input);

    expect(setQueryBuilderJson).toHaveBeenCalledTimes(1);
    const updatedTree = setQueryBuilderJson.mock.calls[0][0];
    const updatedRule = updatedTree.rules.find(
      (n: RuleLeafType) => n.id === rule.id,
    );
    expect(updatedRule.valueAsNumber).toEqual([null, 10]);
  });

  it("BETWEEN: changing lower to 3 (existing upper 7) produces valueAsNumber [3, 7]", () => {
    const rule: RuleLeafType = {
      ...createRule(),
      valueAsNumber: [null, 7],
      valueAsNumberOperator: ValueAsNumberOperator.BETWEEN,
    };
    const { setQueryBuilderJson } = renderWithRule(rule);

    const [lowerInput] = screen.getAllByRole("spinbutton");
    fireEvent.change(lowerInput, { target: { value: "3" } });
    fireEvent.blur(lowerInput);

    expect(setQueryBuilderJson).toHaveBeenCalledTimes(1);
    const updatedTree = setQueryBuilderJson.mock.calls[0][0];
    const updatedRule = updatedTree.rules.find(
      (n: RuleLeafType) => n.id === rule.id,
    );
    expect(updatedRule.valueAsNumber).toEqual([3, 7]);
  });

  it("BETWEEN: changing upper to 9 (existing lower 3) produces valueAsNumber [3, 9]", () => {
    const rule: RuleLeafType = {
      ...createRule(),
      valueAsNumber: [3, null],
      valueAsNumberOperator: ValueAsNumberOperator.BETWEEN,
    };
    const { setQueryBuilderJson } = renderWithRule(rule);

    const inputs = screen.getAllByRole("spinbutton");
    const upperInput = inputs[1];
    fireEvent.change(upperInput, { target: { value: "9" } });
    fireEvent.blur(upperInput);

    expect(setQueryBuilderJson).toHaveBeenCalledTimes(1);
    const updatedTree = setQueryBuilderJson.mock.calls[0][0];
    const updatedRule = updatedTree.rules.find(
      (n: RuleLeafType) => n.id === rule.id,
    );
    expect(updatedRule.valueAsNumber).toEqual([3, 9]);
  });
});
