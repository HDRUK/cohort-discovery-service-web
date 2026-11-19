import { refresh, updateTag } from "next/cache";
import { apiGet, apiPost } from "@/server/api";
import { CACHE_TAGS } from "@/config/tags";
import { QUERY_LIMIT_STATUS } from "@/utils/queryLimit";
import { RuleGroupType } from "@/types/rules";
import submitQuery from "../submitQuery";
import rerunQuery from "../rerunQuery";

jest.mock("@/server/api", () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  ErrorMode: { RESULT: "result" },
}));

jest.mock("@/server/session", () => ({
  requireSession: jest.fn().mockResolvedValue({ token: "a-token" }),
}));

const mockedApiPost = apiPost as jest.MockedFunction<typeof apiPost>;
const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;

const QUERY = { combinator: "and", rules: [] } as unknown as RuleGroupType;

const ACCEPTED = { data: { pid: "q1" } };
const LIMIT_REACHED = {
  data: null,
  error: { code: QUERY_LIMIT_STATUS, text: "Query limit reached" },
};
const INVALID = { data: null, error: { code: 422, text: "Invalid query" } };

const RUNS = [
  ["submitQuery", () => submitQuery(QUERY, "A query"), mockedApiPost],
  ["rerunQuery", () => rerunQuery("q1"), mockedApiGet],
] as const;

beforeEach(() => jest.clearAllMocks());

describe.each(RUNS)("%s", (_, run, mockedCall) => {
  it.each([
    ["an accepted query", ACCEPTED],
    ["a query over the limit", LIMIT_REACHED],
  ])("expires the cached user, which holds the quota, for %s", async (__, response) => {
    mockedCall.mockResolvedValue(response as never);

    await run();

    expect(updateTag).toHaveBeenCalledWith(CACHE_TAGS.currentUser);
    expect(refresh).not.toHaveBeenCalled();
  });

  it("leaves the cached user for a query the API rejects", async () => {
    mockedCall.mockResolvedValue(INVALID as never);

    await run();

    expect(updateTag).not.toHaveBeenCalled();
  });
});
