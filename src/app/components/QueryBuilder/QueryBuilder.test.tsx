import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QueryBuilder from "./QueryBuilder";
import { Field } from "react-querybuilder";
import { useDaphneStore } from "@/store/useDaphneStore";
import { getQueryJson } from "./__mocks__/getQueryJson";
import { baseFields } from "@/config/queryFields";

jest.mock("@/store/useDaphneStore", () => ({
  useDaphneStore: jest.fn(),
}));

describe("QueryBuilder", () => {
  it("renders query in the builder", async () => {
    const mockQueryJson = getQueryJson();
    const setQueryBuilderJson = jest.fn();

    (useDaphneStore as unknown as jest.Mock).mockReturnValue({
      queryBuilder: {
        queryBuilderJson: mockQueryJson,
        setQueryBuilderJson,
      },
      stateManagement: {
        isLoading: false,
      },
    });

    const fields: Field[] = baseFields.map((field) => {
      if (field.name === "condition") {
        return {
          ...field,
          values: [
            { name: "201826", label: "Diabetes" },
            { name: "12345", label: "MyCondition" },
          ],
        };
      }
      return field;
    });

    render(<QueryBuilder fields={fields} />);

    const rules = screen.getAllByTestId("rule");
    expect(rules).toHaveLength(2);

    const rule1 = within(rules[0]);
    expect(rule1.getByDisplayValue("age")).toBeInTheDocument();
    expect(rule1.getByDisplayValue(">")).toBeInTheDocument();
    expect(rule1.getByDisplayValue("60")).toBeInTheDocument();

    const operatorInput = rule1.getByDisplayValue(">");
    await userEvent.click(operatorInput);

    const betweenOption = await screen.findByRole("option", {
      name: "between",
    });
    await userEvent.click(betweenOption);

    const inputs = rule1.getAllByRole("textbox");
    expect(inputs).toHaveLength(2);

    await userEvent.clear(inputs[0]);
    await userEvent.type(inputs[0], "40");

    await userEvent.clear(inputs[1]);
    await userEvent.type(inputs[1], "80");

    console.log(JSON.stringify(setQueryBuilderJson.mock.calls));
    return;

    const rule2 = within(rules[1]);
    expect(rule2.getByDisplayValue("condition")).toBeInTheDocument();
    expect(rule2.getByDisplayValue("=")).toBeInTheDocument();
    expect(rule2.getByDisplayValue("Diabetes")).toBeInTheDocument();

    const comboBoxes = rule2.getAllByRole("combobox");

    const valueInput = comboBoxes[2];
    expect(valueInput).toHaveDisplayValue("Diabetes");

    await userEvent.click(valueInput);

    const option = await screen.findByRole("option", { name: "MyCondition" });
    await userEvent.click(option);

    expect(setQueryBuilderJson).toHaveBeenCalledWith(
      expect.objectContaining({
        rules: expect.arrayContaining([
          expect.objectContaining({
            field: "condition",
            operator: "=",
            value: "12345",
          }),
        ]),
      })
    );
  });
});
