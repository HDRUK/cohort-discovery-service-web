import { EXAMPLE_1, EXAMPLE_2 } from "@/config/queryExamples";
import { Query, ApiResponse, WithIncomplete, Paginated } from "@/types/api";
import { mockTasks } from "./getTasks";
import { paginateData } from "@/utils/mock";

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

const getQueries = async (): Promise<
  WithIncomplete<ApiResponse<Paginated<Query>>>
> => {
  const incompleteQueries = mockQueries.filter((q) =>
    q.tasks.some((t) => !t.completed_at),
  );

  return {
    message: "success",
    data: paginateData({ data: mockQueries }),
    hasIncomplete: incompleteQueries.length > 0,
  };
};

export default getQueries;
