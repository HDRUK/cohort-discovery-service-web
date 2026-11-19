import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiDelete } from "@/server/api";
import { ApiError } from "@/lib/https";
import deleteCollections from "../deleteCollections";

jest.mock("@/server/api", () => ({ apiDelete: jest.fn() }));

jest.mock("@/server/session", () => ({
  requireSession: jest.fn().mockResolvedValue({ token: "a-token" }),
}));

jest.mock("next/navigation", () => ({ unstable_rethrow: jest.fn() }));

const mockedApiDelete = apiDelete as jest.MockedFunction<typeof apiDelete>;

beforeEach(() => {
  mockedApiDelete.mockReset();
  (updateTag as jest.Mock).mockClear();
});

describe("deleteCollections", () => {
  it("deletes every collection and expires the cached collection lists", async () => {
    mockedApiDelete.mockResolvedValue({} as never);

    const result = await deleteCollections([1, 2, 3]);

    expect(result).toEqual({ deleted: [1, 2, 3], failed: [] });
    expect(mockedApiDelete).toHaveBeenCalledTimes(3);
    expect(updateTag).toHaveBeenCalledWith(CACHE_TAGS.collections);
  });

  it("reports a failed delete and still deletes the rest", async () => {
    mockedApiDelete
      .mockResolvedValueOnce({} as never)
      .mockRejectedValueOnce(new ApiError(500, "Server error"))
      .mockResolvedValueOnce({} as never);

    const result = await deleteCollections([1, 2, 3]);

    expect(result).toEqual({ deleted: [1, 3], failed: [2] });
    expect(updateTag).toHaveBeenCalledWith(CACHE_TAGS.collections);
  });
});
