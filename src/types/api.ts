import { QueryContext } from "./context";
import { RuleGroupType } from "./rules";

export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export interface CacheOptions {
  fresh?: boolean;
  force?: boolean;
}

export interface ApiSearchParams {
  per_page?: number;
  page?: number;
  sort?: string;
  searchTerm?: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface WithTimestamps {
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  data: T;
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

export interface Collection extends WithTimestamps {
  id: number;
  name: string;
  description: string;
  pid: string;
  url: UrlString | null;
  type: QueryContext;
  last_active: string | null;
  latest_demographic?: Distribution;
  latest_concept?: Distribution;
  demographics?: Distribution[];
  latest_concept_task?: Task;
  latest_demographic_task?: Task;
  custodian: Custodian;
  custodian_id?: number;
  model_state?: ModelState;
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
  pid: string;
  category: string;
  total_count: number;
  collections_count: number;
  collections_pct: number;
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
}

export interface Query {
  id: number;
  pid: string;
  name: string;
  definition: RuleGroupType;
  created_at: string;
  tasks: Task[];
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

export enum Roles {
  GENERAL_ACCESS = "GENERAL_ACCESS",
  SYSTEM_ADMIN = "SYSTEM_ADMIN",
  ADMIN = "admin",
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
  workgroups: Workgroup[];
  cohort_discovery_roles: Roles[];
  cohort_admin_teams: ExternalCustodian[];
}

export interface Network {
  name: string;
  pid: string;
  id: number;
}

export interface Custodian {
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
}

export interface UpdateCollectionPayload {
  name?: string;
  query_context_type?: string;
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
  users: User[];
  collections: Collection[];
}

export interface CreateWorkgroupPost {
  name: string;
  active: boolean;
}

export interface AddCollectionToWorkgroupPost {
  id: number;
  workgroup_id: number;
}

export interface RemoveCollectionFromWorkgroupPost {
  id: number;
  workgroup_id: number;
}

export interface Concept {
  concept_id: number;
  name?: string;
  description: string;
  category: string;
  children?: Concept[];
  alternatives?: Concept[];
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

export enum FeatureName {
  QueryBuilder = "query-builder",
  ConstrainForBunnyV1 = "constrain-for-bunny-v1",
  QueryNlp = "query-nlp",
  InAppMessenger = "in-app-messenger",
}

export type FeatureFlag = Record<FeatureName, boolean>;

export type GroupedCollection = { custodian: Custodian; items: Collection[] };
