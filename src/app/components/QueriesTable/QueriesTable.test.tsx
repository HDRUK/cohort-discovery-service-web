import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import QueriesTable from "./QueriesTable";
import { getMockQuery } from "@/actions/__mocks__/getQueries";
import { getMockTask } from "@/actions/__mocks__/getTasks";
import { Field } from "react-querybuilder";
import { paginateData } from "@/utils/mock";
jest.mock("@/actions/getQueries");

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("QueriesTable", () => {
  it("renders a query row with task stats", async () => {
    const data = [
      getMockQuery({ id: 1, pid: "abcde", tasks: [getMockTask()] }),
      getMockQuery({ id: 2, pid: "fghij", tasks: [] }),
      getMockQuery({
        id: 1,
        pid: "klmno",
        tasks: [getMockTask(), getMockTask({ completed_at: null })],
      }),
    ];
    render(
      <QueriesTable
        queries={paginateData({ data })}
        hasIncomplete={false}
        fields={[]}
      />
    );

    expect(screen.getByText("abcde")).toBeInTheDocument();
    expect(screen.getByText("fghij")).toBeInTheDocument();
    expect(screen.getByText("klmno")).toBeInTheDocument();

    const percentCompleteCells = screen.getAllByTestId("percent-complete");

    expect(percentCompleteCells[0]).toHaveTextContent("100%");
    expect(percentCompleteCells[1]).toHaveTextContent("0%");
    expect(percentCompleteCells[2]).toHaveTextContent("50%");
  });

  it("expands detail panel and shows natural language + TaskResults", async () => {
    const mockQueries = [
      getMockQuery({
        pid: "abcde",
        definition: {
          id: "def-1",
          combinator: "and",
          rules: [
            {
              id: "rule-1",
              field: "condition",
              operator: "=",
              value: "1234",
            },
          ],
        },
      }),
    ];
    render(
      <QueriesTable queries={mockQueries} hasIncomplete={false} fields={[]} />
    );

    const row = screen.getByText("abcde").closest("tr");
    if (row) {
      fireEvent.click(row);
    }

    expect(screen.getByText("condition is 1234")).toBeInTheDocument();
    expect(screen.getByText("Test Dataset #1")).toBeInTheDocument();
  });

  it("expands detail panel and shows natural language complex + TaskResults", async () => {
    const mockQueries = [
      getMockQuery({
        pid: "abcde",
        definition: {
          id: "def-1",
          combinator: "and",
          rules: [
            {
              id: "rule-1",
              field: "condition",
              operator: "!=",
              value: "1234",
            },
            {
              id: "rule-1",
              field: "condition",
              operator: "=",
              value: "4321",
            },
          ],
        },
      }),
    ];
    render(
      <QueriesTable queries={mockQueries} hasIncomplete={false} fields={[]} />
    );

    const row = screen.getByText("abcde").closest("tr");
    if (row) {
      fireEvent.click(row);
    }

    expect(
      screen.getByText("condition is not 1234, and condition is 4321")
    ).toBeInTheDocument();
  });

  it("expands detail panel and shows natural language + TaskResults", async () => {
    const mockQueries = [
      getMockQuery({
        pid: "abcde",
        definition: {
          id: "def-1",
          combinator: "and",
          rules: [
            {
              id: "rule-1",
              field: "condition",
              operator: "=",
              value: "1234",
            },
          ],
        },
      }),
    ];

    const fields: Field[] = [
      {
        name: "condition",
        label: "Condition",
        values: [{ name: "1234", label: "My Condition" }],
      },
    ];

    render(
      <QueriesTable
        queries={mockQueries}
        hasIncomplete={false}
        fields={fields}
      />
    );

    const row = screen.getByText("abcde").closest("tr");
    if (row) {
      fireEvent.click(row);
    }
    expect(screen.getByText("Condition is My Condition")).toBeInTheDocument();
  });
});
