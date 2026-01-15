import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import RuleOperator, { RuleOperatorProps } from "./RuleOperator";
import MockDaphneStore from "@/store/MockDaphneStore";
import { CombinatorType, OperatorType, RuleGroupType } from "@/types/rules";
import userEvent from "@testing-library/user-event";

jest.mock("@/utils/rules", () => {
  const actual = jest.requireActual("@/utils/rules");
  return {
    ...actual,
    removeById: jest.fn(),
  };
});
import { removeById } from "@/utils/rules";

const setQueryBuilderJson = jest.fn();

describe("RuleOperator", () => {
  const renderComponent = (
    opArgs: Partial<OperatorType> = {},
    rest?: Partial<RuleOperatorProps>
  ) => {
    const operator = {
      id: "op-1",
      combinator: CombinatorType.AND,
      ...opArgs,
    };

    const query = {
      id: "group-1",
      rules: [operator],
    } as RuleGroupType;

    const rendered = render(
      <MockDaphneStore
        overrides={{
          queryBuilder: { queryBuilderJson: query, setQueryBuilderJson },
        }}
      >
        <RuleOperator {...rest} operator={operator} groupId="group-1" />
      </MockDaphneStore>
    );
    return {
      query,
      rendered,
    };
  };

  it("renders the combinator chip correctly for AND", () => {
    renderComponent();
    expect(screen.getByText("AND")).toBeInTheDocument();
    expect(screen.queryByTestId("ErrorIcon")).not.toBeInTheDocument();
  });

  it("renders the combinator chip correctly for OR", () => {
    renderComponent({ combinator: CombinatorType.OR });
    expect(screen.getByText("OR")).toBeInTheDocument();
    expect(screen.queryByTestId("ErrorIcon")).not.toBeInTheDocument();
  });

  it("shows warning icon when rule is invalid", () => {
    renderComponent({ valid: false });
    expect(screen.queryByTestId("ErrorIcon")).toBeInTheDocument();
  });

  it("hides itself when hidden prop is true", () => {
    renderComponent({}, { hidden: true });

    expect(screen.getByText("AND")).not.toBeVisible();
  });

  it("calls setQueryBuilderJson with updated state when Delete action is triggered", async () => {
    const { query } = renderComponent();

    const operatorCard = screen.getByTestId("clickable-card");
    expect(operatorCard).toBeInTheDocument();

    await userEvent.pointer({ keys: "[MouseRight]", target: operatorCard });

    const deleteItem = screen.getByRole("menuitem", { name: /delete/i });
    expect(deleteItem).toBeInTheDocument();
    fireEvent.click(deleteItem);

    expect(removeById).toHaveBeenCalledWith(query, "op-1");
    expect(setQueryBuilderJson).toHaveBeenCalled();
  });
});
