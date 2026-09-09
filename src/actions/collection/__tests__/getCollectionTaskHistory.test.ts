import { apiGet } from "@/lib/apiClient";
import getCollectionTaskHistory from "../getCollectionTaskHistory";

jest.mock("@/lib/apiClient", () => ({
  apiGet: jest.fn(),
  ErrorMode: { THROW: "throw", RESULT: "result" },
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;

const RANGE = {
  from: "2026-09-07T00:00:00.000Z",
  to: "2026-09-07T01:00:00.000Z",
};

const page = (
  pageNumber: number,
  lastPage: number,
  total: number,
  query?: { pid: string; definition: unknown },
) => ({
  message: "",
  data: {
    collection_id: 1,
    from: RANGE.from,
    to: RANGE.to,
    summary: {},
    tasks: {
      data: [
        {
          pid: `p${pageNumber}`,
          query: query
            ? { pid: query.pid, name: "n", query_type: "a", ...query }
            : null,
        },
      ],
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

  it("asks the API to inline each task's query definition", async () => {
    mockedApiGet.mockResolvedValueOnce(page(1, 1, 1) as never);

    await getCollectionTaskHistory("abc", RANGE);

    const { params } = mockedApiGet.mock.calls[0][0] as {
      params: URLSearchParams;
    };

    expect(params.get("include")).toBe("definition");
  });

  it("surfaces failures as a result rather than redirecting the caller", async () => {
    mockedApiGet.mockResolvedValueOnce(page(1, 1, 1) as never);

    await getCollectionTaskHistory("abc", RANGE);

    expect(mockedApiGet).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({ errorMode: "result" }),
      }),
    );
  });

  it("hoists each definition out of the tasks and keys it by query pid", async () => {
    const definition = { id: "g1", rules: [] };
    mockedApiGet.mockResolvedValueOnce(
      page(1, 1, 1, { pid: "q1", definition }) as never,
    );

    const result = await getCollectionTaskHistory("abc", RANGE);

    expect(result.data?.definitionsByPid).toEqual({ q1: definition });
    expect(result.data?.tasks.data[0].query).toEqual({
      pid: "q1",
      name: "n",
      query_type: "a",
    });
  });

  it("stores one definition for a query many tasks share", async () => {
    const definition = { id: "g1", rules: [] };
    mockedApiGet
      .mockResolvedValueOnce(page(1, 2, 2, { pid: "q1", definition }) as never)
      .mockResolvedValueOnce(page(2, 2, 2, { pid: "q1", definition }) as never);

    const result = await getCollectionTaskHistory("abc", RANGE);

    expect(Object.keys(result.data?.definitionsByPid ?? {})).toEqual(["q1"]);
    expect(
      result.data?.tasks.data.every((task) => !("definition" in task.query!)),
    ).toBe(true);
  });

  it("leaves a task with no query alone, since B-type runs distributions", async () => {
    mockedApiGet.mockResolvedValueOnce(page(1, 1, 1) as never);

    const result = await getCollectionTaskHistory("abc", RANGE);

    expect(result.data?.tasks.data[0].query).toBeNull();
    expect(result.data?.definitionsByPid).toEqual({});
  });

  it("never caches, since task history changes constantly", async () => {
    mockedApiGet.mockResolvedValueOnce(page(1, 1, 1) as never);

    await getCollectionTaskHistory("abc", RANGE);

    expect(mockedApiGet).toHaveBeenCalledWith(
      expect.objectContaining({ cacheOptions: { useCache: false } }),
    );
  });
});
