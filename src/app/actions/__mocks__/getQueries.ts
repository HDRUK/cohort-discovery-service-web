import { Query, ApiResponse, WithIncomplete } from "@/types/api";
import { mockTasks } from "./getTasks";

export const getMockQuery = (rest?: Partial<Query>): Query => ({
  id: 100,
  pid: "query-123",
  name: "Test Query",
  definition: {
    id: "def-1",
    combinator: "and",
    rules: [
      {
        id: "rule-1",
        field: "condition",
        operator: "=",
        value: "1234",
      },
    ],
  },
  created_at: "2025-08-06T13:31:58.000000Z",
  tasks: mockTasks,
  ...rest,
});

export const mockQueries: Query[] = [
  getMockQuery(),
  getMockQuery({
    id: 101,
    pid: "query-456",
    name: "Second Query",
    definition: {
      id: "def-2",
      combinator: "and",
      rules: [
        {
          id: "rule-2",
          field: "condition",
          operator: "=",
          value: "5678",
        },
      ],
    },
    created_at: "2025-08-07T10:00:00.000000Z",
    tasks: [],
  }),
];

const getQueries = async (): Promise<WithIncomplete<ApiResponse<Query[]>>> => {
  const incompleteQueries = mockQueries.filter((q) =>
    q.tasks.some((t) => !t.completed_at)
  );

  return {
    message: "success",
    data: mockQueries,
    hasIncomplete: incompleteQueries.length > 0,
  };
};

export default getQueries;
