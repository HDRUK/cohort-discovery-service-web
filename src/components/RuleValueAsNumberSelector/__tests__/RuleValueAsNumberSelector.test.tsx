import { render, screen } from "@testing-library/react";
import RuleValueAsNumberSelector from "../RuleValueAsNumberSelector";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { createRule, createRuleGroup } from "@/utils/rules";
import { ValueAsNumberOperator } from "@/types/rules";

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
