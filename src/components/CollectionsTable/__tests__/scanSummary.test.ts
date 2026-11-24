import { NO_SUCCESSFUL_SCAN_MESSAGE } from "@/config/conceptScan";
import { getMockResultFile, getMockTask } from "@/test/fixtures/tasks";
import { CollectionDetails } from "@/types/api";
import {
  getConceptScanChipState,
  getConceptScanDetailsData,
  getLatestAttempt,
  getScanSummary,
  isConceptFile,
  isEmptyConceptFile,
} from "../scanSummary";

const getMockDetails = (rest?: Partial<CollectionDetails>): CollectionDetails =>
  ({
    pid: "pid-1",
    nconcepts: 2,
    demographics: [],
    result_files: [],
    created_at: "2026-05-19T14:21:17Z",
    updated_at: "2026-05-19T14:21:17Z",
    ...rest,
  }) as CollectionDetails;

const lastGoodScan = getMockResultFile({
  id: 1180,
  rows_processed: 2,
  task: getMockTask({ id: 17799, completed_at: "2026-11-24T09:20:01Z" }),
  updated_at: "2026-11-24T09:20:01Z",
});

const emptyLatestScan = getMockResultFile({
  id: 1181,
  rows_processed: 0,
  task: getMockTask({ id: 17800, completed_at: "2026-11-24T09:27:11Z" }),
  updated_at: "2026-11-24T09:27:11Z",
});

const metadataFile = getMockResultFile({
  id: 1182,
  file_name: "metadata.bcos",
  task: emptyLatestScan.task,
});

describe("isConceptFile", () => {
  it("matches code.distribution files only", () => {
    expect(isConceptFile(lastGoodScan)).toBe(true);
    expect(isConceptFile(metadataFile)).toBe(false);
  });
});

describe("isEmptyConceptFile", () => {
  it("flags a done concept file with no rows", () => {
    expect(isEmptyConceptFile(emptyLatestScan)).toBe(true);
  });

  it("ignores concept files with rows, failed files and metadata files", () => {
    expect(isEmptyConceptFile(lastGoodScan)).toBe(false);
    expect(isEmptyConceptFile({ ...emptyLatestScan, status: "failed" })).toBe(
      false,
    );
    expect(isEmptyConceptFile({ ...metadataFile, rows_processed: 0 })).toBe(
      false,
    );
  });
});

describe("getScanSummary", () => {
  it("takes the successful scan from the API", () => {
    const { successful } = getScanSummary(
      getMockDetails({
        result_files: [emptyLatestScan, lastGoodScan],
        latest_successful_concept_result_file: lastGoodScan,
      }),
    );

    expect(successful?.id).toBe(1180);
  });

  it("has no successful scan when the API sends none", () => {
    expect(getScanSummary(getMockDetails()).successful).toBeNull();
    expect(getScanSummary(undefined).successful).toBeNull();
  });

  it("picks the newest concept file as the latest attempt", () => {
    const { latest } = getScanSummary(
      getMockDetails({
        result_files: [lastGoodScan, metadataFile, emptyLatestScan],
      }),
    );

    expect(latest?.id).toBe(1181);
  });

  it("follows the API's updated_at order rather than task completion time", () => {
    const usedByApi = getMockResultFile({
      id: 2,
      updated_at: "2026-11-24T10:00:00Z",
      task: getMockTask({ id: 2, completed_at: "2026-11-24T09:00:00Z" }),
    });
    const finishedLater = getMockResultFile({
      id: 1,
      updated_at: "2026-11-24T09:30:00Z",
      task: getMockTask({ id: 1, completed_at: "2026-11-24T09:50:00Z" }),
    });
    const details = getMockDetails({
      result_files: [finishedLater, usedByApi],
      latest_successful_concept_result_file: usedByApi,
    });

    expect(getScanSummary(details).latest?.id).toBe(2);
    expect(
      getConceptScanDetailsData(details, getScanSummary(details)),
    ).not.toHaveProperty("latest_attempt");
  });

  it("breaks ties between scans updated together by id", () => {
    const sibling = { ...emptyLatestScan, id: 1190 };
    const { latest } = getScanSummary(
      getMockDetails({ result_files: [emptyLatestScan, sibling] }),
    );

    expect(latest?.id).toBe(1190);
  });

  it("has no latest attempt without concept files", () => {
    const { latest } = getScanSummary(
      getMockDetails({ result_files: [metadataFile] }),
    );

    expect(latest).toBeNull();
  });
});

describe("getConceptScanChipState", () => {
  it("marks the file used for the concept count", () => {
    expect(getConceptScanChipState(lastGoodScan, 1180)).toBe("used");
  });

  it("marks an empty scan that was not used", () => {
    expect(getConceptScanChipState(emptyLatestScan, 1180)).toBe("empty");
  });

  it("marks a failed concept scan", () => {
    expect(
      getConceptScanChipState({ ...emptyLatestScan, status: "failed" }, 1180),
    ).toBe("failed");
  });

  it("gives other files no state", () => {
    expect(getConceptScanChipState(metadataFile, 1180)).toBeNull();
    expect(getConceptScanChipState(lastGoodScan)).toBeNull();
  });
});

describe("getLatestAttempt", () => {
  it("warns that a done scan returned no rows", () => {
    expect(getLatestAttempt(emptyLatestScan)).toEqual({
      label: "Task 17800 returned 0 rows",
      color: "warning",
    });
  });

  it("warns that a done scan with rows produced no concepts", () => {
    expect(getLatestAttempt({ ...emptyLatestScan, rows_processed: 4 })).toEqual(
      { label: "Task 17800 produced no concepts", color: "warning" },
    );
  });

  it("reports a failed scan as an error", () => {
    expect(getLatestAttempt({ ...emptyLatestScan, status: "failed" })).toEqual({
      label: "Task 17800 failed",
      color: "error",
    });
  });

  it("includes the reason a scan failed when the API gives one", () => {
    expect(
      getLatestAttempt({
        ...emptyLatestScan,
        status: "failed",
        error: "No concepts found in file",
      }),
    ).toEqual({
      label: "Task 17800 failed: No concepts found in file",
      color: "error",
    });
  });

  it("names the status of a scan that is still running", () => {
    expect(
      getLatestAttempt({ ...emptyLatestScan, status: "processing" }),
    ).toEqual({ label: "Task 17800 processing", color: "default" });
  });
});

describe("getConceptScanDetailsData", () => {
  it("describes the successful scan and the empty newer attempt", () => {
    const details = getMockDetails({
      result_files: [emptyLatestScan, lastGoodScan],
      latest_successful_concept_result_file: lastGoodScan,
    });

    expect(getConceptScanDetailsData(details, getScanSummary(details))).toEqual(
      {
        task_id: 17799,
        result_file_id: 1180,
        name: "Result of code.distribution analysis",
        completed_at: "2026-11-24T09:20:01Z",
        rows_processed: 2,
        nconcepts: 2,
        latest_attempt: emptyLatestScan,
      },
    );
  });

  it("omits the latest attempt when it is the successful scan", () => {
    const details = getMockDetails({
      result_files: [lastGoodScan],
      latest_successful_concept_result_file: lastGoodScan,
    });

    expect(
      getConceptScanDetailsData(details, getScanSummary(details)),
    ).not.toHaveProperty("latest_attempt");
  });

  it("explains the empty state when no scan has been successful", () => {
    const details = getMockDetails({
      nconcepts: 0,
      result_files: [emptyLatestScan],
    });
    const data = getConceptScanDetailsData(details, getScanSummary(details));

    expect(data.last_successful_scan).toBe(NO_SUCCESSFUL_SCAN_MESSAGE);
    expect(data.nconcepts).toBe(0);
    expect(data).not.toHaveProperty("task_id");
    expect(data.latest_attempt).toBe(emptyLatestScan);
  });
});
