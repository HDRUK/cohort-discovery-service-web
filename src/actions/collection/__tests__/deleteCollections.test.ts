import { refresh } from "next/cache";
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
  (refresh as jest.Mock).mockClear();
});

describe("deleteCollections", () => {
  it("deletes every collection and refreshes once", async () => {
    mockedApiDelete.mockResolvedValue({} as never);

    const result = await deleteCollections([1, 2, 3]);

    expect(result).toEqual({ deleted: [1, 2, 3], failed: [] });
    expect(mockedApiDelete).toHaveBeenCalledTimes(3);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("reports a failed delete and still deletes the rest", async () => {
    mockedApiDelete
      .mockResolvedValueOnce({} as never)
      .mockRejectedValueOnce(new ApiError(500, "Server error"))
      .mockResolvedValueOnce({} as never);

    const result = await deleteCollections([1, 2, 3]);

    expect(result).toEqual({ deleted: [1, 3], failed: [2] });
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
