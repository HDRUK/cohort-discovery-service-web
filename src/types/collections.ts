import { ResultFile } from "@/types/api";

export enum CollectionFilterStatus {
  ALL = "all",
  DRAFT = "draft",
  ACTIVE = "active",
  PENDING = "pending",
  REJECTED = "rejected",
  SUSPENDED = "suspended",
  DELETED = "deleted",
}

export enum CollectionHostFilter {
  ALL = "all",
  DELETED = "deleted",
}

export interface ConceptScanSummary {
  successful: ResultFile | null;
  latest: ResultFile | null;
}

export type ConceptScanChipState = "used" | "empty" | "failed";

export interface ConceptScanChipConfig {
  label: string;
  color: "success" | "warning" | "error" | "default";
}

export interface ConceptScanDetailsData {
  last_successful_scan?: string;
  task_id?: number;
  result_file_id?: number;
  name?: string;
  completed_at?: string;
  rows_processed?: number;
  nconcepts?: number;
  latest_attempt?: ResultFile;
  created_at?: string;
  updated_at?: string;
}
