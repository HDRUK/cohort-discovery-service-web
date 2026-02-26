import { ApiResponse, Task, Result } from "@/types/api";
import { getMockCollections } from "../../collection/__mocks__/getCollections";

const [mockCollection1, mockCollection2] = getMockCollections(2);

export const getMockResult = (rest?: Partial<Result>) => ({
  id: 1,
  pid: "res1",
  count: 723,
  metadata: {},
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
  status: "ok",
  message: "ok",
  ...rest,
});

export const getMockTask = (rest?: Partial<Task>) => ({
  id: 1,
  pid: "task1",
  query_id: 100,
  collection_id: mockCollection1.id,
  task_type: "condition",
  created_at: "2025-01-01T00:00:00Z",
  completed_at: "2025-01-01T12:00:00Z",
  attemted_at: "2025-01-01T12:00:00Z",
  failed_at: null,
  attempts: 1,
  collection: mockCollection1,
  result: getMockResult(),
  ...rest,
});

export const mockTasks: Task[] = [
  {
    id: 1,
    pid: "task1",
    query_id: 100,
    collection_id: mockCollection1.id,
    task_type: "condition",
    created_at: "2025-01-01T00:00:00Z",
    completed_at: "2025-01-01T12:00:00Z",
    attempted_at: "2025-01-01T12:00:00Z",
    attempts: 1,
    failed_at: null,
    collection: mockCollection1,
    result: getMockResult(),
  },
  {
    id: 2,
    pid: "task2",
    query_id: 100,
    collection_id: mockCollection2.id,
    task_type: "condition",
    created_at: "2025-01-01T00:00:00Z",
    attempted_at: "2025-01-01T12:00:00Z",
    attempts: 1,
    failed_at: null,
    completed_at: null,
    collection: mockCollection2,
    result: getMockResult({
      id: 2,
      pid: "res2",
      count: 421,
    }),
  },
];

const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  return {
    data: mockTasks,
    message: "success",
  };
};

export default getTasks;
