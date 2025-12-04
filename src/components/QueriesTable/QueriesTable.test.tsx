import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import QueriesTable from "./QueriesTable";
import { getMockQuery } from "@/actions/__mocks__/getQueries";
import { paginateData } from "@/utils/mock";
import MockDaphneStore from "@/store/MockDaphneStore";
jest.mock("@/actions/getQueries");

describe("QueriesTable", () => {
  /* it("renders a query row with task stats", async () => {
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
      <QueriesTable queries={paginateData({ data })} hasIncomplete={false} />
    );

    expect(screen.getByText("abcde")).toBeInTheDocument();
    expect(screen.getByText("fghij")).toBeInTheDocument();
    expect(screen.getByText("klmno")).toBeInTheDocument();

    const percentCompleteCells = screen.getAllByTestId("percent-complete");

    expect(percentCompleteCells[0]).toHaveTextContent("100%");
    expect(percentCompleteCells[1]).toHaveTextContent("0%");
    expect(percentCompleteCells[2]).toHaveTextContent("50%");
  });*/

  it("expands detail panel and shows natural language + TaskResults", async () => {
    const mockQueries = [getMockQuery()];
    render(
      <MockDaphneStore>
        <QueriesTable
          queries={paginateData({ data: mockQueries })}
          hasIncomplete={false}
        />
      </MockDaphneStore>
    );

    const row = screen.getByText("Test Query").closest("tr");
    if (row) {
      fireEvent.click(row);
    }

    expect(screen.getByText("Test Dataset #1")).toBeInTheDocument();
  });

  // note: removing tests because the designs have completey changed
  // - will be revisited in a new tasks
});
