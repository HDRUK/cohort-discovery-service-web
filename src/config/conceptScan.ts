import {
  ConceptScanChipConfig,
  ConceptScanChipState,
  ConceptScanDetailsData,
} from "@/types/collections";

export const CONCEPT_FILE_NAME = "code.distribution";

export const CONCEPT_SCAN_DESCRIPTION =
  "From the most recent scan that returned concepts.";

export const NO_SUCCESSFUL_SCAN_MESSAGE =
  "None yet: no concept scan has returned concepts";

export const CONCEPT_SCAN_CHIPS: Record<
  ConceptScanChipState,
  ConceptScanChipConfig
> = {
  used: { label: "Used for concept count", color: "success" },
  empty: { label: "Empty (0 rows)", color: "warning" },
  failed: { label: "Failed", color: "error" },
};

export const CONCEPT_SCAN_DETAIL_LABELS: Record<
  keyof ConceptScanDetailsData,
  string
> = {
  last_successful_scan: "Last successful scan",
  task_id: "Task ID",
  result_file_id: "Result file ID",
  name: "Name",
  completed_at: "Completed at",
  rows_processed: "Rows processed",
  nconcepts: "Number of concepts",
  latest_attempt: "Latest attempt",
  created_at: "Collection created",
  updated_at: "Collection updated",
};
