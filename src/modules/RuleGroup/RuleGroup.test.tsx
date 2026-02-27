import "@testing-library/jest-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import RuleGroup, { RuleGroupProps } from "./RuleGroup";
import MockDaphneStore from "@/store/MockDaphneStore";
import { CombinatorType, RuleGroupType } from "@/types/rules";
import userEvent from "@testing-library/user-event";

jest.mock("@/utils/rules", () => {
  const actual = jest.requireActual("@/utils/rules");
  return {
    ...actual,
    removeById: jest.fn(),
    updateById: jest.fn(),
  };
});
import { removeById, updateById } from "@/utils/rules";

const setQueryBuilderJson = jest.fn();

describe("Rule", () => {
  const renderComponent = (
    opArgs: Partial<RuleGroupType> = {},
    rest?: Partial<RuleGroupProps>,
  ) => {
    const group = {
      id: "group-1",
      rules: [
        {
          id: "rule-1",
          rule: {
            concept: {
              concept_id: 1234,
              description: "Rule 1234",
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
            },
          },
        },
      ],
      ...opArgs,
    } as RuleGroupType;

    const query = {
      id: "outer-group",
      rules: [group],
    } as RuleGroupType;

    const rendered = render(
      <MockDaphneStore
        overrides={{
          queryBuilder: { queryBuilderJson: query, setQueryBuilderJson },
        }}
      >
        <RuleGroup {...rest} group={group} parentGroupId="outer-group" />
      </MockDaphneStore>,
    );
    return {
      query,
      rendered,
    };
  };

  it("renders the RuleGroup card correctly", () => {
    renderComponent();

    const groupHeading = screen.getByRole("heading", { name: /group/i });
    const groupCard = groupHeading.closest('[data-testid="clickable-card"]');
    expect(groupCard).toBeInTheDocument();

    const scope = within(groupCard as HTMLInputElement);

    expect(scope.getByText("Rule 1234")).toBeInTheDocument();
    expect(scope.getByText("Rule 4321")).toBeInTheDocument();
    expect(scope.getByText("AND")).toBeInTheDocument();
  });

  it("renders the RuleGroup card correctly when it is an exclusion", () => {
    renderComponent({ exclude: true });
    const groupHeading = screen.getByRole("heading", { name: /group/i });
    const headerEl = groupHeading.closest(".MuiCardHeader-root") as HTMLElement;
    expect(headerEl).toBeInTheDocument();

    expect(within(headerEl).getByText(/exclude/i)).toBeInTheDocument();
  });

  it("renders the RuleGroup card correctly when not valid", () => {
    renderComponent({ valid: false });
    const groupHeading = screen.getByRole("heading", { name: /group/i });
    const headerEl = groupHeading.closest(".MuiCardHeader-root") as HTMLElement;
    expect(headerEl).toBeInTheDocument();

    expect(within(headerEl).queryByTestId("ErrorIcon")).toBeInTheDocument();
  });

  it("calls setQueryBuilderJson with updated state when actions are triggered", async () => {
    const { query } = renderComponent();

    const groupHeading = screen.getByRole("heading", { name: /group/i });
    const groupCard = groupHeading.closest(
      '[data-testid="clickable-card"]',
    ) as Element;
    expect(groupCard).toBeInTheDocument();

    await userEvent.pointer({ keys: "[MouseRight]", target: groupCard });

    const deleteItem = screen.getByRole("menuitem", { name: /delete/i });
    expect(deleteItem).toBeInTheDocument();
    fireEvent.click(deleteItem);

    expect(removeById).toHaveBeenCalledWith(query, "group-1");
    expect(setQueryBuilderJson).toHaveBeenCalled();

    await userEvent.pointer({ keys: "[MouseRight]", target: groupCard });

    const convertButton = screen.getByRole("menuitem", {
      name: /ungroup/i,
    });
    expect(convertButton).toBeInTheDocument();
    fireEvent.click(convertButton);

    expect(updateById).toHaveBeenCalledWith(
      query,
      "group-1",
      expect.any(Function),
    );
    expect(setQueryBuilderJson).toHaveBeenCalled();

    await userEvent.pointer({ keys: "[MouseRight]", target: groupCard });

    const addButton = screen.getByRole("menuitem", {
      name: /add rule/i,
    });
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);

    expect(updateById).toHaveBeenCalledWith(
      query,
      "group-1",
      expect.any(Function),
    );
    expect(setQueryBuilderJson).toHaveBeenCalled();
  });
});
