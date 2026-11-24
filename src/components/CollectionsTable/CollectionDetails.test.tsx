import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import CollectionDetails from "./CollectionDetails";
import useCollectionDetails from "./useCollectionDetails";
import { getMockResultFile, getMockTask } from "@/test/fixtures/tasks";
import { CollectionDetails as CollectionDetailsType } from "@/types/api";

jest.mock("./useCollectionDetails");

const PID = "74514919-09a7-4703-9dbc-9820c4e0d8f4";

const lastGoodScan = getMockResultFile({
  id: 1180,
  rows_processed: 2,
  task: getMockTask({ id: 17799, completed_at: "2026-11-24T09:20:01Z" }),
  created_at: "2026-11-24T09:20:01Z",
});

const emptyLatestScan = getMockResultFile({
  id: 1181,
  rows_processed: 0,
  task: getMockTask({ id: 17800, completed_at: "2026-11-24T09:27:11Z" }),
  created_at: "2026-11-24T09:27:11Z",
});

const metadataFile = getMockResultFile({
  id: 1182,
  file_name: "metadata.bcos",
  file_description: "Metadata for the result of code.distribution analysis",
  rows_processed: 1,
  task: emptyLatestScan.task,
  created_at: "2026-11-24T09:27:11Z",
});

const renderDetails = (rest: Partial<CollectionDetailsType>) => {
  (useCollectionDetails as jest.Mock).mockReturnValue({
    isLoading: false,
    data: {
      pid: PID,
      nconcepts: 2,
      demographics: [],
      result_files: [],
      created_at: "2026-05-19T14:21:17Z",
      updated_at: "2026-05-19T14:21:17Z",
      ...rest,
    },
  });

  render(<CollectionDetails pid={PID} />);

  return within(
    screen.getByRole("region", { name: "Last successful concept scan" }),
  );
};

describe("CollectionDetails", () => {
  it("identifies the last successful concept scan", () => {
    const scan = renderDetails({
      result_files: [emptyLatestScan, metadataFile, lastGoodScan],
      latest_successful_concept_result_file: lastGoodScan,
    });

    expect(scan.getByText("Task ID").nextSibling).toHaveTextContent("17799");
    expect(scan.getByText("Result file ID").nextSibling).toHaveTextContent(
      "1180",
    );
    expect(scan.getByText("Name").nextSibling).toHaveTextContent(
      "Result of code.distribution analysis",
    );
    expect(scan.getByText("Rows processed").nextSibling).toHaveTextContent("2");
    expect(scan.getByText("Number of concepts").nextSibling).toHaveTextContent(
      "2",
    );
  });

  it("warns when the latest scan returned no rows", () => {
    const scan = renderDetails({
      result_files: [emptyLatestScan, metadataFile, lastGoodScan],
      latest_successful_concept_result_file: lastGoodScan,
    });

    expect(scan.getByText("Task 17800 returned 0 rows")).toBeInTheDocument();
  });

  it("does not warn when the latest scan is the successful one", () => {
    const scan = renderDetails({
      result_files: [lastGoodScan],
      latest_successful_concept_result_file: lastGoodScan,
    });

    expect(scan.queryByText(/^Task \d+ /)).not.toBeInTheDocument();
  });

  it("shows an empty state when no scan has been successful", () => {
    const scan = renderDetails({
      nconcepts: 0,
      result_files: [emptyLatestScan],
      latest_successful_concept_result_file: null,
    });

    expect(
      scan.getByText("No successful concept scan yet"),
    ).toBeInTheDocument();
    expect(scan.getByText("Task 17800 returned 0 rows")).toBeInTheDocument();
  });

  it("labels the collection timestamps so they are not mistaken for job dates", () => {
    const scan = renderDetails({
      latest_successful_concept_result_file: lastGoodScan,
      result_files: [lastGoodScan],
    });

    expect(scan.getByText("Collection created")).toBeInTheDocument();
    expect(scan.getByText("Collection updated")).toBeInTheDocument();
  });

  it("marks the file used for the concept count and flags empty files", () => {
    renderDetails({
      result_files: [emptyLatestScan, metadataFile, lastGoodScan],
      latest_successful_concept_result_file: lastGoodScan,
    });

    const fileRows = screen
      .getAllByRole("row")
      .filter((row) => (row as HTMLTableRowElement).cells.length > 2);
    const rowFor = (id: string) =>
      fileRows.find((row) => within(row).queryAllByText(id).length > 0);

    expect(
      within(rowFor("1180")!).getByText("Used for concept count"),
    ).toBeInTheDocument();
    expect(
      within(rowFor("1181")!).getByText("Empty (0 rows)"),
    ).toBeInTheDocument();
    expect(
      within(rowFor("1182")!).queryByText("Empty (0 rows)"),
    ).not.toBeInTheDocument();
  });

  it("shows the task completion time rather than the file creation time", () => {
    renderDetails({
      result_files: [
        getMockResultFile({
          id: 1180,
          task: getMockTask({
            id: 17799,
            completed_at: "2026-11-24T09:20:01Z",
          }),
          created_at: "2026-01-02T03:04:05Z",
        }),
      ],
      latest_successful_concept_result_file: null,
    });

    expect(screen.queryByText(/02\/01\/2026/)).not.toBeInTheDocument();
    expect(screen.getAllByText(/24\/11\/2026/).length).toBeGreaterThan(0);
  });
});
