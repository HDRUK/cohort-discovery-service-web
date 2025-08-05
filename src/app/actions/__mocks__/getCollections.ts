import { ApiResponse, Collection } from "@/types/api";

const mockCollections: Collection[] = [
  {
    id: 1,
    pid: "db6d9b451b818ccc9a449383f2f0c450",
    name: "Test Dataset #1",
    type: "bunny",
    created_at: "2025-01-01 00:00:00",
    updated_at: "2025-01-01 00:00:00",
  },
  {
    id: 2,
    pid: "db6d9b451b818ccc9a449383f2f0c451",
    name: "Test Dataset #2",
    type: "bunny",
    created_at: "2025-01-01 00:00:00",
    updated_at: "2025-01-01 00:00:00",
  },
];

const getCollections = async (): Promise<ApiResponse<Collection[]>> => {
  return {
    data: mockCollections,
    message: "success",
  };
};

export default getCollections;
