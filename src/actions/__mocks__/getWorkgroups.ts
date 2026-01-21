import { ApiResponse, Workgroup } from "@/types/api";

import { getMockCollections } from "./getCollections";

export const getMockWorkgroup = (
  rest?: Partial<Workgroup>,
  count: number = 1213,
): Workgroup => ({
  id: 1,
  name: "Test Workgroup #1",
  collections: getMockCollections(count),
  users: [],
  ...rest,
});

export const getMockWorkgroups = (n: number = 2): Workgroup[] =>
  Array.from({ length: Math.max(0, n) }, (_, id) =>
    getMockWorkgroup({
      id,
      name: `Test Workgroup #${id + 1}`,
      collections: getMockCollections(1),
    }),
  );

const getWorkgroups = async (): Promise<ApiResponse<Workgroup[]>> => {
  return {
    data: getMockWorkgroups(),
    message: "success",
  };
};

export default getWorkgroups;
