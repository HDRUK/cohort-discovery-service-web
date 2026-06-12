import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CohortQueryInput from ".";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import {
  CombinatorType,
  OperatorType,
  RuleLeafType,
  RuleNodeType,
} from "@/types/rules";
import {
  createRuleGroup,
  isOperator,
  isRuleGroup,
  isRuleLeaf,
} from "@/utils/rules";

const setQueryBuilderJson = jest.fn();
const getQueryFromText = jest.fn();
const resetQueryBuilderJson = jest.fn();
const appendError = jest.fn();

const makeRule = (name: string): RuleLeafType =>
  ({
    id: `${name}-rule`,
    valid: true,
    rule: {
      concept: {
        concept_id: name.length,
        name,
        category: "Condition",
        children: [],
      },
    },
  }) satisfies RuleLeafType;

const makeOperator = (combinator: CombinatorType): OperatorType =>
  ({
    id: `${combinator}-operator`,
    valid: true,
    combinator,
  }) satisfies OperatorType;

const diabetesRule = makeRule("Diabetes");
const covidRule = makeRule("COVID-19");
const cancerRule = makeRule("Cancer");
const andRule = makeOperator(CombinatorType.AND);
const orRule = makeOperator(CombinatorType.OR);

const diabetesQuery = createRuleGroup([diabetesRule]);

const covidQuery = createRuleGroup([covidRule]);

const covidAndCancerQuery = createRuleGroup([covidRule, andRule, cancerRule]);

const covidOrCancerQuery = createRuleGroup([covidRule, orRule, cancerRule]);

const renderComponent = ({ queryBuilderJson = createRuleGroup([]) } = {}, extraOverrides: Record<string, unknown> = {}) => {
  return render(
    <MockCohortDiscoveryServiceStore
      overrides={{
        queryBuilder: {
          queryBuilderJson,
          getQueryFromText,
          setQueryBuilderJson,
          resetQueryBuilderJson,
          appendError,
          errors: [],
          hasSelectedSyntheticDatasets: false,
          ...extraOverrides,
        },
      }}
    >
      <CohortQueryInput queries={[]} />
    </MockCohortDiscoveryServiceStore>,
  );
};

const getSearchInput = () => screen.getByRole("searchbox");

const submitWithEnter = async (value: string) => {
  const user = userEvent.setup();

  const input = getSearchInput();

  await user.clear(input);
  await user.type(input, value);
  await user.keyboard("{Enter}");
};

const clickAdd = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: /add/i }));
};

const clickStartFresh = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: /start fresh/i }));
};

const expectRuleNode = (actual: RuleNodeType, expected: RuleNodeType) => {
  if (isOperator(expected)) {
    expect(isOperator(actual)).toBe(true);

    if (!isOperator(actual)) return;

    expect(actual.combinator).toBe(expected.combinator);
    return;
  }

  if (isRuleLeaf(expected)) {
    expect(isRuleLeaf(actual)).toBe(true);

    if (!isRuleLeaf(actual)) return;

    expect(actual?.rule?.concept?.name).toBe(expected?.rule?.concept?.name);
    return;
  }

  if (isRuleGroup(expected)) {
    expect(isRuleGroup(actual)).toBe(true);

    if (!isRuleGroup(actual)) return;

    expectRules(actual.rules, expected.rules);
    return;
  }

  throw new Error("Unsupported expected rule node");
};

const expectRules = (
  actualRules: RuleNodeType[],
  expectedRules: RuleNodeType[],
) => {
  expect(actualRules).toHaveLength(expectedRules.length);

  expectedRules.forEach((expected, index) => {
    expectRuleNode(actualRules[index], expected);
  });
};

describe("CohortQueryInput", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("opens the search overlay when the empty input is focused", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(getSearchInput());

    expect(
      await screen.findByTestId("search-overlay-paper"),
    ).toBeInTheDocument();

    expect(await screen.findByText("Query Examples")).toBeInTheDocument();
  });

  it("does not update queryBuilderJson while typing, then updates when Enter is pressed", async () => {
    const user = userEvent.setup();

    getQueryFromText.mockResolvedValueOnce(diabetesQuery);

    renderComponent();

    const input = getSearchInput();

    await user.type(input, "diabetes");

    expect(setQueryBuilderJson).not.toHaveBeenCalled();

    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(setQueryBuilderJson).toHaveBeenCalledWith(diabetesQuery);
    });
  });

  it("updates queryBuilderJson when the arrow button is clicked", async () => {
    const user = userEvent.setup();

    getQueryFromText.mockResolvedValueOnce(diabetesQuery);

    renderComponent();

    await user.type(getSearchInput(), "diabetes");

    expect(setQueryBuilderJson).not.toHaveBeenCalled();

    const buttons = screen.getAllByRole("button");
    const arrowButton = buttons[buttons.length - 1];

    await user.click(arrowButton);

    await waitFor(() => {
      expect(setQueryBuilderJson).toHaveBeenCalledWith(diabetesQuery);
    });
  });

  it("replaces the existing query when Start Fresh is selected", async () => {
    getQueryFromText.mockResolvedValueOnce(covidQuery);

    renderComponent({
      queryBuilderJson: diabetesQuery,
    });

    await clickStartFresh();
    await submitWithEnter("covid");

    await waitFor(() => {
      expect(setQueryBuilderJson).toHaveBeenCalledWith(covidQuery);
    });
  });

  it("uses AND when adding a plain query to an existing single-term query", async () => {
    getQueryFromText.mockResolvedValueOnce(covidQuery);

    renderComponent({
      queryBuilderJson: diabetesQuery,
    });

    await clickAdd();
    await submitWithEnter("covid");

    await waitFor(() => {
      expect(setQueryBuilderJson).toHaveBeenCalled();
    });

    const updatedQuery = setQueryBuilderJson.mock.calls[0][0];

    const expectedRules = [covidRule, andRule, diabetesRule];

    expectRules(updatedQuery.rules, expectedRules);
  });

  it("uses OR when adding a query with explicit OR to an existing single-term query", async () => {
    getQueryFromText.mockResolvedValueOnce(covidQuery);

    renderComponent({
      queryBuilderJson: diabetesQuery,
    });

    await clickAdd();
    await submitWithEnter("or covid");

    await waitFor(() => {
      expect(setQueryBuilderJson).toHaveBeenCalled();
    });

    const updatedQuery = setQueryBuilderJson.mock.calls[0][0];

    expectRules(updatedQuery.rules, [covidRule, orRule, diabetesRule]);
  });

  it("adds plain diabetes to existing covid AND cancer using AND", async () => {
    getQueryFromText.mockResolvedValueOnce(diabetesQuery);

    renderComponent({
      queryBuilderJson: covidAndCancerQuery,
      queryAsText: "COVID-19 and Cancer",
    });

    await clickAdd();
    await submitWithEnter("diabetes");

    await waitFor(() => {
      expect(setQueryBuilderJson).toHaveBeenCalled();
    });

    const updatedQuery = setQueryBuilderJson.mock.calls[0][0];

    expectRules(updatedQuery.rules, [
      diabetesRule,
      andRule,
      covidRule,
      andRule,
      cancerRule,
    ]);
  });

  it("adds explicit AND diabetes to existing covid AND cancer without grouping", async () => {
    getQueryFromText.mockResolvedValueOnce(diabetesQuery);

    renderComponent({
      queryBuilderJson: covidAndCancerQuery,
    });

    await clickAdd();
    await submitWithEnter("and diabetes");

    await waitFor(() => {
      expect(setQueryBuilderJson).toHaveBeenCalled();
    });

    const updatedQuery = setQueryBuilderJson.mock.calls[0][0];

    expectRules(updatedQuery.rules, [
      diabetesRule,
      andRule,
      covidRule,
      andRule,
      cancerRule,
    ]);
  });

  it("groups existing covid AND cancer when adding explicit OR diabetes", async () => {
    getQueryFromText.mockResolvedValueOnce(diabetesQuery);

    renderComponent({
      queryBuilderJson: covidAndCancerQuery,
    });

    await clickAdd();
    await submitWithEnter("or diabetes");

    await waitFor(() => {
      expect(setQueryBuilderJson).toHaveBeenCalled();
    });

    const updatedQuery = setQueryBuilderJson.mock.calls[0][0];

    expect(updatedQuery.rules).toHaveLength(3);

    expect(updatedQuery.rules[0]).toEqual(diabetesRule);

    expect(updatedQuery.rules[1]).toEqual(
      expect.objectContaining({
        combinator: CombinatorType.OR,
      }),
    );

    expect(updatedQuery.rules[2]).toEqual(
      expect.objectContaining({
        rules: covidAndCancerQuery.rules,
      }),
    );
  });

  it("adds explicit OR diabetes to existing covid OR cancer without grouping", async () => {
    getQueryFromText.mockResolvedValueOnce(diabetesQuery);

    renderComponent({
      queryBuilderJson: covidOrCancerQuery,
    });

    await clickAdd();
    await submitWithEnter("or diabetes");

    await waitFor(() => {
      expect(setQueryBuilderJson).toHaveBeenCalled();
    });

    const updatedQuery = setQueryBuilderJson.mock.calls[0][0];

    expectRules(updatedQuery.rules, [
      diabetesRule,
      orRule,
      covidRule,
      orRule,
      cancerRule,
    ]);
  });

  it("selects the first alternative rule after search returns a query with alternatives", async () => {
    const mockSelect = jest.fn();
    const ruleWithAlts = {
      id: "covid-alt-rule",
      valid: false,
      invalidReason: ["alternatives"],
      rule: {
        concept: {
          concept_id: 100,
          name: "COVID-19",
          category: "Condition",
          alternatives: [{ concept_id: 200, name: "Acute COVID-19", category: "Condition" }],
        },
      },
    } as unknown as RuleLeafType;

    getQueryFromText.mockResolvedValueOnce(createRuleGroup([ruleWithAlts]));

    renderComponent({}, { select: mockSelect });

    await submitWithEnter("covid-alternatives");

    await waitFor(() => {
      expect(mockSelect).toHaveBeenCalledWith("covid-alt-rule");
    });
  });

  it("groups existing covid OR cancer when adding explicit AND diabetes", async () => {
    getQueryFromText.mockResolvedValueOnce(diabetesQuery);

    renderComponent({
      queryBuilderJson: covidOrCancerQuery,
    });

    await clickAdd();
    await submitWithEnter("and diabetes");

    await waitFor(() => {
      expect(setQueryBuilderJson).toHaveBeenCalled();
    });

    const updatedQuery = setQueryBuilderJson.mock.calls[0][0];

    expectRules(updatedQuery.rules, [
      diabetesRule,
      andRule,
      createRuleGroup([covidRule, orRule, cancerRule]),
    ]);
  });
});
