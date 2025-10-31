import { RuleGroupType } from "./rules";

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
  name: string;
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

export interface Collection extends WithTimestamps {
  id: number;
  name: string;
  pid: string;
  url: string | null;
  type: string;
  size?: Distribution;
  demographics?: Distribution[];
}

export interface CollectionWithHosts extends Collection {
  host: CollectionHost;
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

interface Workgroups {
  id: number;
  active: number;
  name: string;
}

export enum Rquestroles {
  GENERAL_ACCESS = "GENERAL_ACCESS",
}

export enum Roles {
  GENERAL_ACCESS = "GENERAL_ACCESS",
  SYSTEM_ADMIN = "SYSTEM_ADMIN",
  ADMIN = "admin",
}

export interface User extends WithTimestamps {
  id: number;
  email: string;
  name: string;
  email_verified_at: string | null;
}

export interface GatewayTeam {
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
  workgroups: Workgroups[];
  cohort_discovery_roles: Roles[];
  admin_teams: GatewayTeam[];
}

export interface Custodian {
  id: number;
  pid: string;
  name: string;
  gateway_team_id: number;
  gateway_team_name: string;
}

export interface CombinedUser extends User {
  gateway_user: TokenUser | null;
}

export interface CreateCollectionHostPost {
  name: string;
  query_context_type: string;
  custodian_id: number;
}

export interface CollectionHostFormValues {
  name: string;
  context: string;
}

export interface CollectionHost {
  id: number;
  name: string;
  query_context_type: string;
  client_id: string;
  client_secret: string;
}

export interface CreateCollectionPost {
  name: string;
  type: string;
  host_id: number;
  url: string | null;
}

export interface Concept {
  concept_id: number;
  name?: string;
  description: string;
  category: string;
  children?: Concept[];
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