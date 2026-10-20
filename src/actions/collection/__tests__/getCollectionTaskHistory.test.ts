import { apiGet } from "@/lib/apiClient";
import getCollectionTaskHistory from "../getCollectionTaskHistory";

jest.mock("@/lib/apiClient", () => ({ apiGet: jest.fn() }));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;

const RANGE = {
  from: "2026-09-07T00:00:00.000Z",
  to: "2026-09-07T01:00:00.000Z",
};

const page = (pageNumber: number, lastPage: number, total: number) => ({
  message: "",
  data: {
    collection_id: 1,
    from: RANGE.from,
    to: RANGE.to,
    summary: {},
    tasks: {
      data: [{ pid: `p${pageNumber}` }],
      last_page: lastPage,
      total,
    },
  },
});

const pidsFrom = (
  result: Awaited<ReturnType<typeof getCollectionTaskHistory>>,
) => result.data?.tasks?.data.map((task) => task.pid);

beforeEach(() => mockedApiGet.mockReset());

describe("getCollectionTaskHistory", () => {
  it("issues a single request when the first page is the last", async () => {
    mockedApiGet.mockResolvedValueOnce(page(1, 1, 1) as never);

    const result = await getCollectionTaskHistory("abc", RANGE);

    expect(mockedApiGet).toHaveBeenCalledTimes(1);
    expect(pidsFrom(result)).toEqual(["p1"]);
  });

  it("merges every page in order when there are several", async () => {
    mockedApiGet
      .mockResolvedValueOnce(page(1, 3, 3) as never)
      .mockResolvedValueOnce(page(2, 3, 3) as never)
      .mockResolvedValueOnce(page(3, 3, 3) as never);

    const result = await getCollectionTaskHistory("abc", RANGE);

    expect(mockedApiGet).toHaveBeenCalledTimes(3);
    expect(pidsFrom(result)).toEqual(["p1", "p2", "p3"]);
  });

  it("stops at the page ceiling and leaves total intact so the caller can say it truncated", async () => {
    mockedApiGet.mockImplementation((({
      params,
    }: {
      params: URLSearchParams;
    }) =>
      Promise.resolve(page(Number(params.get("page")), 50, 5000))) as never);

    const result = await getCollectionTaskHistory("abc", RANGE);

    expect(mockedApiGet).toHaveBeenCalledTimes(10);
    expect(result.data?.tasks?.data).toHaveLength(10);
    expect(result.data?.tasks?.total).toBe(5000);
  });

  it("returns the first response untouched when it carries no paginator", async () => {
    const errored = { message: "boom", error: "boom" };
    mockedApiGet.mockResolvedValueOnce(errored as never);

    const result = await getCollectionTaskHistory("abc", RANGE);

    expect(mockedApiGet).toHaveBeenCalledTimes(1);
    expect(result).toBe(errored);
  });

  it("never caches, since task history changes constantly", async () => {
    mockedApiGet.mockResolvedValueOnce(page(1, 1, 1) as never);

    await getCollectionTaskHistory("abc", RANGE);

    expect(mockedApiGet).toHaveBeenCalledWith(
      expect.objectContaining({ cacheOptions: { useCache: false } }),
    );
  });
});
