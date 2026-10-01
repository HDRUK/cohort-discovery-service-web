import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import Rule, { RuleProps } from "./Rule";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { useQueryBuilderStore } from "@/store/queryBuilderStore";
import { RuleLeafType, RuleGroupType } from "@/types/rules";
import userEvent from "@testing-library/user-event";
import { CloseGuardProvider } from "@/providers/CloseGuardProvider";

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

const findConceptCheckbox = async (omopId: string) => {
  const items = await screen.findAllByTestId("concept-item", undefined, {
    timeout: 3000,
  });
  const match = items.find((item) => item.textContent?.includes(omopId));
  if (!match) throw new Error(`No concept item found for OMOP id ${omopId}`);
  return within(match).getByRole("checkbox");
};

describe("Rule", () => {
  const renderComponent = (
    opArgs: Partial<RuleLeafType> = {},
    rest?: Partial<RuleProps>,
    storeOverrides: Record<string, unknown> = {},
  ) => {
    const rule = {
      id: "rule-1",
      rule: {
        concept: {
          concept_id: 1234,
          name: "A test rule",
        },
      },
      ...opArgs,
    } as RuleLeafType;

    const query = {
      id: "group-1",
      rules: [rule],
    } as RuleGroupType;

    const rendered = render(
      <CloseGuardProvider>
        <MockCohortDiscoveryServiceStore
          overrides={{
            queryBuilder: { queryBuilderJson: query, setQueryBuilderJson, ...storeOverrides },
          }}
        >
          <Rule {...rest} rule={rule} groupId="group-1" />
        </MockCohortDiscoveryServiceStore>
      </CloseGuardProvider>,
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
    renderComponent({
      valid: false,
      invalidReason: ["invalid reason 1"],
    });
    expect(screen.queryByTestId("ErrorIcon")).toBeInTheDocument();
  });

  it("renders the Rule card correctly when concept is blank", async () => {
    renderComponent({ rule: { concept: null } });

    const searchInput = screen.queryByRole("textbox") as HTMLInputElement;
    expect(searchInput).toBeInTheDocument();

    await userEvent.type(searchInput, "diabetes");
    expect(searchInput).toHaveValue("diabetes");
  });

  it("calls select with the rule id when a blank rule card is clicked", async () => {
    const mockSelect = jest.fn();
    renderComponent({ rule: { concept: null } }, undefined, { select: mockSelect });

    await userEvent.click(screen.getByTestId("rule-search-container"));

    expect(mockSelect).toHaveBeenCalledWith("rule-1");
  });

  it("does not show the confirm footer for a selected blank rule before any concept is picked", () => {
    renderComponent({ rule: { concept: null } }, undefined, {
      selected: { "rule-1": true },
    });

    expect(
      screen.queryByRole("button", { name: /confirm selection/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /clear all/i }),
    ).not.toBeInTheDocument();
  });

  it(
    "shows the confirm footer with working buttons once a concept is picked",
    async () => {
      renderComponent({ rule: { concept: null } }, undefined, {
        selected: { "rule-1": true },
      });

      await userEvent.type(screen.getByRole("textbox"), "diabetes");
      await userEvent.click(await findConceptCheckbox("201826"));

      expect(
        screen.getByRole("button", { name: /confirm selection/i }),
      ).toBeEnabled();
      expect(
        screen.getByRole("button", { name: /clear all/i }),
      ).toBeInTheDocument();
    },
    10000,
  );

  it(
    "keeps the confirm footer visible with a deselect prompt after the rule loses selection",
    async () => {
      renderComponent({ rule: { concept: null } }, undefined, {
        selected: { "rule-1": true },
      });

      await userEvent.type(screen.getByRole("textbox"), "diabetes");
      await userEvent.click(await findConceptCheckbox("201826"));

      act(() => {
        useQueryBuilderStore.setState({ selected: {} });
      });

      expect(
        screen.getByText(/please confirm or clear your changes/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /confirm selection/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /clear all/i }),
      ).toBeInTheDocument();
    },
    10000,
  );

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
