/**
 * @jest-environment node
 */
import { cookies } from "next/headers";
import { GET } from "../route";

jest.mock("next/headers", () => ({ cookies: jest.fn() }));

const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockedFetch = jest.fn();

const VALID_PID = "9b2f6c1e-3a4d-4e5f-8a9b-0c1d2e3f4a5b";
const PATH_TRAVERSAL_PID = "../users?x=";

const downloadFor = (pid: string, query = "entity=queries&format=csv") =>
  GET(new Request(`https://localhost:3000/api/download/x?${query}`), {
    params: Promise.resolve({ pid }),
  });

beforeEach(() => {
  process.env.API_BASE_URL = "https://api.example.com";
  global.fetch = mockedFetch;
  mockedFetch.mockReset();
  mockedCookies.mockResolvedValue({
    get: () => ({ value: "a-token" }),
  } as unknown as Awaited<ReturnType<typeof cookies>>);
});

describe("GET /api/download/[pid]", () => {
  it("rejects a pid that isn't a pid without calling the API", async () => {
    const response = await downloadFor(PATH_TRAVERSAL_PID);

    expect(response.status).toBe(400);
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("rejects an unsupported format without calling the API", async () => {
    const response = await downloadFor(VALID_PID, "format=exe");

    expect(response.status).toBe(400);
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("downloads a valid pid from the query's download path", async () => {
    mockedFetch.mockResolvedValue(new Response("a,b", { status: 200 }));

    const response = await downloadFor(VALID_PID);

    expect(response.status).toBe(200);
    expect(mockedFetch.mock.calls[0][0]).toMatch(
      new RegExp(`/queries/${VALID_PID}/download/csv$`),
    );
  });
});
