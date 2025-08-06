import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import QueriesTable from "./QueriesTable";
import getQueries from "@/actions/getQueries";
import { getMockQuery } from "@/actions/__mocks__/getQueries";
import { getMockTask } from "@/actions/__mocks__/getTasks";
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
    render(<QueriesTable queries={data} hasIncomplete={false} fields={[]} />);

    expect(screen.getByText("abcde")).toBeInTheDocument();
    expect(screen.getByText("fghij")).toBeInTheDocument();
    expect(screen.getByText("klmno")).toBeInTheDocument();

    const percentCompleteCells = screen.getAllByTestId("percent-complete");

    expect(percentCompleteCells[0]).toHaveTextContent("100%");
    expect(percentCompleteCells[1]).toHaveTextContent("0%");
    expect(percentCompleteCells[2]).toHaveTextContent("50%");
  });

  {
    /*it("expands detail panel and shows natural language + TaskResults", async () => {
    render(
      <QueriesTable queries={mockQueries} hasIncomplete={false} fields={mockFields} />
    );

    // Expand the row by clicking on it
    const row = screen.getByText("query-123").closest("tr");
    if (row) {
      fireEvent.click(row);
    }

    // Natural language block should appear
    expect(
      await screen.findByText("Natural language version of query")
    ).toBeInTheDocument();

    // TaskResults (should show collection names)
    expect(screen.getByText("Synthea 1k")).toBeInTheDocument();
    expect(screen.getByText("Test Omop Collection - Small")).toBeInTheDocument();
  });*/
  }
});
