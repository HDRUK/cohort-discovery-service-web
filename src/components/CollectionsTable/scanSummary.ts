import { CollectionDetails, ResultFile } from "@/types/api";
import { getTimestamp } from "@/utils/date";

const CONCEPT_FILE_NAME = "code.distribution";

const finishedAt = (file: ResultFile) =>
  file.task?.completed_at ?? file.created_at;

const isConceptFile = (file: ResultFile) =>
  file.file_name === CONCEPT_FILE_NAME;

const isEmptyConceptFile = (file: ResultFile) =>
  isConceptFile(file) && file.status === "done" && file.rows_processed === 0;

const getScanSummary = (details?: CollectionDetails) => {
  const [latest = null] = (details?.result_files ?? [])
    .filter(isConceptFile)
    .sort(
      (a, b) =>
        getTimestamp(finishedAt(b)) - getTimestamp(finishedAt(a)) ||
        b.id - a.id,
    );

  return {
    successful: details?.latest_successful_concept_result_file ?? null,
    latest,
  };
};

const getLatestAttemptLabel = (file: ResultFile) => {
  const task = `Task ${file.task?.id}`;

  if (file.status === "failed") return `${task} failed`;
  if (file.status !== "done") return `${task} ${file.status}`;
  if (file.rows_processed === 0) return `${task} returned 0 rows`;
  return `${task} produced no concepts`;
};

export {
  getLatestAttemptLabel,
  getScanSummary,
  isConceptFile,
  isEmptyConceptFile,
};
