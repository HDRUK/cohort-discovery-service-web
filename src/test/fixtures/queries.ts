import { EXAMPLE_1, EXAMPLE_2 } from "@/config/queryExamples";
import { Query } from "@/types/api";
import { mockTasks } from "./tasks";

export const getMockQuery = (rest?: Partial<Query>): Query => ({
  id: 100,
  pid: "query-123",
  name: "Test Query",
  definition: EXAMPLE_1,
  created_at: "2025-08-06T13:31:58.000000Z",
  tasks: mockTasks,
  ...rest,
});

export const mockQueries: Query[] = [
  getMockQuery(),
  getMockQuery({
    id: 101,
    pid: "query-321",
    name: "Test Query 2",
    definition: EXAMPLE_2,
  }),
];
