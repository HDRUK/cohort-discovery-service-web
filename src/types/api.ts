import { RuleGroupType } from "react-querybuilder";

export interface ApiResponse<T> {
  message: string;
  data: T;
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

export interface Distribution {
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
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: number;
  name: string;
  pid: string;
  url: string | null;
  type: string;
  created_at: string;
  updated_at: string;
  size?: Distribution;
  demographics?: Distribution[];
}

export interface Result {
  id: number;
  pid: string;
  count: number;
  metadata: unknown;
  created_at: string;
  updated_at: string;
}

export interface Code {
  name: string;
  description: string;
}

export interface CodeStat extends Code {
  pid: string;
  category: string;
  collections_count: number;
  collections_pct: number;
}

export interface Option {
  name: string;
  label: string;
}

export interface Task {
  id: number;
  pid: string;
  query_id: number;
  collection_id: number;
  created_at: string;
  attempted_at: string | null;
  failed_at: string | null;
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
