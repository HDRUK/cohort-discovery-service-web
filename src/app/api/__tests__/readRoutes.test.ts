/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { getSession } from "@/server/session";
import * as collections from "@/server/data/collections";
import * as queries from "@/server/data/queries";
import * as tasks from "@/server/data/tasks";
import * as regressionTests from "@/server/data/regressionTests";
import { GET as getDetails } from "../collections/[pid]/details/route";
import { GET as getHealth } from "../collections/[pid]/health/route";
import { GET as getTaskHistory } from "../collections/[pid]/task-history/route";
import { GET as getQueries } from "../queries/route";
import { GET as getQuery } from "../queries/[pid]/route";
import { GET as getTask } from "../tasks/[pid]/route";
import { GET as getHealthCollections } from "../admin/collection-health/route";
import { GET as getRegressionTests } from "../regression-tests/route";

jest.mock("@/server/session", () => ({ getSession: jest.fn() }));
jest.mock("@/server/data/collections", () => ({
  getCollectionDetails: jest.fn(),
  getCollectionHealth: jest.fn(),
  getCollectionTaskHistory: jest.fn(),
  getAdminCollections: jest.fn(),
}));
jest.mock("@/server/data/queries", () => ({
  getQueries: jest.fn(),
  getQuery: jest.fn(),
}));
jest.mock("@/server/data/tasks", () => ({ getTask: jest.fn() }));
jest.mock("@/server/data/regressionTests", () => ({
  getRegressionTests: jest.fn(),
}));

const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;

const SESSION = {
  token: "a-token",
  user: { id: 1, name: "Jane Doe", email: "user@example.com" },
} as Awaited<ReturnType<typeof getSession>>;

const OK = { message: "", data: {} };
const RANGE = "from=2026-09-07T00:00:00.000Z&to=2026-09-07T01:00:00.000Z";

const requestTo = (query = "") =>
  new NextRequest(`https://localhost:3000/api/test${query ? `?${query}` : ""}`);

const withPid = (pid: string) => ({ params: Promise.resolve({ pid }) });

type Case = {
  name: string;
  call: (pid: string, query?: string) => Promise<Response>;
  read: jest.Mock;
  validQuery?: string;
  takesPid: boolean;
};

const CASES: Case[] = [
  {
    name: "collection details",
    call: (pid) => getDetails(requestTo(), withPid(pid)),
    read: collections.getCollectionDetails as jest.Mock,
    takesPid: true,
  },
  {
    name: "collection health",
    call: (pid, query) => getHealth(requestTo(query), withPid(pid)),
    read: collections.getCollectionHealth as jest.Mock,
    validQuery: `bin=15m&${RANGE}`,
    takesPid: true,
  },
  {
    name: "collection task history",
    call: (pid, query) => getTaskHistory(requestTo(query), withPid(pid)),
    read: collections.getCollectionTaskHistory as jest.Mock,
    validQuery: RANGE,
    takesPid: true,
  },
  {
    name: "query",
    call: (pid, query) => getQuery(requestTo(query), withPid(pid)),
    read: queries.getQuery as jest.Mock,
    takesPid: true,
  },
  {
    name: "task",
    call: (pid) => getTask(requestTo(), withPid(pid)),
    read: tasks.getTask as jest.Mock,
    takesPid: true,
  },
  {
    name: "queries",
    call: (_pid, query) => getQueries(requestTo(query)),
    read: queries.getQueries as jest.Mock,
    takesPid: false,
  },
  {
    name: "admin collection health",
    call: (pid, query) =>
      getHealthCollections(requestTo(query ?? `pid=${pid}`)),
    read: collections.getAdminCollections as jest.Mock,
    takesPid: true,
  },
  {
    name: "regression tests",
    call: () => getRegressionTests(),
    read: regressionTests.getRegressionTests as jest.Mock,
    takesPid: false,
  },
];

describe.each(CASES)("GET $name", ({ call, read, validQuery, takesPid }) => {
  it("returns 401 without reading when there is no session", async () => {
    mockedGetSession.mockResolvedValueOnce(null);

    const response = await call("col_abc123", validQuery);

    expect(response.status).toBe(401);
    expect(read).not.toHaveBeenCalled();
  });

  it("returns the read result as JSON", async () => {
    mockedGetSession.mockResolvedValueOnce(SESSION);
    read.mockResolvedValueOnce(OK);

    const response = await call("col_abc123", validQuery);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(OK);
  });

  it("passes an API error status through", async () => {
    mockedGetSession.mockResolvedValueOnce(SESSION);
    read.mockResolvedValueOnce({
      message: "",
      data: null,
      error: { text: "Forbidden", code: 403 },
    });

    const response = await call("col_abc123", validQuery);

    expect(response.status).toBe(403);
  });

  if (takesPid) {
    it("returns 400 for an invalid pid", async () => {
      mockedGetSession.mockResolvedValueOnce(SESSION);

      const response = await call("../admin", validQuery);

      expect(response.status).toBe(400);
      expect(read).not.toHaveBeenCalled();
    });
  }
});

describe("GET collection health params", () => {
  it.each([
    ["an invalid bin", `bin=fortnightly&${RANGE}`],
    ["a missing range", "bin=15m"],
  ])("returns 400 for %s", async (_label, query) => {
    mockedGetSession.mockResolvedValueOnce(SESSION);

    const response = await getHealth(requestTo(query), withPid("col_abc123"));

    expect(response.status).toBe(400);
  });
});

describe("GET queries params", () => {
  it("forwards only the allowed, clamped params", async () => {
    mockedGetSession.mockResolvedValueOnce(SESSION);
    (queries.getQueries as jest.Mock).mockResolvedValueOnce(OK);

    await getQueries(requestTo("page=2&per_page=5000&open_queries=a,b"));

    const { params } = (queries.getQueries as jest.Mock).mock.calls[0][0];
    expect(Object.fromEntries(params)).toEqual({
      page: "2",
      per_page: "200",
    });
  });
});
