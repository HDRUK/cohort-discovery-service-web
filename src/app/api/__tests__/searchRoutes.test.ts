/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { getSession } from "@/server/session";
import { searchConcepts } from "@/server/data/concepts";
import { parseQuery } from "@/server/data/queries";
import { getTermDirectory } from "@/server/data/termDirectory";
import { POST as postConceptSearch } from "../concepts/search/route";
import { POST as postParseQuery } from "../parse-query/route";
import { GET as getTermDirectoryRoute } from "../term-directory/route";

jest.mock("@/server/session", () => ({ getSession: jest.fn() }));
jest.mock("@/server/data/concepts", () => ({ searchConcepts: jest.fn() }));
jest.mock("@/server/data/queries", () => ({ parseQuery: jest.fn() }));
jest.mock("@/server/data/termDirectory", () => ({
  getTermDirectory: jest.fn(),
}));

const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;

const SESSION = {
  token: "a-token",
  user: { id: 1, name: "Jane Doe", email: "user@example.com" },
} as Awaited<ReturnType<typeof getSession>>;

const OK = { message: "", data: {} };
const URL = "https://localhost:3000/api/test";

const postWith = (body: unknown) =>
  new Request(URL, {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

type Case = {
  name: string;
  call: (valid: boolean) => Promise<Response>;
  read: jest.Mock;
};

const CASES: Case[] = [
  {
    name: "POST concept search",
    call: (valid) =>
      postConceptSearch(
        postWith(valid ? { concept_name: ["asthma"] } : { page: "one" }),
      ),
    read: searchConcepts as jest.Mock,
  },
  {
    name: "POST parse query",
    call: (valid) =>
      postParseQuery(postWith(valid ? { query: "asthma" } : "not json")),
    read: parseQuery as jest.Mock,
  },
  {
    name: "GET term directory",
    call: (valid) =>
      getTermDirectoryRoute(
        new NextRequest(`${URL}?domain=${valid ? "person" : "everything"}`),
      ),
    read: getTermDirectory as jest.Mock,
  },
];

describe.each(CASES)("$name", ({ call, read }) => {
  it("returns 401 without reading when there is no session", async () => {
    mockedGetSession.mockResolvedValueOnce(null);

    const response = await call(true);

    expect(response.status).toBe(401);
    expect(read).not.toHaveBeenCalled();
  });

  it("returns 400 without reading for invalid input", async () => {
    mockedGetSession.mockResolvedValueOnce(SESSION);

    const response = await call(false);

    expect(response.status).toBe(400);
    expect(read).not.toHaveBeenCalled();
  });

  it("returns the read result as JSON", async () => {
    mockedGetSession.mockResolvedValueOnce(SESSION);
    read.mockResolvedValueOnce(OK);

    const response = await call(true);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(OK);
  });

  it("passes an API error status through", async () => {
    mockedGetSession.mockResolvedValueOnce(SESSION);
    read.mockResolvedValueOnce({
      message: "",
      data: null,
      error: { text: "Unprocessable", code: 422 },
    });

    const response = await call(true);

    expect(response.status).toBe(422);
  });
});
