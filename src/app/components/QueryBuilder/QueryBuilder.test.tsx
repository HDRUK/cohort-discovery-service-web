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
    let currentQueryJson = getQueryJson();

    const setQueryBuilderJson = jest.fn((newQuery) => {
      currentQueryJson = newQuery;
    });

    (useDaphneStore as unknown as jest.Mock).mockImplementation(() => ({
      queryBuilder: {
        get queryBuilderJson() {
          return currentQueryJson;
        },
        setQueryBuilderJson,
      },
      stateManagement: {
        isLoading: false,
      },
    }));

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

    const select = rule1.getAllByRole("combobox")[1];

    await userEvent.click(select);

    await screen.findByRole("listbox");

    const options = await screen.findAllByRole("option");
    const betweenOption = options.find((opt) => opt.textContent === "between");
    expect(betweenOption).toBeDefined();
    await userEvent.click(betweenOption!);

    expect(setQueryBuilderJson).toHaveBeenCalledWith(
      expect.objectContaining({
        rules: expect.arrayContaining([
          expect.objectContaining({
            field: "age",
            operator: "between",
            value: 60,
          }),
        ]),
      })
    );

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
