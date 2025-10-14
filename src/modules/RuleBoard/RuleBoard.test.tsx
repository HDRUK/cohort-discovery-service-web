import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import RuleBoard from "./RuleBoard";

import MockDaphneStore from "@/store/MockDaphneStore";
import { CombinatorType, RuleGroupType, RuleNodeType } from "@/types/rules";
import { validateRuleTree } from "@/utils/rules";
const setQueryBuilderJson = jest.fn();

describe("QueryBuilder", () => {
  const renderComponent = (
    rules: RuleNodeType[] = [
      {
        id: "rule-1",
        rule: {
          concept: {
            concept_id: 1234,
            description: "Rule 1234",
            category: "cat-1",
          },
        },
      },
      {
        id: "op-1",
        combinator: CombinatorType.AND,
      },
      {
        id: "rule-2",
        rule: {
          concept: {
            concept_id: 4321,
            description: "Rule 4321",
            category: "cat-1",
          },
        },
      },
    ]
  ) => {
    const group = validateRuleTree({
      id: "group-1",
      rules,
    }) as RuleGroupType;
    const rendered = render(
      <MockDaphneStore
        overrides={{
          queryBuilder: {
            queryBuilderJson: group,
            setQueryBuilderJson,
          },
        }}
      >
        <RuleBoard ruleGroup={group} />
      </MockDaphneStore>
    );
    return rendered;
  };

  it("renders the board correctly", async () => {
    renderComponent();

    const ruleHeadings = screen.getAllByRole("heading", { name: /rule/i });
    expect(ruleHeadings).toHaveLength(2);

    const expectedTexts = ["Rule 1234", "Rule 4321"];

    ruleHeadings.map((heading, i) => {
      const ruleCard = heading.closest('[data-testid="clickable-card"]');
      const scope = within(ruleCard as HTMLElement);
      expect(scope.getByText(expectedTexts[i])).toBeInTheDocument();
    });

    const chip = screen.getByText("AND").closest(".MuiChip-root");
    expect(chip).toBeInTheDocument();
  });

  it("renders the warnings when the order is wrong", async () => {
    renderComponent([
      {
        id: "rule-1",
        rule: {
          concept: {
            concept_id: 1234,
            description: "Rule 1234",
            category: "cat-1",
          },
        },
      },
      {
        id: "rule-2",
        rule: {
          concept: {
            concept_id: 4321,
            description: "Rule 4321",
            category: "cat-1",
          },
        },
      },
      {
        id: "op-1",
        combinator: CombinatorType.AND,
      },
    ]);

    const ruleHeadings = screen.getAllByRole("heading", { name: /rule/i });
    expect(ruleHeadings).toHaveLength(2);

    const expectedTexts = ["Rule 1234", "Rule 4321"];

    ruleHeadings.map((heading, i) => {
      const ruleCard = heading.closest('[data-testid="clickable-card"]');
      const scope = within(ruleCard as HTMLElement);
      expect(scope.getByText(expectedTexts[i])).toBeInTheDocument();
      expect(scope.queryByTestId("WarningAmberIcon")).toBeInTheDocument();
    });
  });
});
