import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Rule, { RuleProps } from "./Rule";
import MockDaphneStore from "@/store/MockDaphneStore";
import { RuleLeafType, RuleGroupType } from "@/types/rules";
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
    opArgs: Partial<RuleLeafType> = {},
    rest?: Partial<RuleProps>,
  ) => {
    const rule = {
      id: "rule-1",
      rule: {
        concept: {
          concept_id: 1234,
          description: "A test rule",
        },
      },
      ...opArgs,
    } as RuleLeafType;

    const query = {
      id: "group-1",
      rules: [rule],
    } as RuleGroupType;

    const rendered = render(
      <MockDaphneStore
        overrides={{
          queryBuilder: { queryBuilderJson: query, setQueryBuilderJson },
        }}
      >
        <Rule {...rest} rule={rule} groupId="group-1" />
      </MockDaphneStore>,
    );
    return {
      query,
      rendered,
    };
  };

  it("renders the Rule card correctly", () => {
    renderComponent();

    // Updated matcher to reflect the new ConceptChip implementation
    const conceptChipDescription = screen.getByText(/A test rule/i);
    const conceptChipId = screen.getByText(/1234/i);
    const conceptChipOmop = screen.getByText(/OMOP/i);

    expect(conceptChipDescription).toBeInTheDocument();
    expect(conceptChipId).toBeInTheDocument();
    expect(conceptChipOmop).toBeInTheDocument();

    expect(screen.getByText("Include")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ErrorIcon")).not.toBeInTheDocument();
  });

  it("renders the Rule card correctly when it is an exclusion", () => {
    renderComponent({ exclude: true });

    const conceptChipDescription = screen.getByText(/A test rule/i);
    const conceptChipId = screen.getByText(/1234/i);
    const conceptChipOmop = screen.getByText(/OMOP/i);

    expect(conceptChipDescription).toBeInTheDocument();
    expect(conceptChipId).toBeInTheDocument();
    expect(conceptChipOmop).toBeInTheDocument();

    expect(screen.getByText("Exclude")).toBeInTheDocument();
  });

  it("renders the Rule card correctly when not valid", () => {
    renderComponent({ valid: false });
    expect(screen.queryByTestId("ErrorIcon")).toBeInTheDocument();
  });

  it("renders the Rule card correctly when concept is blank", async () => {
    renderComponent({ rule: { concept: null } });

    const searchInput = screen.queryByRole("textbox") as HTMLInputElement;
    expect(searchInput).toBeInTheDocument();

    await userEvent.type(searchInput, "diabetes");
    expect(searchInput).toHaveValue("diabetes");
  });

  it("calls setQueryBuilderJson with updated state when Delete action is triggered", async () => {
    const { query } = renderComponent();

    const operatorCard = screen.getByTestId("clickable-card");
    expect(operatorCard).toBeInTheDocument();

    await userEvent.pointer({ keys: "[MouseRight]", target: operatorCard });

    const deleteItem = screen.getByRole("menuitem", { name: /delete/i });
    expect(deleteItem).toBeInTheDocument();
    fireEvent.click(deleteItem);

    expect(removeById).toHaveBeenCalledWith(query, "rule-1");
    expect(setQueryBuilderJson).toHaveBeenCalled();

    await userEvent.pointer({ keys: "[MouseRight]", target: operatorCard });

    const convertButton = screen.getByRole("menuitem", {
      name: /convert to group/i,
    });
    expect(convertButton).toBeInTheDocument();
    fireEvent.click(convertButton);

    expect(updateById).toHaveBeenCalledWith(
      query,
      "rule-1",
      expect.any(Function),
    );
    expect(setQueryBuilderJson).toHaveBeenCalled();
  });
});
