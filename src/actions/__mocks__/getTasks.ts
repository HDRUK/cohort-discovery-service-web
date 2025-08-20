import { ApiResponse, Task, Result } from "../../types/api";
import { mockCollections } from "./getCollections";

export const mockResults: Result[] = [
  {
    id: 1,
    pid: "res1",
    count: 723,
    metadata: {},
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    pid: "res2",
    count: 421,
    metadata: {},
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
];

export const getMockTask = (rest?: Partial<Task>) => ({
  id: 1,
  pid: "task1",
  query_id: 100,
  collection_id: mockCollections[0].id,
  task_type: "condition",
  created_at: "2025-01-01T00:00:00Z",
  completed_at: "2025-01-01T12:00:00Z",
  collection: mockCollections[0],
  result: mockResults[0],
  ...rest,
});

export const mockTasks: Task[] = [
  {
    id: 1,
    pid: "task1",
    query_id: 100,
    collection_id: mockCollections[0].id,
    task_type: "condition",
    created_at: "2025-01-01T00:00:00Z",
    completed_at: "2025-01-01T12:00:00Z",
    collection: mockCollections[0],
    result: mockResults[0],
  },
  {
    id: 2,
    pid: "task2",
    query_id: 100,
    collection_id: mockCollections[1].id,
    task_type: "condition",
    created_at: "2025-01-01T00:00:00Z",
    completed_at: null,
    collection: mockCollections[1],
    result: mockResults[1],
  },
];

const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  return {
    data: mockTasks,
    message: "success",
  };
};

export default getTasks;
