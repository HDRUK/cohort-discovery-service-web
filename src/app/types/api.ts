export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface CreateQuery {
  query_pid: string;
  task_count: number;
  task_pids: string[];
}
export type Tasks = string[];

export interface Collection {
  id: number;
  name: string;
  pid: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface Result {
  id: number;
  pid: string;
  count: number;
  metadata: unknown;
  created_at: string;
  updated_at: string;
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
  definition: unknown;
  created_at: string;
  tasks: Task[];
}
