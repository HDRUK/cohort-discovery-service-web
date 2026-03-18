import { ApiResponse, CollectionDetails, Task } from "@/types/api";

const getCollectionDetails = jest.fn(
  async (
    pid: string,
    _args?: Record<string, unknown>,
  ): Promise<ApiResponse<CollectionDetails>> => {
    return {
      data: {
        pid,
        created_at: "2026-03-18T10:00:00.000Z",
        updated_at: "2026-03-18T11:00:00.000Z",
        nconcepts: 123,
        demographics: [],
        result_files: [
          {
            id: 1,
            created_at: "2026-03-18T10:30:00.000Z",
            updated_at: "2026-03-18T10:30:00.000Z",
            file_description: "Test file",
            rows_processed: 1000,
            status: "COMPLETED",
            task: {
              completed_at: "2026-03-18T10:45:00.000Z",
            } as Task,
          },
        ],
      },
      message: "success",
      status: 200,
    } as ApiResponse<CollectionDetails>;
  },
);

export default getCollectionDetails;
