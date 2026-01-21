import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { Hierarchy } from "./Hierarchy";

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
    ],
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
        <Hierarchy />
      </MockDaphneStore>,
    );
    return rendered;
  };

  it("renders the hierarchy correctly", async () => {
    renderComponent();

    const expectedTexts = ["rule-1", "op-1", "rule-2"];

    expectedTexts.map((id) => {
      const row = screen
        .getAllByRole("listitem")
        .find((li) => within(li).queryByText(id));

      expect(row).toBeTruthy();
    });
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

    const expectedTexts = ["rule-1", "op-1", "rule-2"];

    expectedTexts.map((id) => {
      const row = screen
        .getAllByRole("listitem")
        .find((li) => within(li).queryByText(id));

      expect(row).toBeTruthy();
      const icon = within(row!).queryByTestId("ErrorIcon");
      expect(icon).toBeInTheDocument();
    });
  });
});
