import { RuleGroupType } from "react-querybuilder";

export interface ApiResponse<T> {
  message: string;
  data: T;
}

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

export interface Task {
  id: number;
  pid: string;
  query_id: number;
  collection_id: number;
  created_at: string;
  completed_at: string;
  task_type: string;
  collection: Collection;
  result: Result;
}

export interface Query {
  id: number;
  pid: string;
  name: string;
  definition: RuleGroupType;
  created_at: string;
  tasks: Task[];
}
