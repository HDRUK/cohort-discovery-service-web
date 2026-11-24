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
});

const emptyLatestScan = getMockResultFile({
  id: 1181,
  rows_processed: 0,
  task: getMockTask({ id: 17800, completed_at: "2026-11-24T09:27:11Z" }),
});

const metadataFile = getMockResultFile({
  id: 1182,
  file_name: "metadata.bcos",
  file_description: "Metadata for the result of code.distribution analysis",
  rows_processed: 1,
  task: emptyLatestScan.task,
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
};

const valueFor = (label: string) =>
  screen.getByText(label, { selector: "td, th, span, p" }).closest("tr")!;

describe("CollectionDetails", () => {
  it("titles the panel Concepts and says what it shows", () => {
    renderDetails({ latest_successful_concept_result_file: lastGoodScan });

    expect(screen.getByText(/^Concepts\s*\//)).toBeInTheDocument();
    expect(
      screen.getByText("From the most recent scan that returned concepts."),
    ).toBeInTheDocument();
  });

  it("shows the scan the concept count comes from and warns about the newer empty one", () => {
    renderDetails({
      result_files: [emptyLatestScan, metadataFile, lastGoodScan],
      latest_successful_concept_result_file: lastGoodScan,
    });

    expect(within(valueFor("Result file ID")).getByText("1180")).toBeVisible();
    expect(screen.getByText("Task 17800 returned 0 rows")).toBeInTheDocument();
  });

  it("explains the empty state when no scan returned concepts", () => {
    renderDetails({
      nconcepts: 0,
      result_files: [emptyLatestScan],
      latest_successful_concept_result_file: null,
    });

    expect(
      screen.getByText("None yet: no concept scan has returned concepts"),
    ).toBeInTheDocument();
  });

  it("marks the file used for the concept count and flags the empty one", () => {
    renderDetails({
      result_files: [emptyLatestScan, metadataFile, lastGoodScan],
      latest_successful_concept_result_file: lastGoodScan,
    });

    expect(screen.getByText("Used for concept count")).toBeInTheDocument();
    expect(screen.getByText("Empty (0 rows)")).toBeInTheDocument();
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
    });

    expect(screen.queryByText(/02\/01\/2026/)).not.toBeInTheDocument();
    expect(screen.getAllByText(/24\/11\/2026/).length).toBeGreaterThan(0);
  });
});
