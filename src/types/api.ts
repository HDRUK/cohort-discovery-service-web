import { DomainTab } from "@/config/domainFilters";
import { QueryContext } from "./context";
import { Role, RoleName } from "./roles";
import { RuleGroupType } from "./rules";

export type SearchParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | (string | number | boolean | null | undefined)[];

export type SearchParams = Record<string, SearchParamValue>;

export interface ApiSearchParams {
  per_page?: number;
  page?: number;
  sort?: string;
  search_term?: string;
}

export interface CollectionsSearchParams extends ApiSearchParams {
  workgroup_filter?: number; // workgroup-id
  collection_filter?: string; // collection status
}

export interface QueryHistorySearchParams extends ApiSearchParams {
  query?: string;
  open_queries?: string[];
}

export interface ConceptSearchParams extends ApiSearchParams {
  domain?: string;
  collections?: string[];
}

export interface TermDirectorySearchParams extends ApiSearchParams {
  domain?: DomainTab;
  collections?: string;
}

export interface CacheOptions {
  useCache?: boolean;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  error?: { text: string; code: number };
}

export interface WithTimestamps {
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;

  from: number;
  to: number;
  last_page: number;

  path?: string;
  first_page_url?: string;
  last_page_url?: string;
  next_page_url?: string | null;
  prev_page_url?: string | null;
}

export type WithIncomplete<T> = T & { hasIncomplete: boolean };

export interface CreateQueryPost {
  name: string | null;
  definition: RuleGroupType;
  task_type: string;
}

export interface CreateQuery {
  query_pid: string;
  task_count: number;
  task_pids: string[];
}
export type Tasks = string[];

export interface Distribution extends WithTimestamps {
  id: number;
  collection_id: number;
  task_id: number;
  task?: Task;
  name: string;
  category: string;
  description: string;
  count: number;
  q1: number;
  q3: number;
  min: number;
  max: number;
  mean: number;
  median: number;
}

export enum CollectionStatus {
  DRAFT = 1,
  PENDING = 2,
  ACTIVE = 3,
  REJECTED = 4,
  SUSPENDED = 5,
}

export enum DistributionType {
  GENERIC = "GENERIC",
  DEMOGRAPHICS = "DEMOGRAPHICS",
}

export interface State {
  id: number;
  name: string;
  slug: string;
}

export interface ModelState {
  id: number;
  state: State;
  state_id: number;
  stateable_id: number;
  stateable_type: string;
  updated_at: string | null;
}

export interface ResultFile extends WithTimestamps {
  id: number;
  status: string;
  file_description: string;
  rows_processed: number;
  task: Task;
}

export interface CollectionMetadata {
  created_at: string;
  os: string | null;
  bclink: string;
  biobank: string;
  datamodel: string;
  protocol: string;
  rounding: string;
  threshold: string;
}

export type HealthBin = "minute" | "hour" | "day" | "week" | "month";

export interface PingBin {
  bin: string;
  n: number;
  minutes: number;
  silent_minutes: number;
  // n / minutes — the series to chart. Null only when minutes is 0, i.e. a bin
  // wholly in the future.
  per_minute: number | null;
}

export interface PingSummary {
  last_ping_at: string | null;
  pings: number;
  per_minute: number | null;
  minutes: number;
  silent_minutes: number;
  bins: number;
  empty_bins: number;
  longest_gap_bins: number;
}

export interface CollectionHealthSeries {
  collection_id: number;
  // Echo of the resolved bin width — a named unit, or a custom multiple like
  // "10m" (HealthBin's fixed enum no longer covers every value the API accepts).
  bin: string;
  from: string;
  to: string;
  summary: { a: PingSummary; b: PingSummary };
  series: { a: PingBin[]; b: PingBin[] };
}

/** Null throughout when no run settled in the window the stats cover. */
export interface DurationStats {
  runs_measured: number;
  min: number | null;
  avg: number | null;
  p50: number | null;
  p95: number | null;
  max: number | null;
}

export interface TaskHistoryBin {
  bin: string;
  minutes: number;
  // Tasks created in the bin, against runs that settled in it — the two differ
  // whenever a task spans a bin boundary or is retried.
  started: number;
  finished: number;
  succeeded: number;
  failed: number;
  // Runs in flight, averaged over the bin (overlap-minutes / bin minutes) and
  // at its peak. Null only when minutes is 0, i.e. a bin wholly in the future.
  concurrency_avg: number | null;
  concurrency_max: number | null;
  // Attributed by finished_at, so it covers the same runs as `finished`.
  duration_ms: DurationStats;
  queued_for_ms_avg: number | null;
}

export interface TaskHistorySummary {
  tasks: number;
  succeeded: number;
  failed: number;
  in_flight: number;
  pending: number;
  // Keyed by task type — "a" cohort queries, "b" distributions.
  task_types: Record<string, number>;
  attempts: { total: number; retried_tasks: number; max: number };
  duration_ms: DurationStats;
}

export interface TaskHistoryRun {
  attempt: number;
  worker_id: string | null;
  claimed_at: string | null;
  started_at: string | null;
  // Null for a run that never settled — a timeout leaves no end and no
  // duration, so it has to be handled apart from the ones that finished.
  finished_at: string | null;
  duration_ms: number | null;
  result_status: string | null;
  error_class: string | null;
  error_message: string | null;
}

export type TaskHistoryStatus =
  | "succeeded"
  | "failed"
  | "in_flight"
  | "pending";

export interface TaskHistoryTask {
  pid: string;
  task_type: string;
  status: TaskHistoryStatus;
  attempts: number;
  created_at: string;
  attempted_at: string | null;
  completed_at: string | null;
  failed_at: string | null;
  // Created to first claimed — queue latency, not execution time.
  queued_for_ms: number | null;
  // The attempt that settled the task, against every attempt summed.
  duration_ms: number | null;
  total_duration_ms: number | null;
  query: { pid: string; name: string; query_type: string | null } | null;
  runs: TaskHistoryRun[];
}

export interface CollectionTaskHistory {
  collection_id: number;
  from: string;
  to: string;
  summary: TaskHistorySummary;
  tasks: Paginated<TaskHistoryTask>;
}

export interface Activity extends WithTimestamps {
  id: number;
  collection_id: number;
  task_type: string;
}

export interface Collection extends WithTimestamps {
  id: number;
  name: string;
  description: string;
  pid: string;
  url: UrlString | null;
  type: QueryContext;
  last_ping?: {
    a: Activity | null;
    b: Activity | null;
  };
  last_active: string | null;
  last_successful_query?: Task | null;
  demographics?: Distribution[];
  latest_successful_demographic_result_file?: ResultFile | null;
  latest_successful_concept_result_file?: ResultFile | null;
  latest_metadata?: CollectionMetadata | null;
  n_concepts?: number;
  custodian: Custodian;
  custodian_id?: number;
  model_state: ModelState;
  is_synthetic?: boolean;
  location_enabled?: boolean;
  death_enabled?: boolean;
}

export interface CollectionConfig {
  id: number;
  enabled: boolean;
  frequency_mode: number;
  run_time_frequency: number;
  run_time_hour: number;
  run_time_minute: number;
}

export interface CollectionWithHosts extends Collection {
  host: CollectionHost[];
  config: CollectionConfig;
  workgroups?: Workgroup[];
}

export interface CollectionDetails extends WithTimestamps {
  pid: string;
  nconcepts: number;
  demographics: Distribution[];
  result_files: ResultFile[];
}

export interface Network extends WithTimestamps {
  name: string;
  url: string | null;
  pid: string;
  enabled: boolean;
  custodians: Custodian[];
}

export interface Result extends WithTimestamps {
  id: number;
  pid: string;
  count: number;
  metadata: unknown;
  status: string;
  message: string;
}

export interface Code {
  name: string;
  description: string;
}

export interface CodeStat extends Code {
  id: number;
  pid: string;
  category: string;
  total_count: number;
  collections_count: number;
  collections_pct: number;
}

export interface TermDirectoryEntry {
  concept_id: number;
  concept_name: string;
  domain_id: string;
  count: number;
  ncollections: number;
}

export interface TaskRun {
  duration_ms: number;
  error_class: string;
  error_message: string;
}

export interface Task {
  id: number;
  pid: string;
  query_id: number;
  collection_id: number;
  created_at: string;
  attempted_at?: string | null;
  failed_at?: string | null;
  completed_at: string | null;
  attempts: number;
  task_type: string;
  collection: Collection;
  result?: Result;
  latest_run?: TaskRun;
}

export interface Query {
  id: number;
  pid: string;
  name: string;
  definition: RuleGroupType;
  created_at: string;
  tasks: Task[];
}

export interface RegressionTestTask {
  pid: string;
  created_at: string;
  completed_at: string | null;
  failed_at: string | null;
  result: { count: number; status: string } | null;
}

export interface RegressionTestCollection {
  pid: string;
  name: string;
  expected_result: number | null;
  run_count: number;
  last_run_at: string | null;
  pass_rate: number | null;
  last_passed: boolean | null;
  tasks: RegressionTestTask[];
}

export interface RegressionTest {
  id: number;
  pid: string;
  name: string;
  created_at: string;
  updated_at: string;
  query: { pid: string; name: string; definition: RuleGroupType };
  collections: RegressionTestCollection[];
}

export interface RegressionTestCollectionInput {
  pid: string;
  expected_result: number | null;
}

export interface RunRegressionTestResponse {
  task_count: number;
  task_pids: string[];
}

export interface Token {
  federated_token: string;
  type: string;
  federated_user_id: number;
  local_user_id: number;
}

export enum Rquestroles {
  GENERAL_ACCESS = "GENERAL_ACCESS",
}

export enum FrequencyMode {
  WEEKLY = "1",
  MONTHLY = "2",
  QUARTERLY = "3",
  BIANNUALLY = "4",
}

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MONTH_WEEKS = [
  "First Week",
  "Second Week",
  "Third Week",
  "Fourth Week",
  "Last Week",
];

export const frequencyMap: Record<FrequencyMode, string[]> = {
  [FrequencyMode.WEEKLY]: WEEK_DAYS,
  [FrequencyMode.MONTHLY]: MONTH_WEEKS,
  [FrequencyMode.QUARTERLY]: ["Q1", "Q2", "Q3", "Q4"],
  [FrequencyMode.BIANNUALLY]: ["H1", "H2"],
};

export enum TaskType {
  A = "a",
  B = "b",
}

export interface User extends WithTimestamps {
  id: number;
  email: string;
  name: string;
  email_verified_at: string | null;
  new_user_status?: number;
  roles: Role[];
  custodians: Custodian[];
  workgroups?: Workgroup[];
}

export interface ExternalCustodian {
  id: number;
  name: string;
}

export interface TokenUser {
  id: number;
  email: string;
  orcid: string;
  name: string;
  firstname: string;
  lastname: string;
  is_admin: boolean;
  is_nhse_sde_approval: boolean;
  organisation: string;
  provider: string;
  workgroups: string[];
  cohort_discovery_roles: RoleName[];
  cohort_admin_teams: ExternalCustodian[];
}

export interface Network {
  name: string;
  pid: string;
  id: number;
}

export interface Custodian extends WithTimestamps {
  id: number;
  pid: string;
  name: string;
  external_custodian_id: number | string;
  external_custodian_name: string;
  network?: Network;
}

export interface CombinedUser extends User {
  token_user: TokenUser | null;
}

export interface CreateCollectionHostPost {
  name: string;
  query_context_type: string;
  custodian_id: number;
}

export interface UpdateCollectionHostPayload {
  name?: string;
  query_context_type?: string;
}

export interface CollectionHost {
  id: number;
  name: string;
  query_context_type: string;
  client_id: string;
  client_secret: string;
  custodian: Custodian;
  collections: Collection[];
}

export type UrlString = `http${"s" | ""}://${string}`;

export interface CreateCollectionPost {
  name: string;
  description: string;
  type: QueryContext;
  host_id: number;
  url: UrlString | "" | null;
  custodian_id: string;
  status?: boolean;
  pid: string;
  model_state?: ModelState;
  is_synthetic?: boolean;
  location_enabled?: boolean;
  death_enabled?: boolean;
}

export interface UpdateCollectionPayload {
  name?: string;
  query_context_type?: string;
}

export interface TransitionCollectionPut {
  state: string;
}

export interface CreateCollectionConfigPost {
  collection_id: number;
  run_time_hour: number;
  run_time_minute: number;
  frequency_mode: number;
  run_time_frequency: number;
  enabled: number;
  type: string;
}

export interface Workgroup {
  id: number;
  name: string;
  external_name?: string;
  users?: User[];
  collections?: Collection[];
}

export interface CreateWorkgroupPost {
  name: string;
  active: boolean;
}

export interface AddCollectionsToWorkgroupPost {
  ids: number[];
  workgroup_id: number;
}

export interface AddUsersToWorkgroupPost {
  ids: number[];
  workgroup_id: number;
}

export interface AddCollectionToWorkgroupsPost {
  id: number;
  workgroup_ids: number[];
}

export interface RemoveCollectionsFromWorkgroupPost {
  ids: number[];
  workgroup_id: number;
}

export interface RemoveUsersFromWorkgroupPost {
  ids: number[];
  workgroup_id: number;
}

export interface RemoveCollectionFromWorkgroupsPost {
  id: number;
  workgroup_ids: number[];
}

export interface CreateNetworkPost {
  name: string;
  url: string;
}

export interface UpdateNetworkPost {
  name: string;
  url: string;
}

export interface AddCustodiansToNetworkPost {
  id: number;
  custodian_ids: number[];
}

export interface RemoveCustodiansFromNetworkPost {
  id: number;
  custodian_ids: number[];
}

export interface Concept {
  concept_id: number;
  name: string;
  description?: string;
  category: string;
  children?: Concept[];
  alternatives?: Concept[];
  ncollections?: number;
  count?: number;
  all_synthetic?: number;
  match_score?: number;
  tokens?: string[];
  phrase_tokens?: string[];
}

export interface ConceptSet extends WithTimestamps {
  id: number;
  domain: string;
  name: string;
  description: string;
  concepts: Concept[];
}

export interface CreateConceptSetPost {
  name: string;
  description: string;
  domain: string;
}

export interface SignInPost {
  email: string;
  password: string;
}

export type GroupedCollection = { custodian: Custodian; items: Collection[] };
