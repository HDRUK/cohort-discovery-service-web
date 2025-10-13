import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import RuleBoard from "./RuleBoard";
import MockDaphneStore from "@/store/MockDaphneStore";
import {
  CombinatorType,
  OperatorType,
  RuleGroupType,
  RuleNodeType,
} from "@/types/rules";

import { validateRuleTree } from "@/utils/rules";

describe("RuleBoard", () => {
  const renderComponent = (
    opArgs?: Partial<OperatorType>,
    before: RuleNodeType = {
      id: "rule-before",
      rule: {
        concept: {
          concept_id: 1234,
          description: "Observation 1234",
          category: "Observation",
        },
      },
    },
    after: RuleNodeType = {
      id: "rule-after",
      rule: {
        concept: {
          concept_id: 4321,
          description: "Observation 4321",
          category: "Observation",
        },
      },
    }
  ) => {
    const operator = {
      id: "op-1",
      combinator: CombinatorType.AND,
      ...opArgs,
    };

    const query = {
      id: "group-1",
      rules: [before, operator, after],
    } as RuleGroupType;

    return render(
      <MockDaphneStore
        overrides={{
          queryBuilder: { queryBuilderJson: validateRuleTree(query) },
        }}
      >
        <RuleOperator operator={operator} groupId="group-1" />
      </MockDaphneStore>
    );
  };

  it("renders the combinator chip correctly for AND", () => {
    renderComponent();
    expect(screen.getByText("AND")).toBeInTheDocument();
    expect(screen.queryByTestId("WarningAmberIcon")).not.toBeInTheDocument();
  });

  it("renders the combinator chip correctly for OR", () => {
    renderComponent({ combinator: CombinatorType.OR });
    expect(screen.getByText("OR")).toBeInTheDocument();
    expect(screen.queryByTestId("WarningAmberIcon")).not.toBeInTheDocument();
  });

  it("shows warning icon when rule is invalid", () => {
    renderComponent({ valid: false });
    expect(screen.queryByTestId("WarningAmberIcon")).toBeInTheDocument();
  });
  /*

  it("hides itself when hidden prop is true", () => {
    setupStore();

    render(
      <RuleOperator operator={baseOperator} groupId="grp-1" hidden={true} />
    );

    // The chip still exists but should not be visible
    expect(screen.getByText("AND OR")).not.toBeVisible();
  });

  it("calls setQueryBuilderJson with updated state when Delete action is triggered", () => {
    const { setQueryBuilderJson, queryBuilderJson } = setupStore();
    (removeById as jest.Mock).mockReturnValue({ updated: true });

    render(<RuleOperator operator={baseOperator} groupId="grp-1" />);

    // RuleWrapper likely renders some button with "Delete" label
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(removeById).toHaveBeenCalledWith(queryBuilderJson, "op-123");
    expect(setQueryBuilderJson).toHaveBeenCalledWith({ updated: true });
  });*/
});
