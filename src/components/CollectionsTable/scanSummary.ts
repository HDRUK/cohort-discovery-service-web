import {
  CONCEPT_FILE_NAME,
  NO_SUCCESSFUL_SCAN_MESSAGE,
} from "@/config/conceptScan";
import { CollectionDetails, ResultFile } from "@/types/api";
import {
  ConceptScanChipConfig,
  ConceptScanChipState,
  ConceptScanDetailsData,
  ConceptScanSummary,
} from "@/types/collections";
import { getTimestamp } from "@/utils/date";

export const isConceptFile = (file: ResultFile): boolean =>
  file.file_name === CONCEPT_FILE_NAME;

export const isEmptyConceptFile = (file: ResultFile): boolean =>
  isConceptFile(file) && file.status === "done" && file.rows_processed === 0;

export const getScanSummary = (
  details?: CollectionDetails,
): ConceptScanSummary => {
  const [latest = null] = (details?.result_files ?? [])
    .filter(isConceptFile)
    .sort(
      (a, b) =>
        getTimestamp(b.updated_at) - getTimestamp(a.updated_at) || b.id - a.id,
    );

  return {
    successful: details?.latest_successful_concept_result_file ?? null,
    latest,
  };
};

export const getConceptScanChipState = (
  file: ResultFile,
  successfulFileId?: number,
): ConceptScanChipState | null => {
  if (file.id === successfulFileId) return "used";
  if (isEmptyConceptFile(file)) return "empty";
  if (isConceptFile(file) && file.status === "failed") return "failed";
  return null;
};

export const getLatestAttempt = (file: ResultFile): ConceptScanChipConfig => {
  const task = `Task ${file.task.id}`;

  if (file.status === "failed") {
    return { label: `${task} failed`, color: "error" };
  }
  if (file.status !== "done") {
    return { label: `${task} ${file.status}`, color: "default" };
  }
  if (file.rows_processed === 0) {
    return { label: `${task} returned 0 rows`, color: "warning" };
  }
  return { label: `${task} produced no concepts`, color: "warning" };
};

export const getConceptScanDetailsData = (
  details: CollectionDetails,
  { successful, latest }: ConceptScanSummary,
): ConceptScanDetailsData => ({
  ...(successful
    ? {
        task_id: successful.task.id,
        result_file_id: successful.id,
        name: successful.file_description,
        completed_at: successful.task.completed_at ?? successful.created_at,
        rows_processed: successful.rows_processed,
      }
    : { last_successful_scan: NO_SUCCESSFUL_SCAN_MESSAGE }),
  nconcepts: details.nconcepts,
  ...(latest && latest.id !== successful?.id ? { latest_attempt: latest } : {}),
});
