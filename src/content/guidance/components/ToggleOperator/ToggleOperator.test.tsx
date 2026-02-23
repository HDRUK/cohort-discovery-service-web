import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToggleOperator from "./ToggleOperator";
import MockDaphneStore from "@/store/MockDaphneStore";
import { CombinatorType } from "@/types/rules";
import { v4 as uuidv4 } from "uuid";
const setSelectedGuidance = jest.fn();

describe("ToggleOperator", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays OR operator and can toggle to AND and back", async () => {
    const user = userEvent.setup();
    const operator = {
      id: uuidv4(),
      combinator: CombinatorType.OR,
      exclude: false,
    };

    render(
      <MockDaphneStore
        overrides={{
          queryBuilder: {
            openSelectDatasetsPanel: true,
            setSelectedGuidance: setSelectedGuidance,
          },
        }}
      >
        <ToggleOperator operator={operator} />
      </MockDaphneStore>,
    );

    let orRadio = screen.getByLabelText("OR") as HTMLInputElement;
    expect(orRadio).toBeInTheDocument();
    expect(orRadio.checked).toBe(true);

    await user.click(orRadio);

    const andRadio = screen.getByLabelText("AND") as HTMLInputElement;
    expect(andRadio).toBeInTheDocument();

    await user.click(andRadio);

    orRadio = screen.getByLabelText("OR") as HTMLInputElement;
    expect(orRadio).toBeInTheDocument();
    expect(orRadio.checked).toBe(true);
  });
});
